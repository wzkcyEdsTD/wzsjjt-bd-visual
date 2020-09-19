<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="水情监测" :num="total"></ItemTitle>
    <div class="title-btn-group">
      <!-- <el-select
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
      </el-select> -->
      <span
        class="dot-white"
        v-show="index===btnIndex"
        @click="changeDot"
        :key="'d' + index"
        v-for="(item,index) in dotIndex">
        <img v-if="dotIndex[index]===0" src="../item-title/images/dot_white.png"/>
        <img v-if="dotIndex[index]===1" src="../item-title/images/dot_blue.png"/>
      </span>
      <span class="add-spc" :class="{'margin':btnIndex===2}">
        <el-popover
          placement="top-start"
          title=""
          width="200"
          trigger="hover"
          v-for="(item,index) in btns"
          :key="index">
          <div class="content" v-show="item==='水库'">
            <div v-for="item in options" @click="selectChange(item.value)" :key="'s' + item.value" :style="{color: item.value === value?'#159bfd':'', cursor: 'pointer'}">{{item.name}}</div>
            <!-- <div>小型型</div> -->
          </div>
          <div class="content" v-show="item==='河道'">
            <div v-for="item in options2" @click="selectChange1(item.value)" :key="'h' + item.value" :style="{color: item.value === riverType?'#159bfd':'', cursor: 'pointer'}">{{item.name}}</div>
          </div>
          <b
          @click="changeBtnIndex(index)"
          v-show="isShowDot && (item!=='水闸' && userInfo.districtName === '温州市')"
          slot="reference"
          :class="{'active' : btnIndex === index}">{{item}}</b>
        </el-popover>
        <b
          @click="changeBtnIndex(index)"
          :key="'t' + index"
          v-show="isShowDot && (item==='水闸' || userInfo.districtName !== '温州市')"
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
        v-if="userInfo.districtName !== '洞头区'"
        @refresh="initData"
        title1="最高水位"
        title2="警戒水位"
        class="flex-1"
        :isShow="btnIndex===1"
        :data="data2"></Echart01>
      <Echart02
        v-else
        @refresh="initData"
        class="flex-1"
        :isShow="btnIndex===1"
        :data="data2"></Echart02>
      <div class="iframe-box" v-show="btnIndex===2">
        <ShuiZha ref='shuizha' :isIframe="isIframe"></ShuiZha>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Echart01 from './modules/echart01'
import Echart02 from './modules/echart02'
import { getNatureDisasterByUser, getDTWaterMonitorMain } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapState, mapGetters } from 'vuex'
import ShuiZha from '../shuizhajiance/shuizhajiance'

