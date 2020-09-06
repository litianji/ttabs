<template>
  <div class="t-tab-bar" :style="barStyle"></div>
</template>

<script>
export default {
  name: 'TTabBar',
  props: ['panes'],
  inject: ['tabNav'],
  data () {
    return {
      tabs: []
    }
  },
  methods: {
    getTabs () {
      if (!this.tabNav.$el) {
        return []
      }
      return [...this.tabNav.$el.querySelectorAll('.dragable-item')]
    }
  },
  watch: {
    panes () {
      this.tabs = this.getTabs()
    }
  },
  computed: {
    activeName () {
      return this.tabNav.currentName
    },
    barStyle () {
      const style = {}
      let offset = 0
      let tabSize = 0
      let borderWidth = 0

      this.tabs && this.tabs.every((tab, index) => {
        const active = tab.id.replace('tab-item-', '') === this.activeName
        const tabStyles = window.getComputedStyle(tab)
        borderWidth = tabStyles.borderWidth.replace('px', '') - 0
        tabSize = tabStyles.width.replace('px', '') - 2 * borderWidth
        offset += borderWidth
        if (!active) {
          offset += tabSize
          return true
        }

        return false
      })
      const transform = `translateX(${offset}px)`
      style.width = tabSize + 'px'
      style.transform = transform
      style.msTransform = transform
      style.webkitTransform = transform
      return style
    }
  }
}
</script>

<style>

</style>
