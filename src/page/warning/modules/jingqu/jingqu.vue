<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="景区(人)" :num="total">
      <el-input placeholder="输入名称" v-model="searchContent" @change='searchList' class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
      </el-input>
    </ItemTitle>
    <div class="title-btn-group">
       <span class="dot-white" @click="changeDot">
          <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
          <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
    </div>
    <div class="flex-1">
      <Echart01 @refresh="initData" :time="time" :isShow="0===0" :data="showList"></Echart01>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import { getScenicMainByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'

export default {
  name: 'PeopleMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      data: [],
      point: 'jingqukeliuliangjiance',
      searchContent: '',
      showList: [],
      time: ''
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 查询过滤
    searchList() {
      this.showList = this.data.filter(val => {
        return val.name.indexOf(this.searchContent) > -1
      })
    },
    initData() {
      getScenicMainByUser().then((data) => {
        if (data.code === 500) {
          data.totalCount = 0
          data.warnCount = 0
          data.categoryViews = []
          data.time = ''
        }
        this.total = '监测总数' + data.totalCount + '/报警数' + data.warnCount
        this.data = data.categoryViews
        this.time = data.time
        this.showList = this.data.filter(val => {
          return val.name.indexOf(this.searchContent) > -1
        })
      })
    }
  },
  components: {
    ItemTitle,
    Echart01
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
    }
  }
</style>
