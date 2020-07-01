<template>
  <div class="page-state page-spc">
    <div class="page-box box-lf">
      <el-carousel ref="leftCar" indicator-position="none" arrow="never">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <component class="Uniform-h" :is="nameList[0]"></component>
              <component class="Uniform-h" :is="nameList[1]"></component>
              <component class="Uniform-h" :is="nameList[2]"></component>
            </div>
            <div class="swiper-slide">
              <component class="Uniform-h" :is="nameList[3]"></component>
              <component class="Uniform-h" :is="nameList[4]"></component>
              <component class="Uniform-h" :is="nameList[5]"></component>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </el-carousel>
    </div>
    <div class="map">
      <component :is="currentComponent"></component>
    </div>
    <div class="page-box box-rt">
      <el-carousel indicator-position="none" arrow="never">
        <div class="swiper-container1">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <component class="Uniform-h" :is="nameList[6]"></component>
              <component class="Uniform-h" :is="nameList[7]"></component>
              <component class="Uniform-h" :is="nameList[8]"></component>
            </div>
            <div class="swiper-slide">
              <component class="Uniform-h" :is="nameList[9]"></component>
              <component class="Uniform-h" :is="nameList[10]"></component>
              <component class="Uniform-h" :is="nameList[11]"></component>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </el-carousel>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>

import Swiper from 'swiper'
import loading from '../../components/mixins/loading'
import { mapGetters, mapActions } from 'vuex'
import { getAQFXMenuOrder } from 'api/state/state'

export default {
  name: 'State',
  mixins: [loading],
  data() {
    return {
      currentComponent: '',
      timer: true,
      test: {
        name: {
        }
      },
      nameList: []
    }
  },
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
    window.onresize = () => {
      if (this.timer) {
        this.timer = false
      }
    }
    this.requireMap()
    let slidesPerView = 1
    // 适配1620
    if (window.screen.width >= 5000) {
      slidesPerView = 2
    }
    var mySwiper1 = new Swiper('.swiper-container1', {
      slidesPerView: slidesPerView,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        mouseoverable: true
      },
      // autoplay: false
      autoplay: {
        // delay: 22000,
        delay: 9999999999999,
        disableOnInteraction: false
      }
    })
    // 鼠标覆盖停止自动切换
    mySwiper1.el.onmouseover = function() {
      mySwiper1.autoplay.stop()
    }
    // 鼠标离开开始自动切换
    mySwiper1.el.onmouseout = function() {
      mySwiper1.autoplay.start()
    }
  },
  methods: {
    initNameList() {
      getAQFXMenuOrder().then((data) => {
        this.nameList = data.map((item, index) => {
          if (this.userInfo.districtName === '永嘉县' && item.vueUrl === 'haiyangyuye') {
            return () => import('./modules/qixiangzaihaizhongdianfangyudanwei/qixiangzaihaizhongdianfangyudanwei.vue')
          } else {
            if (item.vueUrl === '无') {
              return null
            } else {
              // if (item.vueUrl === 'dixiakongjian') {
              //   return () => import('./modules/chengshijichusheshi-special/chengshijichusheshi-special.vue')
              // }
              return () => import('./modules/' + item.vueUrl + '/' + item.vueUrl + '.vue')
            }
            // }
          }
        })
        let slidesPerView = 1
        // 适配1620
        if (window.screen.width >= 5000) {
          slidesPerView = 2
        }
        console.log(this.nameList)
        if (this.nameList[3] !== null || this.nameList[4] !== null || this.nameList[5] !== null) {
          var mySwiper = new Swiper('.swiper-container', {
            slidesPerView: slidesPerView,
            spaceBetween: 30,
            loop: false,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
              mouseoverable: true
            },
            autoplay: {
              // delay: 20000,
              delay: 9999999999,
              disableOnInteraction: false
            }
          })
          mySwiper.el.onmouseover = function() {
            // mySwiper.autoplay.stop();
          }
          // 鼠标离开开始自动切换
          mySwiper.el.onmouseout = function() {
            mySwiper.autoplay.start()
          }
        }
        console.log(this.nameList)
      })
    },
    requireMap() {
      switch (this.userInfo.districtName) {
        case '温州市':
          this.currentComponent = () => import('./modules/state-map/state-map-wenzhou.vue')
          break
        case '永嘉县':
          this.currentComponent = () => import('./modules/state-map/state-map-yongjia.vue')
          break
        case '瑞安市':
          this.currentComponent = () => import('./modules/state-map/state-map-ruian.vue')
          break
        case '泰顺县':
          this.currentComponent = () => import('./modules/state-map/state-map-taishun.vue')
          break
        case '文成县':
          this.currentComponent = () => import('./modules/state-map/state-map-wencheng.vue')
          break
        case '乐清市':
          this.currentComponent = () => import('./modules/state-map/state-map-leqing.vue')
          break
        case '龙湾区':
          this.currentComponent = () => import('./modules/state-map/state-map-longwan.vue')
          break
        case '龙港市':
          this.currentComponent = () => import('./modules/state-map/state-map-longgang.vue')
          break
        case '洞头区':
          this.currentComponent = () => import('./modules/state-map/state-map-dongtou.vue')
          break
        case '平阳县':
          this.currentComponent = () => import('./modules/state-map/state-map-pingyang.vue')
          break
        case '鹿城区':
          this.currentComponent = () => import('./modules/state-map/state-map-lucheng.vue')
          break
        case '瓯海区':
          this.currentComponent = () => import('./modules/state-map/state-map-ouhai.vue')
          break
        case '苍南县':
          this.currentComponent = () => import('./modules/state-map/state-map-cangnan.vue')
          break
        case '经开区':
          this.currentComponent = () => import('./modules/state-map/state-map-jingkai.vue')
          break
        case '瓯江口':
          this.currentComponent = () => import('./modules/state-map/state-map-oujiang.vue')
          break
        default:
          this.currentComponent = ''
          break
      }
    },
    ...mapActions([
      'SetResize'
    ])
  }
}
</script>

