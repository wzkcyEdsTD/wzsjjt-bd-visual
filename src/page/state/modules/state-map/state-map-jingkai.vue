<template>
  <div style="height: 100%">
    <div id="map">
      <div class="map1">
        <img id="mapView" src="./images/jingkai-map.png" alt/>
        <list class="list1" :data="list" :index="listIndex" @listChange="listChange"></list>
        <total class="total" :total="total"></total>
        <bottomlist @mouseenter.native="mouseChange(true)" @mouseleave.native="mouseChange(false)" class="bottomlist" :scroll='scroll' :data="bottomData" v-if="listIndex!==2"></bottomlist>
        <echartLine @mouseenter="isEnter=true" @mouseleave="isEnter=false" :data="chartList" v-if="listIndex===2"></echartLine>
        <point :data="pointData"></point>
        <steps
          @mouseenter="isEnter=true"
          @mouseleave="isEnter=false"
          class="steps"
          ref='steps'
          :data="timeData"
          :listCount='{count: list.length, index: listIndex}'
          :index="timeDataIndex"
          :isEnter="isEnter"
          @listChange="listChange"
          @changeTimeDataIndex="changeTimeDataIndex"></steps>
      </div>
    </div>
  </div>
</template>
<script>
import point from './modules/point-jingkai'
import list from './modules/list'
import total from './modules/total'
import bottomlist from './modules/bottom_list'
import steps from './modules/step'
import EchartLine from './modules/echartLine'
import { getSafetyRiskSource, getPrimaryRiskSource, getCurYearDisaster } from 'api/state/state'
import { mapState } from 'vuex'

export default {
  name: 'StateMapWenZhou',
  data() {
    return {
      list: ['安全风险源', '一级风险源', '近五年新增地质灾害'], // 列表数据
      listIndex: 0, // 列表下标
      total: 0, // 总数
      scroll: true,
      // bottomData: {
      //   typeList: [],
      //   typeTotalCount: 0,
      //   name: ''
      // }, //  右下角数据
      // pointData: [], // 地图点的数据
      timeData: [], // 时间轴数据
      timeDataIndex: 0,
      chartList: [], // 地质灾害图表
      dataList: [], // 各数据列表
      totalList: [],
      isEnter: true
    }
  },
  computed: {
    pointData() {
      return this.bottomData.disList || []
    },
    bottomData() {
      return this.timeData[this.timeDataIndex] || {
        typeList: [],
        typeTotalCount: 0,
        name: ''
      }
    },
    ...mapState({
      'stepName': state => state.stateM.stepName
    })
  },
  watch: {
    stepName(val) {
      this.dataList[0].forEach((v, index) => {
        if (val.name === v.name.split('(个)')[0]) {
          this.listChange(0)
          this.$refs.steps.changeActive(index)
        }
      })
    }
  },
  created() {
    this.update()
    // Promise.all([getSafetyRiskSource(), getPrimaryRiskSource()]).then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    // 设置左侧头部列表
    listChange(index) {
      this.listIndex = index
      this.initData(index)
    },
    // 设置时间轴下标
    changeTimeDataIndex(index) {
      this.timeDataIndex = index
    },
    // 更新'安全风险源', '一级风险源', '本年地质灾害'的数据
    update() {
      Promise.all([getSafetyRiskSource(), getPrimaryRiskSource(), getCurYearDisaster()]).then(res => {
        // 第一个接口
        this.dataList[0] = res[0].list
        this.totalList[0] = res[0].totalCount
        // 第二个接口
        let total = 0
        for (const i in res[1].data) {
          res[1].data[i].typeTotalCount = res[1].data[i].totalNum
          res[1].data[i].typeList = res[1].data[i].tipData
          res[1].data[i].disList = res[1].data[i].mapData
          total += res[1].data[i].typeTotalCount
        }
        this.dataList[1] = res[1].data
        this.totalList[1] = total
        // 第三个接口
        for (const i in res[2].disList) {
          res[2].disList[i].name = res[2].disList[i].type
          res[2].disList[i].disList = res[2].disList[i].list
        }
        this.dataList[2] = res[2].disList
        this.totalList[2] = res[2].total
        this.chartList = res[2].chartList
        this.$nextTick(() => {
          this.listChange(0)
        })
      })
    },
    // 更换数据
    initData(index) {
      switch (index) {
        case 0:
          this.timeData = this.dataList[0]
          this.timeDataIndex = 0
          this.total = this.totalList[0]
          break
        case 1:
          this.timeData = this.dataList[1]
          this.timeDataIndex = 0
          this.total = this.totalList[1]
          break
        case 2:
          this.timeData = this.dataList[2]
          this.timeDataIndex = 0
          this.total = this.totalList[2]
          break
      }
    },
    // 轮播状态改变
    mouseChange(boolean) {
      if (boolean) {
        this.scroll = false
      } else {
        this.scroll = true
      }
      this.isEnter = boolean
    }
  },
  mounted() {
    // this.listChange(0)
  },
  components: {
    list,
    total,
    bottomlist,
    point,
    steps,
    EchartLine
  }
}
</script>
<style scoped lang="less">
  #map {
    height: 100%;
    width: 100%;
    /*background: url("images/map.png");*/
    background-size: 100% 100%;
    padding-top: 16%;
  }
  .map1 {
    position: relative;
    width: 75%;
    margin-left: 16%;
    height: auto;
  }
  .list1,
  .list2,
  .list3 {
    position: absolute;
    left: -14%;
    top: -1.5rem;
    /* width: 183px;
    height: 58px; */
    line-height: 0.75rem;
  }
  .list2 {
    top: 2.23rem;
  }
  .list3 {
    top: 2.91rem;
  }
  .total {
    position: absolute;
    /* line-height: 75px; */
    right: -5%;
    top: -0.5rem;
  }
  .bottomlist {
    position: absolute;
    right: -10%;
    bottom: 4%;
    /* line-height: 35px; */
  }
  .steps {
    position: absolute;
    bottom: -8%;
    left: 50%;
    line-height: 0.35rem;
    width: 120% !important;
  }
  #mapView {
    width: 100%;
  }
  /deep/ .map1>.wrapper{
    bottom: 6%;
    right: -1rem;
  }
  @media screen and (min-height: 1050px) {
    #map {
      padding-top: 20%;
    }
    .steps {
      bottom: -18%;
    }
    .bottomlist{
      right: -8%;
      bottom: -4%;
    }
    .total{
     top:-1.4rem
    }
    .list1{
      top:-1.8rem
    }
    /deep/ .map1>.wrapper{
      bottom: -6%;
      right: -0.8rem;
    }
  }
  @media screen and (min-height: 1620px) {
    .map1 {
      width: 60%;
      margin-left: 16%
    }
    #map {
      padding-top: 2%;
    }
    .list1 {
      left: -20%;
      top: 0rem;
    }
    .total {
      right: -35%;
      top: 0rem;
    }
  }
</style>
