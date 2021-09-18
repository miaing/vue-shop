import Vue from 'vue'
import { Button , Form, FormItem, Input} from 'element-ui'

//导入弹框提示组件组件
import {Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//挂在在原型链上，之后所有的组件都可通过$message来调用弹窗提示
Vue.prototype.$message = Message
