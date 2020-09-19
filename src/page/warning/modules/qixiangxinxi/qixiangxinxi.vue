<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="气象信息"></ItemTitle>
    <div class="title-btn-group">
      <span
        :class="{'active':index === titleActiveIndex}"
        :key="index"
        v-for="(item,index) in titleList"
        @click="changeMap(index)">
        {{item.name}}
        <div v-if="index===0" class="weather_grid current">
          <el-radio-group v-model="radio">
            <el-radio :label="1" @click.native.prevent="clickitem(1)">未来1小时</el-radio>
            <el-radio :label="3" @click.native.prevent="clickitem(3)">未来3小时</el-radio>
            <el-radio :label="6" @click.native.prevent="clickitem(6)">未来6小时</el-radio>
            <el-radio :label="0" @click.native.prevent="clickitem(0)">短时临近预报</el-radio>
          </el-radio-group>
          <!-- <div class="close" @click="close"></div> -->
        </div>
        <!-- <div v-if="index===3" class="weather_grid current weather_grid_right"> -->
        <!-- <el-radio-group v-model="radioRainfall">
          <el-radio :label="1" @click.native.prevent="clickRainfall(1,'OneRain')">1小时</el-radio>
          <el-radio :label="3" @click.native.prevent="clickRainfall(3,'ThreeRain')">3小时</el-radio>
          <el-radio :label="6" @click.native.prevent="clickRainfall(6,'SixRain')">6小时</el-radio>
          <el-radio :label="12" @click.native.prevent="clickRainfall(12,'TweleveRain')">12小时</el-radio>
          <el-radio :label="24" @click.native.prevent="clickRainfall(24,'DayRain')">24小时</el-radio>
          <el-radio :label="48" @click.native.prevent="clickRainfall(48,'TwoDayRain')">48小时</el-radio>
          <el-radio :label="72" @click.native.prevent="clickRainfall(72,'ThreeDayRain')">72小时</el-radio>
        </el-radio-group> -->
        <!-- <div class="close" @click="close"></div> -->
        <!-- </div> -->
      </span>
    </div>
    <div class="flex-1 flex flex-y">
      <div class="header-wrapper">
        <span
          :class="{'active':headListIndex === index}"
          :key="index"
          v-for="(item,index) in headList"
          @click="changeHeadListIndex(index)"
        >{{item.name}}</span>
      </div>
      <div class="flex-1">
        <Weather :isShow="headListIndex===0"></Weather>
        <Warning ref="warning" :isShow="headListIndex===1"></Warning>
        <Typhoon ref="typhoon" :isShow="headListIndex===2"></Typhoon>
        <div :isShow="headListIndex===2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import Weather from './modules/weather'
import Warning from './modules/warning'
import Typhoon from './modules/typhoon'
import { forwardAFileAll } from 'api/warning/warning'

