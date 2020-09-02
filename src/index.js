
import Vue from 'vue'
import TTabs from './tabs/tabs'
import TTabPane from './tabs/tab-pane'
import './style/index.scss'

let components = {}
components.install = () => {
  [
    TTabs,
    TTabPane
  ].forEach(item => {
    Vue.component(item.name, item)
    components[item.name] = item
  })
}

export default components
