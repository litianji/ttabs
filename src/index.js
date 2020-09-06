
import Vue from 'vue'
import TTabs from './tabs/tabs'
import TTabPane from './tabs/tab-pane'
import TSwapMask from './swap/mask'
import './style/index.scss'

const components = {}
components.install = () => {
  [
    TTabs,
    TTabPane,
    TSwapMask
  ].forEach(item => {
    Vue.component(item.name, item)
    components[item.name] = item
  })
}

export default components
