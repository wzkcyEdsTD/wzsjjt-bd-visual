<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="应急关键设备"></ItemTitle>
    <div class="title-btn-group">
    <span class="dot-white" @click="changeDot">
        <img v-if="show" src="../item-title/images/dot_blue.png"/>
        <img v-else src="../item-title/images/dot_white.png"/>
      </span>
    </div>
    <div class="container flex-1">
      <ul class="box">
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
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
// import cnchar from 'cnchar'
// import { getEquipmentMainByUser } from 'api/save/save'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      interval: 1000 * 5,
      dataList: [],
      dataList2: [],
      num: 0,
      show: false,
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
    ...mapGetters('warning', [
      'clearAllLayers'
    ])
  },
  watch: {
    clearAllLayers() {
      if (this.clearAllLayers.value) {
        this.show = true
        this.changeDot()
      }
    }
  },
  mounted() {
    this.dataList = [{
      name: '卫星电话',
      value: '2',
      unit: '个',
      src: require(`./images/wxdh.png`)
    }, {
      name: '单兵设备',
      value: '2',
      unit: '台',
      src: require(`./images/dbsb.png`)
    }
      // {
      //   name: '应急车',
      //   value: '171',
      //   unit: '辆',
      //   src: require(`./images/yjzhc.png`)
      // }
    ]
    this.dataList2 = [{
      name: '布控球',
      value: '2',
      unit: '个',
      src: require(`./images/bkq.png`)
    }, {
      name: '无人机',
      value: '2',
      unit: '台',
      src: require(`./images/wrj.png`)
    }
    ]
  },
  methods: {
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
      console.log('infoOfDaxing')
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
</style>
