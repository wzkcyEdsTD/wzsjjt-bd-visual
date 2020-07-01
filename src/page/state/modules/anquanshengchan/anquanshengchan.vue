/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="安全生产"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div>
    <div class="relative">
      <div class="text-box-wrapper">
        <ul class="text-list">
          <li @click="fourColorClickme(dataList[selectIndex].name)">一级风险源
            ({{dataList[selectIndex].riskLevelViewList&&dataList[selectIndex].riskLevelViewList[0].value}})
          </li>
          <li @click="fourColorClickme(dataList[selectIndex].name)">二级风险源
            ({{dataList[selectIndex].riskLevelViewList&&dataList[selectIndex].riskLevelViewList[1].value}})
          </li>
          <li @click="fourColorClickme(dataList[selectIndex].name)">三级风险源
            ({{dataList[selectIndex].riskLevelViewList&&dataList[selectIndex].riskLevelViewList[2].value}})
          </li>
          <li @click="fourColorClickme(dataList[selectIndex].name)">四级风险源
            ({{dataList[selectIndex].riskLevelViewList&&dataList[selectIndex].riskLevelViewList[3].value}})
          </li>
        </ul>
        <div class="camera-total">
          <h6>监测设备总数</h6>
          <p>在线 {{onlineTotal || 0}} </p>
          <p>报警 {{warnTotal || 0}} </p>
        </div>
      </div>
      <div class="echart">
        <div class="e_wrap" :class="[{three: isThree, four: !isThree}, 'active' + selectIndex]">
          <div
            class="wz"
            :class="{active: selectIndex === index}"
            v-for='(item, index) in dataList'
            :key='"wz" + index'
            @mouseleave="startTimer"
            @mouseenter="highLight(index)"
            @click="clickme(item.name)">{{item.name}}
          </div>
          <!-- <div class="wz1" :class="{active: a}" @click="clickme(dataList[0].name)">{{dataList[0].name}}</div>
          <div class="wz2" @click="clickme(dataList[1].name)">{{dataList[1].name}}</div>
          <div class="wz3" @click="clickme(dataList[2].name)">{{dataList[2].name}}</div>
          <div class="wz4" @click="clickme(dataList[3].name)">{{dataList[3].name}}</div> -->
          <div
            class="sz"
            :class="{active: selectIndex === index}"
            v-for='(item, index) in dataList'
            :key='"sz" + index'
            @mouseleave="startTimer"
            @mouseenter="highLight(index)"
            @click="clickme(item.name)">{{item.totalCount}}
          </div>
          <!-- <div class="sz1" @click="clickme(dataList[0].name)">{{dataList[0].value}}</div>
          <div class="sz2" @click="clickme(dataList[1].name)">{{dataList[1].value}}</div>
          <div class="sz3" @click="clickme(dataList[2].name)">{{dataList[2].value}}</div>
          <div class="sz4" @click="clickme(dataList[3].name)">{{dataList[3].value}}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'
import { getSafeProduce } from "@/api/state/safeProduce";
import { getRiskLevel } from "@/api/state/RiskLevel";
import { getVideoInfo, getDistrictAndTypeInfo } from 'api/warning/warning'
import ItemTitle from "../item-title/item-title";

