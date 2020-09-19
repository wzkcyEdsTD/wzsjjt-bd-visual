<template>
  <div class="wrapper flex flex-y">
    <ItemTitle
      title="气温监控"
      @mouseenter.native="modalShow = true"
      @mouseleave.native="modalShow = false"
      :num="total"></ItemTitle>
    <!-- <div class="modal" v-show="modalShow">
      <div class="title">
        <span>统计时间：</span>
        <p>08:00 - {{currentTime}}</p>
      </div>
    </div> -->
    <div class="title-btn-group">
      <!-- <el-date-picker
        v-model="time"
        type="date"
        value-format='yyyyMMdd'
        @change='changeDate'
        :picker-options="pickerOptions"
        placeholder="选择日期">
      </el-date-picker> -->
      <span
        class="dot-white"
        v-show="index===btnIndex"
        @click="changeDot"
        :key="index"
        v-for="(item,index) in dotIndex">
        <img v-if="dotIndex[index]===0" src="../item-title/images/dot_white.png"/>
          <img v-if="dotIndex[index]===1" src="../item-title/images/dot_blue.png"/>
      </span>
      <!-- <span class="add-sp">
        <b
          @click="changeBtnIndex(index)"
          :key="index"
          v-for="(item,index) in btns"
          :class="{'active' : btnIndex === index}">{{item}}</b>
      </span> -->
    </div>
    <div class="flex-1 flex flex-y relative yq-spc">
      <el-carousel
        :interval="interval2"
        arrow="never">
        <el-carousel-item>
          <div class="echart-box flex-1 relative">
            <Echart01 class="echart" :class="btnIndex===0?'active':''" :data="data1"></Echart01>
            <!-- <Echart01 class="echart" :time='time' :data="data2"></Echart01> -->
            <Kong v-show="isKong1" text="当前无数据"></Kong>
            <!-- <Kong v-show="isKong2 && btnIndex===1" text="当前无降雨"></Kong> -->
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="echart-box flex-1 relative">
            <Echart02 class="echart" :class="btnIndex===0?'active':''" :data="data3"></Echart02>
            <!-- <Echart02 class="echart" :class="btnIndex===1?'active':''" :time='time' :data="data4"></Echart02> -->
            <Kong v-show="isKong3" text="当前无数据"></Kong>
            <!-- <Kong v-show="isKong4 && btnIndex===1" text="当前无降雨"></Kong> -->
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- <div class="flex-1 relative">
        <div class="echart-box">
          <Echart01 class="echart" :class="btnIndex===0?'active':''" :data="data1"></Echart01>
          <Echart01 class="echart" :class="btnIndex===1?'active':''" :data="data2"></Echart01>
        </div>
      </div>
      <div class="flex-1 relative">
        <div class="echart-box">
          <Echart02 class="echart" :class="btnIndex===0?'active':''" :data="data3"></Echart02>
          <Echart02 class="echart" :class="btnIndex===1?'active':''" :data="data4"></Echart02>
        </div>
      </div> -->
      <!-- <Kong v-show="isKong0 && btnIndex===0" text="当前无降雨"></Kong>
      <Kong v-show="isKong1 && btnIndex===1" text="当前无降雨"></Kong> -->
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import Echart02 from './modules/echart02'
import { getQXTempMonitorMainByUser } from 'api/warning/warning'
import Kong from 'components/noData/noData'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'RainMonitor',
  mixins: [monitorTypeMixin],
  computed: {
    ...mapGetters('warning', [
      'mapLoaded',
      'waterState'
    ]),
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      modalShow: false,
      currentTime: 0,
      timer: null,
      time: new Date(),
      today: '',
      timeType: 1,
      total: '',
      dotIndex: [0, 0],
      point: ['qiwenjiance'],
      btns: ['水利', '气象'],
      btnIndex: 0,
      data1: [], // 第一组
      data2: [], // 第一组
      data3: [], // 第二组
      data4: [], // 第二组
      flag0: true,
      flag1: true,
      isKong1: false,
      isKong2: false,
      isKong3: false,
      isKong4: false,
      monitor: null,
      monitorTime: 1000 * 60,
      failTime: 1000 * 5,
      oneT0: null,
      oneT1: null,
      interval2: 6000,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time <= new Date('2020-5-15 00:00:00').getTime()
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }, {
        //   text: '昨天',
        //   onClick(picker) {
        //     const date = new Date()
        //     date.setTime(date.getTime() - 3600 * 1000 * 24)
        //     picker.$emit('pick', date)
        //   }
        // }]
      }
    }
  },
  mounted() {
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    this.time = y + '' + m + d
    this.today = this.time
    // this.time = new Date()
    this.timer = setInterval(() => {
      this.currentTime = this.getTime()
    }, 1000)
    this.initData(this.btnIndex)
    // this.monitor = setInterval(() => {
    //   this.initData(this.btnIndex)
    // }, this.monitorTime)
    // this.addPoint()
  },
  beforeDestroy() {
    clearInterval(this.monitor)
    clearInterval(this.timer)
  },
  methods: {
    initData(num) {
      this.initData0()
    },
    addPoint() {
      if (this.mapLoaded) {
        // 主动勾选点
        this.dotIndex = [1, 0]
        let obj = {}
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point[0]) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            i = this.monitorType.length
          }
        }
        obj.checked = true
        obj.from = this.point[0]
        this.SetCurrentMonitorType(obj)
      }
    },
    // 地图展示图层
    changeDot() {
      console.log(this.monitorType)
      console.log(this.point)
      if (this.monitorType.length) {
        this.dotIndex[this.btnIndex] = (this.dotIndex[this.btnIndex] + 1) % 2
        this.dotIndex = [...this.dotIndex]
        let obj = {}
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point[this.btnIndex]) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            i = this.monitorType.length
          }
        }
        obj.checked = Boolean(this.dotIndex[this.btnIndex])
        obj.from = this.point[this.btnIndex]
        this.SetCurrentMonitorType(obj)
      }
    },
    initData0() {
      getQXTempMonitorMainByUser().then(data => {
        // data = {
        //   'totalCount': 1104,
        //   'districtDetail': [
        //     { 'name': '鹿城区', 'value': 0.0 },
        //     { 'name': '龙湾区', 'value': 0.0 },
        //     { 'name': '瓯海区', 'value': 0.0 },
        //     { 'name': '洞头区', 'value': 0.0 },
        //     { 'name': '乐清市', 'value': 0.0 },
        //     { 'name': '瑞安市', 'value': 0.0 },
        //     { 'name': '龙港市', 'value': 0.0 },
        //     { 'name': '永嘉县', 'value': 0.0 },
        //     { 'name': '文成县', 'value': 0.0 },
        //     { 'name': '平阳县', 'value': 0.0 },
        //     { 'name': '泰顺县', 'value': 0.0 },
        //     { 'name': '苍南县', 'value': 0.0 },
        //     { 'name': '经开区', 'value': 0.0 },
        //     { 'name': '瓯江口', 'value': 0.0 }],
        //   'topDetail': [
        //     {
        //       'name': '万排',
        //       'value': 0.50,
        //       'smid': '28',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '119.930000000,27.351500000',
        //       'type': null
        //     }, {
        //       'name': '小坑雨量站',
        //       'value': 0.50,
        //       'smid': '11440',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '121.039021,28.4240070000001',
        //       'type': null
        //     }, {
        //       'name': '柳垟雨量',
        //       'value': 0.50,
        //       'smid': '11001',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.334444,27.4669440000001',
        //       'type': null
        //     }, {
        //       'name': '瓯北麻山水库',
        //       'value': 0.50,
        //       'smid': '268',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.648,28.075',
        //       'type': null
        //     }, {
        //       'name': '鹤盛郑庄水库（新）',
        //       'value': 0.50,
        //       'smid': '304',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.88,28.4508',
        //       'type': null
        //     }, {
        //       'name': '金溪朱坑垟水库',
        //       'value': 0.50,
        //       'smid': '349',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.536,28.228',
        //       'type': null
        //     }, {
        //       'name': '驮垟水库',
        //       'value': 0.50,
        //       'smid': '10597',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '119.948978647,27.7900001250001',
        //       'type': null
        //     }, {
        //       'name': '塘川',
        //       'value': 0.50,
        //       'smid': '10763',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.523442,27.6056610000001',
        //       'type': null
        //     }, {
        //       'name': '岩头岭外站备用',
        //       'value': 0.20,
        //       'smid': '316',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.654,28.381',
        //       'type': null
        //     }, {
        //       'name': '上塘sw',
        //       'value': 0.20,
        //       'smid': '376',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.705,28.155',
        //       'type': null
        //     }, {
        //       'name': '上塘sw',
        //       'value': 0.20,
        //       'smid': '376',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.705,28.155',
        //       'type': null
        //     }, {
        //       'name': '上塘sw',
        //       'value': 0.20,
        //       'smid': '376',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.705,28.155',
        //       'type': null
        //     }, {
        //       'name': '上塘sw',
        //       'value': 0.20,
        //       'smid': '376',
        //       'alias': 'shuiliyuqingjiance',
        //       'location': '120.705,28.155',
        //       'type': null
        //     }]
        // }
        this.data1 = data.districtDetail
        console.log(this.data1)
        this.data3 = data.topDetail.map(val => {
          val.alias = 'qiwenjiance'
          return val
        })
        this.getIsKong(0)
        this.total = '总数' + data.totalCount
        // if (this.isKong1 && this.isKong3 && this.flag0) {
        //   this.flag0 = false
        //   this.oneT0 = setTimeout(() => {
        //     clearTimeout(this.oneT0)
        //     this.initData()
        //   }, this.failTime)
        // }
      })
    },
    getIsKong(num) {
      if (num === 0) {
        let res1 = true
        for (let i = 0; i < this.data1.length; i++) {
          if (this.data1[i].value > 0) {
            res1 = false
            i = this.data1.length
          }
        }
        this.isKong1 = res1
        let res3 = true
        for (let i = 0; i < this.data3.length; i++) {
          if (this.data3[i].value > 0) {
            res3 = false
            i = this.data3.length
          }
        }
        this.isKong3 = res3
      }
    },
    changeBtnIndex(index) {
      this.btnIndex = index
      this.total = ''
      if (index === 0) {
        this.flag0 = true
      } else {
        this.flag1 = true
      }
      this.initData(this.btnIndex)
      this.$emit('changeIndex', this.btnIndex)
    },
    // 获取当前时间
    getTime() {
      const date = new Date()
      const time = `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}`
      return time
    }
  },
  watch: {
    mapLoaded() {
      // this.addPoint()
    },
    currentMonitorType() {
      for (let i = 0; i < this.dotIndex.length; i++) {
        if (this.currentMonitorType.from !== this.point[i]) {
          if (this.currentMonitorType.alias === this.point[i]) {
            if (this.currentMonitorType.checked) {
              this.dotIndex[i] = 1
            } else {
              this.dotIndex[i] = 0
            }
            this.dotIndex = [...this.dotIndex]
          }
        }
      }
    }
  },
  components: {
    ItemTitle,
    Echart01,
    Echart02,
    Kong
  }
}
</script>

