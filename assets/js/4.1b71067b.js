(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{328:function(t,a,n){},355:function(t,a,n){"use strict";var e=n(328);n.n(e).a},361:function(t,a,n){"use strict";n.r(a);var e={data:function(){return{active:"mask1",list:[{name:"mask1",label:"使用",content:"通过slot插槽，插入遮罩，可插入到需要的位置"},{name:"mask2",label:"事件",content:"默认情况下，dragEnd触发时，会将当前插入到list的最后一个，如果本来就在list里则与最后一个交互"},{name:"mask3",label:"自定义",content:"mask上的dragEnd事件可以自定义，return false则默认的事件不会再触发"}]}},methods:{dragEndHandle:function(){return alert("什么也不做"),!1}}},s=(n(355),n(5)),l=Object(s.a)(e,(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("t-tabs",{staticClass:"tabs",attrs:{list:t.list},on:{"update:list":function(a){t.list=a}},model:{value:t.active,callback:function(a){t.active=a},expression:"active"}},[t._l(t.list,(function(a){return n("t-tab-pane",{key:a.name,attrs:{name:a.name,label:a.label}},[n("div",[t._v(t._s(a.content))])])})),t._v(" "),n("template",{slot:"mask"},[n("t-swap-mask",{attrs:{target:"t-scrollbar__wrap"}}),t._v(" "),n("t-swap-mask",{attrs:{target:"t-tabs__content",dragEndHandle:t.dragEndHandle,"in-path":""}})],1)],2)}),[],!1,null,"31e15972",null);a.default=l.exports}}]);