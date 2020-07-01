<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :title="title" :num="total">
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
import { getFishBoatInfo } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'BusMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      title: '渔船监测',
      listData: [],
      timer: null,
      listFild: [
        { name: '渔船名称', fild: 'name' },
        { name: '上报时间', fild: 'reportTime' }
      ],
      point: 'yuchuanjiance',
      searchContent: '',
      showList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
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
        return val.name.indexOf(this.searchContent) > -1 || val.reportTime.indexOf(this.searchContent) > -1
      })
      console.log(this.showList)
    },
    initData() {
      getFishBoatInfo().then((data) => {
        this.listData = data
        this.showList = this.listData.filter(val => {
          return val.name.indexOf(this.searchContent) > -1 || val.reportTime.indexOf(this.searchContent) > -1
        })
        console.log(this.showList)
        this.total = '总数' + data.length
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
  .el-input.el-input--prefix{
    width: unset;
  }
  .wrapper {
    position: relative;
    padding:0.05rem 0;
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
