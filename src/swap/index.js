
import { Sortable, Swap } from 'sortablejs/modular/sortable.core.esm'
import { removeClass } from '../utils/dom'
import emitter from '../mixins/emitter'

let relatedElement = null
let teleportDestinationVm = null

// aop, override Swap 'drop' method
function SwapOverride () {
  const SwapCls = Swap()
  SwapCls.prototype._drop = SwapCls.prototype.drop
  SwapCls.prototype.drop = function (evt) {
    // const { activeSortable, putSortable, dragEl } = evt
    // if (relatedElement) {
    //   this._drop({ activeSortable, putSortable, dragEl })
    // }
    // do nothing
  }
  return SwapCls
}

Sortable.mount(new SwapOverride())

function computeVmIndex (vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element)
}

function isTransitionName (name) {
  return ['transition-group', 'TransitionGroup'].includes(name)
}

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End', 'Move']

const swapComponent = {
  name: 'TSwapComponent',
  componentName: 'TSwapComponent',
  mixins: [emitter],
  props: {
    list: {
      type: Array,
      required: false,
      default: null
    },
    value: {
      type: Array,
      required: false,
      default: null
    },
    tag: {
      type: String,
      default: 'div'
    },
    options: {
      type: Object
    }
  },

  data () {
    return {
      $sortable: undefined,
      noneFunctionalComponentMode: false,
      relatedElement: undefined
    }
  },

  computed: {
    rootContainer () {
      return this.$el
    },
    realList () {
      return this.list ? this.list : this.value
    }
  },

  render (h) {
    const slots = this.$slots.default
    const attr = {
      ...this.$attrs,
      on: {
        dragleave: this.onLeave,
        dragover: this.onOver
      }
    }
    return h(this.tag, attr, slots)
  },

  mounted () {
    const { options, $attrs } = this

    this.noneFunctionalComponentMode = this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase()

    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
      )
    }

    const eventOptions = eventsListened.reduce((res, name) => {
      res[`on${name}`] = (e) => {
        this[`on${name}`] && this[`on${name}`](e)
        this.$emit(`on${name}`, e)
      }
      return res
    }, {})

    this.getMaskInstances()
    this.$on('onMask', this.onMask)

    this.$sortable = !this.$sortable && new Sortable(this.rootContainer, {
      group: 'description',
      swap: true,
      ...options,
      ...eventOptions,
      ...$attrs
    })
  },
  beforeDestroy () {
    this.$off('onMask', this.onMask)
    if (this.$sortable !== undefined) this.$sortable.destroy()
  },
  methods: {
    getTag () {
      return this.tag
    },

    getChildrenNodes () {
      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default
      }
      const rawNodes = this.$slots.default
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes
    },

    getUnderlyingVm (htmlElt) {
      const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt)
      if (index === -1) {
        // Edge case during move callback: related element might be
        // an element different from collection
        return null
      }
      const element = this.realList[index]
      return { index, element }
    },

    getUnderlyingPotencialDraggableComponent ({ __vue__: vue }) {
      if (
        !vue ||
        !vue.$options ||
        !isTransitionName(vue.$options._componentTag)
      ) {
        if (
          !('realList' in vue) &&
          vue.$children.length === 1 &&
          'realList' in vue.$children[0]
        ) { return vue.$children[0] }

        return vue
      }
      return vue.$parent
    },

    getMaskInstances () {
      if (this.$slots.default) {
        this.maskSlots = this.$slots.default.filter(vnode =>
          vnode.tag &&
          vnode.componentOptions &&
          vnode.componentOptions.Ctor.options.name === 'TSwapMask')
      }
    },

    swapList (newIndex, oldIndex, element) {
      const list = [...this.value]
      const t = list[newIndex]
      list[newIndex] = list[oldIndex]
      list[oldIndex] = t
      this.$emit('input', list)
    },

    spliceList () {
      const list = [...this.value]
      list.splice(...arguments)
      this.$emit('input', list)
    },

    onStart (evt) {
      this.context = this.getUnderlyingVm(evt.item)
      evt.item._underlying_vm_ = this.context.element
    },

    onMove (evt) {
      const { from, to } = evt

      if (evt.related) {
        relatedElement = evt.related
      }

      if (from !== to) {
        teleportDestinationVm = this.getUnderlyingPotencialDraggableComponent(to)
      } else {
        teleportDestinationVm = null
      }
    },

    onLeave (evt) {
      removeClass(relatedElement, this.$attrs.swapClass)
      relatedElement = null

      this.removeMaskEvent()
      teleportDestinationVm = null

      this.$emit('onLeave', evt)
    },

    onOver (evt) {
      if (this.maskSlots && this.maskSlots.length) {
        this.broadcast('TSwapMask', 'onMask', evt)
        this.broadcast('TSwapComponent', 'onMask', evt)
      }
    },

    onMask (e) {
      const { __vue__: vue } = e.srcElement
      teleportDestinationVm = this
      teleportDestinationVm._mask_evt_ = true
      teleportDestinationVm._mask_vm_ = vue && vue.mask_vm
    },

    onEnd (evt) {
      const element = evt.item._underlying_vm_
      if (element === undefined) {
        return
      }

      const children = this.getChildrenNodes()
      const oldIndex = computeVmIndex(children, evt.item)
      const newIndex = computeVmIndex(children, evt.swapItem)

      removeClass(relatedElement, this.$attrs.swapClass)

      if (teleportDestinationVm) {
        this.teleport(oldIndex, element)
        return
      }

      // update position
      if (relatedElement === evt.swapItem) {
        this.swapList(newIndex, oldIndex, element)
      }
    },

    teleport (oldIndex, element) {
      if (!teleportDestinationVm) {
        return
      }

      let { index: newIndex } = teleportDestinationVm.getUnderlyingVm(relatedElement) || {}

      // handle drag end in mask
      if (teleportDestinationVm._mask_evt_) {
        newIndex = this.realList.length - 1

        const maskVm = teleportDestinationVm._mask_vm_
        // remove mask event
        this.removeMaskEvent()

        if (maskVm) {
          maskVm.removeMask()
          if (maskVm.dragEndHandle && maskVm.dragEndHandle({ teleportDestinationVm, oldIndex, element, swapComponentVm: this }) === false) {
            return
          }
        }

        if (teleportDestinationVm === this) {
          this.swapList(newIndex, oldIndex, element)
          return
        }
      }

      this.spliceList(oldIndex, 1)
      if (newIndex !== undefined) {
        teleportDestinationVm.spliceList(newIndex, 0, element)
      }
    },

    removeMaskEvent () {
      if (teleportDestinationVm) {
        delete teleportDestinationVm._mask_vm_
        delete teleportDestinationVm._mask_evt_
      }
    }
  }
}

export default swapComponent
