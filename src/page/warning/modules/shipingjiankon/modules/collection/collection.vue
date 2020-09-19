<template>
  <div class="wrapper">
    <div class="video-block">
      <div
        class="video-block-content"
        v-loading="loadingFlag"
        element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-input
          placeholder="输入监控名称"
          v-model="searchContent"
          @change='getVideoData(true)'
          class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getVideoData(true)"></el-button>
        </el-input>
        <el-tree
          ref="tree"
          :props="defaultProps"
          :data="videoList"
          :load="loadNode"
          @node-click="handleNodeClick"
          node-key="smid"
          :highlight-current="true"
          :render-content="renderContent"
          :default-expanded-keys="expandedKeys"
          lazy>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>

import { monitorTypeMixin } from 'common/js/mixin'
import { getUserVideos, getMonitorUserCameraDetail, deleteUserVideo } from 'api/warning/warning'

export default {
  mixins: [monitorTypeMixin],
  data() {
    return {
      loadingFlag: false,
      searchContent: '', // 搜索值
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      videoList: [], // 视频播放列表
      //
      videoCount: '',
      xqList: [],
      list: [{ name: 'region' }, { name: 'region1' }],
      expandedKeys: [1],
      point: 'shipinjiance',
      appendBody: false,
      isShow: false
    }
  },
  mounted() {
    const me = this
    this.getVideoData(true)
    window.changeCollection2 = function(collection_smid, leaf, smid) {
      event.preventDefault()
      event.stopPropagation()
      const node = me.$refs.tree.getNode(smid)
      // 如果不是叶子节点 return
      if (node.childNodes && node.childNodes.length > 0) {
        return false
      }
      if (node.data.collection_smid) {
        deleteUserVideo(smid).then(data => {
          // let delNode = node
          // while (true) {
          //   if (delNode.parent && delNode.parent.childNodes.length === 1) {
          //     delNode = delNode.parent
          //   } else {
          //     break
          //   }
          // }
          // delNode.remove()
          const parentNode = me.$parent.$refs.tree.getNode(smid)
          if (parentNode) {
            const newData = JSON.parse(JSON.stringify(parentNode.data))
            newData.collection_smid = ''
            parentNode.setData(newData)
          }
          me.getVideoData(true)
        })
      }
    }
  },
  methods: {
    renderContent(h, { node, data, store }) {
      /* eslint-disable */
      return (
        < span
    class
      = 'custom-tree-node' >
        < span > { node.label } < /span>
        < span
      onclick = { 'changeCollection2("'+data.collection_smid + '","' + data.leaf + '","' + data.smid + '")' }
    class
      = { data.leaf ? (data.collection_smid && data.collection_smid !== '' ? 'sign active' : 'sign') : '' } > < /span>
        < /span>);
      /* eslint-disable */
    },
    getVideoData(bool) {
      this.loadingFlag = true
      var total = 0
      getUserVideos(this.$parent.xqValue === 'quanshi' ? '' : this.$parent.xqValue, this.searchContent)
        .then(res => {
          this.videoList = res.map(item => {
            total += item.total
            item = this.videoManage(item)
            return item
          })
          this.$bus.$emit('monitorList', this.videoList)
          this.videoCount = '接入总数' + total
          this.videoList[0].smid = 1
          this.videoList[1].smid = 2
          if (bool && this.$store.state.warning.waterState === 'shipingjiankon') {
            this.expandedKeys = [2]
          }
          this.loadingFlag = false
        })
        .catch(_ => {
          this.videoCount = ''
          this.loadingFlag = false
        })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        var total = 0
        getUserVideos(this.$parent.xqValue === 'quanshi' ? '' : this.$parent.xqValue, this.searchContent)
          .then(res => {
            this.videoList = res.map(item => {
              total += item.total
              item = this.videoManage(item)
              return item
            })
            this.$bus.$emit('monitorList', this.videoList)
            this.videoCount = '接入总数' + total
            this.videoList[0].smid = 1
            this.videoList[1].smid = 2
            if (this.$store.state.warning.waterState === 'shipingjiankon') {
              this.expandedKeys = [2]
            }
            return resolve(this.videoList)
          })
      }
      if (node.data && node.data.children && node.data.children.length > 0) {
        node.data.children = node.data.children.map(val => {
          if (val.total > 0 && !val.children) val.children = []
          if (!val.children || val.total === 0) val.leaf = true
          return val
        })
        return resolve(node.data.children)
      }
      if (node.data && node.data.total > 0) {
        let datatype = ''
        let district = ''
        if (this.$store.state.userInfo.districtName !== '温州市') {
          datatype = node.data.label || node.data.name
        } else {
          datatype = node.parent.data.label || node.parent.data.name
          district = node.data.label || node.data.name
        }
        getMonitorUserCameraDetail(this.searchContent, datatype, district).then(res => {
          res = res.map(val => {
            if (!val.children || val.children.length === 0) val.leaf = true
            return val
          })
          return resolve(res)
        })
      }
      if (!node.data || !node.data.children) return resolve([])
    },
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data)
    },
    // 视频数据处理
    videoManage(data) {
      if (typeof data.total === 'number') {
        data.label = data.name
        data.name = `${data.name}(${data.total}个)`
      }
      if (data.children) {
        data.children = data.children.map(val => {
          val = this.videoManage(val)
          return val
        })
      }
      return data
    }
  }
}
</script>
<style scoped lang="less">
  .list-camera {
    position: absolute;
    z-index: 100;
    right: 40px;
    top: 0px;
    height: 0.35rem;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .wrapper {
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    .tree,
    .video-block {
      padding: 0.1rem 0.2rem;
      padding-top: 0.35rem;
      border-radius: 0.04rem;
      border: 0.01rem solid #38cbda;
      // background: rgba(8, 26, 68, 1);
      height: 100%;
      .tree-wrapper {
        height: 100%;
        width: 100%;
        overflow: auto;
        .tree-content {
          width: 100%;
        }
      }
    }
  }
  .close {
    color: #ffffff;
    font-size: 0.14rem;
    position: absolute;
    top: 0.07rem;
    right: 0.1rem;
    cursor: pointer;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image("../../images/close");
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    z-index: 99;
    &:hover {
      transform: rotate(45deg);
    }
  }
  .wrapper .video-block {
    padding: 0;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
    // background: rgba(0, 0, 0, 0.5);
  }
  .video-buttons {
    position: absolute;
    z-index: 100;
    right: 15px;
    top: 0px;
    height: 0.35rem;
    display: flex;
    align-items: center;
    /deep/ .el-select {
      width: 86px;
      margin-right: 0.7rem;
    }
    /deep/ input {
      height: 0.25rem;
      line-height: 0.25rem;
      padding-right: 20px;
      background: transparent;
      border-color: rgba(56, 64, 74, 1);
      color: #a2aabf;
      border: 1px solid;
    }
    /deep/ .el-input__suffix {
      right: 1px;
      i {
        color: #a2aabf;
        line-height: 0.25rem;
      }
    }
  }
  .video-block-content {
    flex-grow: 1;
    min-height: 0;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow: auto;
  }
  .video-block-content /deep/ .el-tree {
  }
  .video-block-content /deep/ .el-tree > div > .el-tree-node__content {
    color: #0ed6f5;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(270deg,
    rgba(56, 64, 74, 0) 0%,
    rgba(56, 64, 74, 0.7) 100%) !important;
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
    .bg-image("../../images/btn_checked");
    border: none;
  }
  /deep/ .el-checkbox__inner {
    .bg-image("../../images/btn_kong");
    border: none;
  }
  /deep/ .el-checkbox__inner::after {
    display: none;
  }
  /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    .bg-image("../../images/btn_zhankai");
    background-size: 0.14rem 0.14rem;
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-icon-caret-right:before {
    visibility: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    .bg-image("../../images/btn_shouqi");
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
  /deep/ .custom-tree-node .sign {
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    background: url("../../images/shoucang1.png") no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    &.active {
      background: url("../../images/shoucang2.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
  /deep/ .el-tree-node__content {
    height: 0.3rem;
  }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border: none;
    .bg-image("../../images/btn_have");
  }
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
  /deep/ .el-checkbox__inner {
    width: 0.14rem;
    height: 0.14rem;
  }
  /deep/ .el-input-group {
    border: 1px solid #43bafe;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 4px;
    width: 100%;
    height: 0.25rem;
    margin-left: 0;
    margin-bottom: 0.1rem;
  }
  /deep/ .el-input__inner {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    border-right: 1px solid #43bafe;
    height: 0.25rem;
    line-height: 0.25rem;
    color: #fff;
  }
  /deep/ .el-input__inner:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  /deep/ .el-button {
    background-color: rgba(0, 0, 0, 0);
  }
  /deep/ .el-icon-search {
    color: #43bafe;
  }
  /deep/ .el-input-group__append {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    padding: 0 12px;
  }
</style>
<style lang="less">
  /deep/ .el-select-dropdown {
    left: 18.75rem !important;
  }
</style>
