<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="应急关键设备" :num="total"></ItemTitle>
    <div class="title-btn-group">
      <span class="dot-white" @click="changeDot">
        <img v-if="show" src="../item-title/images/dot_blue.png"/>
        <img v-else src="../item-title/images/dot_white.png"/>
      </span>
      <div class="list-camera">
        <span class='list' :class="{active: isShow}" @click="listShow">
           <img v-if="isShow" src="../item-title/images/camera_blue.png"/>
           <img v-else src="../item-title/images/camera_white.png"/>
          </span>
      </div>
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
    <div class="container flex-1">
      <ul v-show="activeIndex===0" class="box">
        <li
          class="item flex"
          :class="{active: status[item.name]}"
          v-for="(item, index) in dataList"
          @click="onclickme(index)"
          :key="index">
          <img :src="item.src" alt/>
          <div class="flex-1">
            <span>{{item.name}}</span>
            <b>
              {{index === 1?danbingLength:weixinLength}}
              <!-- {{danbingLength}} -->
              <span>{{item.unit}}</span>
            </b>
          </div>
        </li>
        <li
          class="item flex"
          :class="{active: status[item.name]}"
          v-for="(item, index) in dataList2"
          @click="onclickme2(index)"
          :key="'two' + index">
          <img :src="item.src" alt/>
          <div class="flex-1">
            <span>{{item.name}}</span>
            <b>
              {{index === 1?wurenjiLength:bukongLength}}
              <!-- {{danbingLength}} -->
              <span>{{item.unit}}</span>
            </b>
          </div>
        </li>
      </ul>
      <div v-if="activeIndex===1" class="wrapper-list">
        <el-carousel
          @change="changeCarouselIndex"
          :autoplay='autoplay'
          trigger="click">
          <el-carousel-item>
            <div class="item">
              <div class="title">
                <span>{{dataList[1].name}}(<i>{{danbingLength}}</i>){{dataList[1].unit}}</span>
                <i @click="onclickme(1)">
                  <img v-if="status[dataList[1].name]" src="../item-title/images/dot_blue.png"/>
                  <img v-else src="../item-title/images/dot_white.png"/>
                </i>
              </div>
              <List
                @itemClick="itemClick"
                :isShow="activeIndex===1"
                :data="danbingList[dataList[1].name]||[]"
                :fild="listFild2"></List>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="item">
              <div class="title">
                <span>{{dataList2[0].name}}(<i>{{bukongLength}}</i>){{dataList2[0].unit}}</span>
                <i @click="onclickme2(0)">
                  <img v-if="status[dataList2[0].name]" src="../item-title/images/dot_blue.png"/>
                  <img v-else src="../item-title/images/dot_white.png"/>
                </i>
              </div>
              <List
                @itemClick="itemClick"
                :isShow="activeIndex===1"
                :data="danbingList[dataList2[0].name]||[]"
                :fild="listFild3"></List>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="item">
              <div class="title">
                <span>{{dataList2[1].name}}(<i>{{wurenjiLength}}</i>){{dataList2[1].unit}}</span>
                <i @click="onclickme2(1)">
                  <img v-if="status[dataList2[1].name]" src="../item-title/images/dot_blue.png"/>
                  <img v-else src="../item-title/images/dot_white.png"/>
                </i>
              </div>
              <List
                @itemClick="itemClick"
                :isShow="activeIndex===1"
                :data="danbingList[dataList2[1].name]||[]"
                :fild="listFild4"></List>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="item">
              <div class="title">
                <span>{{dataList[0].name}}(<i>{{weixinLength}}</i>){{dataList[0].unit}}</span>
                <i @click="onclickme(0)">
                  <img v-if="status[dataList[0].name]" src="../item-title/images/dot_blue.png"/>
                  <img v-else src="../item-title/images/dot_white.png"/>
                </i>
              </div>
              <List
                @itemClick="itemClick"
                :isShow="activeIndex===1"
                :data="danbingList[dataList[0].name]||[]"
                :fild="listFild1"></List>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { mapActions, mapGetters } from 'vuex'
import List from '../list/list'

