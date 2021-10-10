import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/css/globle.css'
//导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

//导入tree-table
import TreeTable from 'vue-table-with-tree-grid'
//导入一些富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//配置axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器,保证其他的组件有权调用token里面的数据
axios.interceptors.request.use(config =>{
  // console.log(config);
  //再请求之前需要做一个数据的预处理
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //最后必须要返回一个config
  return config
})
Vue.prototype.$http = axios
//将富文本编辑器组件注册为全局组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

//在全局定义一个时间过滤器
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
