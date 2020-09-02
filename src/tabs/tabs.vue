<template>
  <t-swap-component
    v-bind="dragOptions"
    :class="{
      't-tabs': true,
      [`t-tabs--${tabPosition}`]: true,
      't-tabs--border': true,
      'dragable-item': true
    }"
    >
      <div class="t-tabs__header">
        <t-tab-nav
          ref="nav"
          :currentName="currentName"
          :handleTabClick="handleTabClick"
          @tab-change="tabChange">
        </t-tab-nav>
      </div>
      <div class="t-tabs__content">
        <slot></slot>
      </div>
  </t-swap-component>
</template>

<script>
import TTabNav from './tab-nav'
import TSwapComponent from '../swap'
export default {
  name: 'TTabs',
  components: {TTabNav, TSwapComponent},
  model: {
    prop: 'activeName'
  },
  props: {
    // nav位置
    tabPosition: {
      type: String,
      default: 'top'
    },

    // 当前选中
    activeName: {
      type: String,
      default: ''
    },

    // 绑定的数组
    list: {
      type: Array,
      default: () => ([])
    }
  },
  provide () {
    return {
      rootTabs: this
    }
  },
  data () {
    return {
      panes: [],
      currentName: this.activeName,

      dragOptions: {
        disabled: true
        // filter: '.dragdisabled'
      }
    }
  },
  methods: {
    calcPaneInstances (isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default
          .filter(vnode =>
            vnode.tag &&
            vnode.componentOptions &&
            vnode.componentOptions.Ctor.options.name === 'TTabPane')
        // update indeed
        const panes = paneSlots.map(({ componentInstance }) => {
          componentInstance.listItem = this.listMap[componentInstance.$options.propsData.name]
          return componentInstance
        })
        const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    },
    handleTabClick (tab, name, event) {
      this.currentName = name
      this.$emit('input', name)
    },
    tabChange (panes) {
      this.panes = panes
      const tabList = panes.map(pane => {
        if (this.listMap[pane.name]) {
          return this.listMap[pane.name]
        } else {
          this.handleTabClick(pane, pane.name)
          return pane.listItem
        }
      })
      this.$emit('update:list', tabList)
    }
  },
  computed: {
    listMap () {
      return this.list.reduce((res, item) => {
        res[item.name] = item
        return res
      }, {})
    }
  },
  mounted () {
    this.calcPaneInstances()
    this.$refs.nav && this.$refs.nav.$emit('set-navs', this.panes)
  }

}
</script>

<style lang="scss">
</style>
