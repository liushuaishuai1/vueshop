import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router) 
const router =new Router({
  routes: [
    {path: '/Login',component:Login},
    {path:'/home',component:Home}
  ]
})
router.beforeEach((to,from,next)=>{
  var token=window.sessionStorage.getItem('token')
  if(token ===null && to.path !=='/login'){
     return next('/login')
  }
  next()
})

export default router