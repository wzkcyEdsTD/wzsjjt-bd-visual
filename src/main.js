/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:04
 * @LastEditTime: 2020-07-13 11:04:07
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\main.js
 */
import 'element-ui/lib/theme-chalk/index.css'
import './swiper.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import './router/permission.js'
import './font/Digital-7Mono.css';
import "./font/YouSheBiaoTiHei.css";
import "./font/PingFang.css";
import "./font/DIN.css";
import * as filters from './filters' // 全局过滤器
import ElementUI from 'element-ui'
import echarts from 'echarts'
window.echarts = echarts //挂载到window上
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueBus from 'vue-bus'
// import 'jquery'/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') {
// require('../mock')
// }

//第三方库
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
import axios from 'axios'
window.axios = axios //挂载到window上
//vue-iclient3d-webgl组件库
import VueiClient from '@supermap/vue-iclient3d-webgl';
Vue.use(VueiClient);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(VueBus)
Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