export default {
  components: {
    ItemTitle,
    List
  },
  data() {
    return {
      autoplay: false,
      total: '',
      activeIndex: 1,
      // 卫星电话
      listFild1: [
        { name: '名称', fild: 'isatphone_tel' },
        { name: '所属区域', fild: 'district' },
        { name: '是否在线', fild: 'isOnline', fildBool: true }
      ],
      // 单兵设备
      listFild2: [
        { name: '名称', fild: 'name' },
        { name: '所属区域', fild: 'deviceGroupName' },
        { name: '是否在线', fild: 'online', fildBool: true }
      ],
      // 布控球
      listFild3: [
        { name: '名称', fild: 'name' },
        { name: '所属区域', fild: 'deviceGroupName' },
        { name: '是否在线', fild: 'online', fildBool: true }
      ],
      // 无人机
      listFild4: [
        { name: '名称', fild: 'name' },
        { name: '所属区域', fild: 'deviceGroupName' },
        { name: '是否在线', fild: 'online', fildBool: true }
      ],
      testData: [],
      testDataIndex: [0, 0, 0, 0],
      carouselIndex: 0,
      // 以上变量切换之后的用
      interval: 1000 * 5,
      dataList: [
        {
          name: '卫星电话',
          value: '0',
          unit: '个',
          src: require(`./images/wxdh.png`)
        },
        {
          name: '单兵设备',
          value: '0',
          unit: '台',
          src: require(`./images/dbsb.png`)
        }
        // {
        //   name: '应急车',
        //   value: '171',
        //   unit: '辆',
        //   src: require(`./images/yjzhc.png`)
        // }
      ],
      dataList2: [
        {
          name: '布控球',
          value: '0',
          unit: '个',
          src: require(`./images/bkq.png`)
        },
        {
          name: '无人机',
          value: '0',
          unit: '台',
          src: require(`./images/wrj.png`)
        }
      ],
      num: 0,
      show: false,
      isShow: false,
      status: {
        '卫星电话': false,
        '单兵设备': false,
        '布控球': false,
        '无人机': false
      }
    }
  },
  props: {
    danbingLength: {
      type: Number,
      default: 0
    },
    weixinLength: {
      type: Number,
      default: 0
    },
    bukongLength: {
      type: Number,
      default: 0
    },
    wurenjiLength: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    ...mapGetters('warning', [
      'clearAllLayers',
      'danbingList'
    ])
  },
  watch: {
    clearAllLayers() {
      if (this.clearAllLayers.value) {
        this.show = true
        this.changeDot()
      }
    },
    danbingList() {
      this.watchCarouselIndex()
    }
  },
  mounted() {
    this.watchCarouselIndex()
    this.$bus.$on('videoShow', (data) => {
      this.isShow = data
    })
  },
  methods: {
    watchCarouselIndex() {
      let str = ''
      let num = 0
      if (!this.danbingList['单兵设备']) return
      switch (this.carouselIndex) {
        case 0:
          this.danbingList[this.dataList[1].name].forEach(val => {
            if (val.online === '是') {
              num += 1
            }
          })
          str = this.dataList[1].name + num + '/' + this.danbingLength + this.dataList[1].unit
          break
        case 1:
          this.danbingList[this.dataList2[0].name].forEach(val => {
            if (val.online === '是') {
              num += 1
            }
          })
          str = this.dataList2[0].name + num + '/' + this.bukongLength + this.dataList2[0].unit
          break
        case 2:
          this.danbingList[this.dataList2[1].name].forEach(val => {
            if (val.online === '是') {
              num += 1
            }
          })
          str = this.dataList2[1].name + num + '/' + this.wurenjiLength + this.dataList2[1].unit
          break
        case 3:
          str = this.dataList[0].name + this.weixinLength + this.dataList[0].unit
          break
      }
      this.total = str
    },
    itemClick(data) {
      console.log(data)
      if (this.carouselIndex === 0) {
        data.daxingguanjianshebeiType = '单兵设备'
        if (!this.status['单兵设备']) {
          this.onclickme(1)
        }
      } else if (this.carouselIndex === 1) {
        data.daxingguanjianshebeiType = '布控球'
        if (!this.status['布控球']) {
          this.onclickme2(0)
        }
      } else if (this.carouselIndex === 2) {
        data.daxingguanjianshebeiType = '无人机'
        if (!this.status['无人机']) {
          this.onclickme2(1)
        }
      } else if (this.carouselIndex === 3) {
        data.daxingguanjianshebeiType = '卫星电话'
        console.log(this.status['卫星电话'])
        if (!this.status['卫星电话']) {
          this.onclickme(0)
        }
      }
      this.$parent.$parent.$refs.map.specalPointGuanJianSheBei = data
    },
    // 展示监控列表
    listShow() {
      this.isShow = !this.isShow
      this.$bus.$emit('videoShow', this.isShow)
    },
    changeCarouselIndex(index) {
      this.carouselIndex = index
      this.watchCarouselIndex()
    },
    changeActiveIndex(num) {
      this.activeIndex = num
    },
    changeDot() {
      if (this.show) {
        this.show = false
        this.status = {
          '卫星电话': false,
          '单兵设备': false,
          '布控球': false,
          '无人机': false
        }
      } else {
        this.show = true
        this.status = {
          '卫星电话': true,
          '单兵设备': true,
          '布控球': true,
          '无人机': true
        }
      }
      this.$bus.$emit('infoOfDaxing', this.status)
      // this.$bus.$emit('changeShow', this.show)
    },
    onclickme(index) {
      this.show = false
      // this.$bus.$emit('changeShow', false)
      var data
      if (index === 0) {
        data = {
          name: '卫星电话'
        }
        console.log(data)
        this.SetCurrentMonitorType(data)
      } else if (index === 1) {
        this.num = this.num + 1
        this.dataList[index].index = this.num
        data = {
          name: this.dataList[index].name
        }
        this.SetCurrentMonitorType(this.dataList[index])
        // 强行点击按钮
      }
      if (this.status[data.name] === true) {
        this.status[data.name] = false
      } else {
        this.clearStatus()
        this.status[data.name] = true
      }
      console.log(this.status)
      this.$bus.$emit('infoOfDaxing', this.status)
    },
    onclickme2(index) {
      this.show = false
      // this.$bus.$emit('changeShow', false)
      let data
      if (index === 0) {
        data = {
          name: '布控球'
        }
        this.SetCurrentMonitorType(data)
      } else if (index === 1) {
        data = {
          name: '无人机'
        }
        this.SetCurrentMonitorType(data)
      }
      if (this.status[data.name] === true) {
        this.status[data.name] = false
      } else {
        this.clearStatus()
        this.status[data.name] = true
      }
      this.$bus.$emit('infoOfDaxing', this.status)
    },
    sendInfo(data) {
      // this.$bus.$emit('changeShow', data)
    },
    clearStatus() {
      for (const n in this.status) {
        this.status[n] = false
      }
    },
    ...mapActions('warning', [
      'SetCurrentMonitorTypeArr',
      'SetCurrentMonitorType',
      'SetCurrentPoints',
      'DeleteCurrentPoints'
    ])
  }
}
</script>

