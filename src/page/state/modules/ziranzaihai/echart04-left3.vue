/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <div class="panel">
      <div class="maquee" ref="wrapper" :id="myUuid">
        <ul class="ul-rymodal flex flex-y" ref="ul">
          <li
            class="li-rymodal"
            :class="{active:index==currentIndex}"
            v-for="(value,index) in navList"
            v-show='value.isShow'
            :key="value+index">
            <div class="maquee_div1 maquee_public" ref="acp11" :id="'name' + index">{{value.name}}</div>
            <div
              class="maquee_div2 maquee_public"
              @click="clickme(value.name === '风险防范区' ? '地质灾害风险防范区' : value.name)"
              @mouseover="mouseove(index)"
              @mouseout="mouseout(index)">
              <span
                :style="{'width':value.value/dataMax*100 +'%'}"
                :class="{active:index==currentIndex}"
                @click="clickme(value.name === '风险防范区' ? '地质灾害风险防范区' : value.name)"
                @mouseover="mouseove(index)"
                @mouseout="mouseout(index)"></span>
            </div>
            <div class="maquee_div3 maquee_public">{{value.value}}处</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="tip">
      <div class="tip_1" @mouseover="mouseove(currentIndex)" @mouseout="mouseout(currentIndex)">
        <div v-for='(item, index) in navList[currentIndex].list' :key='index'>
          <div class="tip_white">
            <!-- {{result}} -->
            {{item.name}}
          </div>
          <div class="tip_yellow">
            <!-- {{result}} -->
            {{item.number}}{{item.unit}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'
import { getnatural } from "@/api/state/natural";
import { uuid } from 'common/js/util'
import $ from 'jquery'

export default {
  name: "e4",
  data() {
    return {
      echart: null,
      resultList: [
        {
          top1: 36,
          top2: 320,
          top3: 12,
          unit1: '户',
          unit2: '人',
          unit3: '万元',
          bot1: '总危险户数',
          bot2: '总危险人口',
          bot3: '总危险财产'
        },
        {
          unit1: '户',
          unit2: '人',
          unit3: '万元',
          top1: 52,
          top2: 56,
          top3: 23,
          bot1: '总危险户数',
          bot2: '总危险人口',
          bot3: '总危险财产'
        },
        {
          unit1: '户',
          unit2: '人',
          unit3: '万元',
          top1: 52,
          top2: 92,
          top3: 23,
          bot1: '总危险户数',
          bot2: '总危险人口',
          bot3: '总危险财产'
        },
        {
          unit1: '户',
          unit2: '人',
          unit3: '万元',
          top1: 103,
          top2: 65,
          top3: null,
          bot1: '总危险户数',
          bot2: '总危险人口',
          bot3: '总危险财产'
        },
        {
          unit1: '个',
          unit2: '个',
          unit3: '千米',
          unit4: '',
          top1: 62,
          top2: 23,
          top3: 23,
          top4: null,
          bot1: '跨行政村个数',
          bot2: '跨乡镇个数',
          bot3: '总长度',
          bot4: '总面积'
        },
        {
          unit1: '个',
          unit2: '个',
          unit3: '千米',
          unit4: '平方千米',
          top1: 236,
          top2: 10,
          top3: 12,
          top4: 12,
          bot1: '跨行政村个数',
          bot2: '跨乡镇个数',
          bot3: '河流长度',
          bot4: '总面积'
        }
      ],
      navList: [{
        list: []
      }],
      currentIndex: 0,
      datanum: 10,
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      timer: null
    }
  },
  computed: {
    dataMax() {
      let max = 0
      this.navList.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    getnatural().then(res => {
      if (!res) {
        return
      }
      this.navList = res.categoryViews.map(val => {
        val.list = this.infoList(val)
        val.isShow = true
        if ((this.userInfo.districtName === '平阳县' || this.userInfo.districtName === '瑞安市') && val.name === '山洪沟') {
          val.isShow = false
        }
        if (this.userInfo.districtName === '文成县' && (val.name === '小流域' || val.name === '山洪沟')) {
          val.isShow = false
        }
        if (this.userInfo.districtName === '龙港市' && (val.name === '小流域' || val.name === '山洪沟')) {
          val.isShow = false
        }
        // 经开区处理
        if (this.userInfo.districtName === '经开区' && (val.name === '滑坡' || val.name === '泥石流' || val.name === '山洪沟')) {
          val.isShow = false
        }
        // 泰顺县处理
        if (this.userInfo.districtName === '泰顺县' && (val.name === '滑坡' || val.name === '泥石流' || val.name === '崩塌' || val.name === '风险防范区')) {
          val.isShow = false
        }
        // 乐清市处理
        if (this.userInfo.districtName === '乐清市' && (val.name === '小流域' || val.name === '山洪沟')) {
          val.isShow = false
        }
        return val
      })
      this.startTimer()
    })
  },
  beforeDestroy() {
    this.scrollDestroyHandler()
    this.stopTimer()
  },
  watch: {
    navList() {
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
      //     const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
      //     if (ul > wrapper) {
      //       this.scrollTop = 0
      //       this.scrollStartHandler()
      //     } else {
      //       this.scrollDestroyHandler()
      //     }
      //   }, 100)
      // })
    }
  },
  methods: {
    // clickme(key) {
    //   if (key === '风险防范区') key = '地质灾害风险防范区'
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    // 判断数据类型
    infoList(data) {
      let list = []
      if (typeof data === 'object') {
        // data.forEach(val => {
          // 总危险户数
          if (typeof data.disasterInfo.sum_threat_num === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响户数',
                unit: '户',
                number: data.disasterInfo.sum_threat_num
              })
            } else {
              list.push({
                name: '总危险户数',
                unit: '户',
                number: data.disasterInfo.sum_threat_num
              })
            }
          }
          if (typeof data.disasterInfo.sum_population === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响人数',
                unit: '人',
                number: data.disasterInfo.sum_population
              })
            } else {
              list.push({
                name: '总危险人口',
                unit: '人',
                number: data.disasterInfo.sum_population
              })
            }
          }
          if (typeof data.disasterInfo.sum_threat === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响财产',
                unit: '万元',
                number: data.disasterInfo.sum_threat
              })
            } else {
              list.push({
                name: '总危险财产',
                unit: '万元',
                number: data.disasterInfo.sum_threat
              })
            }
          }
          // if (typeof data.disasterInfo.village_count === 'number') {
          //   list.push({
          //     name: '跨行政村个数',
          //     unit: '个',
          //     number: data.disasterInfo.village_count
          //   })
          // }
          if (typeof data.disasterInfo.street_count === 'number') {
            if (this.userInfo.districtName !== '瑞安市') {
              list.push({
                name: '跨乡镇个数',
                unit: '个',
                number: data.disasterInfo.street_count
              })
            }
          }
          if (typeof data.disasterInfo.total_river_length === 'number') {
            if (this.userInfo.districtName !== '瑞安市') {
              list.push({
                name: '总长度',
                unit: '千米',
                number: data.disasterInfo.total_river_length
              })
            }
          }
          if (typeof data.disasterInfo.sum_length === 'number') {
            list.push({
              name: '河流长度',
              unit: '千米',
              number: data.disasterInfo.sum_length
            })
          }
          if (typeof data.disasterInfo.sum_area === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '流域面积',
                unit: '平方千米',
                number: data.disasterInfo.sum_area.toFixed(2)
              })
            } else {
              list.push({
                name: '总面积',
                unit: '平方千米',
                number: data.disasterInfo.sum_area.toFixed(2)
              })
            }
          }
          // 风险防范区
          if (typeof data.disasterInfo.sum_house === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响户数',
                unit: '户',
                number: data.disasterInfo.sum_house
              })
            } else {
              list.push({
                name: '总危险户数',
                unit: '户',
                number: data.disasterInfo.sum_house
              })
            }
          }
          if (typeof data.disasterInfo.sum_people === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响人数',
                unit: '人',
                number: data.disasterInfo.sum_people
              })
            } else {
              list.push({
                name: '总危险人数',
                unit: '人',
                number: data.disasterInfo.sum_people
              })
            }
          }
          if (typeof data.disasterInfo.sum_property === 'number') {
            if (this.userInfo.districtName === '瑞安市') {
              list.push({
                name: '影响财产',
                unit: '万元',
                number: data.disasterInfo.sum_property
              })
            } else {
              list.push({
                name: '总危险财产',
                unit: '万元',
                number: data.disasterInfo.sum_property
              })
            }
          }
          if (typeof data.disasterInfo.check === 'number' && this.userInfo.districtName === '瑞安市') {
            list.push({
              name: '已核销',
              unit: '处',
              number: data.disasterInfo.check
            })
          }
          if (typeof data.disasterInfo.uncheck === 'number' && this.userInfo.districtName === '瑞安市') {
            list.push({
              name: '未核销',
              unit: '处',
              number: data.disasterInfo.uncheck
            })
          }
      }
      return list
    },
    stopTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    startTimer() {
      this.stopTimer()
      this.timer = setInterval(() => {
        if (this.currentIndex >= this.navList.length - 1) {
          this.currentIndex = 0
        } else {
          this.currentIndex += 1
        }
      }, 4000)
    },
    mouseove(key) {
      this.stopTimer()
      this.currentIndex = key
    },
    mouseout(key) {
      this.startTimer()
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            dom.scrollTop = 0
            this.scrollTop = 0
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
}
</script>
<style scoped lang='less'>
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .echart {
      width: 2.7rem;
      height: 2.7rem;
      position: absolute;
    }
    .tip {
      position: absolute;
      width: 1.67rem;
      /*height: 2.55rem;*/
      .bg-image("./images/nature_frame");
      margin-top: 0.1rem;
      // margin-left: 2.8rem;
      padding-top: 0.3rem;
      top: 0.4rem;
      left: 2.8rem;
      padding-bottom: 0.3rem;
    }
    /deep/ span.active {
      background: -webkit-linear-gradient(left, #fdf061, #fe9352);
      background: -o-linear-gradient(left, #fdf061, #fe9352);
      background: -mos-linear-gradient(left, #fdf061, #fe9352);
      background: linear-gradient(left, #fdf061, #fe9352);
    }
    .li-rymodal.active {
      background: rgba(8, 16, 27, 0);
      box-shadow: 0px 0px 20px #539fe6 inset;
      border-radius: 4px;
    }
    li .active1 {
      // background-color:red;
      border: 1px solid #fe9352;
    }
    * {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .panel {
      width: 56%;
      background-color: rgba(0, 0, 0, 0);
      border-radius: 0.03rem;
      overflow: hidden;
      height: 2.4rem;
      margin-top: 0.45rem;
      margin-left: 3%;
    }
    .maquee {
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      /*overflow: auto;*/
      width: calc(100%);
    }
    .maquee ul {
      width: 100%;
    }
    .maquee li {
      width: 100%;
      height: 0.4rem;
      background-color: rgba(0, 0, 0, 0);
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
    .maquee_public {
      float: left;
    }
    .maquee_div1 {
      width: 32%;
      text-align: right;
      color: #fff;
      margin-right: 0.05rem;
    }
    .maquee_div2 {
      width: 42%;
      margin-right: 2%;
      background-color: #1D538D;
      height: 0.12rem;
      border-radius: 0.06rem;
      margin-top: 6%;
      cursor: pointer;
      overflow: hidden;
    }
    .maquee_div3 {
      width: 12%;
      text-align: left;
      color: rgba(255, 255, 255, 0.7);
    }
    .maquee_div2 span {
      display: block;
      height: 0.12rem;
      border-radius: 0.06rem;
      margin-top: 0.01rem;
      float: left;
    }
    span {
      background: -webkit-linear-gradient(left, #1b669b, #05effc);
      background: -o-linear-gradient(left, #1b669b, #05effc);
      background: -mos-linear-gradient(left, #1b669b, #05effc);
      background: linear-gradient(left, #1b669b, #05effc);
    }
    .maquee_div2 span :hover {
      background: -webkit-linear-gradient(left, #fdf061, #fe9352);
      background: -o-linear-gradient(left, #fdf061, #fe9352);
      background: -mos-linear-gradient(left, #fdf061, #fe9352);
      background: linear-gradient(left, #fdf061, #fe9352);
    }
    .li-rymodal {
      /*float: left;
      list-style: none;
      margin: 5px;*/
      list-style: none;
      white-space: nowrap;
      display: block;
    }
    .ul-rymodal {
      display: block;
      padding: 0;
      white-space: nowrap;
      overflow-y: scroll;
      padding-bottom: 50px;
    }
    .ul-rymodal::-webkit-scrollbar {
      display: none;
    }
    span {
      cursor: pointer;
    }
    @keyframes mymove {
      0% {
        background-size: 90%;
      }
      100% {
        background-size: 100%;
      }
    }
    .tip_1 {
      margin-top: 0.09rem;
      margin-left: 0.31rem;
    }
    .tip_white {
      /*height: 0.14rem;*/
      margin-top: 0.09rem;
      color: white;
      font-size: 0.16rem;
      margin-left: 0rem;
    }
    .tip_yellow {
      height: 0.14rem;
      margin-top: 0.09rem;
      color: #fedb5d;
      margin-left: 0rem;
      font-size: 0.16rem;
      animation: mymove 2s alternate;
      -webkit-animation: mymove1 2s alternate; /* Safari and Chrome */
      // display: none;
    }
    /*@keyframes mymove1 {*/
    /*  0% {*/
    /*    font-size: 0.1rem;*/
    /*  }*/
    /*  100% {*/
    /*    font-size: 0.12rem;*/
    /*  }*/
    /*}*/
    @media screen and (min-height: 950px) {
      .panel {
        height: 3.2rem;
      }
      .maquee {
        margin-top: 0.1rem;
      }
    }
    @media screen and (max-height: 1050px) {
      .maquee li {
        height: 0.36rem;
        line-height: 0.36rem;
      }
      .echart {
        height: 2.55rem;
      }
      .tip_yellow {
        margin-top: 0px;
      }
    }
  }
  //大屏适配
  @media screen and (min-width: 5000px) {
    .wrapper {
      .tip {
        margin-top: -0.05rem;
      }
      .panel {
        height: 2.6rem;
        margin-top: 0.3rem;
      }
    }
  }
</style>
