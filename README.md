# ttabs

> 一个可以拖拽交换tab页位置的基于vue2的tab页组件

## doc
https://litianji.github.io/ttabs/

```vue
  <t-tabs v-model="active" :list.sync="list">
    <t-tab-pane name="tab1" label="tab1">
      <p>tab1</p>
    </t-tab-pane>
    <t-tab-pane name="tab2" label="tab2">
      <p>tab2</p>
    </t-tab-pane>
    <t-tab-pane name="tab3" label="tab3">
      <p>tab3</p>
    </t-tab-pane>
  </t-tabs>
```

## Install
```bash
 npm i ttabs --save
```

## Import 
```js
 import TTabs from 'ttabs'
 import 'ttabs/lib/ttabs.css'
 Vue.use(TTabs)
```
