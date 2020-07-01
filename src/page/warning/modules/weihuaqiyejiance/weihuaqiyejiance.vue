<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="危化企业监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
      <span class="dot-white" @click="changeDot">
        <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
        <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
      <div class="btns">
        <span class="item" @click="changeActiveIndex(0)">
          <img v-if="activeIndex===0" src="../item-title/images/pic_blue.png"/>
          <img v-else src="../item-title/images/pic_white.png"/>
        </span>
        <i class="line"></i>
        <span class="item" @click="changeActiveIndex(1)">
          <img v-if="activeIndex===1" src="../item-title/images/table_blue.png"/>
          <img v-else src="../item-title/images/table_white.png"/>
        </span>
      </div>
    </div>
    <div class="flex-1 relative">
      <Echart01 @refresh="initData" :isShow="activeIndex===0" :data="data">1</Echart01>
      <List @refresh="initData" :isShow="activeIndex===1" :data="listData" :fild="listFild"></List>
      <Kong v-show="isKong"></Kong>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import List from '../list/list'
import Kong from 'components/noData/noData'
import { getChemicalMonitorMainByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'

export default {
  name: 'EnterpriseMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      data: [],
      dotIndex: 0,
      activeIndex: 0,
      listData: [],
      isKong: false,
      listFild: [
        { name: '企业名称', fild: 'name' },
        { name: '检测类型', fild: 'type' },
        { name: '数值', fild: 'num' }
      ],
      point: 'weihuaqiyejiance'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getChemicalMonitorMainByUser().then((data) => {
        if (data && data.details.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
        this.total = '接入总数' + data.total
        this.data = data.details
        this.listData = data.companys
      })
    },
    changeActiveIndex(num) {
      this.activeIndex = num
      this.show = num
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
        margin-right: 0.16rem;
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
        margin: 0.01rem 0.16rem;
      }
    }
  }
</style>