export default {
  name: 'MeteorologicalMonitor',
  data() {
    return {
      titleActiveIndex: -1,
      titleList: [
        { name: '气象预测' },
        { name: '卫星云图' },
        { name: '气象雷达' },
        { name: '降雨分布' }
      ],
      headList: [
        { name: '天气实况' },
        { name: '预警信息' },
        { name: '台风信息' }
      ],
      headListIndex: 0,
      isHide: false,
      radio: '',
      radioRainfall: '',
      clickTime1: 1
    }
  },
  mounted() {
    this.$bus.on('clearTyphoon', _ => {
      this.radioRainfall = ''
    })
    this.$bus.on('clearQixiangyuce', (val) => {
      this.radio = ''
    })
  },
  methods: {
    changeHeadListIndex(index) {
      this.headListIndex = index
    },
    clearAll() {
      if (this.radioRainfall !== '') {
        this.radioRainfall = ''
        this.$bus.emit('valueDeleteRain', {
          img: '',
          checked: this.radioRainfall !== ''
        })
      }
      if (this.radio !== '') {
        this.$bus.emit('valueDelete', this.radio)
        this.radio = ''
      }
      // 清除降雨
      // console.log('清除降雨')
      this.$bus.emit('rainMap', [])
      this.$bus.emit('valueDeleteRain', {
        img: '',
        checked: false
      })
      this.$bus.emit('clearYunTu')
      this.titleActiveIndex = -1
    },
    changeMap(index) {
      console.log(index)
      if (index === 1 || index === 2) {
        if (this.radioRainfall !== '') {
          this.radioRainfall = ''
          this.$bus.emit('valueDeleteRain', {
            img: '',
            checked: this.radioRainfall !== ''
          })
        }
        if (this.radio !== '') {
          this.$bus.emit('valueDelete', this.radio)
          this.radio = ''
        }
        if (this.titleActiveIndex === index) {
          this.titleActiveIndex = -1
        } else {
          this.titleActiveIndex = index
        }
      }
      if (index !== 3) {
        this.$emit('weatherMap', [index, this.titleActiveIndex])
      }
      if (index === 0 || index === 3) {
        this.isHide = !this.isHide
      }
      // 降雨分布
      if (index === 3) {
        // console.log('this.titleActiveIndex: ' + this.titleActiveIndex)
        if (this.titleActiveIndex === 3) {
          // 清除图层
          this.titleActiveIndex = -1
          this.$bus.emit('rainMap', [])
          this.$bus.emit('valueDeleteRain', {
            img: '',
            checked: false
          })
        } else {
          this.titleActiveIndex = 3
          this.$bus.emit('rainMap', [
            {
              num: 1,
              value: 'OneRain'
            },
            {
              num: 3,
              value: 'ThreeRain'
            },
            {
              num: 6,
              value: 'SixRain'
            },
            {
              num: 12,
              value: 'TweleveRain'
            },
            {
              num: 24,
              value: 'DayRain'
            },
            {
              num: 48,
              value: 'TwoDayRain'
            },
            {
              num: 72,
              value: 'ThreeDayRain'
            }
          ])
        }
      } else if (index === 1 || index === 2) {
        this.$bus.emit('rainMap', [])
        this.$bus.emit('valueDeleteRain', {
          img: '',
          checked: false
        })
      }
    },
    clickitem(e) {
      this.$bus.emit('rainMap', [])
      this.$bus.emit('valueDeleteRain', {
        img: '',
        checked: false
      })
      this.$bus.emit('clearYunTu')
      if (this.radioRainfall !== '') {
        this.radioRainfall = ''
        this.$bus.emit('valueDeleteRain', {
          img: '',
          checked: this.radioRainfall !== ''
        })
      }
      this.$bus.emit('clearTyphoon')
      e === this.radio ? this.radio = '' : this.radio = e
      if (this.radio !== '') {
        this.titleActiveIndex = 0
      } else {
        this.titleActiveIndex = -1
      }
      this.$bus.emit('valueDelete', e)
      // console.log('this.radio: ' + this.radio)
      // console.log('e: ' + JSON.stringify(e))
    },
    clickRainfall(e, value) {
      // console.log('e: ' + e + ', value: ' + value)
      this.$bus.emit('clearYunTu')
      if (this.radio !== '') {
        this.$bus.emit('valueDelete', this.radio)
        this.radio = ''
      }
      // this.$bus.emit('clearTyphoon')
      e === this.radioRainfall ? this.radioRainfall = '' : this.radioRainfall = e
      if (this.radioRainfall !== '') {
        this.titleActiveIndex = 3
      } else {
        this.titleActiveIndex = -1
      }
      const bigDate = new Date().getTime() - 60 * 1000 * 60
      const date = new Date(bigDate)
      const y = date.getFullYear().toString().slice(2)
      let m = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      h = h < 10 ? '0' + h : h
      const dateStr = y + m + d + h
      const imgUrl = 'http://ecapi.wztf121.com/product//area/zhejiang/wenzhou/image/' + value + '/' + dateStr + '/' + dateStr + '_opacite.png'
      forwardAFileAll(imgUrl).then(data => {
        const obj = {
          img: 'data:image/png;base64,' + data,
          checked: this.radioRainfall !== ''
        }
        this.$bus.emit('valueDeleteRain', obj)
      })
    },
    close() {
      this.isHide = false
      this.$bus.emit('close', -1)
    }
  },
  components: {
    ItemTitle,
    Weather,
    Warning,
    Typhoon
  }
}
</script>

<style lang="less" scoped>
  .title-btn-group > span:hover {
    .weather_grid {
      display: block;
    }
  }
  .weather_grid {
    position: absolute;
    z-index: 100000;
    top: 0.32rem;
    /*left: 1.6rem;*/
    left: 0;
    width: 1.2rem;
    border: 0.01rem solid #00a0e9;
    padding: 0.15rem 0 0.1rem 0.1rem;
    border-radius: 0.08rem;
    background-color: rgba(5, 18, 39, 0.9);
    box-shadow: rgba(8, 169, 221, 0.6) 0px 0px 10px inset;
    display: none;
    &.weather_grid_right {
      left: auto;
      right: 0;
    }
    .el-radio {
      color: #fff;
      margin: 0.05rem 0;
    }
    .close {
      color: #ffffff;
      font-size: 0.14rem;
      position: absolute;
      top: 1px;
      right: 1px;
      cursor: pointer;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('./modules/images/close');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      &:hover {
        transform: rotate(45deg);
      }
    }
  }
  .wrapper {
    position: relative;
    height: 100%;
    .title-btn-group {
      position: absolute;
      top: 0;
      right: 0;
      height: 0.35rem;
      line-height: 0.35rem;
      font-size: 0.14rem;
      margin-right: 0.05rem;
      color: #fff;
      z-index: 9;
      > span {
        font-size: 0.14rem;
        float: left;
        font-weight: 600;
        margin-left: 0.2rem;
        position: relative;
        display: block;
        cursor: pointer;
        &:before {
          content: '';
          display: block;
          width: 0.02rem;
          height: 0.18rem;
          background: #fff;
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
          left: -0.1rem;
        }
        &:first-child:before {
          display: none;
        }
        &.active {
          color: #0ed6f5;
        }
      }
    }
    .header-wrapper {
      width: 100%;
      text-align: center;
      margin-top: 0.15rem;
      color: #fff;
      font-size: 0.14rem;
      > span {
        margin-left: 0.1rem;
        cursor: pointer;
        &:first-child {
          margin-left: 0;
        }
        &.active {
          color: #0ed6f5;
        }
      }
    }
  }
  @keyframes mymove {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .current {
    animation: mymove 1s alternate;
    -webkit-animation: mymove 1s alternate; /* Safari and Chrome */
  }
</style>
