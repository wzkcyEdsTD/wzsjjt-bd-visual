<template>
  <div class="dizaijiance" :class="{'iframe':isIframe}">
    <ItemTitle v-show="!isIframe" title="水闸监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
     <span class="dot-white" @click="changeDot">
        <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
        <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
      <!-- <div class="btns"> -->
      <!-- <span class="item" @click="changeActiveIndex(0)">
        <img v-if="activeIndex===0" src="../item-title/images/pic_blue.png"/>
        <img v-else src="../item-title/images/pic_white.png"/>
      </span> -->
      <!-- <i class="line"></i> -->
      <!-- <span class="item" @click="changeActiveIndex(1)">
        <img v-if="activeIndex===1" src="../item-title/images/table_blue.png"/>
        <img v-else src="../item-title/images/table_white.png"/>
      </span> -->
      <!-- </div> -->
    </div>
    <div class="content">
      <div class="wrapper-list">
        <el-carousel
          @change="changeCarouselIndex"
          :autoplay='autoplay'
          trigger="click">
          <!-- <el-carousel-item :key="index" v-for="(item,index) in list" v-if="item.info && item.info.length>0"> -->
          <div class="item">
            <List
              ref="list"
              @itemClick="itemClick"
              :isShow="activeIndex===1"
              :data="list[0].info"
              :fild="minDataField"></List>
          </div>
          <!-- </el-carousel-item> -->
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import ItemTitle from '../item-title/item-title'
import { getWaterGateMainByUser } from 'api/warning/warning'
import { mapActions, mapGetters } from 'vuex'
import List from '../list/list-special'

