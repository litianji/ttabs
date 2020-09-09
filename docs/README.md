
## 安装
```bash
 npm i ttabs --save
```

## 全局引入 
```js
 import TTabs from 'ttabs'
 import 'ttabs/lib/ttabs.css'
 Vue.use(TTabs)
```

## 基本使用

> 拖拽交换位置，支持`.sync`，同步更新

<demo-base />

> tab数量比较多时出现滚动条

<demo-scroller />

::: details 代码
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
:::

## slot
> 遮罩

<demo-mask />
