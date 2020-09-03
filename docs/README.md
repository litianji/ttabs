
## 功能
+ tab页切换
+ 拖拽调整tab页顺序，响应式同步列表


## 拖拽

> 支持`.sync`, 绑定一个数组，同步更新

<demo-base />

## 滚动条

> tab数量比较多时出现滚动条

<demo-scroller />


```vue
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
```

## 问题

+ :bug:滚动条没有自动更新
+ :bug:当把当前选中拖拽走了之后没有更新滚动条位置
+ :bug:选项卡没有拖过去，或者说以v-for的指令优先了