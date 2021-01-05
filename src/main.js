import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import './element-variables.scss'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
// 样式 github    vuepress
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// 代码高亮
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
// 显示行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 表情
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
// 快捷复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import { treeData } from '@/utils/treeData';
VMdEditor.use(vuepressTheme);
VMdEditor.use(createHighlightLinesPlugin());
VMdEditor.use(createLineNumbertPlugin());
VMdEditor.use(createEmojiPlugin());
VMdEditor.use(createCopyCodePlugin());
Vue.use(VMdEditor);
Vue.prototype.$treeData = treeData;
VMdEditor.use(vuepressTheme, {
  codeHighlightExtensionMap: {
    vue: 'js',
  },
});
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
