<template>
  <t-tabs v-model="active" :list.sync="list1">
    <t-tab-pane 
      v-for="item in list1" 
      :name="item.name" 
      :label="item.label" 
      :key="item.name">
      <p>这是第{{item.index}}选项卡</p>
    </t-tab-pane>
  </t-tabs>
</template>

<script>
export default {
  data () {
    return {
      active: 'tab2',
      list1: []
    }
  },
  created () {
    for (let i = 0; i < 20; i++) {
      this.list1.push({
        index: i + 1,
        name: 'tab' + (i + 1),
        label: 'tab' + (i + 1)
      })
    }
  }
}
</script>