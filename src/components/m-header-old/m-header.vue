<template>
  <div class="wrapper">
    <h1 class="title">智慧应急一张图综合指挥与协同管理云平台</h1>
    <div class="nav">
      <div class="nav-item" :class="navIsActive(item.to)?'active':''" v-for="(item,index) in list" :key="index">
        <router-link
          class="nav-link-wrapper"
          tag="div"
          :to="item.to"
        >
          <span class="nav-link">{{item.text}}</span>
        </router-link>
      </div>
    </div>
    <div class="right-box">
      <div class="right-content">
        <span class="title" @click="jump">温州市应急管理局</span>
        <span class="date" :class="{'show':date!==''}">{{date}}</span>
        <span class="quit" @click="logout"><i></i><span>退出</span></span>
      </div>
    </div>
    <div class="br"></div>
  </div>
</template>

<script>
import { getDate } from 'common/js/util'

export default {
  name: 'MHeader',
  data() {
    return {
      date: '',
      routerUrl: '',
      list: [
        { text: '风险态势', to: '/state' },
        { text: '风险一张图', to: '/map' },
        { text: '监测预警', to: '/warning' },
        { text: '分析研判', to: '/analysis' },
        { text: '指挥调度', to: '/dispatch' },
        { text: '智能预案', to: '/plan' },
        { text: '值班值守', to: '/onduty' },
        { text: '数字孪生', to: '/twins' }
      ]
    }
  },
  mounted() {
    this.date = getDate()
    setInterval(() => {
      this.date = getDate()
    }, 1000)
  },
  methods: {
    logout() {
      window.location.href = 'http://pshyz.f3322.net:9000/logout?service=http://pshyz.f3322.net:9000/'
    },
    jump() {
      window.open('http://pshyz.f3322.net:3000')
    },
    navIsActive(to) {
      if (this.routerUrl.indexOf(to) === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: relative;
    width: 100%;
    height: 59px;
    > .title {
      position: absolute;
      top: 0;
      left: 0;
      width: 553px;
      height: 42px;
      line-height: 0;
      font-size: 0;
      .bg-image('images/img_topTitle');
    }
    .right-box {
      position: absolute;
      right: 0;
      top: 0;
      width: 347px;
      height: 43px;
      color: @color-text;
      line-height: 42px;
      .bg-image('images/btn_topMenuBgRight');
      .right-content {
        height: @font-size-small;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
      }
      span {
        font-size: @font-size-small;
        line-height: @font-size-small;
        float: left;
      }
      .title {
        padding: 0 20px 0 38px;
        cursor: pointer;
      }
      .quit {
        margin-left: 20px;
        cursor: pointer;
        i {
          width: @font-size-small;
          height: @font-size-small;
          float: left;
          .bg-image('images/quit');
          margin-right: 2px;
        }
        span {
          height: @font-size-small;
          line-height: @font-size-small;
          color: @color-text-hover;
        }
      }
      .date {
        width: 120px;
        visibility: hidden;
        height: @font-size-small;
        &.show {
          visibility: visible;
        }
      }
    }
  }
  .nav {
    position: absolute;
    left: 511px;
    .nav-item {
      float: left;
      width: 187px;
      height: 59px;
      background: url("images/nav-default.png") no-repeat center top;
      background-size: 159px 43px;
      text-align: center;
      margin-right: -56px;
      &.active {
        background: url("images/nav-hover.png") no-repeat center;
        background-size: 100% 100%;
        .nav-link {
          color: @color-text-hover;
        }
      }
      .nav-link-wrapper {
        display: inline;
      }
      .nav-link {
        font-size: 16px;
        line-height: 42px;
        color: @color-text;
        cursor: pointer;
      }
    }
  }
  .br {
    position: absolute;
    height: 4px;
    width: 100%;
    top: 46px;
    background: url("images/bg-bottom.png") no-repeat center;
    background-size: 100% 100%;
  }
</style>
