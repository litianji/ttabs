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
  components: { TTabNav, TSwapComponent },
  props: {

    tabPosition: {
      type: String,
      default: 'top'
    },

    value: {
      type: String,
      default: ''
    },

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
      currentName: this.value,

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
          componentInstance.__listItem = this.listMap[componentInstance.$options.propsData.name] || {
            name: componentInstance.name,
            label: componentInstance.label
          }
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

      // update list & reset active tab
      let isInList = false
      const tabList = panes.map(pane => {
        if (
          this.list &&
          this.list.length &&
          !(this.listMap && this.listMap[pane.name])
        ) {
          this.handleTabClick(pane, pane.name)
        }

        if (pane.name === this.currentName) {
          isInList = true
        }
        return pane.__listItem
      })

      if (this.list.length && !isInList) {
        const oldIndex = this.list.findIndex(item => item.name === this.currentName)
        const nextIndex = oldIndex === this.list.length - 1 ? oldIndex - 1 : oldIndex

        if (nextIndex > -1) {
          const pane = panes[nextIndex]
          this.handleTabClick(pane, pane.name)
        }
      }

      this.$emit('update:list', tabList)
    }
  },
  computed: {
    listMap () {
      return this.list.reduce((res, item) => {
        if (item) {
          res[item.name] = item
        }
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
