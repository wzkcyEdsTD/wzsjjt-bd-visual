<template>
  <div class="page-state">
    <div class="map">
      <component :is="currentComponent"></component>
    </div>
    <div class="page-box box-lf">
      <el-carousel indicator-position="none" arrow="never">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <component class="echart" :is="nameList[0]"></component>
              <component class="echart" :is="nameList[1]"></component>
              <component class="echart" :is="nameList[2]"></component>
            </div>
            <div class="swiper-slide">
              <component class="echart" :is="nameList[3]"></component>
              <component class="echart" :is="nameList[4]"></component>
              <component class="echart" :is="nameList[5]"></component>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </el-carousel>
    </div>
    <div class="page-box box-rt">
      <component class="echart" :is="nameList[6]"></component>
      <component class="echart" :is="nameList[7]"></component>
      <component class="echart" :is="nameList[8]"></component>
    </div>
  </div>
</template>

<script>
import loading from '../../components/mixins/loading'
import Swiper from 'swiper'
import { mapGetters } from 'vuex'
import { getJZJZMenuOrder } from 'api/save/save'

export default {
  name: 'State',
  data() {
    return {
      currentComponent: '',
      nameList: []
    }
  },
  mixins: [loading],
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    userInfo() {
      this.requireMap()
    }
  },
  mounted() {
    this.initNameList()
    this.requireMap()
    let slidesPerView = 1
    // 适配1620
    if (window.screen.width >= 5000) {
      slidesPerView = 2
    }
    // slidesPerView = 2
    // eslint-disable-next-line no-unused-vars
    var mySwiper = new Swiper('.swiper-container', {
      slidesPerView: slidesPerView,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        mouseoverable: true
      },
      autoplay: false
    })
    // 鼠标离开开始自动切换
    // mySwiper.el.onmouseover = function() {
    //   mySwiper.autoplay.stop()
    // }
    // 鼠标覆盖停止自动切换
    // mySwiper.el.onmouseout = function() {
    //   mySwiper.autoplay.start()
    // }
  },
  methods: {
    initNameList() {
      getJZJZMenuOrder().then((data, index) => {
        this.nameList = data.map((item, index) => {
          return () => import('./modules/' + item.vueUrl + '/' + item.vueUrl + '.vue')
        })
      })
    },
    requireMap() {
      this.currentComponent = () => import('./modules/state-map/save-map.vue')
      // this.currentComponent = () => import('./modules/state-map/save-map-ruian.vue')
      // return
      // switch (this.userInfo.districtName) {
      //   case '温州市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-wenzhou.vue')
      //     break
      //   case '永嘉县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-yongjia.vue')
      //     break
      //   case '瑞安市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-ruian.vue')
      //     break
      //   case '泰顺县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-taishun.vue')
      //     break
      //   case '文成县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-wencheng.vue')
      //     break
      //   case '乐清市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-leqing.vue')
      //     break
      //   case '龙湾区':
      //     this.currentComponent = () => import('./modules/state-map/save-map-longwan.vue')
      //     break
      //   case '龙港市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-longgang.vue')
      //     break
      //   case '洞头区':
      //     this.currentComponent = () => import('./modules/state-map/save-map-dongtou.vue')
      //     break
      //   case '平阳县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-pingyang.vue')
      //     break
      //   case '鹿城区':
      //     this.currentComponent = () => import('./modules/state-map/save-map-lucheng.vue')
      //     break
      //   case '瓯海区':
      //     this.currentComponent = () => import('./modules/state-map/save-map-ouhai.vue')
      //     break
      //   case '苍南县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-cangnan.vue')
      //     break
      //   case '经开区':
      //     this.currentComponent = () => import('./modules/state-map/save-map-jingkai.vue')
      //     break
      //   default:
      //     this.currentComponent = () => import('./modules/state-map/save-map-wenzhou.vue')
      //     break
      // }
      // switch (this.userInfo.districtName) {
      //   case '温州市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-wenzhou.vue')
      //     break
      //   case '永嘉县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-yongjia.vue')
      //     break
      //   case '瑞安市':
      //     this.currentComponent = () => import('./modules/state-map/save-map-ruian.vue')
      //     break
      //   case '泰顺县':
      //     this.currentComponent = () => import('./modules/state-map/save-map-taishun.vue')
      //     break
      //   default:
      //     this.currentComponent = () => import('./modules/state-map/save-map-wenzhou.vue')
      //     break
      // }
    }
  }
}
</script>

<style scoped lang="less">
  .page-box > .echart, .swiper-slide > .echart {
    height: 33.333%;
  }
  .swiper-wrapper{
    height: calc(100% - 0.13rem);
  }
  .page-state {
    position: relative;
    .map {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      /*测试代码*/
      color: #000;
      font-size: 0.3rem;
      text-align: center;
      // line-height: 150px;
    }
    .page-box {
      position: absolute;
      width: 4.8rem;
      height: calc(100% - 0.13rem);
      max-height: calc(100% - 10px);
      z-index: 2;
      &.box-lf {
        left: 0.14rem;
      }
      &.box-rt {
        right: 0.14rem;
      }
    }
  }
  /deep/ .el-carousel {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-carousel__container {
    height: 100%;
  }
  /deep/ .el-carousel__item.is-animating {
    transition: all 0.8s ease-in;
  }
  /deep/ .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 0.06rem;
  }
  /deep/ .el-carousel--horizontal {
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0);
  }
  .swiper-container {
    width: 4.5rem;
    height: 100%;
    // margin: 20px auto;
    // background: white;
  }
  /deep/ .swiper-pagination-bullet {
    width: 48%;
    height: 0.07rem;
    background: #2d70b5;
    border-radius: 0;
    margin: 0 0 !important;
    transform: skew(-30deg);
  }
  /deep/
  .swiper-pagination {
    bottom: 0.06rem;
  }
  /deep/ .swiper-pagination-bullet-active {
    /*background: #3887da;*/
    background: linear-gradient(to right, #5595da 0%, #237eda 100%);
    /*opacity: 0.8;*/
    height: 0.1rem;
  }
  .swiper-container,
  .swiper-container1 {
    width: 4.5rem;
    height: 100%;
  }
  // 屏幕适配1620
  @media screen and (min-width: 5000px) {
    .box-lf {
      width: 9.6rem !important;
      .swiper-container {
        width: 9rem;
      }
      .swiper-pagination {
        display: none;
      }
    }
  }
</style>
