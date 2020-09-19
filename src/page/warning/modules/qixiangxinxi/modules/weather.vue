<template>
  <div class="wrapper flex" v-if="data && data.future3DayList" v-show="isShow">
    <div class="content-lf flex">
      <div class="left-box">
        <img src="./images/temperature.png" alt="">
      </div>
      <div class="right-box flex-1 flex flex-y">
        <span class="big">{{data.future3DayList[0].temp}}℃</span>
        <ul class="flex-1 flex flex-y">
          <li class="icon1 flex-1">
            <div><img src="./images/percent.png"/></div>
            <span><b>{{data.future3DayList[0].humidity}}%</b></span>
          </li>
          <li class="icon2 flex-1">
            <div><img src="./images/rain.png"/></div>
            <span><b>{{data.future3DayList[0].rain}}mm</b></span>
          </li>
          <li class="icon3 flex-1">
            <div><img src="./images/power.png"/></div>
            <span><b>{{data.future3DayList[0].airPressure}}hPa</b></span>
          </li>
          <li class="icon4 flex-1">
            <div><img src="./images/see.png"/></div>
            <span><b>{{data.future3DayList[0].visibility}}m</b></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content-rt flex-1">
      <div class="weather">
        <img
          v-if="data.future24HourList && data.future24HourList[0] && data.future24HourList[0].wpName"
          :style="{left:timePer}"
          :src="'http://www.wz121.com/static/images/icon/s/'+ data.future24HourList[0].wpName +'.png'"/>
        <img
          v-if="data.twentyFourWeather && data.twentyFourWeather[0] && data.twentyFourWeather[0].wpname"
          :style="{left:timePer}"
          :src="'http://www.wz121.com/static/images/icon/s/'+ data.twentyFourWeather[0].wpname +'.png'"/>
      </div>
      <div class="round">
        <div>
          <div :style="{width:timePer}"></div>
        </div>
        <span>{{data.future3DayList[0].windSpeed}}m/s {{data.future3DayList[0].winds}}</span>
      </div>
      <div class="line"></div>
      <div class="bottom">
        <span>{{data.future3DayList[0].sunrise}}am</span>
        <span>{{data.future3DayList[0].sunset}}pm</span>
      </div>
    </div>
  </div>
  <div class="relative" v-else-if="isShow && isKong">
    <Kong v-show="true"></Kong>
  </div>
</template>

