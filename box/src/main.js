// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import httpService from './service/http-service';
import axios from 'axios'
import Moment from 'moment'
//Vue.prototype.loading=loading;
Vue.prototype.$axios = httpService;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.moment = Moment
// 请求拦截
axios.interceptors.request.use(config => {
  if ("prod-api/common/login" != config.url) {
    if (localStorage.getItem("token")) {
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem("token")
      console.log(localStorage.getItem("token"))
      // 让每个请求携带自定义token 请根据实际情况自行修
    }
  }
  return config;
}, err => {
  // todo 待完善接口拦截
  return Promise.reject(err);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
