<template>
  <div>
    <t-tabs v-model="active" :list.sync="list">
      <t-tab-pane name="tab1" label="tab1">
        <div class="content">这是一个可以拖拽的tab，你可以拖动他的选项卡</div>
      </t-tab-pane>
      <t-tab-pane name="tab2" label="tab2">
        <div class="content">拖拽基于sortablejs</div>
      </t-tab-pane>
      <t-tab-pane name="tab3" label="tab3">
        <div class="content">效果和vscode一样</div>
      </t-tab-pane>
    </t-tabs>
    <div class="language-js extra-class">
      <pre class="language-js">{{ JSON.stringify(list, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 'tab2',
      list: []
    }
  }
}
</script>

<style>
.content {
  padding: 10px;
}
</style>