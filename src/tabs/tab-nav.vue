<template>
    <div class="t-tab-nav">
      <t-scrollbar>
        <div class="t-tab-nav__wrap">
          <t-swap-component
            v-model="cPanes"
            v-bind="dragOptions"
            @onStart="dragStart"
            @onEnd="dragEnd">
              <div
                ref="tabs"
                v-for="item in cPanes"
                :key="item.name"
                :id="`tab-item-${item.name}`"
                class="t-tab-nav__item dragable-item"
                @click="(e) => handleTabClick(item, item.name, e)"
                @mousedown="(e) => handleTabClick(item, item.name, e)">
                <label-slot :label="item.$slots.label || item.label"></label-slot>
              </div>
          </t-swap-component>
          <t-tab-bar :panes="cPanes"></t-tab-bar>
        </div>
      </t-scrollbar>

    </div>

</template>

<script>
import TTabBar from './tab-bar'
import TScrollbar from '../scrollbar'
import TSwapComponent from '../swap'
export default {
  name: 'TTabNav',
  components: {
    LabelSlot: {
      props: ['label'],
      render (h) {
        return h('span', { class: 'inner' }, Array.isArray(this.label) ? this.label : [this.label])
      }
    },
    TTabBar,
    TScrollbar,
    TSwapComponent
  },

  provide () {
    return {
      tabNav: this
    }
  },
  props: {
    handleTabClick: Function,
    currentName: String
  },
  data () {
    return {
      cPanes: [],
      dragOptions: {
        swap: true,
        animation: 0,
        group: 'nav',
        disabled: false,
        swapClass: 'ghost'
      },
      isDragging: false
    }
  },
  methods: {
    setNavs (panes) {
      this.cPanes = panes
    },
    handleChange () {
      this.$emit('tab-change', this.cPanes)
    },
    dragStart (e) {
      this.isDragging = true
    },
    dragEnd (e) {
      this.isDragging = false
    }
  },
  created () {
    this.$on('set-navs', this.setNavs)
  },
  beforeDestroy () {
    this.$off('set-navs', this.setNavs)
  },
  watch: {
    cPanes () {
      this.handleChange()
    }
  }
}
</script>

<style>

</style>