export default {
  name: 'WaterMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      isIframe: true,
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
        return '汛限水位'
      } else if (this.userInfo.districtName === '瑞安市') {
        return '核洪水位'
      }
    }
  },
  mounted() {
    if (this.userInfo.districtName === '温州市') {
      this.btns = ['水库', '河道', '水闸']
    }
    if (this.userInfo.districtName !== '温州市') {
      this.value = 0
    }
    if (this.userInfo.districtName === '平阳县' || this.userInfo.districtName === '鹿城区' || this.userInfo.districtName === '龙港市') {
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
        if (this.btnIndex === 0 && this.userInfo.districtName === '温州市') {
          let str = ''
          if (this.value === 1) {
            str = 'xiaoxing'
          } else if (this.value === 2) {
            str = 'dazhongxing'
          }
          obj.typeName = str
        }
        obj.checked = true
        obj.from = this.point[index]
        // console.log(obj)
        this.SetCurrentMonitorType(obj)
      }
    },
    // 下拉框值变动
    selectChange(data) {
      if (data !== this.value) {
        this.value = data
        this.initData()
        this.dotIndex[this.btnIndex] = 0
        this.changeDot()
      }
    },
    selectChange1(data) {
      if (data !== this.riverType) {
        this.riverType = data
        this.initData()
        this.dotIndex[this.btnIndex] = 0
        this.changeDot()
      }
    },
    initData() {
      const me = this
      if (this.userInfo.districtName === '洞头区') {
        this.point = ['dongtoushuikushuiqingjiance', 'dongtoushuizhajiance']
        getDTWaterMonitorMain().then(res => {
          this.btns = [res[0].name, res[1].name]
          this.data1 = res[0]
          this.data1.total = (this.data1.total / 10000).toFixed(2) + '亿方'
          this.data2 = res[1]
          this.data = res
          // console.log(this.data1)
          this.setTotal()
        })
      } else {
        getNatureDisasterByUser({ type: this.value, riverType: this.riverType }).then((data) => {
          // data = [
          //   {
          //     count: 20,
          //     details: [
          //       {
          //         alias: 'shuikushuiqingjiance',
          //         ccsw: '3.79',
          //         ckflz: '127.38',
          //         grz: null,
          //         kssw: '123.95',
          //         location: '120.869888283,28.1325176870001',
          //         mgstcd: 'SWZ_05164',
          //         name: '钟前',
          //         smid: '12330',
          //         typeName: 'dazhongxing',
          //         xxsw: '120.16'
          //       }
          //     ],
          //     name: '水库',
          //     total: '109893.67',
          //     warnCount: 4
          //   },
          //   {
          //     count: 20,
          //     details: [
          //       {
          //         alias: 'shuikushuiqingjiance',
          //         ccsw: '3.79',
          //         ckflz: '127.38',
          //         grz: null,
          //         kssw: '123.95',
          //         location: '120.869888283,28.1325176870001',
          //         mgstcd: 'SWZ_05164',
          //         name: '钟前',
          //         smid: '12330',
          //         typeName: 'dazhongxing',
          //         xxsw: '120.16'
          //       }
          //     ],
          //     name: '水库',
          //     total: '109893.67',
          //     warnCount: 4
          //   }
          // ]
          // if (!data || !data.success) {
          //   return
          // }
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
      }
    },
    isShow(num) {
      return this.btnIndex === num
    },
    changeDot() {
      if (this.monitorType.length) {
        this.dotIndex[this.btnIndex] = (this.dotIndex[this.btnIndex] + 1) % 2
        this.dotIndex = [...this.dotIndex]
        let obj = {}
        console.log(this.monitorType)
        console.log(this.point[this.btnIndex] === 'dongtoushuikushuiqingjiance')
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
              // console.log('this.riverType: ' + this.riverType)
              if (typeof this.riverType === 'number') {
                // obj.typeName = this.riverType === 0 ? 'zhongyao' : 'qita'
                let str = ''
                if (this.riverType === 0) {
                  str = 'zhongyao'
                } else if (this.riverType === 1) {
                  str = 'qita'
                }
                obj.typeName = str
              }
            }
          }
        }
        obj.checked = Boolean(this.dotIndex[this.btnIndex])
        obj.from = this.point[this.btnIndex]
        // if (typeof this.riverType === 'number') {
        //   obj.typeName = this.riverType === 0 ? 'zhongyao' : 'qita'
        // }
        // console.log(obj)
        this.SetCurrentMonitorType(obj)
      }
    },
    changeBtnIndex(index) {
      this.btnIndex = index
      this.setTotal()
    },
    setTotal() {
      if (this.btnIndex === 0) {
        if (this.userInfo.districtName === '瑞安市') {
          this.total = '总数' + this.data[this.btnIndex].count + '/报警数' + this.data[this.btnIndex].warnCount
        } else {
          this.total = '总数' + this.data[this.btnIndex].count + '/超汛限' + this.data[this.btnIndex].warnCount
        }
      } else if (this.btnIndex === 1) {
        if (this.userInfo.districtName === '洞头区') {
          this.total = '总数' + this.data[this.btnIndex].count
        } else {
          this.total = '总数' + this.data[this.btnIndex].count + '/超警戒' + this.data[this.btnIndex].warnCount
        }
      } else if (this.btnIndex === 2) {
        this.$refs.shuizha.$refs.list.initScroll()
        // console.log(this.$refs.shuizha.list[0].info)
        this.total = '总数' + this.$refs.shuizha.list[0].info.length
        console.log(this.total)
      }
      if (this.btnIndex !== 2) {
        this.$refs.shuizha.$refs.list.scrollDestroyHandler()
      }
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
    Echart01,
    Echart02,
    ShuiZha
  }
}
</script>

<style lang="less" scoped>
  .iframe-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 0.35rem)
  }
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
      /deep/.add-spc {
        float: right;
        margin-right: 0.03rem;
        &.margin {
          margin-right: 0.35rem;
        }
        /deep/.content{
          cursor: pointer;
        }
        /deep/b {
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
          .active{
            color: #159bfd;
          }
        }
      }
    }
  }
</style>
