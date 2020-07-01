/*
 * @Author: eds
 * @Date: 2020-07-01 14:19:49
 * @LastEditTime: 2020-07-01 15:26:53
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
      path: "/", // 风险一张图
      name: "Map",
      component: (resolve) => require(["page/map/map"], resolve),
    },
  ],
});
