import Vue from 'vue'
import VueRouter from 'vue-router'
const Login =()=>import('@/components/Login') 
const Home =()=>import('@/components/Home') 
const Welcome =()=> import('@/components/Welcome') 
const User =()=>import('@/components/User') 
const Rights =()=>import('@/components/Rights')
const Role =()=>import('@/components/Role') 
const Cat =()=>import('@/components/Cat') 
const Param=()=> import('@/components/Param') 
const Goods =()=>import('@/components/Goods') 
const GoodsAdd =()=>import( '@/components/Goodsapp')
const VueQuillEditor=()=> import('vue-quill-editor') 
const Orders=()=> import('@/components/Orders') 
const Reports=()=> import( '@/components/Reports')


Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Role },
        { path: '/categories', component: Cat },
        { path: '/params', component: Param },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/orders', component: Orders},
        { path: '/reports', component: Reports}
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
