import Vue from 'vue'

let scrollBarWidth

export default function (isForce) {
  if (Vue.prototype.$isServer) return 0
  if (scrollBarWidth !== undefined && !isForce) return scrollBarWidth
  const outer = document.createElement('div')
  outer.className = 'el-scrollbar__wrap'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  // const widthNoScroll = outer.offsetWidth
  const widthNoScroll = window.getComputedStyle(outer).width.replace('px', '')
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  // const widthWithScroll = inner.offsetWidth
  const widthWithScroll = window.getComputedStyle(inner).width.replace('px', '')
  outer.parentNode.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
};
