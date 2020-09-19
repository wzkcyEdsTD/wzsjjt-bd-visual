<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="两客一危" ref="itemTitle" :numOne="numOne" :numTwo="numTwo" @changeIndex="changeIndex">
      <el-input
        v-show="btnIndex===0"
        placeholder="输入车牌号"
        v-model="searchContent1"
        @change='searchList1'
        class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchList1"></el-button>
      </el-input>
      <el-input
        v-show="btnIndex===1"
        placeholder="输入车牌号"
        v-model="searchContent2"
        @change='searchList2'
        class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchList2"></el-button>
      </el-input>
    </ItemTitle>
    <div class="title-btn-group">
      <span class="dot-white" @click="changeDot">
        <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
        <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
    </div>
    <div class="flex-1">
      <List ref="list1" @refresh="initData" @next='next' :isShow="this.btnIndex===0" :data="listData1" :fild="listFild1"></List>
      <List ref="list2" @refresh="initData" @next='next' :isShow="this.btnIndex===1" :data="listData2" :fild="listFild2"></List>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title-liangkeyiwei'
import List from '../list/list'
import { getEnterpriseMainByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'

export default {
  name: 'BusMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      btnIndex: 0,
      numOne: '',
      numTwo: '',
      listData1: [],
      listData2: [],
      searchContent1: '',
      searchContent2: '',
      timer: null,
      listFild1: [
        { name: '车牌号', fild: 'plate' },
        { name: '公司名称', fild: 'companyName' }
      ],
      listFild2: [
        { name: '车牌号', fild: 'plate' },
        { name: '警报类型', fild: 'warnType' }
      ],
      point: 'liangkeyiweijiance',
      listDataO: [],
      listDataT: [],
      index: 1
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
    this.searchList1()
    this.searchList2()
    this.timer = setInterval(() => {
      this.searchList1()
      this.searchList2()
    }, 300000)
  },
  methods: {
    changeIndex(index) {
      this.btnIndex = index
    },
    searchList1() {
      this.initData(0)
    },
    searchList2() {
      this.initData(1)
    },
    // 加载其他数据
    next() {
      if (this.searchContent) {
        this.$refs.list1.isAll = true
        return
      }
      this.index += 1
      if (this.btnIndex === 0) {
        if (this.listDataO.length > 0 && this.listData1.length < this.listDataO.length) {
          this.listData1 = [...this.listData1, ...this.listDataO.slice(10 * (this.index - 1), 10 * this.index)]
        } else {
          this.$refs.list1.isAll = true
        }
      } else if (this.btnIndex === 1) {
        if (this.listDataT.length > 0 && this.listData2.length < this.listDataT.length) {
          this.listData2 = [...this.listData2, ...this.listDataT.slice(10 * (this.index - 1), 10 * this.index)]
        } else {
          this.$refs.list2.isAll = true
        }
      }
      // }
    },
    initData(num) {
      console.log('刷新')
      let type = this.btnIndex
      if (typeof num === 'number') {
        type = num
      }
      let search = this.searchContent1
      if (type === 1) {
        search = this.searchContent2
      }
      getEnterpriseMainByUser(type, search).then((data) => {
        this.index = 1
        this.$refs.list1.isAll = false
        this.$refs.list2.isAll = false
        console.log(data.details)
        if (type === 0) {
          this.listDataO = data.details.slice(0, 30)
          this.listData1 = data.details.slice(10 * (this.index - 1), 10 * this.index)
          this.numOne = '接入数' + data.totalCount
        } else if (type === 1) {
          this.listDataT = data.details
          this.listData2 = data.details.slice(10 * (this.index - 1), 10 * this.index)
          this.numTwo = '报警数' + data.totalCount
        }
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
