<template>
  <div class="video-list" :class="{'enlarge-type': isEnlarge}" v-show="isShow">
    <div class="enlarge" @click="enlarge">
      <img v-show="!isEnlarge" src="./images/enlarge.png">
      <img v-show="isEnlarge" src="./images/narrow.png">
    </div>
    <div class="close" @click="close">关闭</div>
    <div class="list-title">视频监控列表(提示：最多同时展示9个监控)</div>
    <div class="menu">
      <div class="search">
        <el-input
          placeholder="输入监控名称"
          v-model="searchContent"
          @change="search()"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
        </el-input>
      </div>
      <el-tree
        lazy
        :data="menuList"
        show-checkbox
        ref='menuTree'
        node-key="id"
        @check='clickCheck'
        @check-change="handleCheckChange"
        :load="loadNode"
        :props="defaultProps">
      </el-tree>
    </div>
    <table class="pop-tip-table" v-for="(item, index) in showList" :key='index' v-show="(index + 1) > (current - 1) * 4 && (index + 1) <= current * 4">
      <iframe width="100%" height="100%" allowfullscreen="true" :src="item.video_url"></iframe>
      <div class="pop-detail">
        <span class="name">{{item.name}}</span>
      </div>
    </table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync='current'
      :page-count="count">
    </el-pagination>
  </div>
</template>