<style scoped lang="less">
  .Uniform-h {
    height: 33%;
  }
  .page-state {
    position: relative;
    .map {
      width: 50%;
      height: 100%;
      z-index: 1;
      /*测试代码*/
      color: #000;
      font-size: 0.3rem;
      text-align: center;
      float: left;
      // line-height: 150px;
    }
    .map2 {
      position: absolute;
      width: 40%;
      height: 100%;
      max-height: calc(100% - 10px);
      z-index: 2;
      left: 4.94rem;
      top: 10%;
    }
    .page-box {
      width: 24%;
      height: 100%;
      max-height: calc(100% - 10px);
      z-index: 2;
      float: left;
      &.box-lf {
        margin-left: 1%;
      }
      &.box-rt {
        margin-right: 1%
      }
    }
  }
  .page-spc {
    padding-top: 0.5rem;
    margin-top: -0.5rem;
    height: 107% !important;
    background: url("images/map.png");
    background-size: 100% 100%;
  }
  /deep/ .el-carousel {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-carousel__container {
    height: 100%;
    overflow: hidden;
  }
  /deep/ .el-carousel__item.is-animating {
    transition: all 0.8s ease-in;
  }
  /deep/ .swiper-pagination-bullet {
    width: 48%;
    height: 0.07rem;
    background: #2d70b5;
    border-radius: 0;
    margin: 0 0 !important;
    transform: skew(-30deg);
  }
  /*/deep/*/
  /*!*.swiper-pagination{*!*/
  /*!*bottom:-0.02rem;}*!*/
  /deep/ .swiper-pagination-bullet-active {
    /*background: #3887da;*/
    background: linear-gradient(to right, #5595da 0%, #237eda 100%);
    /*opacity: 0.8;*/
    height: 0.1rem;
  }
  .swiper-container,
  .swiper-container1 {
    width: 100% !important;
    height: 100%;
    // margin: 20px auto;
    // background: white;
  }
  /*@media screen and (min-height:950px){*/
  /*  .swiper-container,*/
  /*  .swiper-container1{*/
  /*  margin-top:0.1rem;}*/
  /*}*/
  /deep/ .mapboxgl-popup-tip {
    border-top-color: #7935ff;
  }
  /deep/ .mapboxgl-popup-content {
    background: #7935ff;
    padding: 0.05rem;
  }
  /deep/ .mapboxgl-popup-content > h1 {
    color: #fff;
    font-size: 0.18rem;
    text-align: center;
    line-height: 0.28rem;
    > span {
      color: #ffb963;
      font-size: 0.24rem;
    }
  }
  @media screen and (min-width: 5000px) {
    .swiper-pagination {
      display: none;
    }
    .page-state .map {
      width: 40%;
    }
    .page-state .page-box {
      width: 29%;
    }
    .swiper-wrapper {
      width: 50%;
    }
  }
</style>
