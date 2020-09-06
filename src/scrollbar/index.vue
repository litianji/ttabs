<template>
  <div class="t-scrollbar" v-mousewheel="handleMousewheel">
    <!-- 内容 -->
    <div
      ref="wrap"
      class="t-scrollbar__wrap"
      :style="{
        marginBottom: `-${scrollWidth}px`,
        marginRight: `-${scrollWidth}px`
      }"
      @scroll="handleScroll">
      <div ref="resize" class="t-scrollbar__view">
        <slot></slot>
      </div>
    </div>

    <!-- bar -->
    <el-bar :move="this.moveX" :size="sizeWidth" v-show="sizeWidth"></el-bar>
    <el-bar :move="this.moveY" :size="sizeHeight" v-show="sizeHeight" vertical></el-bar>
  </div>

</template>

<script>
import { addResizeListener, removeResizeListener } from '../utils/resize-event'
import scrollbarWidth from '../utils/scrollbar-width'
import Mousewheel from '../directives/mousewheel'
import ElBar from './bar'
export default {
  name: 'TScrollbar',
  components: { ElBar },
  directives: {
    Mousewheel
  },
  props: {
    step: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      scrollWidth: scrollbarWidth(),
      // x方向
      moveX: 0,
      // y方向
      moveY: 0,

      sizeWidth: '0',
      sizeHeight: '0',

      // scrollTop
      scrollTop: 0,
      scrollLeft: 0,
      horizontalOnly: false
    }
  },
  methods: {
    handleScroll (e) {
      const wrap = this.$refs.wrap
      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight)
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth)

      this.scrollTop = wrap.scrollTop
      this.scrollLeft = wrap.scrollLeft
    },

    update () {
      this.scrollWidth = scrollbarWidth(true)
      const wrap = this.$refs.wrap
      if (!wrap) return

      const heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight)
      const widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth)

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : ''
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : ''

      this.horizontalOnly = !this.sizeHeight

      this.$emit('update', {
        scrollTopPercent: this.moveY,
        scrollTop: wrap.scrollTop,
        scrollSizePercent: heightPercentage,
        clientHeight: wrap.clientHeight,
        scrollHeight: wrap.scrollHeight
      })
    },
    handleMousewheel (e) {
      if (!this.horizontalOnly || !this.sizeWidth) return

      e.preventDefault()

      const { wheelDelta } = e
      const { scrollLeft } = this.$refs.wrap
      const px = this.step * wheelDelta / -120

      let left = scrollLeft + px

      left = left === 0 ? -1 : left
      this.setPosition(left)
    },

    setPosition (x, y) {
      y && (this.$refs.wrap.scrollTop = y)
      x && (this.$refs.wrap.scrollLeft = x)
    }
  },
  mounted () {
    this.$nextTick(this.update)
    addResizeListener(this.$refs.resize, this.update)
  },

  beforeDestroy () {
    removeResizeListener(this.$refs.resize, this.update)
  }
}
</script>

<style lang="scss">

</style>