export default {
  components: {
    ItemTitle,
  },
  data() {
    return {
      echart: null,
      dataList: [{ name: '0', value: '0' }, { name: '0', value: '0' }, { name: '0', value: '0' }, {
        name: '0',
        value: '0'
      }],
      onlineTotal: 0,
      warnTotal: '',
      safeList: [
        {
          first: 74,
          second: 28,
          third: 52,
          fourth: 32,
          online: 89,
          warn: 24
        },
        {
          first: 45,
          second: 28,
          third: 29,
          fourth: 23,
          online: 77,
          warn: 32
        },
        {
          first: 24,
          second: 21,
          third: 52,
          fourth: 14,
          online: 63,
          warn: 21
        },
        {
          first: 34,
          second: 13,
          third: 12,
          fourth: 25,
          online: 45,
          warn: 12
        }
      ],
      selectIndex: 0,
      timer: null,
      total: 0,
      isThree: false
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    
  },
  mounted() {
     
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.selectIndex >= this.dataList.length - 1) {
          this.selectIndex = 0
        } else {
          this.selectIndex += 1
        }
      }, 4000)
    },
    stopTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    // 获取视频信息
    getVideoData() {
      this.loadingFlag = true
      var total = 0
      getVideoInfo(this.xqValue === 'quanshi' ? '' : this.xqValue)
        .then(res => {
          console.log(res)
          res.forEach(val => {
            this.onlineTotal += val.total
          })

        })
    },
    // 获取区县列表
    getXqTypeList() {
      getDistrictAndTypeInfo()
        .then(res => {
          const xq = res.districtInfo
          xq.unshift({
            code: 'quanshi',
            name: '全市'
          })
          this.xqList = xq
          this.xqValue = xq[0].code
        })
    },
    fourColorClickme(key) {
      if (key) {
        this.SetFourColorSpecalTreeName(key)
      } else {
        this.SetFourColorSpecalTreeName()
      }
      this.$router.push('/map')
    },
    ...mapActions('map', ['SetSpecalTreeName', 'SetFourColorSpecalTreeName', 'clickme']),
    // 鼠标移动高亮
    highLight(index) {
      this.selectIndex = index
      this.stopTimer()
    }
  },
  created() {
    if (this.$store.state.userInfo.district === '3303') {
      // 判断是否是温州市区
      this.getVideoData()
      this.getXqTypeList()
    } else {
      this.xqValue = this.$store.state.userInfo.district
      this.getVideoData()
    }
    if (this.userInfo.districtName === '平阳县') {
      this.isThree = true
    }
    console.log(this.userInfo.districtName)
    getRiskLevel().then(res => {
      // this.onlineTotal = res.onlineTotal
      this.warnTotal = res.warnTotal
      if (res.childList) {
        let list = this.isThree ? res.childList.slice(0, 3) : res.childList.slice(0, 4)
        console.log(list)
        list.forEach(val => {
          val.list = {}
          console.log(val)
          val.riskLevelViewList.sort((a, b) => {
            return  a.name - b.name
          })
        })
        this.dataList = list
        this.$nextTick(() => {
          this.startTimer()
        })
      }
    })
    // getSafeProduce().then(
    //   res => {
    //     this.dataList = res.categoryViews
    //     this.total = res.totalCount
    //     this.$nextTick(() => {
    //       this.startTimer()
    //     })
    //   }
    // );
  },
  beforeDestroy() {
    this.stopTimer()
  }
};
</script>
<style scoped lang="less">
  .wrapper {
    position: relative;
    .tip-box {
      text-align: right;
      position: absolute;
      right: 0;
      top: 0.15rem;
      .item {
        color: #fff;
        font-size: 0.14rem;
        display: block;
        padding: 0 0.1rem;
        margin-top: 0.3rem;
        .icon {
          .bg-image('../../images/img-blue');
          width: 0.1rem;
          height: 0.11rem;
          display: inline-block;
          &.orange {
            .bg-image('../../images/img-orange');
          }
        }
      }
    }
    .text-box-wrapper {
      width: 1.8rem;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
      padding-top: 0.6rem;
      padding-left: 0.2rem;
      .text-list {
        width: 1.5rem;
        text-align: center;
        cursor: pointer;
        li {
          width: 100%;
          height: 0.3rem;
          line-height: 0.3rem;
          padding-left: 0.2rem;
          text-align: left;
          background: url('./images/primary_risk.png') no-repeat;
          background-position-y: calc((0.3rem - 16px) / 2);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        li:nth-child(2) {
          background-image: url('./images/second_risk.png');
        }
        li:nth-child(3) {
          background-image: url('./images/third_risk.png');
        }
        li:nth-child(4) {
          background-image: url('./images/fourth_risk.png');
        }
      }
      .camera-total {
        width: 1.5rem;
        height: 1.0rem;
        margin-top: 0.2rem;
        background: url('./images/safe_frame.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 0.25rem;
        padding-top: 12px;
      }
    }
    .echart {
      height: 100%;
      width: 100%;
      padding-left: 1.8rem;
    }
    .e_wrap {
      width: 2.73rem;
      height: 2.4rem;
      position: relative;
      margin-top: -0.3rem;
    }
    .e_wrap.four{
      background: url('./images/windmill.png') no-repeat 0.5rem 0.38rem;
    }
    .e_wrap.three {
      background: url('./images/windmill.png') no-repeat 0.5rem 0.38rem;
    }
    .e_wrap.active0 {
      background: url('./images/light_blue.png') no-repeat 0.5rem 0.38rem;
    }
    .three.active0{
      background: url('./images/windmill_blue.png') no-repeat 0.5rem 0.38rem;
    }
    .e_wrap.active1 {
      background: url('./images/dark_blue.png') no-repeat 0.5rem 0.38rem;
    }
    .three.active1 {
      background: url('./images/windmill_yellow.png') no-repeat 0.5rem 0.38rem;
    }
    .e_wrap.active2 {
      background: url('./images/orange.png') no-repeat 0.5rem 0.38rem;
    }
    .three.active2 {
      background: url('./images/windmill_orange.png') no-repeat 0.5rem 0.38rem;
    }
    .e_wrap.active3 {
      background: url('./images/yellow.png') no-repeat 0.5rem 0.38rem;
    }
    .wz, .sz {
      color: white;
      font-size: 0.16rem;
      position: absolute;
      cursor: pointer;
      z-index: 9;
    }
    .sz {
      text-align: center;
      display: inline-block;
      width: 0.5rem;
      cursor: pointer;
    }
    .wz:nth-child(1) {
      left: 0.20rem;
      top: 0.15rem;
    }
    .wz.active:nth-child(1) {
      color: #00ddff;
    }
    .wz.active:nth-child(2) {
      color: #27aaff;
    }
    .wz.active:nth-child(3) {
      color: #f19c4a;
    }
    .wz.active:nth-child(4) {
      color: #ffcf00;
    }
    .wz:nth-child(2) {
      left: 2.30rem;
      top: 0.22rem;
    }
    .three .wz.active:nth-child(2) {
      color: yellow;
    }
    .three .wz:nth-child(2) {
      left: 2.30rem;
      top: 1.52rem;
    }
    .wz:nth-child(3) {
      left: 0.1rem;
      top: 2.1rem
    }
    .wz:nth-child(4) {
      width: 0.5rem;
      left: 2.3rem;
      top: 2rem;
    }
    .three .sz:nth-child(4) {
      left: 0.78rem;
      top: 0.69rem;
    }
    .three .sz:nth-child(5) {
      left: 1.78rem;
      top: 1.1rem;
    }
    .three .sz:nth-child(6){
      left: 0.85rem;
      top: 1.68rem;
    }
    .sz:nth-child(5) {
      left: 0.82rem;
      top: 0.69rem;
    }
    .sz:nth-child(6) {
      left: 1.63rem;
      top: 0.8rem;
    }
    .sz:nth-child(7) {
      left: 0.71rem;
      top: 1.5rem;
    }
    .sz:nth-child(8) {
      left: 1.51rem;
      top: 1.58rem;
    }
    @media screen and (min-height: 1050px) {
      .echart {
        margin-top: 0.8rem;
      }
    }
    @media screen and (max-height: 1050px) {
      .e_wrap {
        margin-top: 0.4rem;
      }
      .text-box-wrapper .camera-total {
        margin-top: 0rem;
      }
      .text-box-wrapper {
        padding-top: 0.5rem;
      }
      .wz:nth-child(4) {
        top: 1.8rem;
      }
    }
  }
</style>
