<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="两客一危" :num="total">
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
      <List @refresh="initData" :isShow="0===0" :data="showList" :fild="listFild"></List>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import List from '../list/list'
import { getEnterpriseMainByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'

export default {
  name: 'BusMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      listData: [],
      timer: null,
      listFild: [
        { name: '车牌号', fild: 'plate' },
        { name: '警报类型', fild: 'warnType' }
      ],
      point: 'liangkeyiweijiance',
      searchContent: '',
      showList: []
    }
  },
  watch: {
    currentMonitorType() {
      if (this.currentMonitorType.from !== this.point) {
        if (this.currentMonitorType.alias && this.currentMonitorType.alias.indexOf(this.point) === 0) {
          if (this.currentMonitorType.checked) {
            this.dotIndex = 1
          } else {
            this.dotIndex = 0
          }
        }
      }
    }
  },
  mounted() {
    this.initData()
    this.timer = setInterval(() => {
      this.initData()
    }, 300000)
  },
  methods: {
    // 查询过滤
    searchList() {
      this.showList = this.listData.filter(val => {
        console.log(val.plate.indexOf(this.searchContent) > -1 || val.warnType.indexOf(this.searchContent) > -1)
        return val.plate.indexOf(this.searchContent) > -1 || val.warnType.indexOf(this.searchContent) > -1
      })
    },
    initData() {
      getEnterpriseMainByUser().then((data) => {
        this.listData = data.details
        this.showList = this.listData.filter(val => {
          return val.plate.indexOf(this.searchContent) > -1 || val.warnType.indexOf(this.searchContent) > -1
        })
        this.total = '接入数' + data.totalCount + '/报警数' + data.warnCount
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  components: {
    ItemTitle,
    List
  }
}
</script>

<style scoped lang="less">
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
