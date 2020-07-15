/*
 * @Author: eds
 * @Date: 2020-07-01 14:19:49
 * @LastEditTime: 2020-07-14 15:14:45
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "state",
    },
    {
      path: "/state",
      name: "state",
      component: resolve => require(["page/state/state"], resolve) // 404页面
    },
    {
      path: "/map", // 风险一张图
      name: "Map",
      component: resolve => require(["page/map/map"], resolve)
    }
  ]
});
