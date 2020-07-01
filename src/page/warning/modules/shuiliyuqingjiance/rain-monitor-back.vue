<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="雨情监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
       <span class="dot-white" @click="changeDot">
          <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
          <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
      <span class="add-spc" @click="showInfo">详</span>
      <span class="add-sp">
        <b
          @click="changeBtnIndex(index)"
          :key="index"
          v-for="(item,index) in btns"
          :class="{'active' : btnIndex === index}">{{item}}</b>
      </span>
    </div>
    <div class="flex-1 flex flex-y relative">
      <div class="flex-1 relative">
        <div class="echart-box">
          <Echart01 ref="echart01" :data="data1"></Echart01>
        </div>
      </div>
      <div class="flex-1 relative">
        <div class="echart-box">
          <Echart02 ref="echart02" :data="data2"></Echart02>
        </div>
      </div>
      <Kong v-show="isKong" text="当前无降雨"></Kong>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import Echart02 from './modules/echart02'
import { getRainMonitorMainByUser } from 'api/warning/warning'
import Kong from 'components/noData/noData'
import { monitorTypeMixin } from 'common/js/mixin'

export default {
  name: 'RainMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      isShowInfo: false,
      data1: [],
      data2: [],
      falg: false,
      point: 'yuqingjiance',
      monitor: null,
      monitorTime: 1000 * 60,
      isKong: false,
      btns: ['水利', '气象'],
      btnIndex: 0,
      oneT: null
    }
  },
  mounted() {
    this.initData(this.btnIndex)
    this.monitor = setInterval(() => {
      this.initData(this.btnIndex)
    }, this.monitorTime)
  },
  beforeDestroy() {
    clearInterval(this.monitor)
  },
  methods: {
    changeBtnIndex(index) {
      this.btnIndex = index
      this.$emit('changeIndex', index)
      // this.setTotal()
    },
    getIsKong() {
      if (this.falg) {
        let res = true
        for (let i = 0; i < this.data1.length; i++) {
          if (this.data1[i].value > 0) {
            res = false
            i = this.data1.length
          }
        }
        if (!res) {
          for (let i = 0; i < this.data2.length; i++) {
            if (this.data2[i].value > 0) {
              res = false
              i = this.data2.length
            }
          }
        }
        this.isKong = res
      }
    },
    initData(type) {
      getRainMonitorMainByUser(type).then((data) => {
        this.data1 = data.districtDetail
        this.data2 = data.topDetail
        this.total = '总数' + data.totalCount
        this.falg = true
        this.getIsKong()
        if (this.isKong) {
          this.oneT = setTimeout(() => {
            clearTimeout(this.oneT)
            this.initData(type)
          }, 60000)
        }
      })
    },
    showInfo() {
      this.isShowInfo = !this.isShowInfo
      this.$emit('isShow')
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
  }
</style>
