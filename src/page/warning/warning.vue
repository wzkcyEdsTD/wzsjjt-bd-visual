<template>
  <div class="page-warning">
    <div class="map">
      <Map
        @showDiZai="showDiZai"
        @showFullVideo="showFullVideo"
        ref='map'
        :collapse2="rtCollage"
        :cameraOne="cameraOne"
        :camera="cameraChecked"
        @length='getLength'
        @videoList='changeList'
        @chooseMenu="chooseMenu($event)"></Map>
    </div>
    <div class="page-box box-lf" :class="{'collapse': lfCollage}">
      <div class="btn" :class="{'collapse': lfCollage}" @click="collage('lf')"></div>
      <div class="myswiper-container" :class="{close: ismove}" >
        <div :id="myswiperIndex[0].id" class="myswiper-wrapper" @mousedown="mousedown($event, 'left')">
          <div class="cover" v-show='ismove'></div>
          <div class="myswiper-slide">
            <component
              :class="className(nameList[0] && nameList[0].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[0] && nameList[0].name"
              :is="nameList[0] && nameList[0].url"></component>
            <component
              :class="className(nameList[1] && nameList[1].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[1] && nameList[1].name"
              :is="nameList[1] && nameList[1].url"></component>
            <component
              :class="className(nameList[2] && nameList[2].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[2] && nameList[2].name"
              :is="nameList[2] && nameList[2].url"></component>
          </div>
          <div class="myswiper-slide">
            <component
              :class="className(nameList[3] && nameList[3].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[3] && nameList[3].name"
              :is="nameList[3] && nameList[3].url"></component>
            <component
              :class="className(nameList[4] && nameList[4].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[4] && nameList[4].name"
              :is="nameList[4] && nameList[4].url"></component>
            <component
              :class="className(nameList[5] && nameList[5].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[5] && nameList[5].name"
              :is="nameList[5] && nameList[5].url"></component>
          </div>
        </div>
        <div class="myswiper-pagination">
          <span
            @click="changeSwiperIndex(0,swiperIndex1)"
            :key="'swiperIndex'+swiperIndex1"
            v-for="(_,swiperIndex1) in 2"
            :class="{'active':myswiperIndex[0].value===swiperIndex1}"></span>
        </div>
      </div>
    </div>
    <div class="page-box box-rt" :class="{'collapse': rtCollage}">
      <div class="btn" :class="{'collapse': rtCollage}" @click="collage('rt')"></div>
      <div class="myswiper-container" :class="{close: ismove}">
        <div :id="myswiperIndex[1].id" class="myswiper-wrapper" @mousedown="mousedown($event, 'right')">
          <div class="cover" v-show='ismove'></div>
          <div class="myswiper-slide">
            <component
              :class="className(nameList[6] && nameList[6].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[6] && nameList[6].name"
              :is="nameList[6] && nameList[6].url"></component>
            <component
              :class="className(nameList[7] && nameList[7].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[7] && nameList[7].name"
              :is="nameList[7] && nameList[7].url"></component>
            <component
              :class="className(nameList[8] && nameList[8].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[8] && nameList[8].name"
              :is="nameList[8] && nameList[8].url"></component>
          </div>
          <div class="myswiper-slide">
            <component
              :class="className(nameList[9] && nameList[9].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[9] && nameList[9].name"
              :is="nameList[9] && nameList[9].url"></component>
            <component
              :class="className(nameList[10] && nameList[10].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[10] && nameList[10].name"
              :is="nameList[10] && nameList[10].url"></component>
            <component
              :class="className(nameList[11] && nameList[11].name)"
              @weatherMap="changeWeatherMap"
              @treeCheckedCamera="treeCheckedCamera"
              @isShow='setIsShow'
              @changeIndex='changeIndex'
              :danbingLength='danbingLength'
              :weixinLength='weixinLength'
              :bukongLength='bukongLength'
              :wurenjiLength='wurenjiLength'
              :ref="nameList[11] && nameList[11].name"
              :is="nameList[11] && nameList[11].url"></component>
          </div>
        </div>
        <div class="myswiper-pagination">
          <span
            @click="changeSwiperIndex(1,swiperIndex2)"
            :key="'swiperIndex'+swiperIndex2"
            v-for="(_,swiperIndex2) in 2"
            :class="{'active':myswiperIndex[1].value===swiperIndex2}"></span>
        </div>
      </div>
    </div>
    <waterDetail
      class="waterDetail"
      :class="detailClass"
      :isShow='isShow'
      :type='waterIndex'
      @close="closeWaterDetail"/>
    <div class="leftbtn" :class="{'collapse': lfCollage}">
      <leftbtn
        ref="leftbtn"
        @zoomChange='zoomChange'
        @baseMapChange='baseMapChange'
        @mapInit='mapInit'
        @treeCheckedCamera="treeCheckedCamera"
        @treeCheckedItems="cameraCheckedItems"/>
    </div>
    <div></div>
    <WarningBar></WarningBar>
    <VideoList></VideoList>
    <VideoList2></VideoList2>
    <CenterMap1
      v-if="centerMap[1]"
      :isShow="centerMap[1]"
      @weatherMap="changeWeatherMap"></CenterMap1>
    <CenterMap2
      v-if="centerMap[2]"
      :isShow="centerMap[2]"
      @weatherMap="changeWeatherMap"></CenterMap2>
    <CenterMap3
      v-if="centerMap[3]"
      :isShow="centerMap[3]"
      @weatherMap="changeWeatherMap"></CenterMap3>
    <CenterMap4
      v-if="centerMap[4]"
      :isShow="centerMap[4]"
      @weatherMap="changeWeatherMap"></CenterMap4>
    <CenterMap5
      v-if="centerMap[5]"
      :isShow="centerMap[5]"
      @weatherMap="changeWeatherMap"></CenterMap5>
    <BigVideo ref="fullVideoEl"></BigVideo>
    <DizaiDialog ref="dizai" :dizaiData="dizaiData"></DizaiDialog>
    <ShuizhaDialog ref="shuizha" :shuizhaData="shuizhaData"></ShuizhaDialog>
    <TyphoonVideo ref="typhoonVideo"></TyphoonVideo>
    <Step></Step>
  </div>
