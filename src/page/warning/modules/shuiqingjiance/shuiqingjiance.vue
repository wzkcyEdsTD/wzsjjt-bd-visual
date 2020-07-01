<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="水情监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
      <el-select
        v-show="btnIndex===0 && value !== 0"
        v-model="value"
        @change="selectChange"
        :popper-append-to-body='false'
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-show="btnIndex===1 && value !== 0"
        v-model="riverType"
        @change="selectChange1"
        :popper-append-to-body='false'
        placeholder="请选择">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <span
        class="dot-white"
        v-show="index===btnIndex"
        @click="changeDot"
        :key="index"
        v-for="(item,index) in dotIndex">
        <img v-if="dotIndex[index]===0" src="../item-title/images/dot_white.png"/>
          <img v-if="dotIndex[index]===1" src="../item-title/images/dot_blue.png"/>
      </span>
      <span class="add-spc">
        <b
          @click="changeBtnIndex(index)"
          :key="index"
          v-show="isShowDot"
          v-for="(item,index) in btns"
          :class="{'active' : btnIndex === index}">{{item}}</b>
      </span>
    </div>
    <div class="flex-1 flex flex-y">
      <Echart01
        @refresh="initData"
        title1="总蓄水量"
        :title2="title2"
        class="flex-1"
        :isShow="btnIndex===0"
        :data="data1"></Echart01>
      <Echart01
        @refresh="initData"
        title1="最高水位"
        title2="警戒水位"
        class="flex-1"
        :isShow="btnIndex===1"
        :data="data2"></Echart01>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import { getNatureDisasterByUser } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'WaterMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      dotIndex: [0, 0],
      point: ['shuikushuiqingjiance', 'hedaoshuiqingjiance'],
      btnIndex: 0,
      btns: ['水库', '河道'],
      data1: {},
      data2: {},
      data: [],
      value: 2,
      riverType: 0,
      isShowDot: true,
      options: [
        {
          value: 1,
          name: '小型'
        },
        {
          value: 2,
          name: '大中型'
        }
      ],
      options2: [
        {
          value: 0,
          name: '重要'
        },
        {
          value: 1,
          name: '其他'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      'waterState': state => state.warning.waterState
    }),
    ...mapGetters('warning', [
      'mapLoaded'
    ]),
    ...mapGetters([
      'userInfo'
    ]),
    title2() {
      if (this.userInfo.districtName !== '瑞安市') {
        return '校核洪水位'
      } else if (this.userInfo.district === '330381') {
        return '核洪水位'
      } else {
        return '汛限水位'
      }
    }
  },
  mounted() {
    if (this.userInfo.districtName !== '温州市') {
      this.value = 0
    }
    if (this.userInfo.districtName === '平阳县' || this.userInfo.districtName === '鹿城区') {
      this.isShowDot = false
    }
    this.btns.forEach((v, index) => {
      if (v === this.waterState) {
        this.btnIndex = index
      }
    })
    this.initData()
    this.addPoint()
  },
  beforeDestroy() {
    clearInterval(this.monitor)
  },
  methods: {
    addPoint() {
      if (this.mapLoaded) {
        let index = -1
        const indexArr = [0, 0]
        for (let i = 0; i < this.btns.length; i++) {
          if (this.btns[i] === this.waterState) {
            indexArr[i] = 1
            index = i
            break
          }
        }
        if (index === -1) {
          return
        }
        // 主动勾选点
        this.dotIndex = indexArr
        let obj = {}
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point[index]) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            break
          }
        }
        obj.checked = true
        obj.from = this.point[index]
        this.SetCurrentMonitorType(obj)
      }
    },
    // 下拉框值变动
    selectChange(data) {
      this.initData()
      this.dotIndex[this.btnIndex] = 0
      this.changeDot()
    },
    selectChange1() {
      this.initData()
      this.dotIndex[this.btnIndex] = 0
      this.changeDot()
    },
    initData() {
      const me = this
      getNatureDisasterByUser({ type: this.value, riverType: this.riverType }).then((data) => {
        if (!data) {
          return
        }
        let str = ''
        if (me.value === 1) {
          str = 'xiaoxing'
        } else if (me.value === 2) {
          str = 'dazhongxing'
        }
        data[0].details.forEach((item) => {
          item.typeName = str
        })
        this.data1 = data[0]
        this.data1.total = (this.data1.total / 10000).toFixed(2) + '亿方'
        this.data2 = data[1]
        this.data2.total = this.data2.total + 'm'
        this.data = data
        this.setTotal()
      })
    },
    isShow(num) {
      return this.btnIndex === num
    },
    changeDot() {
      if (this.monitorType.length) {
        this.dotIndex[this.btnIndex] = (this.dotIndex[this.btnIndex] + 1) % 2
        this.dotIndex = [...this.dotIndex]
        let obj = {}
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point[this.btnIndex]) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            i = this.monitorType.length
            if (this.btnIndex === 0) {
              let str = ''
              if (this.value === 1) {
                str = 'xiaoxing'
              } else if (this.value === 2) {
                str = 'dazhongxing'
              }
              obj.typeName = str
            }
            if (this.btnIndex === 1) {
              if (typeof this.riverType === 'number') {
                obj.typeName = this.riverType === 0 ? 'zhongyao' : 'qita'
              }
            }
          }
        }
        obj.checked = Boolean(this.dotIndex[this.btnIndex])
        obj.from = this.point[this.btnIndex]
        // if (typeof this.riverType === 'number') {
        //   obj.typeName = this.riverType === 0 ? 'zhongyao' : 'qita'
        // }
        this.SetCurrentMonitorType(obj)
      }
    },
    changeBtnIndex(index) {
      this.btnIndex = index
      this.setTotal()
    },
    setTotal() {
      this.total = '总数' + this.data[this.btnIndex].count + '/报警数' + this.data[this.btnIndex].warnCount
    }
  },
  watch: {
    mapLoaded() {
      this.addPoint()
    },
    currentMonitorType() {
      for (let i = 0; i < this.dotIndex.length; i++) {
        if (this.currentMonitorType.from !== this.point[i]) {
          if (this.currentMonitorType.alias === this.point[i]) {
            if (this.currentMonitorType.checked) {
              this.dotIndex[i] = 1
            } else {
              this.dotIndex[i] = 0
            }
            this.dotIndex = [...this.dotIndex]
          }
        }
      }
    }
  },
  components: {
    ItemTitle,
    Echart01
  }
}
</script>

