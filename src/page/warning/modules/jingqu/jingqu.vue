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
    <div class="flex-1 wrapper-content">
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
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
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
        const list = data.categoryViews
        this.total = '监测总数' + data.totalCount + '/报警数' + data.warnCount
        // for (const i in data.dataViews) {
        //   list.push({
        //     name: i,
        //     children: data.dataViews[i]
        //   })
        // }
        this.data = list
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
    .wrapper-content{
      height: 100%;
      overflow: auto;
    }
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
  /* 树 */
  /deep/ .active .el-tree-node__label {
    color: #ffd800 !important;
  }
  /deep/
  .el-tree
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node__content
  .el-checkbox {
    display: none;
  }
  /deep/ .el-tree {
    background: transparent;
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover {
    background-color: rgba(27, 147, 254, 0.4);
    background: transparent;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content,
  /deep/ .el-tree-node:focus > .el-tree-node__content {
    /*background-color: rgba(27, 147, 254, 0.4) !important;*/
    background: transparent !important;
    color: #0ed6f5;
  }
  /deep/
  .el-tree-node.is-current
  > .el-tree-node__children
  .el-tree-node__content {
    /*background: linear-gradient(90deg,rgba(14,214,245,0.25) 0%,rgba(14,214,245,0) 100%);*/
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    .bg-image("images/btn_checked");
    border: none;
  }
  /deep/ .el-checkbox__inner {
    .bg-image("images/btn_kong");
    border: none;
  }
  /deep/ .el-checkbox__inner::after {
    display: none;
  }
  /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    .bg-image("images/btn_zhankai");
    background-size: 0.14rem 0.14rem;
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-icon-caret-right:before {
    visibility: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    .bg-image("images/btn_shouqi");
    background-size: 0.14rem 0.14rem;
    transform: rotate(0);
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-tree-node__expand-icon.is-leaf {
    background: none;
  }
  /deep/ .custom-tree-node {
    font-size: 0.18rem;
    width: 100%;
    position: relative;
    height: 0.3rem;
    display: block;
    line-height: 0.3rem;
    overflow: hidden;
  }
  /deep/ .custom-tree-node > span:first-child {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 0.3rem;
  }
  /deep/ .custom-tree-node span {
    font-size: 0.14rem;
  }
  /deep/ .el-tree-node__content {
    height: 0.3rem;
  }
  // /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  //   border: none;
  //   .bg-image("images/btn_have");
  // }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    visibility: hidden;
  }
  /deep/ .el-tree-node .is-hidden {
    display: block !important;
  }
  /deep/ .blod {
    color: @color-text-hover;
  }
  /deep/ .el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
    display: none;
  }
  /deep/ .el-tree-node {
    font-size: @font-size-medium-x;
  }
  /deep/ .el-tree-node .el-tree-node {
    font-size: @font-size-medium;
  }
  /deep/ .el-tree-node .el-tree-node .el-tree-node {
    font-size: @font-size-small;
  }
  /deep/ .el-tree-node__content > label.el-checkbox {
    margin-top: 0.03rem;
  }
</style>
