<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="积水点监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
      <span
        class="dot-white"
        v-show="index===btnIndex"
        @click="changeDot"
        :key="index"
        v-for="(item,index) in dotIndex">
        <img v-if="dotIndex[index]===0" src="../item-title/images/dot_white.png"/>
          <img v-if="dotIndex[index]===1" src="../item-title/images/dot_blue.png"/>
      </span>
      <!--      <div class="btns">-->
      <!--        <span class="item" @click="changeActiveIndex(0)">-->
      <!--          <img v-if="activeIndex===0" src="../item-title/images/pic_blue.png"/>-->
      <!--          <img v-else src="../item-title/images/pic_white.png"/>-->
      <!--        </span>-->
      <!--        <i class="line"></i>-->
      <!--        <span class="item" @click="changeActiveIndex(1)">-->
      <!--          <img v-if="activeIndex===1" src="../item-title/images/table_blue.png"/>-->
      <!--          <img v-else src="../item-title/images/table_white.png"/>-->
      <!--        </span>-->
      <!--      </div>-->
      <span class="add-spc">
        <b
          @click="changeBtnIndex(index)"
          :key="index"
          v-for="(item,index) in btns"
          :class="{'active' : btnIndex === index}">{{item}}</b>
      </span>
    </div>
    <div class="flex-1 relative">
      <Echart01
        @refresh="initData"
        :isShow="!isKong1 && activeIndex===0 && btnIndex === 0"
        :data="listData1"></Echart01>
      <List
        @refresh="initData"
        :isShow="!isKong1 && activeIndex===1 && btnIndex === 0"
        :data="listData1"
        :fild="listFild"></List>
      <Echart01
        @refresh="initData2"
        :isShow="!isKong2 && activeIndex===0 && btnIndex === 1"
        :data="listData2"></Echart01>
      <List
        @refresh="initData2"
        :isShow="!isKong2 && activeIndex===1 && btnIndex === 1"
        :data="listData2"
        :fild="listFild2"></List>
      <Kong v-show="(isKong1 && btnIndex===0) || (isKong2 && btnIndex===1)"></Kong>
      <!-- <Kong v-show="isKong2"></Kong> -->
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import List from '../list/list'
import Kong from 'components/noData/noData'
import { getPondingMainByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'WaterMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      dotIndex: [0, 0],
      btnIndex: 0,
      btns: ['城市道路', '下穿路段'],
      point: ['jishuidianjiance', 'jishuidianjiance_paishui'],
      activeIndex: 1,
      listData1: [],
      listData2: [],
      total1: 0,
      total2: 0,
      listFild: [
        { name: '名称', fild: 'name' },
        { name: '深度(cm)', fild: 'value' }
      ],
      listFild2: [
        { name: '名称', fild: 'name' },
        { name: '深度(m)', fild: 'value' }
      ],
      isKong1: false,
      isKong2: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    if (this.userInfo.districtName === '瓯海区') {
      this.btnIndex = 1
      this.setTotal()
    }
    this.initData()
    this.initData2()
    console.log(this.btnIndex)
  },
  methods: {
    changeDot() {
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
    changeBtnIndex(index) {
      this.btnIndex = index
      this.setTotal()
    },
    initData() {
      getPondingMainByUser(0).then((data) => {
        if (data && data.details.length) {
          this.isKong1 = false
        } else {
          this.isKong1 = true
        }
        this.listData1 = data.details
        this.total1 = data.total
        this.setTotal()
        console.log((this.isKong1 && this.activeIndex === 0) || (this.isKong2 && this.activeIndex === 1))
      })
    },
    setTotal() {
      if (this.btnIndex === 0) {
        this.total = '总数' + (this.total1 ? this.total1 : 0)
      } else {
        this.total = '总数' + (this.total2 ? this.total2 : 0)
      }
    },
    initData2() {
      getPondingMainByUser(1).then((data) => {
        console.log(data)
        if (data && data.details.length) {
          this.isKong2 = false
        } else {
          this.isKong2 = true
        }
        this.listData2 = data.details
        this.total2 = data.total
        this.setTotal()
        console.log((this.isKong2 && this.activeIndex === 1))
      })
    },
    changeActiveIndex(num) {
      this.activeIndex = num
    }
  },
  watch: {
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
    List,
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
      .btns {
        float: right;
        height: 0.17rem;
        margin-top: 0.09rem;
        margin-right: 0.04rem;
        margin-left: 0.08rem;
      }
      .item {
        float: left;
        height: 0.17rem;
        font-size: 0;
        cursor: pointer;
        > img {
          height: 0.17rem;
          width: auto;
        }
      }
      .line {
        width: 0.02rem;
        height: 0.14rem;
        float: left;
        background: #fff;
        margin: 0.01rem 0.08rem;
      }
      .add-spc {
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
          margin-top: 0.09rem;
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
</style>