export default {
  props: {
    isIframe: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    ItemTitle,
    List
  },
  computed: {
    ...mapGetters('warning', [
      'clearAllLayers',
      'currentMonitorType',
      'monitorType',
      'currentPoints'
    ]),
    minData() {
      const arr = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].info && this.list[i].info.length > 0) {
          for (let j = 0; j < this.list[i].info.length; j++) {
            const item = this.list[i].info[j]
            // switch (item.type) {
            //   case 0:
            //     item.value1 = item.device_name
            //     item.value2 = item.district
            //     item.value3 = item.type
            //     break
            //   case 1:
            //     item.value1 = item.device_name
            //     item.value2 = item.district
            //     item.value3 = this.list[1].name
            //     break
            //   case 2:
            //     item.value1 = item.device_name
            //     item.value2 = item.district
            //     item.value3 = this.list[2].name
            //     break
            //   case 3:
            //     item.value1 = item.device_name
            //     item.value2 = item.district
            //     item.value3 = this.list[3].name
            //     break
            // }
            item.value1 = item.name
            item.value2 = item.district
            item.value3 = item.type
            arr.push(item)
          }
        }
      }
      console.log(arr)
      return arr
    }
  },
  data() {
    return {
      autoplay: false,
      carouselIndex: 0,
      activeIndex: 1,
      point: 'dizaijiance',
      dotIndex: 0,
      total: '',
      list: [
        {
          name: '水闸监测',
          checked: false,
          num: '',
          info: []
        }
      ],
      minDataWarning: 0,
      minDataField: [
        { name: '名称', fild: 'name' },
        { name: '闸上水位(m)', fild: 'upz' },
        { name: '闸下水位(m)', fild: 'dwz' },
        { name: '流量(m³/s)', fild: 'mxgtq' }
      ]
    }
  },
  methods: {
    initData() {
      // getPointList().then((data) => {
      //   const newData = JSON.parse(JSON.stringify(this.list))
      //   for (let i = 0; i < data.details.length; i++) {
      //     switch (data.details[i].name) {
      //       case '地表位移':
      //         newData[0] = Object.assign(newData[0], data.details[i])
      //         break
      //       case 'GPS':
      //         newData[1] = Object.assign(newData[1], data.details[i])
      //         break
      //       case '双轴倾斜':
      //         newData[2] = Object.assign(newData[2], data.details[i])
      //         break
      //       case '雨量':
      //         newData[3] = Object.assign(newData[3], data.details[i])
      //         break
      //     }
      //   }
      //   for (let i = 0; i < data.details.length; i++) {
      //     if (data.details[i].info) {
      //       for (let j = 0; j < data.details[i].info.length; j++) {
      //         data.details[i].info[j].type = i
      //       }
      //     }
      //   }
      //   // newData[2].info = []
      //   // newData[1].info = []
      //   let warningNum = 0
      //   for (let i = 0; i < newData.length; i++) {
      //     warningNum += newData[i].warn
      //   }
      //   this.minDataWarning = warningNum
      //   console.log(newData)
      //   this.list = newData
      // })
      getWaterGateMainByUser().then(res => {
        console.log(res)
        this.list[0].info = res.details.map((val, index) => {
          val.index = index + 1
          return val
        })
        this.total = '总数' + this.list[0].info.length
      })
    },
    itemClick(data) {
      if (!this.list[data.type].checked) {
        this.addDizai(data.type)
      }
      this.$parent.$parent.showDiZai2(data)
    },
    changeCarouselIndex(index) {
      this.carouselIndex = index
    },
    changeActiveIndex(num) {
      this.activeIndex = num
    },
    changeDot() {
      this.list[0].checked = !this.list[0].checked
      // arr.push(this.list[0])
      // this.SetCurrentMonitorType(JSON.parse(JSON.stringify(this.list[0])))
      console.log(this.monitorType)
      if (this.monitorType.length) {
        this.dotIndex = (this.dotIndex + 1) % 2
        let obj = {}
        const list = []
        var findOut = false
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === 'shuizhajiance') {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            // i = this.monitorType.length
            findOut = true
          }
          if (this.monitorType[i].alias.indexOf('shuizhajiance') >= 0) {
            const obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            obj.checked = Boolean(this.dotIndex)
            obj.from = 'shuizhajiance'
            list.push(obj)
          }
          if (findOut === true) {
            break
          }
        }
        obj.checked = Boolean(this.dotIndex)
        obj.from = 'shuizhajiance'
        console.log(obj)
        this.SetCurrentMonitorType(obj)
      }
    },
    addDizai(index) {
      const arr = []
      this.list.forEach((item) => {
        const obj = JSON.parse(JSON.stringify(item))
        arr.push(obj)
      })
      arr[index].checked = !arr[index].checked
      this.list = arr
      this.SetCurrentMonitorType(arr[index])
      // 判断是否要勾选
      let num = 0
      arr.forEach((item) => {
        if (item.checked) {
          num += 1
        }
      })
      if (num >= arr.length) {
        this.dotIndex = 1
      } else {
        this.dotIndex = 0
      }
    },
    clearPoint(type) {
      // type为all清除所有
    },
    // 所有打点
    addAllPoint() {
    },
    getPointInfo() {
      // getPointInfo().then(res => {
      //   var total = 0
      //   res.map(item => {
      //     total += item.num
      //   })
      //   this.total = '接入总数' + total
      // })
    },
    ...mapActions('warning', [
      'SetCurrentMonitorTypeArr',
      'SetCurrentMonitorType',
      'SetCurrentPoints',
      'DeleteCurrentPoints'
    ])
  },
  mounted() {
    this.getPointInfo()
    this.initData()
  },
  watch: {
    dotIndex(val) {
      if (val === 0) {
        this.clearPoint('all')
      } else {
        this.addAllPoint()
      }
    },
    clearAllLayers() {
      if (this.clearAllLayers.value) {
        this.dotIndex = 0
        const bool = Boolean(this.dotIndex)
        const arr = []
        this.list.forEach((item) => {
          const obj = JSON.parse(JSON.stringify(item))
          obj.checked = bool
          arr.push(obj)
        })
        this.list = arr
      }
    }
  }
}
</script>
<style scoped lang="less">
  .dizaijiance {
    position: relative;
    display: flex;
    flex-direction: column;
    &.iframe {
      display: block;
      height: 100%;
      .title-btn-group {
        top: -0.35rem;
      }
      .content {
        height: 100%;
        padding: 0.15rem 0;
        .wrapper {
          padding: 0 !important;
        }
      }
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
      .btns {
        float: right;
        height: 0.17rem;
        margin-top: 0.09rem;
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
  }
  .dizaijiance-content {
    padding: 0 20px;
    box-sizing: border-box;
    flex-grow: 1;
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  .dizai-block {
    width: 47%;
    height: 90px;
    box-shadow: 0px 0px 22px 0px rgba(80, 194, 208, 1) inset;
    border-radius: 4px;
    border: 1px solid rgba(34, 111, 123, 1);
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .dizai-block-img {
    width: 52px;
    height: 54px;
  }
  .dizai-block-desc {
    height: auto;
    margin-left: 14px;
    font-size: 20px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #fff;
  }
  .dizai-block-desc-title {
    color: #08a9dd;
    margin-bottom: 9px;
  }
  .dizai-block-current {
    border: 2px solid rgba(84, 225, 247, 1);
  }
  .content {
    position: absolute;
    height: calc(100% - 0.35rem);
    bottom: 0;
    width: 100%;
    .wrapper-list {
      height: 100%;
      .item {
        height: 100%;
        /deep/ .wrapper {
          padding: 0 0 0.35rem;
        }
      }
      .title {
        text-align: center;
        color: #fff;
        position: relative;
        line-height: 0.35rem;
        z-index: 2;
        > span {
          background-size: 114% 150%;
          height: 0.35rem;
          display: inline-block;
          padding: 0 0.2rem;
          color: #0ED2F1;
          > i {
            margin-right: 0.05rem;
            width: 0.32rem;
            height: 0.35rem;
            display: block;
            cursor: pointer;
            float: right;
            > img {
              height: 0.19rem;
              display: block;
              margin: 0 auto;
              position: relative;
              top: 0.08rem;
            }
          }
        }
        .tip-lf {
          position: absolute;
          top: 0;
          left: 0;
          height: 0.52rem;
          width: 1.52rem;
          .bg-image('./images/tip-left');
          font-style: normal;
          color: #ffe400;
        }
        .tip-rt {
          position: absolute;
          top: 0;
          right: 0;
          height: 0.52rem;
          width: 1.52rem;
          .bg-image('./images/tip-right');
          font-style: normal;
          color: #ff4b4b;
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