</template>

<script>
import DizaiDialog from './modules/dizaijiance/dizaiDialog'
import ShuizhaDialog from './modules/shuizhajiance/shuizhaDialog'
import Map from './modules/map/map'
import WarningBar from './modules/map/warningBar'
import VideoList from './modules/map/videoList'
import VideoList2 from './modules/map/videoList2'
import Yuqingjiance from './modules/yuqingjiance/yuqingjiance'
import Shuiqingjiance from './modules/shuiqingjiance/shuiqingjiance'
import Jishuidianjiance from './modules/jishuidianjiance/jishuidianjiance'
import Qixiangxinxi from './modules/qixiangxinxi/qixiangxinxi'
import Step from './modules/qixiangxinxi/modules/step'
import Weihuaqiyejiance from './modules/weihuaqiyejiance/weihuaqiyejiance'
import Liangkeyiweijiance from './modules/liangkeyiweijiance/liangkeyiweijiance'
import Dizaijiance from './modules/dizaijiance/dizaijiance'
import Jingqu from './modules/jingqu/jingqu'
import leftbtn from './modules/button/leftbutton'
import rightbtn from './modules/button/rightbutton'
import CenterMap1 from './modules/center-map/map1'
import CenterMap2 from './modules/center-map/map2'
import CenterMap3 from './modules/center-map/map3'
import CenterMap4 from './modules/center-map/map4'
import CenterMap5 from './modules/center-map/map5'
import loading from '../../components/mixins/loading'
import waterDetail from './modules/water-detail/water-detail'
import Yuchuanjiance from './modules/yuchuanjiance/yuchuanjiance'
import BigVideo from 'components/big-video/big-video'
// import Swiper from 'swiper'
import Shipingjiankon from './modules/shipingjiankon/shipingjiankon.vue'
import TyphoonVideo from './modules/qixiangxinxi/modules/typhoonVideo'
import { getJCYJMenuOrder, forward, forwardAFileAll } from 'api/warning/warning'
import { uuid } from 'common/js/util'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Waring',
  data() {
    return {
      myswiperIndex: [
        {
          id: 'uuid' + uuid(),
          value: 0,
          ismove: false
        },
        {
          id: 'uuid' + uuid(),
          value: 0,
          ismove: false
        }
      ],
      ismove: false,
      centerMap: [false, false, false, false, false],
      timer: true,
      isShow: false,
      cameraChecked: {},
      waterIndex: 0,
      cameraOne: {},
      weatherTime: '',
      detailClass: 'left',
      lfCollage: false,
      rtCollage: false,
      nameList: [
        // { url: () => import('./modules/daxingguanjianshebei/daxingguanjianshebei.vue'), name: 'daxingguanjianshebei' }
      ],
      isShowDiZai: false,
      danbingLength: 0,
      bukongLength: 0,
      wurenjiLength: 0,
      weixinLength: 0,
      dizaiData: {
        smid: 1,
        type: 3, //  0为地表位移、1为GPS、2为双轴倾角、3为雨量
        name: '温州市瓯海区景山街道精神病院东首不稳定斜坡'
      },
      shuizhaData: {},
      mySwiper: null,
      danbingList: {},
      // 滑动属性
      beginX: 0,
      swiperType: '',
      endX: 0,
      swipeRight: false,
      swipeLeft: false,
      startLeft: 0,
      swiperWidth: 0,
      time: 0
    }
  },
  computed: {
    ...mapGetters('warning', [
      'collapse',
      'waterState'
    ])
  },
  mixins: [loading],
  mounted() {
    // this.ismove = true
    if (this.$store.state.userInfo.districtName === '文成县') {
      this.lfCollage = true
      this.rtCollage = true
    }
    this.danbingList = this.$refs.map.danbingList
    const me = this
    // let slidesPerView = 1
    // // 适配1620
    // if (window.screen.width >= 5000) {
    //   slidesPerView = 2
    // }
    // var mySwiper = new Swiper('.swiper-container', {
    //   slidesPerView: slidesPerView,
    //   spaceBetween: 30,
    //   loop: false,
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //     mouseoverable: true
    //   },
    //   // autoplay: {
    //   //   // delay: 20000,
    //   //   delay: 2000,
    //   //   disableOnInteraction: false
    //   // }
    //   autoplay: false
    // })
    // mySwiper.onmouseover = function() {
    //   // mySwiper.autoplay.stop();
    // }
    // this.mySwiper = mySwiper
    getJCYJMenuOrder().then(res => {
      this.nameList = res.map((item, index) => {
        if (item.vueUrl === 'yuqingjiance') {
          item.orderNum > 6 ? this.detailClass = 'right' : this.detailClass = 'left'
        } 
        if (item.vueUrl === 'yuchuanjiance') {
          // return { name: '无' }
          return { url: () => import('./modules/shishichaoweijiance/shishichaoweijiance.vue'), name: 'shishichaoweijiance' }
        } else {
          return { url: () => import('./modules/' + item.vueUrl + '/' + item.vueUrl + '.vue'), name: item.vueUrl }
        }
      })
      // 是否跳转到第二屏
      let flagIndex = -1
      for (let i = 0; i < this.nameList.length; i++) {
        if (this.nameList[i].name === this.waterState) {
          flagIndex = i
          i = this.nameList.length
        }
      }
      if (this.waterState === 'yuchuanjiance') this.SetCurrentWaterState('')
      // this.SetCurrentWaterState('')
      flagIndex = Math.floor(flagIndex / 3)
      if (flagIndex === 1) {
        me.mySwiper[0].$el[0].children[1].children[1].click()
      } else if (flagIndex === 3) {
        me.mySwiper[1].$el[0].children[1].children[1].click()
      }
    })
    window.onresize = () => {
      if (this.timer) {
        this.timer = false
      }
    }
    this.$bus.on('clearYunTu', (val) => {
      this.$refs.typhoonVideo.remove()
    })
  },
  watch: {
    timer() {
      if (!this.timer) {
        setTimeout(() => {
          this.timer = !this.timer
          this.SetResize({
            width: document.body.offsetWidth,
            height: document.body.offsetHeight
          })
        }, 300)
      }
    }
  },
  methods: {
    // swiperClick(e) {
    //   e.stopPropagation()
    //   console.log(e.target)
    //   return false
    // },
    mousedown(e, type) {
      // this.ismove = false
      if (e.target.classList[0] === 'mapboxgl-canvas') return false
      this.swiperType = type
      // e.stopPropagation()
      // e.preventDefault()
      // 清除延迟
      document.getElementById(this.myswiperIndex[0].id).style.transition = ''
      document.getElementById(this.myswiperIndex[1].id).style.transition = ''
      let index = 0
      this.time = Date.now()
      if (this.swiperType === 'right') index = 1
      this.startLeft = Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).transform.split(',')[4])
      this.beginX = event.screenX
      this.swiperWidth = Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).width.split('px')[0])
      // console.log(Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).transform.split(',')[4]))
      if (this.swiperType) {
        document.onmousemove = this.mousemove
        document.onmouseup = this.mouseup
      }
    },
    mousemove(e) {
      // var pre = Date.now()
      // console.log(pre)
      // return (e) => {
      // var now = Date.now()
      this.ismove = true
      let index = 0
      if (this.swiperType === 'right') index = 1
      // console.log(now - this.time)
      // if (now - this.time >= 100) {
      // console.log('触发')
      this.endX = event.screenX
      // console.log(this.endX - this.beginX)
      /* 向右滑动*/
      if (this.endX - this.beginX > 0) {
        const left = Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).transform.split(',')[4])
        // console.log(left)
        // 当到头时不移动
        // document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.016s linear'
        if (left >= 0) {
          document.getElementById(this.myswiperIndex[index].id).style.transform = 'translate3d(0,0,0)'
        } else {
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(${this.startLeft + this.endX - this.beginX}px,0,0)`
        }
        console.log('结束')
      } else {
        const left = Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).transform.split(',')[4])
        // console.log(left)
        // document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.016s linear'
        if (Math.abs(left) >= this.swiperWidth / 2) {
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(-${this.swiperWidth / 2}px,0,0)`
        } else {
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(${this.startLeft + this.endX - this.beginX}px,0,0)`
        }
        console.log('结束')
      }
      // this.time = Date.now()
      // }
      // }
      // this.time += 1
      // console.log(e)
      // if (this.time <= 100) return
      // e.stopPropagation()
      // e.preventDefault()
    },
    mouseup(e) {
      console.log('up')
      e.stopPropagation()
      e.preventDefault()
      // 判断左右栏
      let index = 0
      if (this.swiperType === 'right') index = 1
      console.log(this.swiperType)
      const left = Number(window.getComputedStyle(document.getElementById(this.myswiperIndex[index].id)).transform.split(',')[4])
      // 鼠标向右滑
      console.log(left)
      console.log(this.endX - this.beginX)
      if (this.endX - this.beginX > 0) {
        if (left > this.swiperWidth / (-4)) {
          document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.3s linear'
          document.getElementById(this.myswiperIndex[index].id).style.transform = 'translate3d(0,0,0)'
          this.myswiperIndex[index].value = 0
        } else if (this.swiperWidth / (-2) <= left && left <= this.swiperWidth / (-4)) {
          document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.3s linear'
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(-${this.swiperWidth / 2}px,0,0)`
          this.myswiperIndex[index].value = 1
        }
      } else { // 鼠标向左滑
        if (left > this.swiperWidth / (-4)) {
          document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.3s linear'
          document.getElementById(this.myswiperIndex[index].id).style.transform = 'translate3d(0,0,0)'
          this.myswiperIndex[index].value = 0
        } else if (this.swiperWidth / (-2) < left && left <= this.swiperWidth / (-4)) {
          document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.3s linear'
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(-${this.swiperWidth / 2}px,0,0)`
          this.myswiperIndex[index].value = 1
        } else if (this.swiperWidth / (-2) >= left) {
          document.getElementById(this.myswiperIndex[index].id).style.transition = 'all 0.3s linear'
          document.getElementById(this.myswiperIndex[index].id).style.transform = `translate3d(-${this.swiperWidth / 2}px,0,0)`
          this.myswiperIndex[index].value = 1
        }
      }
      console.log(this.myswiperIndex[index].value)
      // }
      // 清空状态
      this.swiperType = ''
      setTimeout(() => {
        this.ismove = false
        document.getElementById(this.myswiperIndex[0].id).style.transition = ''
        document.getElementById(this.myswiperIndex[1].id).style.transition = ''
      }, 200)
      document.onmousemove = null
      document.onmouseup = null
    },
    changeSwiperIndex(index, value) {
      const arr = [...this.myswiperIndex]
      arr[index].value = value
      this.myswiperIndex = arr
      const id = document.getElementById(arr[index].id)
      id.style.transition = 'all 0.3s linear'
      id.style.transform = 'translateX(' + parseInt(window.getComputedStyle(id.parentNode).width) * -value + 'px)'
    },
    // 左右关闭开启
    collage(data) {
      if (data === 'lf') {
        this.lfCollage = !this.lfCollage
      } else {
        this.rtCollage = !this.rtCollage
      }
    },
    // 监听单兵设备数量
    changeList(data) {
      this.danbingList = data
    },
    // 获取设备数量
    getLength(data) {
      if (data.weixin >= 0) {
        this.weixinLength = data.weixin
      }
      if (data.danbing >= 0) {
        this.danbingLength = data.danbing
      }
      if (data.bukongqiu >= 0) {
        this.bukongLength = data.bukongqiu
      }
      if (data.wurenji >= 0) {
        this.wurenjiLength = data.wurenji
      }
    },
    showDiZai(data) {
      this.$refs.dizai.show()
      const obj = {}
      for (const i in data.properties) {
        obj[i.toLowerCase()] = data.properties[i]
      }
      this.dizaiData = data
    },
    // 水闸弹框
    showShuiZha(data) {
      console.log(this.$refs.shuizha)
      this.$refs.shuizha.show()
      this.shuizhaData = data
    },
    showDiZai2(data) {
      this.$refs.dizai.show()
      this.dizaiData = data
    },
    className(name) {
      switch (name) {
        case 'shipingjiankon':
          return `Uniform-video ${name}`
        default:
          return `Uniform-h ${name}`
      }
    },
    showFullVideo(url) {
      this.$refs.fullVideoEl.show(url)
    },
    setIsShow(num) {
      this.isShow = !this.isShow
      this.changeIndex(num)
    },
    // 雨情监测类型
    changeIndex(index) {
      this.waterIndex = index
    },
    cameraCheckedItems(obj) {
      this.cameraChecked = obj
    },
    treeCheckedCamera(obj) {
      this.cameraOne = obj
    },
    closeWaterDetail() {
      this.isShow = false
    },
    chooseMenu(data) {
      this.$refs.leftbtn.chooseMenu(data)
    },
    changeWeatherMap(arr) {
      let index = arr[0]
      const bool = arr[1] !== -1
      if (index === 1 || index === 2) {
        if (bool) {
          let url = ''
          let type = ''
          if (index === 1) {
            url = 'http://data.istrongcloud.com/data/images/cloud/szmb_transparent.json'
            type = '卫星云图'
          } else if (index === 2) {
            // url = 'http://data.istrongcloud.com/data/images/radar/mingle/caiyun_transparent.json'
            url = 'https://api.caiyunapp.com/v1/radar/fine_images?lon=120.94146&lat=27.999399&level=1&token=Y2FpeXVuIGFuZHJpb2QgYXBp'
            type = '气象雷达'
          }
          forward(url).then(data => {
            // console.log('data: ' + JSON.stringify(data))
            // data = [{
            //   'name': '202007101900.png',
            //   'url': 'https://upy.istrongcloud.com/radar/mingle/caiyun_transparent/202007/10/2020071018157Eh1rJ4P.PNG',
            //   'md5': 'e8de4ec95709fc38ae5c8b7c7b98a17b',
            //   'dt': null
            // }, {
            //   'name': '202007102000.png',
            //   'url': 'https://upy.istrongcloud.com/cloud/szmb_transparent/202007/10/202007101900om5dcgR0.png',
            //   'md5': 'e8de4ec95709fc38ae5c8b7c7b98a17b',
            //   'dt': null
            // }]
            const arr = []
            if (type === '卫星云图') {
              data.forEach((item, index) => {
                forwardAFileAll(item.url).then(_baseData => {
                  const timeNum = item.name.split('.')[0]
                  arr[index] = [
                    item.url,
                    new Date(timeNum.slice(0, 4) + '/' + timeNum.slice(4, 6) + '/' + timeNum.slice(6, 8) + ' ' + timeNum.slice(8, 10) + ':' + timeNum.slice(10, 12)).getTime().toString().slice(0, -3) - 0,
                    type,
                    'data:image/png;base64,' + _baseData
                  ]
                  let flag = true
                  for (let j = 0; j < arr.length; j++) {
                    if (arr[j] === undefined) {
                      flag = false
                      break
                    }
                  }
                  if (arr.length === data.length && flag) {
                    this.$bus.emit('clearTyphoon')
                    this.$bus.emit('clearYunTu')
                    this.$refs.typhoonVideo.show(arr, true, type)
                  }
                })
              })
            } else if (type === '气象雷达') {
              var map = this.$refs.map.map
              if (data && data.images && data.images.length > 0) {
                // 显示video
                this.$refs.typhoonVideo.show(data.images, true, type)
                // console.log('data.images[0][0]: ' + data.images[0][0]);
                if (map.getLayer('qixiangleida' + '_layer')) {
                  map.removeLayer('qixiangleida' + '_layer')
                }
                if (map.getSource('qixiangleida' + '_source')) {
                  map.removeSource('qixiangleida' + '_source')
                }
                map.addSource('qixiangleida' + '_source', {
                  'type': 'image',
                  'url': data.images[0][0],
                  'coordinates': [
                    [data.images[0][2][1], data.images[0][2][2]],
                    [data.images[0][2][3], data.images[0][2][2]],
                    [data.images[0][2][3], data.images[0][2][0]],
                    [data.images[0][2][1], data.images[0][2][0]]
                  ]
                })
                map.addLayer({
                  'id': 'qixiangleida' + '_layer',
                  'type': 'raster',
                  'source': 'qixiangleida' + '_source'
                })
              }
            }
          })
        } else {
          // 清除
          this.$bus.emit('clearYunTu')
        }
      } else {
        this.centerMap = [false, false, false, false, false]
        if (index === 1) {
          index = 4
        } else if (index === 2) {
          index = 5
        }
        if (index !== -1) {
          this.centerMap[index] = true
        }
        this.centerMap = [...this.centerMap]
      }
    },
    zoomChange(data) {
      this.$refs.map.zoomChange(data)
    },
    baseMapChange(data) {
      this.$refs.map.baseMapChangedata(data)
    },
    mapInit() {
      this.$refs.map.mapInit()
    },
    ...mapActions([
      'SetResize'
    ]),
    ...mapActions('warning', [
      'SetMapLoaded',
      'SetCurrentWaterState'
    ])
  },
  beforeDestroy() {
    this.SetMapLoaded(false)
  },
  components: {
    Map,
    Yuqingjiance,
    Shuiqingjiance,
    Jishuidianjiance,
    Qixiangxinxi,
    Weihuaqiyejiance,
    Liangkeyiweijiance,
    Jingqu,
    Yuchuanjiance,
    leftbtn,
    rightbtn,
    CenterMap1,
    CenterMap2,
    CenterMap3,
    CenterMap4,
    CenterMap5,
    waterDetail,
    BigVideo,
    // FourVideo,
    Shipingjiankon,
    Dizaijiance,
    // Daxingguanjianshebei,
    DizaiDialog,
    ShuizhaDialog,
    WarningBar,
    VideoList,
    VideoList2,
    TyphoonVideo,
    Step
  }
}
</script>
<style>
.close span, .close b, .close p, .close div {
  /* * { */
  user-select: none!important;
  /* } */
}
</style>
<style scoped lang="less">
  /*自己的滑动*/
  .myswiper-container {
    * {
      user-select: none!important;
    }
    /deep/ span,b,p,div{
      user-select: none!important;
    }
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none!important;
    .myswiper-wrapper {
      height: 100%;
      width: 200%;
      position: relative;
      transform: translateX(0);
      // pointer-events: none;
      .cover{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        z-index: 2000;
      }
      // &.move > div{
      //   pointer-events: none;
      // }
      // transition: all 0.3s linear;
      .myswiper-slide {
        height: 100%;
        width: 50%;
        float: left;
      }
    }
    .myswiper-pagination {
      position: absolute;
      bottom: 0;
      height: 0.16rem;
      width: 100%;
      text-align: center;
      transition: 300ms opacity;
      transform: translate3d(0, 0, 0);
      z-index: 10;
      > span {
        width: 48%;
        height: 0.07rem;
        background: #2d70b5;
        border-radius: 0;
        margin: 0 0 !important;
        transform: skew(-30deg);
        display: inline-block;
        cursor: pointer;
        opacity: 0.2;
        &.active {
          opacity: 1;
          height: 0.1rem;
        }
      }
    }
  }
  /deep/ .waterDetail {
    z-index: 50;
    &.left {
      left: 5rem;
    }
    &.right {
      right: 5rem;
    }
  }
  .Uniform-h {
    height: 33% !important;
  }
  Uniform-video {
    height: 100%;
    padding-bottom: 21px;
    box-sizing: border-box;
  }
  .page-warning {
    position: relative;
    .map {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .box {
      z-index: 2
    }
    .tree {
      overflow: auto;
    }
    .page-box {
      position: absolute;
      width: 4.8rem;
      height: 100%;
      max-height: calc(100% - 0.1rem);
      background: rgba(0, 0, 0, 0.6);
      z-index: 2;
      transition: left .3s linear, right .3s linear;
      &.box-lf {
        left: 0.14rem;
        .btn {
          background: url(images/btn-left.png) no-repeat center;
          background-size: 100% 100%;
          width: 0.15rem;
          height: 1rem;
          margin-top: -0.75rem;
          position: absolute;
          top: 50%;
          left: 100%;
          text-align: center;
          cursor: pointer;
        }
        &.collapse {
          left: -4.8rem;
        }
      }
      &.box-rt {
        right: 0.14rem;
        .btn {
          background: url(images/btn-right.png) no-repeat center;
          background-size: 100% 100%;
          width: 0.15rem;
          height: 1rem;
          margin-top: -0.75rem;
          position: absolute;
          top: 50%;
          right: 100%;
          text-align: center;
          cursor: pointer;
        }
        &.collapse {
          right: -4.8rem;
        }
      }
    }
    .title_tree {
      position: absolute;
      top: 0.7rem;
      left: 5.5rem;
      line-height: 0rem;
      z-index: 2;
    }
    .sxt_tree {
      position: absolute;
      top: 3.4rem;
      left: 5.5rem;
      line-height: 0rem;
      z-index: 2;
    }
    .leftbtn {
      position: absolute;
      top: 0;
      left: 5rem;
      z-index: 2;
      transition: left .3s linear, right .3s linear;
      &.collapse {
        left: 0.14rem;
      }
    }
    .rightbtn {
      position: absolute;
      top: 0;
      right: 5rem;
      z-index: 2;
      transition: left .3s linear, right .3s linear;
      &.collapse {
        right: 0.14rem;
      }
    }
    .paging {
      position: absolute;
      top: 80%;
      right: 40%;
      z-index: 2;
    }
    .Meteoro {
      position: absolute;
      top: 70%;
      right: 30%;
      z-index: 2;
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
    .swiper-container {
      width: 100%;
      height: 100%;
    }
  }
  // 地图标志按钮
  /deep/ .mapboxgl-ctrl-bottom-left {
    z-index: 0;
    left: 4rem;
    bottom: 0.5rem;
    transition: left .3s linear;
  }
  /deep/ .mapboxgl-ctrl-scale {
    background: rgba(0, 0, 0, 0.4);
    border: none;
    color: #fff;
  }
  .map.collapse {
    /deep/ .mapboxgl-ctrl-bottom-left {
      left: 0.04rem;
    }
  }
  // 隐藏地图自己的按钮
  /deep/ .mapboxgl-ctrl-top-left {
    left: 4.1rem !important;
    top: 1rem !important;
    visibility: hidden;
  }
  // 修改地图poptip样式
  /deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip, /deep/ .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip, /deep/ .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
    border-top-color: rgba(3, 67, 106, 0.9);
  }
  /deep/ .mapboxgl-popup-anchor-top .mapboxgl-popup-tip, /deep/ .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip, /deep/ .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
    border-bottom-color: rgba(3, 67, 106, 0.9);
  }
  /deep/ .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-right-color: rgba(3, 67, 106, 0.9);
  }
  /deep/ .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    border-left-color: rgba(3, 67, 106, 0.9);
  }
  /deep/ .mapboxgl-popup-content {
    background: rgba(3, 67, 106, 0.9);
    color: #fff;
  }
  /deep/ .mapboxgl-popup {
    top: -0.14rem;
    min-width: 1.5rem;
    max-width: 6rem !important;
  }
  /deep/ .mapboxgl-popup-close-button {
    right: 0.05rem;
    z-index: 1;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0;
    position: absolute;
    top: 0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image('./images/zoom-in') ;
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    outline: none;
    text-indent: -9999rem;
    &:hover {
      transform: rotate(45deg);
    }
  }
  /deep/ .relative {
    position: relative;
  }
  /deep/ .swiper-pagination-bullet-active {
    background: linear-gradient(to right, #5595da 0%, #237eda 100%);
    height: 0.1rem;
  }
  .swiper-container,
  .swiper-container1 {
    width: 100% !important;
    height: 100%;
  }
  /deep/ .swiper-pagination-bullet {
    width: 48%;
    height: 0.1rem;
    background: #2d70b5;
    border-radius: 0;
    margin: 0 0 !important;
    transform: skew(-30deg);
  }
  /deep/ .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 0;
  }
</style>