<style lang="less" scoped>
  .modal {
    color: #fff;
    position: absolute;
    top: 0.4rem;
    left: 0.5rem;
    width: 1.5rem;
    z-index: 100;
    padding: 0.1rem 0.2rem;
    border-radius: 0.04rem;
    border: 0.01rem solid #38cbda;
    background: rgba(8, 26, 68, 0.8);
  }
  .wrapper {
    position: relative;
    .title-btn-group {
      position: absolute;
      top: 0;
      right: 0;
      height: 0.35rem;
      line-height: 0.35rem;
      font-size: 0.14rem;
      margin-right: 0.05rem;
      /deep/ .el-date-editor.el-input {
        width: 1.2rem;
        margin-right: 5px;
        .el-input__inner {
          height: 0.2rem;
          background: rgba(0, 0, 0, 0);
          border: none;
          color: #86ccff;
        }
      }
      /deep/ .el-input__inner {
        padding-right: 20px;
      }
      /deep/ .el-input__prefix {
        color: #86ccff;
      }
      .dot-white {
        cursor: pointer;
        width: 0.32rem;
        height: 0.35rem;
        float: right;
        > img {
          margin: 0 auto;
          display: block;
          width: 0.12rem;
          height: 0.19rem;
          margin-top: 0.08rem;
        }
      }
      .add-spc {
        cursor: pointer;
        height: 0.2rem;
        line-height: 0.2rem;
        background-color: #4298e8;
        border-radius: 0.04rem;
        font-size: 0.14rem;
        padding: 0 0.05rem;
        margin-top: 0.08rem;
        margin-left: 0.06rem;
        color: #fff;
        font-weight: 700;
        float: right;
      }
      .add-sp {
        float: right;
        margin-right: 0.03rem;
        > b {
          cursor: pointer;
          height: 0.2rem;
          line-height: 0.2rem;
          border-radius: 0.02rem;
          font-size: 0.14rem;
          padding: 0 0.1rem;
          border: 0.01rem solid #159bfd;
          margin-top: 0.08rem;
          display: block;
          float: left;
          background-color: transparent;
          color: #159bfd;
          &.active {
            background-color: #159bfd;
            color: #fff;
          }
        }
      }
    }
  }
  .echart-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .echart {
      visibility: hidden;
      &.active {
        visibility: visible;
      }
    }
  }
  .yq-spc {
    /deep/ .el-carousel__arrow--right {
      display: none;
    }
    /deep/ .el-carousel__arrow--left {
      display: none;
    }
    /deep/ .el-carousel__button {
      width: 0.16rem;
      height: 0.16rem;
      border-radius: 0.1rem;
      background: #3ecbe0;
    }
    /deep/.el-carousel__indicator--horizontal{
      width: 0.25rem;
      height: 0.25rem;
    }
  }
  /deep/ .el-input__icon {
    line-height: 30px;
  }
  .title-btn-group /deep/ .el-input--suffix .el-input__inner {
    padding-right: 5px;
  }
  /deep/ .nopage > .el-carousel__indicators {
    display: none !important;
  }
</style>
