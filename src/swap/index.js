
import { Sortable, Swap } from 'sortablejs/modular/sortable.core.esm'
import { removeClass } from '../utils/dom'

Sortable.mount(new Swap())

function computeVmIndex (vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element)
}

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End', 'Move']

const swapComponent = {
  name: 'TSwapComponent',
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
      related: undefined
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
        dragleave: this.onLeave
      }
    }
    return h(this.tag, attr, slots)
  },

  mounted () {
    let { options, $attrs } = this

    this.noneFunctionalComponentMode = this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase()

    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
      )
    }

    let eventOptions = eventsListened.reduce((res, name) => {
      res[`on${name}`] = (e) => {
        this[`on${name}`] && this[`on${name}`](e)
        this.$emit(`on${name}`, e)
      }
      return res
    }, {})

    this.$sortable = !this.$sortable && new Sortable(this.rootContainer, {
      group: 'description',
      swap: true,
      ...options,
      ...eventOptions,
      ...$attrs
    })

    if (!this.$attrs.disabled) {
      window.$sortable = this.$sortable
      console.log(this.$sortable)
    }
  },
  beforeDestroy () {
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

    swapList (newIndex, oldIndex, element) {
      const list = [ ...this.value ]
      const t = list[newIndex]
      list[newIndex] = list[oldIndex]
      list[oldIndex] = t
      this.$emit('input', list)
    },

    onStart (evt) {
      this.context = this.getUnderlyingVm(evt.item)
      evt.item._underlying_vm_ = this.context.element
    },

    onMove (evt) {
      if (evt.related) {
        this.related = evt.related
      }
    },

    onLeave (evt) {
      removeClass(this.related, this.$attrs.swapClass)
      this.related = null
    },

    onEnd (evt) {
      const element = evt.item._underlying_vm_
      if (element === undefined) {
        return
      }
      const oldIndex = computeVmIndex(this.getChildrenNodes(), evt.item)
      const newIndex = computeVmIndex(this.getChildrenNodes(), evt.swapItem)

      if (newIndex >= this.getChildrenNodes().length || newIndex < 0) {
        return
      }
      if (this.related === evt.swapItem) {
        this.swapList(newIndex, oldIndex, element)
      }
    }
  }
}

export default swapComponent
