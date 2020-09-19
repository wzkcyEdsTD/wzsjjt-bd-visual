<template>
  <div class="video-list" :class="{'enlarge-type': isEnlarge}" v-show="isShow">
    <div class="enlarge" @click="enlarge">
      <img v-show="!isEnlarge" src="./images/enlarge.png">
      <img v-show="isEnlarge" src="./images/narrow.png">
    </div>
    <div class="close" @click="close">关闭</div>
    <div class="list-title">监控列表</div>
    <div class="menu">
      <el-tree
        :data="menuList"
        show-checkbox
        ref='menuTree'
        node-key="name"
        @check-change="handleCheckChange"
        :props="defaultProps">
      </el-tree>
    </div>
    <table class="pop-tip-table" v-for="(item, index) in showList" :key='index' v-show="(index + 1) > (current - 1) * 4 && (index + 1) <= current * 4">
      <iframe width="100%" height="100%" allowfullscreen="true" :src="'http://10.36.226.3:8089/video/index.html?url=' + item.url"></iframe>
      <div class="pop-detail">
        <span class="name">{{item.name}}</span>
        <button class='dial' @click="dial(item.wsUrl, index)">{{item.dial}}</button>
        <button class='hangUp' @click="hangUp">挂断</button>
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
import { getIndividualData } from 'api/warning/warning'
export default {
  name: 'VideoList',
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      showList: [],
      types: {
        '单兵设备': true,
        '布控球': false,
        '无人机': false
      },
      danbingList: {
        单兵设备: [],
        无人机: [],
        布控球: []
      },
      menuList: [],
      count: 1,
      current: 1,
      socket: null,
      index: 0,
      isShow: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isEnlarge: false
    }
  },
  watch: {
    danbingList() {
      const data = { ...this.danbingList }
      const list = this.danbingManage(data)
      this.menuList = [
        {
          name: '单兵设备',
          children: list['单兵设备']
        },
        {
          name: '无人机',
          children: list['无人机']
        },
        {
          name: '布控球',
          children: list['布控球']
        }
      ]
      this.updateVideo()
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {
    const data = { ...this.danbingList }
    const list = this.danbingManage(data)
    this.menuList = [
      {
        name: '单兵设备',
        children: list['单兵设备']
      },
      {
        name: '无人机',
        children: list['无人机']
      },
      {
        name: '布控球',
        children: list['布控球']
      }
    ]
    this.$bus.$on('videoShow', (data) => {
      this.isShow = data
    })
    this.updateVideo()
  },
  methods: {
    // 单兵设备、布控、无人机
    getInfo() {
      getIndividualData().then(res => {
        var obj = res
        const list1 = []
        const list2 = [] // 布控
        const list3 = [] // 无人机
        obj.forEach(val => {
          // if (val.info) {
          if (val.type === '1') {
            list2.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: !!val.url0,
              lat: val.info ? val.info.latitude : null,
              lon: val.info ? val.info.longitude : null,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID,
                nChn: 0,
                nSrc: 0
              }
            })
          } else if (val.type === '2') {
            list3.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: !!val.url0,
              lat: val.info ? val.info.latitude : null,
              lon: val.info ? val.info.longitude : null,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID,
                nChn: 0,
                nSrc: 0
              }
            })
          } else {
            list1.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: !!val.url0,
              lat: val.info ? val.info.latitude : null,
              lon: val.info ? val.info.longitude : null,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID,
                nChn: 0,
                nSrc: 0
              }
            })
          }
          // }
        })
        this.danbingList = {
          '单兵设备': list1,
          '布控球': list2,
          '无人机': list3
        }
        for (const i in this.danbingList) {
          this.danbingList[i] = this.danbingList[i].sort(
            function compareFunction(param1, param2) {
              if (param1.online && param2.online) {
                if (param1.lat && param2.lat) return 1
                if (param1.lat && !param2.lat) return -1
                if (!param1.lat && param2.lat) return 1
              } else if (param1.online && !param2.online) {
                return -1
              } else if (!param1.online && param2.online) {
                return 1
              } else {
                if (param1.lat && param2.lat) return 1
                if (param1.lat && !param2.lat) return -1
                if (!param1.lat && param2.lat) return 1
              }
            }
          )
        }
        console.log(this.danbingList)
      })
    },
    // 放大缩小操作
    enlarge() {
      this.isEnlarge = !this.isEnlarge
    },
    // 处理单兵设备数据
    danbingManage(data) {
      const navList = {}
      for (const i in data) {
        if (i === '卫星电话') continue
        const list = {}
        data[i].forEach(val => {
          if (val.deviceGroupName == null) {
          } else if (list[val.deviceGroupName]) {
            list[val.deviceGroupName].push(val)
          } else {
            list[val.deviceGroupName] = [val]
          }
        })
        navList[i] = list
      }
      const list = {}
      for (const n in navList) {
        list[n] = []
        for (const m in navList[n]) {
          list[n].push({
            name: m,
            children: navList[n][m]
          })
        }
      }
      return list
    },
    // 分页改变事件
    handleCurrentChange(data) {
      this.current = data
    },
    // 复选框变化
    handleCheckChange(data, checked, indeterminate) {
      this.showList = this.$refs.menuTree.getCheckedNodes().filter(val => {
        return typeof val.children !== 'object'
      })
      this.$nextTick(() => {
        this.current = 1
      })
      this.updateVideo()
    },
    // 更新数据
    updateVideo() {
      // this.showList = []
      // for (const n in this.types) {
      //   if (this.types[n] && n !== '卫星电话' && this.danbingList[n]) this.showList = [...this.showList, ...this.danbingList[n]]
      // }
      this.showList = this.showList.map(val => {
        val.wsUrl = `ws://127.0.0.1:9005/websocket/${Date.parse(new Date())}?domainId=${val.phoneInfo.domainID}&deviceId=${val.phoneInfo.deviceID}&nChn=0&nSrc=0`
        val.dial = '拨号'
        return val
      })
      this.count = Math.ceil(this.showList.length / 4) || 1
    },
    // 拨号
    dial(url, index) {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      this.index = index
      this.$set(this.showList, this.index, {
        ...this.showList[this.index],
        ...{
          dial: '通话中'
        }
      })
      // this.showList = this.showList.map()
      this.socket = new WebSocket(url)
      this.socket.onmessage = this.getMessage
    },
    getMessage2(msg) {
      if (msg) {
        this.showList[this.index].dial = '拨号成功'
      }
    },
    // 挂断
    hangUp() {
      this.socket.close()
      this.socket = null
      this.showList[this.index].dial = '拨号'
    },
    // 全屏
    fullScreen(url) {
      this.$alert(`<iframe width="100%" height="100%" allowfullscreen="true" src="http://10.36.226.3:8089/video/index.html?url=${url}"></iframe>`, '监控', {
        dangerouslyUseHTMLString: true,
        customClass: 'fullScreen',
        showConfirmButton: false
      })
    },
    close() {
      this.isShow = false
      this.$bus.$emit('videoShow', this.isShow)
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
    width: 16rem;
    left: 2rem;
    height: 8.5rem;
    .pop-tip-table{
      width: calc(50% - 0.2rem);
      height: 3.7rem;
      iframe{
        height: 3.4rem;
      }
    }
  }
  width: 6rem;
  position: absolute;
  top: 0;
  left: 1rem;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 6rem;
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
  left: -2rem;
  top: -2px;
  width: 2rem;
  height: calc(100% + 4px);
  overflow: auto;
  background-color: rgba(9,27,70,0.8);
  border:2px solid #38cbda;
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
  width: 2.5rem;
  height: 2rem;
  margin-left: 0.2rem;
  iframe{
    width: 100%;
    height: 2rem;
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
/deep/ .el-pagination button:disabled{
  background-color: rgba(0,0,0,0);
}
/deep/ .el-pagination .btn-next{
  background-color: rgba(0,0,0,0);
}
</style>