<script>
import { getWeatherReport, forwardPost } from 'api/warning/warning'
import Kong from 'components/noData/noData'
import { mapGetters } from 'vuex'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Kong
  },
  data() {
    return {
      data: {},
      monitor: null,
      isKong: false,
      monitorTime: 1000 * 60
    }
  },
  computed: {
    timePer() {
      const startArr = this.data.future3DayList[0].sunrise.split(':')
      const endArr = this.data.future3DayList[0].sunset.split(':')
      const start = (startArr[0] - 0) * 60 + (startArr[1] - 0)
      const end = (endArr[0] - 0) * 60 + (endArr[1] - 0)
      const dTime = new Date()
      const current = dTime.getHours() * 60 + dTime.getMinutes()
      if (current >= end) {
        return '100%'
      } else if (current <= start) {
        return '0%'
      } else {
        return (current - start) / (end - start) * 100 + '%'
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.initData()
    this.monitor = setInterval(() => {
      this.initData()
    }, this.monitorTime)
  },
  beforeDestroy() {
    clearInterval(this.monitor)
  },
  methods: {
    initData() {
      // getWeatherReport().then(data => {
      //   if (data && data.length) {
      //     this.isKong = false
      //   } else {
      //     this.isKong = true
      //   }
      //   this.data = data
      // })
      // return
      const districtName = this.userInfo.districtName.slice(0, 2)
      if (districtName === '洞头' || districtName === '永嘉' || districtName === '乐清' || districtName === '瑞安' || districtName === '文成' || districtName === '平阳' || districtName === '苍南' || districtName === '泰顺') {
        let stationId = ''
        switch (districtName) {
          case '洞头':
            stationId = 58760
            break
          case '永嘉':
            stationId = 58658
            break
          case '乐清':
            stationId = 58656
            break
          case '瑞安':
            stationId = 58752
            break
          case '文成':
            stationId = 58750
            break
          case '平阳':
            stationId = 58751
            break
          case '苍南':
            stationId = 58755
            break
          case '泰顺':
            stationId = 58746
            break
        }
        forwardPost({
          url: 'http://www.wz121.com/ts/chartweb/changeData',
          state: 'city',
          stationId
        }).then(data => {
          if (data && data.length) {
            this.isKong = false
          } else {
            this.isKong = true
          }
          if (data.future3DayList) {
            data.future3DayList[0].rain = data.future3DayList[0].rains || '0.0'
          }
          this.data = data
        })
      } else {
        getWeatherReport().then(data => {
          if (data && data.length) {
            this.isKong = false
          } else {
            this.isKong = true
          }
          this.data = data
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .relative {
    height: 100%;
  }
  .wrapper {
    .content-lf {
      width: 52%;
      position: relative;
      &:before {
        content: '';
        display: block;
        width: 0.02rem;
        background: rgba(56, 203, 218, 0.5);
        height: 75%;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
      .left-box {
        width: 40%;
        position: relative;
        > img {
          position: absolute;
          top: 45%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 0.42rem;
          height: 1.85rem;
          max-width: 100%;
          max-height: 100%;
        }
      }
      .right-box {
        color: #fff;
        font-size: 0;
        .big {
          height: 0.38rem;
          font-size: 0.24rem;
          padding-top: 0.1rem;
          font-weight: 600;
          line-height: 0.38rem;
        }
        > ul {
          width: 100%;
          padding: 0.1rem 0 0.35rem 0;
          > li {
            width: 100%;
            position: relative;
            font-size: 0.16rem;
            > span {
              display: block;
              width: 100%;
              padding-left: 0.32rem;
              height: 100%;
              position: relative;
              > b {
                font-weight: 400;
                position: absolute;
                top: 50%;
                left: 0.32rem;
                transform: translate(0, -50%);
              }
            }
            > div {
              width: 0.24rem;
              height: 0.24rem;
              position: absolute;
              top: 50%;
              left: 0;
              transform: translate(0, -50%);
              > img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
          .icon1 {
            width: 0.24rem;
            height: 0.24rem;
          }
          .icon2 {
            width: 0.23rem;
            height: 0.2rem;
          }
          .icon3 {
            width: 0.23rem;
            height: 0.23rem;
          }
          .icon3 {
            width: 0.18rem;
            height: 0.18rem;
          }
        }
      }
    }
    .content-rt {
      font-size: 0;
      .weather {
        width: 1.4rem;
        margin: 0.7rem auto 0.1rem;
        > img {
          width: 0.26rem;
          height: 0.26rem;
          margin-left: -0.13rem;
          position: relative;
        }
      }
      .round {
        width: 100%;
        height: 0.7rem;
        overflow: hidden;
        position: relative;
        > span {
          color: #fff;
          position: absolute;
          bottom: 0.1rem;
          left: 50%;
          display: block;
          transform: translate(-50%, 0);
          font-size: 0.12rem;
        }
        > div {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;
          border: 0.02rem solid #35d0e9;
          background-color: rgba(0, 255, 255, 0.2);
          margin: auto;
          overflow: hidden;
          > div {
            height: 100%;
            background-color: #08a9dd;
            /*border-right: 0.02rem solid #68dffc;*/
            position: relative;
            &:before {
              content: '';
              height: 100%;
              background: #68dffc;
              width: 0.02rem;
              position: absolute;
              right: -0.02rem;
              bottom: 0;
            }
          }
        }
      }
      .line {
        width: 1.8rem;
        margin: auto;
        background: -webkit-gradient(linear, right top, left top, from(#35d0e9), to(#478cf3));
        /*background: linear-gradient(right, #35d0e9, #478cf3);*/
        /*background: -webkit-linear-gradient(right, #35d0e9, #478cf3);*/
        height: 0.04rem;
        border-radius: 0.02rem;
      }
      .bottom {
        width: 1.4rem;
        margin: 0.1rem auto 0;
        color: #fff;
        position: relative;
        font-size: 0.14rem;
        height: 0.14rem;
        > span {
          width: 0.7rem;
          position: absolute;
          display: block;
          top: 0;
          text-align: center;
        }
        > span:first-child {
          left: -0.35rem;
        }
        > span:last-child {
          right: -0.35rem;
        }
      }
    }
  }
  @media screen and (max-height: 1000px) {
    .wrapper .content-lf .left-box > img {
      width: 0.4rem;
      height: 1.7rem;
    }
    .wrapper .content-lf .right-box > ul {
      padding-bottom: 0.25rem;
    }
    .wrapper .content-rt .weather {
      margin: 0.4rem auto 0.1rem;
    }
  }

</style>