<script>
import { getVideoTree, getVideoTreeDetail } from 'api/warning/warning'
// import { getDistrictAndTypeInfo, getVideoInfo, getMonitorCameraDetail } from 'api/warning/warning'
export default {
  name: 'VideoList',
  props: {
    // danbingList: {
    //   type: Object,
    //   default: () => ({
    //     单兵设备: [],
    //     无人机: [],
    //     布控球: []
    //   })
    // },
    type: {
      type: String
    }
  },
  data() {
    return {
      showList: [],
      menuList: [],
      count: 1,
      current: 1,
      socket: null,
      index: 0,
      isShow: false,
      defaultProps: {
        children: 'childern',
        label: 'name',
        isLeaf: 'leaf'
      },
      isEnlarge: false,
      obj: {
        list: []
      },
      searchContent: '',
      shoucangShow: false,
      shoucang: [],
      allList: [],
      videoList: [],
      videoListId: ''
    }
  },
  created() {
    // this.search()
    // this.getInfo()
  },
  watch: {
    shoucangShow(val) {
      // this.showList = []
    }
  },
  mounted() {
    this.$bus.$on('video-search', data => {
      this.searchContent = data
      this.search()
    })
    // 接收列表展示状态及收藏信息
    this.$bus.$on('monitorShow', (data) => {
      this.isShow = data.isShow
      // if (!this.isShow) {
      //   this.menuList = []
      // }
      this.showList = []
      //   return
      //   // }, 1000)
      // } else {
      //   this.showList = this.videoList
      // }
      this.shoucangShow = data.shoucangShow
      this.videoListId = data.videoListId
      // this.shoucang = data.shoucang
      this.search(1)
    })
    // this.updateVideo()
  },
  methods: {
    // 视频懒加载
    // loadNode(node, resolve) {
    //   // const me = this
    //   if (node.level === 0) {
    //     // return resolve([{ name: 'region' }, { name: 'region1' }])
    //     // getMonitorCamera
    //     getVideoInfo(this.xqValue === 'quanshi' ? '' : this.xqValue, this.searchContent)
    //       .then(res => {
    //         // let total = 0
    //         this.menuList = res.map(item => {
    //           // item.name = `${item.name}(${item.total}个)`
    //           // total += item.total
    //           item = this.videoManage(item)
    //           return item
    //         })
    //         console.log(this.menuList)
    //         return resolve(this.menuList)
    //         // this.loadingFlag = false
    //       })
    //   }
    //   // if (node.level === 1 || node.level === 2) {
    //   //   node.data.children = node.data.children.map(val => {
    //   //     if (val.total === 0) val.leaf = true
    //   //     return val
    //   //   })
    //   //   return resolve(node.data.children)
    //   // }
    //   if (node.data && node.data.children && node.data.children.length > 0) {
    //     node.data.children = node.data.children.map(val => {
    //       if (val.total > 0 && !val.children) val.children = []
    //       if (!val.children || val.total === 0) val.leaf = true
    //       return val
    //     })
    //     return resolve(node.data.children)
    //   }
    //   if (node.data && node.data.total > 0) {
    //     let datatype = ''
    //     let district = ''
    //     if (this.$store.state.userInfo.districtName !== '温州市') {
    //       datatype = node.data.label || node.data.name
    //     } else {
    //       datatype = node.parent.data.label || node.parent.data.name
    //       district = node.data.label || node.data.name
    //     }
    //     getMonitorCameraDetail(this.searchContent, datatype, district).then(res => {
    //       res = res.map(val => {
    //         if (!val.children || val.children.length === 0) val.leaf = true
    //         return val
    //       })
    //       return resolve(res)
    //     })
    //   }
    //   if (!node.data || !node.data.children) return resolve([])
    //   // if (node.level > 1) return resolve([{ name: 'data1' }])

    //   // setTimeout(() => {
    //   //   const data = [{
    //   //     name: 'leaf',
    //   //     leaf: true
    //   //   }, {
    //   //     name: 'zone'
    //   //   }]
    //   //   resolve(data)
    //   // }, 500)
    // },
    loadNode(node, resolve) {
      if (!this.videoListId) return
      console.log(node)
      if (node.level === 0) {
        // var total = 0
        getVideoTree('', this.videoListId, this.shoucangShow, this.searchContent).then(res => {
          console.log(res)
          this.menuList = res.childern.map(item => {
            // item.name = `${item.name}(${item.total}个)`
            // total += item.count
            item = this.videoManage(item)
            return item
          })
          // this.$bus.$emit('monitorList', this.videoList)
          // this.videoCount = '接入总数' + total
          // this.videoList[0].id = 1
          return resolve(this.menuList)
        })
      }
      if (node.data && node.data.childern && node.data.childern.length > 0) {
        node.data.childern = node.data.childern.map(val => {
          if (val.count > 0 && !val.childern) val.childern = []
          if (!val.childern || val.count === 0) val.leaf = true
          return val
        })
        return resolve(node.data.childern)
      }
      if (node.data && node.data.count > 0) {
        getVideoTreeDetail(this.xqValue || node.data.code, node.parent.data.id, this.shoucangShow, this.searchContent).then(res => {
          res = res.map(val => {
            if (!val.childern || val.childern.length === 0) val.leaf = false
            val = this.videoManage(val)
            return val
          })
          return resolve(res)
        })
      }
      if (!node.data || !node.data.count) return resolve([])
    },
    // 视频数据处理
    videoManage(data) {
      if (typeof data.count === 'number' && data.childern) {
        data.label = data.name
        data.name = `${data.name}(${data.count}个)`
      }
      if (data.childern) {
        data.childern = data.childern.map(val => {
          val = this.videoManage(val)
          return val
        })
      }
      return data
    },
    // 放大缩小操作
    enlarge() {
      this.isEnlarge = !this.isEnlarge
    },
    // 分页改变事件
    handleCurrentChange(data) {
      this.current = data
    },
    // 复选框变化
    handleCheckChange(data, checked, indeterminate) {
    },
    search(bool) {
      getVideoTree(this.xqValue, this.videoListId, this.shoucangShow, this.searchContent).then(res => {
        // let total = 0
        // console.log(res)
        this.menuList = res.childern.map(item => {
          // total += item.count
          item = this.videoManage(item)
          return item
        })
        // this.$bus.$emit('monitorList', this.videoList)
        // this.videoCount = '接入总数' + total
        console.log(this.menuList)
      })
    },
    clickCheck() {
      const obj = this.obj
      console.log(obj)
      const newList = this.$refs.menuTree.getCheckedNodes().filter(val => {
        return typeof val.childern !== 'object'
      })
      const list = newList.filter(val => {
        return typeof obj[val.id] === 'object'
      })
      const list1 = []
      obj.list.filter(v => {
        let bool = false
        list.forEach(val => {
          if (Number(v) === val.id) bool = true
        })
        if (bool) {
          list1.push(obj[v])
        }
        return bool
      })
      const list2 = newList.filter(val => {
        return typeof obj[val.id] !== 'object'
      })
      this.obj = {
        list: []
      }
      if ([...list1, ...list2].length > 9) {
        this.showList = [...list1, ...list2].slice(0, 9)
        this.showList.forEach(val => {
          this.obj[val.id] = val
          this.obj.list.push(val.id)
        })
        this.videoList = this.showList
        setTimeout(() => {
          this.$refs.menuTree.setCheckedKeys(this.obj.list)
        }, 2000)
      } else {
        this.showList = [...list1, ...list2]
        this.showList.forEach(val => {
          this.obj[val.id] = val
          this.obj.list.push(val.id)
        })
        this.videoList = this.showList
      }
      const count = this.current
      this.$nextTick(() => {
        console.log(Math.ceil(this.showList.length / 4))
        console.log(count)
        if (count > Math.ceil(this.showList.length / 4)) {
          this.current = 1
        }
      })
      this.updateVideo()
      // this.$refs.menuTree.setCheckedKeys(this.obj.list)
    },
    // 更新数据
    updateVideo() {
      // this.showList = []
      // for (const n in this.types) {
      //   if (this.types[n] && n !== '卫星电话' && this.danbingList[n]) this.showList = [...this.showList, ...this.danbingList[n]]
      // }
      this.count = Math.ceil(this.showList.length / 4) || 1
    },
    close() {
      this.isShow = false
      this.showList = []
      this.menuList = []
      this.$bus.$emit('monitorShow', this.isShow)
    }
  }
}
</script>

