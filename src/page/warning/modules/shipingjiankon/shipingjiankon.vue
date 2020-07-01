<template>
  <div class="wrapper">
    <!-- <i class="close" @click.stop="close"></i> -->
    <!--     <div class="tree">
      <div class="tree-wrapper">
        <el-tree
          class="tree-content"
          ref="tree"
          :data="dataType"
          show-checkbox
          :node-key="defaultProps.key"
          :props="defaultProps"
          @check="handleCheckChange"
          :default-expand-all="true"
          @node-click="nodeClick"
        ></el-tree>
      </div>
    </div>-->
    <div class="video-block">
      <ItemTitle title="视频监控" :num="videoCount"></ItemTitle>
      <div class="video-buttons">
        <el-select v-model="xqValue" @change="getVideoData" v-if="selectFlag"  :popper-append-to-body="appendBody">
          <el-option v-for="item in xqList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
        <span class="dot-white" @click="changeDot" style="margin-left: 10px;cursor: pointer;">
          <img
            v-if="dotIndex===0"
            src="../item-title/images/dot_white.png"
            style="vertical-align: middle;"
          />
          <img v-else src="../item-title/images/dot_blue.png" style="vertical-align: middle;" />
        </span>
      </div>
      <div
        class="video-block-content"
        v-loading="loadingFlag"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <el-tree
          :data="videoList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
          node-key="cameraId"
          :default-expanded-keys="[1]"
        ></el-tree>
      </div>
    </div>
  </div>
</template>
<script>
// import { getMonitorCamera } from 'api/warning/warning'
// import { debounce } from 'common/js/util'
import { getDistrictAndTypeInfo, getVideoInfo } from 'api/warning/warning'
import ItemTitle from '../item-title/item-title'
import { monitorTypeMixin } from 'common/js/mixin'
export default {
  components: {
    ItemTitle
  },
  mixins: [monitorTypeMixin],
  data() {
    return {
      videoCount: '',
      loadingFlag: false,
      xqValue: '',
      xqList: [],
      // 视频播放列表
      videoList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      point: 'shipinjiance',
      selectFlag: true,
      appendBody: false
      // defaultProps: {
      //   children: 'children',
      //   label: 'name',
      //   key: 'key'
      // },
      // search: '',
      // dataType: []
    }
  },
  created() {
    if (this.$store.state.userInfo.district === '3303') {
      // 判断是否是温州市区
      this.getVideoData()
      this.getXqTypeList()
    } else {
      this.selectFlag = false
      this.xqValue = this.$store.state.userInfo.district
      this.getVideoData()
    }
    // this.$watch('search', debounce((newQuery) => {
    //   this.initData()
    // }, 200))
  },
  mounted() {
    // this.initData()
  },
  methods: {
    handleNodeClick(data) {
      if (data.children) return
      if (this.dotIndex === 0) {
        this.changeDot()
      }
      this.$emit('treeCheckedCamera', data)
    },
    // 获取区县列表
    getXqTypeList() {
      getDistrictAndTypeInfo()
        .then(res => {
          const xq = res.districtInfo
          xq.unshift({
            code: 'quanshi',
            name: '全市'
          })
          this.xqList = xq
          this.xqValue = xq[0].code
        })
    },
    // 视频数据处理
    videoManage(data) {
      if (typeof data.total === 'number') {
        data.name = `${data.name}(${data.total}个)`
      }
      if (data.children) {
        data.children = data.children.map(val => {
          val = this.videoManage(val)
          return val
        })
      }
      return data
    },
    // 获取视频信息
    getVideoData() {
      this.loadingFlag = true
      var total = 0
      getVideoInfo(this.xqValue === 'quanshi' ? '' : this.xqValue)
        .then(res => {
          this.videoList = res.map(item => {
            // item.name = `${item.name}(${item.total}个)`
            total += item.total
            item = this.videoManage(item)
            return item
          })
          this.videoCount = '接入总数' + total
          this.videoList[0].children[0].cameraId = 1
          this.loadingFlag = false
        })
        .catch(_ => {
          this.videoCount = ''
          this.loadingFlag = false
        })
    },
    // nodeClick(data, node, el) {
    //   if (data.video_url) {
    //     this.$nextTick(() => {
    //       if (el.$el.className.indexOf('active') === -1) {
    //         el.$el.className = 'el-tree-node is-expanded is-focusable active'
    //         data.checked = true
    //       } else {
    //         el.$el.className = 'el-tree-node is-expanded is-focusable'
    //         data.checked = false
    //       }
    //       const checkedListKey = this.$refs.tree.getCheckedKeys()
    //       if (checkedListKey.indexOf(node.parent.key) === -1) {
    //         checkedListKey.push(node.parent.key)
    //         this.$refs.tree.setCheckedKeys(checkedListKey)
    //         this.$nextTick(() => {
    //           el.$el.className = 'el-tree-node is-expanded is-focusable active'
    //         })
    //         this.handleCheckChange(node.parent.data)
    //       }
    //       this.$emit('treeCheckedCamera', data)
    //     })
    //   }
    // },
    // initData() {
    //   getMonitorCamera().then((res) => {
    //     this.dataType = res
    //   })
    // },
    // handleCheckChange(data) {
    //   const checkedList = this.$refs.tree.getCheckedNodes()
    //   const checkedListKey = this.$refs.tree.getCheckedKeys()
    //   const obj = JSON.parse(JSON.stringify(data))
    //   const key = data.key
    //   obj.checked = checkedListKey.indexOf(key) !== -1
    //   const checkedListArr = []
    //   for (const i in checkedList) {
    //     if (checkedList[i].video_url) {
    //       checkedList[i].checked = true
    //       checkedListArr.push(checkedList[i])
    //     }
    //   }
    //   obj.allData = checkedListArr
    //   if (!obj.children) {
    //     obj.children = []
    //   }
    //   this.$emit('treeCheckedItems', obj)
    // },
    close() {
      this.$emit('close', -1)
    }
  }
}
</script>
<style scoped lang="less">

.wrapper {
  /*    position: fixed;
    left: 0.14rem;
    top: 0.5rem;
    z-index: 1;
    width: 4.8rem;
    bottom: 0.1rem;*/
    height: 100%;
    background-color:rgba(0, 0, 0, 0);
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
  .bg-image("./images/close");
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
  }
  /deep/ input {
    height: 0.25rem;
    line-height: 0.25rem;
    padding-right: 20px;
    background: transparent;
    border-color: rgba(56, 64, 74, 1);
    color: #a2aabf;
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
  padding: 15px 20px 15px 14px;
  box-sizing: border-box;
  overflow: auto;
}
.video-block-content /deep/ .el-tree {
}
.video-block-content /deep/ .el-tree > div > .el-tree-node__content {
  color: #0ed6f5;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(
    270deg,
    rgba(56, 64, 74, 0) 0%,
    rgba(56, 64, 74, 0.7) 100%
  ) !important;
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
}
/deep/ .custom-tree-node span {
  font-size: 0.16rem;
}
/deep/ .el-tree-node__content {
  height: 0.3rem;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: none;
  .bg-image("images/btn_have");
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
</style>
<style lang="less">
/deep/.el-select-dropdown {
  left: 18.75rem !important;
}
// .el-select{
//   background: #fff;
// }
</style>
