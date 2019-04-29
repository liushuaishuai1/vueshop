// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// Vue.config.productionTip = falseMP
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ComCrumb from './components/share/Crumb.vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
Vue.component('com-crumb', ComCrumb)
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
axios.interceptors.request.use(
  function(config) {
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: { App },

  // template: '<App/>'
  render: h => h(App)
})
