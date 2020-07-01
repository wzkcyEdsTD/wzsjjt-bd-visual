.wrapper li/* eslint-disable */
<template>
  <div class="wrapper">
   <div class="title_first" @click="jump"><!-- <img src="./images/slash.png" alt/>-->{{titleName}}智慧应急一张图
    </div>
    <div class="nav1">
      <ul>
        <router-link
          v-for="(item,index) in list"
          :key="index"
          tag="li"
          :to="item.to">
          {{item.text}}
          <div class="undeline">
            <img src="./images/undeline.png" alt/>
          </div>
          <div class="list_line"></div>
        </router-link>
        <li @click="jump">
          风险源管理
          <div class="undeline">
            <img src="./images/undeline.png" alt/>
          </div>
          <div class="list_line"></div>
        </li>
        <li @click="jump">
          救灾资源管理
          <div class="undeline">
            <img src="./images/undeline.png" alt/>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-content1">
      <div class="title_second">
        <div class="tit_1">{{titleName}}</div>
        <div class="tit_2">应急管理局</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'

export default {
  name: "MHeader",
  data() {
    return {
      date: "",
      routerUrl: "",
      list: [
        { text: "安全风险态势", to: "/state" },
        { text: "减灾救灾能力", to: "/save" },
        { text: "安全监管执法", to: "/safe" },
        { text: "风险一张图", to: "/map" },
        { text: "监测预警", to: "/warning" },
        { text: "分析研判", to: "/analysis" },
        { text: "智能预案", to: "/plan" },
        { text: "值班值守", to: "/scheduling" },
        { text: "指挥调度", to: "/dispatch" },
      ],
      currentIndex: "scheduling"
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    titleName() {
      if (!this.userInfo.districtName) {
        return ''
      } else {
        return this.userInfo.districtName
      }
    }
  },
  methods: {
    logout() {
      window.location.href =
        "http://pshyz.f3322.net:9000/logout?service=http://pshyz.f3322.net:9000/";
    },
    goRouter(router) {
      this.$router.push({ path: `/${router}` });
    },
    jump() {
      window.open("http://" + window.location.host + "/write");
    },
    navIsActive(to) {
      if (this.routerUrl.indexOf(to) === 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    }
  }
};
</script>

<style scoped lang="less">
  /* eslint-disable */
  .wrapper {
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 0.72rem;
    top: 0.15rem;
    .title_first {
      height: 0.72rem;
      font-size: 0.45rem;
      color: white;
      line-height: 0.6rem;
      text-align: left;
      position: absolute;
      left: 0.92rem;
      cursor: pointer;
    }
    .title_first img {
      vertical-align: middle;
      height: 0.2rem;
      width: 0.35rem;
      margin-right: 0.1rem;
    }
    .title_second {
      /*width: 0.92rem;*/
      /*height: 0.27rem;*/
      border-left: 0.02rem solid #fff;
      margin-top: 0.1rem;
      // background: #ccc
      /*left: 2.9rem;*/
      /*line-height: 0.13rem;*/
    }
    .tit_1,
    .tit_2 {
      margin-left: 0.07rem;
      font-size: 0.2rem;
      margin-top: 0.03rem;
      -webkit-background-clip: text;
      color: #fff;
    }
    .tit_1 {
      margin-top: 0;
      color: #ffffff
    }
    .nav1 {
      position: absolute;
      /*width: 15rem;*/
      // background: #0f0;
      height: 0.72rem;
      float: left;
      left: 20%;
    }
    li {
      float: left;
      // background: #00f;
      font-size: 0.32rem;
      height: 0.32rem;
      color: #d6d6d6;
      line-height: 0.19rem;
      text-align: center;
      margin-top: 0.21rem;
      cursor: pointer;
      padding-left: 0.5rem;
      padding-right:0.5rem;
      position: relative;
      letter-spacing: 0.05rem;
    }
    .undeline {
      display: none;
      width: 0.4rem;
      height: 0.03rem;
      margin: 0 auto;
      position: relative
    }
    .undeline img {
      width: 3rem;
      height: 0.4rem;
      position: absolute;
      left: -1.3rem;
      top: -0.03rem;
    }
    li:hover, li.router-link-active {
      color: #29b5e8;
      font-weight: 600;
      .undeline {
        display: block;
      }
    }
    .right-content1 {
      /*height: 0.72rem;*/
      // background: #f00
      right: 0.55rem;
      position: absolute;
    }
    .list_line {
      width: 0.03rem;
      height: 0.3rem;
      .bg-image("images/square");
      top: -0.02rem;
      right: 0rem;
      position: absolute;
    }
    .quit1 {
      // background: #fff;
      width: 0.65rem;
      height: 0.3rem;
      // margin-left: 0.2rem;
      margin-top: 0.26rem;
      cursor: pointer;
      i {
        width: @font-size-small;
        height: @font-size-small;
        float: left;
        .bg-image("images/quit");
        margin-right: 0.02rem;
        margin-left: 0.1rem;
      }
      span {
        font-size: 0.28rem;
        float: left;
        height: @font-size-small;
        line-height: @font-size-small;
        color: @color-text-hover;
      }
    }
  }
</style>
