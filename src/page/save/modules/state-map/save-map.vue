<template>
  <div class="map-center" :class="city" style="height: 100%">
    <div id="map">
      <div class="map1" @mouseenter="mouseChange(true)" @mouseleave="mouseChange(false)">
        <img id="mapView" :src="src" alt/>
        <list class="list1" :data="list" :index="listIndex" @listChange="listChange"></list>
        <total class="total" :total="total"></total>
        <!-- <point :data="pointData"></point> -->
        <component :is='point' :data="pointData"></component>
        <steps
          @mouseenter="isEnter=true"
          @mouseleave="isEnter=false"
          class="steps"
          ref='steps'
          :data="timeData"
          :listCount='{count: list.length, index: listIndex}'
          :index="timeDataIndex"
          :isEnter="isEnter"
          @listChange="listChange"
          @changeTimeDataIndex="changeTimeDataIndex"></steps>
      </div>
    </div>
  </div>
</template>
<script>
import point from './modules/point-wencheng'
import list from './modules/list'
import total from './modules/total'
import steps from './modules/step'
import saveMap from 'common/js/saveMap'

export default {
  name: 'SaveMap',
  mixins: [saveMap],
  data() {
    return {
      point: '',
      src: '',
      city: ''
    }
  },
  watch: {
    userInfo(val) {
      if (val.districtName) {
        this.loadMap()
      }
    }
  },
  mounted() {
    // this.city = 'yongjia'
    // this.src = require('./images/yjmap1.png')
    // this.point = () => import('./modules/point-yongjia')
    // return
    this.loadMap()
  },
  methods: {
    loadMap() {
      switch (this.userInfo.districtName) {
      // switch ('苍南县') {
        case '温州市':
          this.city = 'wenzhou'
          this.src = require('./images/detail.png')
          this.point = () => import('./modules/point-wenzhou')
          break
        case '永嘉县':
          this.city = 'yongjia'
          this.src = require('./images/yjmap1.png')
          this.point = () => import('./modules/point-yongjia')
          break
        case '瑞安市':
          this.city = 'ruian'
          this.src = require('./images/ruian-map.png')
          this.point = () => import('./modules/point-ruian')
          break
        case '泰顺县':
          this.city = 'taishun'
          this.src = require('./images/taishun-map.png')
          this.point = () => import('./modules/point-taishun')
          break
        case '文成县':
          this.city = 'wencheng'
          this.src = require('./images/wencheng-map.png')
          this.point = () => import('./modules/point-wencheng')
          break
        case '乐清市':
          this.city = 'leqing'
          this.src = require('./images/leqing-map.png')
          this.point = () => import('./modules/point-leqing')
          break
        case '龙湾区':
          this.city = 'longwan'
          this.src = require('./images/longwan-map.png')
          this.point = () => import('./modules/point-longwan')
          break
        case '龙港市':
          this.city = 'longgang'
          this.src = require('./images/longgang-map.png')
          this.point = () => import('./modules/point-longgang')
          break
        case '洞头区':
          this.city = 'dongtou'
          this.src = require('./images/dongtou-map.png')
          this.point = () => import('./modules/point-dongtou')
          break
        case '平阳县':
          this.city = 'pingyang'
          this.src = require('./images/pingyang-map.png')
          this.point = () => import('./modules/point-pingyang')
          break
        case '鹿城区':
          this.city = 'lucheng'
          this.src = require('./images/lucheng-map.png')
          this.point = () => import('./modules/point-lucheng')
          break
        case '瓯海区':
          this.city = 'ouhai'
          this.src = require('./images/ouhai-map.png')
          this.point = () => import('./modules/point-ouhai')
          break
        case '苍南县':
          this.city = 'cangnan'
          this.src = require('./images/cangnan-map.png')
          this.point = () => import('./modules/point-cangnan')
          break
        case '瓯江口':
          this.city = 'oujiang'
          this.src = require('./images/oujiang-map.png')
          this.point = () => import('./modules/point-oujiang')
          break
        case '经开区':
          this.city = 'jingkai'
          this.src = require('./images/jingkai-map.png')
          this.point = () => import('./modules/point-jingkai')
          break
        default:
          // this.city = 'wenzhou'
          // this.src = require('./images/detail.png')
          // this.point = () => import('./modules/point-wenzhou')
          break
      }
    }
  },
  components: {
    list,
    total,
    point,
    steps
  }
}
</script>
<style scoped lang="less">
.map-center{
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
    background: url("images/map.png");
    background-size: 100% 100%;
  }
  .map1 {
    position: relative;
    width: 45%;
    height: auto;
    margin: 10% auto 0;
  }
  .list1,
  .list2,
  .list3 {
    position: fixed;
    left: 30%;
    top: 0.65rem;
    /* width: 183px;
    height: 58px; */
    line-height: 0.75rem;
  }
  .list2 {
    top: 2.23rem;
  }
  .list3 {
    top: 2.91rem;
  }
  .total {
    position: fixed;
    /* line-height: 75px; */
    left: 52%;
    top: 0.75rem;
  }
  .bottomlist {
    position: fixed;
    right: 28%;
    bottom: 16%;
    /* line-height: 35px; */
  }
  .steps {
    position: absolute;
    bottom: -15%;
    left: 55%;
    line-height: 0.35rem;
  }
  #mapView {
    width: 100%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 12%;
    }
  }
}
.wenzhou{
  .map1 {
    margin: 6% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 12%;
    }
  }
}
.yongjia{
  .map1 {
    position: relative;
    width: 38%;
    height: auto;
    margin: 12% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 15%;
    }
  }
}
.ruian{
  .map1 {
    width: 43%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 15%;
    }
  }
}
.taishun{
  .map1 {
    width: 38%;
    margin: 13% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 16%;
    }
  }
}
.wencheng{
  .map1 {
    width: 41%;
    margin: 5% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 10%;
    }
  }
}
.leqing{
  .map1 {
    width: 37%;
    margin: 6% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 10%;
    }
  }
}
.longwan{
  .map1 {
    width: 37%;
    margin: 4% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 10%;
    }
  }
}
.longgang{
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 16%;
    }
    .steps{
      bottom: -29%
    }
  }
}
.dongtou{
  .map1 {
    width: 39%;
    margin: 9% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 15%;
    }
  }
}
.pingyang{
  .map1 {
    width: 42%;
    margin: 6% auto 0;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 14%;
    }
  }
}
.lucheng{
  .map1 {
    margin: 7% auto 0;
  }
  .steps{
    bottom: 1%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 14%;
    }
  }
}
.ouhai{
  .steps{
    bottom: 2%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 14%;
    }
  }
}
.cangnan{
  .steps{
    bottom: 2%;
  }
  .map1 {
    width: 44%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 14%;
    }
  }
}
.oujiang{
  .steps{
    bottom: 2%;
  }
  .map1 {
    width: 44%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 14%;
    }
  }
}
.jingkai{
  .steps{
    bottom: -8%;
  }
  .map1 {
    margin-top: 6%;
    width: 44%;
  }
  @media screen and (min-height: 1050px) {
    .map1 {
      margin-top: 12%;
    }
  }
}
</style>
