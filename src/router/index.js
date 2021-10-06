import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import users from '../components/users/users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Login
  },
  {
    path:'/login',
    component:Login,
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
      path:'/welcome',
      component:Welcome
      },
      {
        path:'/users',
        component:users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由器的导航守卫
router.beforeEach((to,from,next) => {
  /**
   * to表示要跳转到的页面
   * from表示当前要跳转的页面
   * next表示要一个要执行的函数,
   */
  //判断是否属于登录状态，判断是否处于登录状态
  if(to.path == '/login') return next();

  //首先要获取到token值
  const tokenStr = window.sessionStorage.getItem('token');
  
  //判断不处于登录状态时
  if(!tokenStr) next('/login');
  next();
})
export default router
