<template>
  <div class="wrapper flex flex-y">
    <ItemTitle
      title="实时风力监测"
      @mouseenter.native="modalShow = true"
      @mouseleave.native="modalShow = false"
      :num="total"></ItemTitle>
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
    </div>
    <div class="flex-1 flex flex-y relative yq-spc">
      <el-carousel
        arrow="never"
        :class="{'nopage':userInfo.district&&userInfo.district.length!==4}">
        <!-- <el-carousel-item v-if="userInfo.district&&userInfo.district.length===4">
          <div class="echart-box flex-1 relative">
            <Echart01 class="echart" :class="btnIndex===0?'active':''" :time='time' :data="data1"></Echart01>
            <Echart01 class="echart" :class="btnIndex===1?'active':''" :time='time' :data="data2"></Echart01>
            <Kong v-show="isKong1 && btnIndex===0" text="当前无降雨"></Kong>
            <Kong v-show="isKong2 && btnIndex===1" text="当前无降雨"></Kong>
          </div>
        </el-carousel-item> -->
        <el-carousel-item>
          <div class="echart-box flex-1 relative">
            <Echart02 class="echart active" :data="data"></Echart02>
            <Kong v-show="isKong" text="暂无数据"></Kong>
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
import Echart02 from './modules/echart02'
import { getQXWindMonitor } from 'api/warning/warning'
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
      point: 'fenglijiance',
      btnIndex: 0,
      data: [], // 第一组
      flag0: true,
      flag1: true,
      isKong: false,
      isShowInfo: false,
      monitor: null,
      monitorTime: 1000 * 60,
      failTime: 1000 * 5,
      oneT0: null,
      oneT1: null
      // interval2: 6000
    }
  },
  mounted() {
    // var date = new Date()
    // var y = date.getFullYear()
    // var m = date.getMonth() + 1
    // m = m < 10 ? '0' + m : m
    // var d = date.getDate()
    // d = d < 10 ? ('0' + d) : d
    // this.time = y + '' + m + d
    // this.today = this.time
    // // this.time = new Date()
    // this.timer = setInterval(() => {
    //   this.currentTime = this.getTime()
    // }, 1000)
    this.initData(this.btnIndex)
    // this.monitor = setInterval(() => {
    //   this.initData(this.btnIndex)
    // }, this.monitorTime)
  },
  beforeDestroy() {
    clearInterval(this.monitor)
    clearInterval(this.timer)
  },
  methods: {
    // 修改日期
    changeDate(date) {
      this.time = date
      this.initData(this.btnIndex)
    },
    initData(num) {
      getQXWindMonitor().then(data => {
        this.data = data.topDetail
        this.total = '总数' + data.totalCount
        this.getIsKong(0)
        if (this.isKong) {
          this.flag0 = false
          this.oneT0 = setTimeout(() => {
            clearTimeout(this.oneT0)
            this.initData(0)
          }, this.failTime)
        }
      })
    },
    getIsKong() {
      let res = true
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].value > 0) {
          res = false
          i = this.data.length
        }
      }
      this.isKong = res
    },
    changeDot() {
      if (this.monitorType.length) {
        this.dotIndex[this.btnIndex] = (this.dotIndex[this.btnIndex] + 1) % 2
        this.dotIndex = [...this.dotIndex]
        let obj = {}
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            i = this.monitorType.length
          }
        }
        obj.checked = Boolean(this.dotIndex[this.btnIndex])
        obj.from = this.point
        this.SetCurrentMonitorType(obj)
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
      this.addPoint()
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
          margin-top: 0.06rem;
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
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 0.1rem;
      background: #3ecbe0;
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
