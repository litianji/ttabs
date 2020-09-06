
import { hasClass } from '../utils/dom'
import emitter from '../mixins/emitter'
import Vue from 'vue'

const MASKCLASS = 't-swap__mask'
export default {
  name: 'TSWapMask',
  componentName: 'TSWapMask',
  mixins: [emitter],
  props: {
    target: {
      type: String
    },
    inPath: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      container: null
    }
  },
  created () {
    const self = this
    this.tmpVM = new Vue({
      data () {
        return {
          node: '',
          mask_vm: self
        }
      },
      render (h) {
        const { node } = this
        return h('div', {
          ref: 'node',
          class: MASKCLASS,
          on: {
            dragleave: self.dragleave,
            dragend: self.dragend
          }
        },
        Array.isArray(node) ? node : [node])
      }
    }).$mount()
  },
  methods: {
    handleMask (e) {
      this.$nextTick(() => {
        const needHandle = !this.inPath ? hasClass(e.target, this.target) : e.path.find(node => hasClass(node, this.target))
        if (needHandle || this.isMouseInMask(e)) {
          if (this.container) {
            this.addMask()
          } else {
            this.setContainer(e)
          }
        } else {
          this.removeMask()
        }
      })
    },
    dragleave () {
      this.removeMask()
    },
    dragend () {
      console.log('here')
    },
    hasMask () {
      if (!this.container) {
        return false
      }
      return this.container.querySelectorAll('.' + MASKCLASS).length > 0
    },
    isMouseInMask (e) {
      return e.path && e.path.find(node => node === this.maskDom)
    },
    setContainer (e) {
      if (!this.inPath && hasClass(e.target, this.target)) {
        this.container = e.target
      }

      if (this.inPath) {
        this.container = e.path.find(node => hasClass(node, this.target))
      }
    },
    addMask () {
      this.container &&
      this.maskDom &&
      !this.hasMask() &&
      this.container.appendChild(this.maskDom)
    },
    removeMask () {
      this.container &&
      this.maskDom &&
      this.hasMask() &&
      this.container.removeChild(this.maskDom)
    }
  },
  mounted () {
    this.maskDom = this.tmpVM.$refs.node
    this.$on('onMask', this.handleMask)
  },
  beforeDestroy () {
    this.$off('onMask', this.handleMask)
  },
  render (h) {
    const slots = this.$slots.default || []
    if (slots.length) {
      this.tmpVM.node = slots
    }
    return null
  }
}