<style scoped lang='less'>
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
        margin-right: 0.04rem;
        margin-left: 0.08rem;
      }
      .list-camera {
        float: right;
        height: 0.17rem;
        margin-top: 0.04rem;
        margin-right: 0.04rem;
        margin-left: 0.08rem;
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
        margin: 0.01rem 0.08rem;
      }
    }
    .container {
      position: relative;
      .box {
        overflow: hidden;
        position: absolute;
        top: 45%;
        left: 15px;
        transform: translate(0, -50%);
        width: 92%;
        .item {
          width: 48%;
          float: left;
          margin: 0.15rem 0;
          padding: 8px;
          border-radius: 8px;
          margin-left: 2%;
          border: 2px solid rgba(0, 0, 0, 0);
          &.active {
            border: 2px solid #099bde;
            box-shadow: rgb(9, 155, 222, 0.5) 0px 0px 18px inset;
          }
          cursor: pointer;
          > img {
            width: 0.68rem;
            height: 0.58rem;
          }
          > div {
            height: 0.58rem;
            > span {
              color: #00ccff;
              display: block;
              font-size: 0.16rem;
              line-height: 0.26rem;
            }
            > b {
              color: #f2ec81;
              font-size: 0.16rem;
              line-height: 0.26rem;
              display: block;
              > span {
                color: #fff;
                padding-left: 0.1rem;
              }
            }
          }
        }
      }
      .wrapper-list {
        height: 100%;
        .item {
          height: calc(100% - 0.34rem);
        }
        .title {
          text-align: center;
          color: #fff;
          position: relative;
          line-height: 0.35rem;
          z-index: 2;
          > span {
            .bg-image('./images/yingji-tip');
            background-size: 114% 150%;
            height: 0.35rem;
            display: inline-block;
            padding: 0 0.2rem;
            color: #0ED2F1;
            display: none;
            > i {
              font-style: normal;
              color: #ffd800;
            }
          }
          > i {
            position: absolute;
            right: 0;
            top: 0.2rem;
            margin-right: 0.05rem;
            width: 0.32rem;
            height: 0.35rem;
            display: block;
            cursor: pointer;
            > img {
              height: 0.19rem;
              display: block;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
  /deep/ .el-carousel__arrow--right {
    display: none;
  }
  /deep/ .el-carousel__arrow--left {
    display: none;
  }
  /deep/ .el-carousel__button {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 0.1rem;
    background: #3ecbe0;
  }
  /deep/ .el-carousel__arrow--right {
    display: none;
  }
  /deep/ .el-carousel__arrow--left {
    display: none;
  }
  /deep/ .el-carousel__button {
    width: 0.14rem;
    height: 0.14rem;
    border-radius: 0.1rem;
    background: #3ecbe0;
  }
  /deep/ .el-carousel__indicators--horizontal {
    height: 0.35rem;
    > li {
      height: 100%;
      width: 0.25rem;
      position: relative;
      > button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  /deep/ .el-carousel__item, .el-carousel__mask {
    height: 100%;
  }
  /deep/ .el-carousel__indicator.is-active button {
    width: 0.16rem;
    height: 0.16rem;
  }
  .list {
    cursor: pointer;
    color: #fff;
    float: right;
    &.active {
      color: #00ccff;
    }
  }
</style>