<style lang="less" scoped>
  /deep/ .el-select {
    width: 0.7rem;
    height: 0.2rem;
    margin-right: 5px;
    margin-top: 2px;
    /deep/ .el-input__icon {
      width: 0.16rem !important;
    }
    .el-input__inner {
      padding-left: 0.07rem;
      height: 0.2rem;
      border: 1px solid #00b7ee;
      background-color: rgba(0, 0, 0, 0);
      color: #ffffff,
    }
    .el-input__suffix {
      top: 0.04rem
    }
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 20px
  }
  /deep/ .el-input__icon {
    line-height: 10px;
    height: 0.12rem;
    display: block;
    margin-top: 0.08rem;
  }
  /deep/ .el-select-dropdown__wrap {
    background-color: #5d8ebc;
    color: #ffffff;
  }
  /deep/ .el-select-dropdown {
    border: none
  }
  /deep/ .el-select-dropdown__item {
    color: #ffffff;
  }
  /deep/ .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #bed9f3;
    color: #409EFF;
    font-weight: 600;
  }
  /deep/ .el-select-dropdown {
    background-color: rgba(0, 0, 0, 0);
  }
  /deep/ .el-scrollbar {
    border-radius: 4px;
  }
  /deep/ .popper__arrow::after {
    border-bottom-color: #5d8ebc !important;
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
      .add-spc {
        float: right;
        margin-right: 0.03rem;
        > b {
          cursor: pointer;
          height: 0.2rem;
          line-height: 0.2rem;
          border-radius: 0.02rem;
          font-size: 0.14rem;
          padding: 0 0.1rem;
          border: 0.01rem solid #159bfd;
          margin-top: 0.09rem;
          display: block;
          float: left;
          background-color: transparent;
          color: #159bfd;
          &.active {
            background-color: #159bfd;
            color: #fff;
          }
        }
      }
    }
  }
</style>