<style lang="less" scoped>
.list-title{
  text-align: center;
  margin-bottom: 0.15rem;
}
.video-list{
  &.enlarge-type{
    width: 14rem;
    left: 4rem;
    height: 8.5rem;
    .pop-tip-table{
      width: calc(50% - 0.2rem);
      height: 3.7rem;
      iframe{
        height: 3.4rem;
      }
    }
  }
  width: 9.3rem;
  position: absolute;
  top: 0;
  left: 4rem;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 8rem;
  background: #aaa;
  z-index: 10;
  padding: 0.1rem 0.25rem 0.5rem;
  background-color: rgba(9,27,70,0.8);
  border-radius: 4px;
  color:#ffffff;
  border:2px solid #38cbda;
}
.menu{
  position: absolute;
  left: -4rem;
  top: -2px;
  width: 4rem;
  height: calc(100% + 4px);
  overflow: auto;
  background-color: rgba(9,27,70,0.8);
  border:2px solid #38cbda;
  .search{
    padding: 10px;
  }
  /deep/ .el-tree{
    background: transparent;
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover{
    background: transparent;
  }
  /deep/.el-tree-node:focus>.el-tree-node__content{
    background: transparent;
  }
  li{
      margin: 0.1rem auto;
    text-align: left;
    cursor: pointer;
    width: 0.7rem;
    &.active{
      color: #00ffff;
    }
  }
}
.pop-tip-table{
  float: left;
  width: 4.1rem;
  height: 3.1rem;
  margin-left: 0.2rem;
  margin-bottom: 0.2rem;
  iframe{
    width: 100%;
    height: 3.1rem;
    border: 1px solid #fff;
  }
}
.dial{
  background-color: #091b46;
  border:1px solid #00ffff;
  color:#00ffff;
  outline:none;
  border-radius: 4px;
  height: 25px;
  width: 60px;
  float: right;
  margin-left:0.05rem;
  cursor: pointer;
}
.pop-detail{
  margin-top:0.1rem;
}
.hangUp{
  background-color: #091b46;
  border:1px solid #ffa438;
  color:#ffa438;
  outline:none;
  border-radius: 4px;
  height: 25px;
  width: 60px;
  float:right;
  cursor: pointer;
}
/deep/.el-tree-node__label {
  width: 2.3rem;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/deep/ .el-pagination{
  position: absolute;
  bottom: 2px;
  left: 50%;
  right: 0;
  transform: translateX(-50%);
  text-align: center;
  .el-pager li{
    background-color: #159bfd;
    color:#ffffff;
    border-radius: 4px;
    &.active{
      background: #fff;
      color: #159bfd;
    }
  }
}
.close{
  position: absolute;
  right: 0.09rem;
  top: 0.05rem;
  cursor: pointer;
}
.enlarge{
  position: absolute;
  right: 0.5rem;
  width: 0.2rem;
  top: 0.05rem;
  img{
    width: 0.2rem;
    cursor: pointer;
  }
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
/deep/ .el-pagination button:disabled{
  background-color: rgba(0,0,0,0);
}
/deep/ .el-pagination .btn-next{
  background-color: rgba(0,0,0,0);
}
</style>
