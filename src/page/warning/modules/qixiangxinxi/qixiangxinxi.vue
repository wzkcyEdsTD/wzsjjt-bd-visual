<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="气象信息"></ItemTitle>
    <div class="title-btn-group">
      <span :key="index" v-for="(item,index) in titleList" @click="changeMap(index)">
        {{item.name}}
        <div v-if="index===0" class="weather_grid current">
          <el-radio-group v-model="radio">
            <el-radio :label="1" @click.native.prevent="clickitem(1)">未来1小时</el-radio>
            <el-radio :label="3" @click.native.prevent="clickitem(3)">未来3小时</el-radio>
            <el-radio :label="6" @click.native.prevent="clickitem(6)">未来6小时</el-radio>
          </el-radio-group>
          <!-- <div class="close" @click="close"></div> -->
        </div>
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
        <Typhoon :isShow="headListIndex===2"></Typhoon>
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

export default {
  name: 'MeteorologicalMonitor',
  data() {
    return {
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
      clickTime1: 1
    }
  },
  methods: {
    changeHeadListIndex(index) {
      this.headListIndex = index
    },
    changeMap(index) {
      this.$emit('weatherMap', index)
      if (index === 0) {
        this.isHide = !this.isHide
      }
    },
    clickitem(e) {
      // console.log('this.radio: ' + this.radio)
      // console.log('e: ' + JSON.stringify(e))
      e === this.radio ? this.radio = '' : this.radio = e
      this.$bus.emit('valueDelete', e)
    },
    // changeWeather(val) {
    //   val === this.radio ? this.radio = '' : this.radio = val
    //   this.$bus.emit('valueChanged', val)
    // },
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
