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
            :key="value+index">
            <div class="maquee_div1 maquee_public" ref="acp11">{{value.name}}</div>
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
        <div class="tip_white">
          <!-- {{result}} -->
          {{resultList[currentIndex].bot1}}
        </div>
        <div class="tip_yellow">
          <!-- {{result}} -->
          {{resultList[currentIndex].top1}}{{resultList[currentIndex].unit1}}
        </div>
        <div class="tip_white">
          <!-- {{result}} -->
          {{resultList[currentIndex].bot2}}
        </div>
        <div class="tip_yellow">
          <!-- {{result}} -->
          {{resultList[currentIndex].top2}}{{resultList[currentIndex].unit2}}
        </div>
        <div class="tip_white">
          <!-- {{result}} -->
          {{resultList[currentIndex].bot3}}
        </div>
        <div class="tip_yellow">
          <!-- {{result}} -->
          {{resultList[currentIndex].top3?resultList[currentIndex].top3.toFixed(2):resultList[currentIndex].top3}}{{resultList[currentIndex].unit3}}
        </div>
        <!-- 总面积 -->
        <div class="tip_white" v-show="currentIndex==4 || currentIndex==5">
          <!-- {{result}} -->
          总面积
        </div>
        <div class="tip_yellow" v-show="currentIndex==4 || currentIndex==5">
          <!-- {{result}} -->
          {{(resultList[currentIndex].sum_area&&resultList[currentIndex].sum_area.toFixed(2)) || 0}}平方千米
        </div>
      </div>
      <!-- <div class="tip_1" v-if="currentIndex==0 || currentIndex==1 || currentIndex==2">
        <div class="tip_white">
          隐患治理状态
        </div>
        <div class="tip_yellow">
          治理中
          {{resultList[currentIndex].top4}}个
        </div>
        <div class="tip_yellow">
          治理完成
          {{resultList[currentIndex].top5}}个
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapActions } from 'vuex'
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
          top4: 36,
          top5: 320,
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
          top4: 36,
          top5: 320,
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
          top4: 36,
          top5: 320,
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
        }
      ],
      navList: [],
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
    }
  },
  mounted() {
    getnatural().then(res => {
      if (!res) {
        return
      }
      this.navList = res.categoryViews.filter(val => {
        return val.name !== '小流域' && val.name !== '山洪沟'
      });
      this.resultList[0].top1 = this.navList[0].disasterInfo.sum_threat_num;
      this.resultList[0].top2 = this.navList[0].disasterInfo.sum_population;
      this.resultList[0].top3 = this.navList[0].disasterInfo.sum_threat;
      this.resultList[0].top4 = this.navList[0].disasterInfo.during;
      this.resultList[0].top5 = this.navList[0].disasterInfo.complete;
      this.resultList[1].top1 = this.navList[1].disasterInfo.sum_threat_num;
      this.resultList[1].top2 = this.navList[1].disasterInfo.sum_population;
      this.resultList[1].top3 = this.navList[1].disasterInfo.sum_threat;
      this.resultList[1].top4 = this.navList[1].disasterInfo.during;
      this.resultList[1].top5 = this.navList[1].disasterInfo.complete;
      this.resultList[2].top1 = this.navList[2].disasterInfo.sum_threat_num;
      this.resultList[2].top2 = this.navList[2].disasterInfo.sum_population;
      this.resultList[2].top3 = this.navList[2].disasterInfo.sum_threat;
      this.resultList[2].top4 = this.navList[2].disasterInfo.during;
      this.resultList[2].top5 = this.navList[2].disasterInfo.complete;
      this.resultList[3].top1 = this.navList[3].disasterInfo.sum_house;
      this.resultList[3].top2 = this.navList[3].disasterInfo.sum_people;
      this.resultList[3].top3 = this.navList[3].disasterInfo.sum_property;
      // this.resultList[4].top1 = this.navList[4].disasterInfo.village_count; // 行政村
      // this.resultList[4].top2 = this.navList[4].disasterInfo.street_count; // 乡镇
      // this.resultList[4].top3 = this.navList[4].disasterInfo.total_river_length;
      // this.resultList[4].sum_area = this.navList[4].disasterInfo.sum_area;
      // this.resultList[5].top1 = this.navList[5].disasterInfo.village_count;
      // this.resultList[5].top2 = this.navList[5].disasterInfo.street_count;
      // this.resultList[5].top3 = this.navList[5].disasterInfo.sum_length;
      // this.resultList[5].top4 = this.navList[5].disasterInfo.sum_area;
      // this.resultList[5].sum_area = this.navList[5].disasterInfo.sum_area;
      this.startTimer()
    })
    // $('#' + this.myUuid).on({
    //   mouseover: () => {
    //     this.scrollDestroyHandler()
    //   },
    //   mouseout: () => {
    //     this.scrollStartHandler()
    //   },
    //   scroll: () => {
    //     this.scrollTop = $('#' + this.myUuid)[0].scrollTop
    //   }
    // })
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
