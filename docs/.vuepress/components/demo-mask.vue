<template>
  <t-tabs v-model="active" :list.sync="list" class="tabs">
    <t-tab-pane 
      v-for="item in list" 
      :name="item.name" 
      :label="item.label" 
      :key="item.name">
      <div>{{ item.content }}</div>
    </t-tab-pane>

    <template slot="mask">
      <t-swap-mask target="t-scrollbar__wrap"></t-swap-mask>
      <t-swap-mask target="t-tabs__content" :dragEndHandle="dragEndHandle" in-path></t-swap-mask>
    </template>
  </t-tabs>
</template>

<script>
export default {
  data () {
    return {
      active: 'mask1',
      list: [
        { name: 'mask1', label: '使用', content: '通过slot插槽，插入遮罩，可插入到需要的位置' },
        { name: 'mask2', label: '事件', content: '默认情况下，dragEnd触发时，会将当前插入到list的最后一个，如果本来就在list里则与最后一个交互' },
        { name: 'mask3', label: '自定义', content: 'mask上的dragEnd事件可以自定义，return false则默认的事件不会再触发' },
      ]
    }
  },
  methods: {
    dragEndHandle () {
      alert('什么也不做')
      return false
    }
  }
}
</script>

<style scoped>
.tabs {
  height: 400px;
}
</style>