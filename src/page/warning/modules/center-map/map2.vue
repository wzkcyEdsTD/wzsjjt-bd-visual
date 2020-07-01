<template>
  <div class="image-video-play" :class="{'full':quanpingFlag}">
    <div class="image-video-play-main">
      <div class="image-video-play-title">
        气象雷达
        <div class="image-video-play-tool">
          <div
            class="image-video-play-quanping"
            @click="quanping"
            :class="[quanpingFlag ? 'image-video-play-suoxiao' : '']"></div>
          <div class="image-video-play-close" @click="close"></div>
        </div>
      </div>
      <image-block
        :src="canNotPlay ? '' : (imgList && imgList[currentPlayIndex] && imgList[currentPlayIndex].url ? imgList[currentPlayIndex].url : '')"
        class="image-video-play-img"></image-block>
      <div class="image-video-play-control">
        <div class="control-speed">
          播放速度：
          <div class="control-speed-inner">
            <span
              v-for="(value, index) of speedArr"
              :key="index"
              :class="[currentSpeedIndex === index ? 'current-speed' : '', 'speed-icon']"
              @click="changeSpeed(value, index)">
                {{ value }}
            </span>
          </div>
        </div>
        <el-select
          v-model="yuntuTypeOne"
          class="control-select"
          popper-class="image-video-play-select"
          :popper-append-to-body="appendBody"
          @change="yuntuTypeOneSelect">
          <el-option label="单站雷达图" value="0"></el-option>
          <el-option label="拼图" value="1"></el-option>
        </el-select>
        <el-select
          ref="type0"
          v-show="yuntuTypeOne-0===0"
          v-model="yuntuType"
          class="control-select"
          popper-class="image-video-play-select"
          :popper-append-to-body="appendBody"
          @change="yuntuTypeSelect">
          <el-option
            label="温州"
            value="http://www.wztf121.com/data/images/radar/single/zj_wenzhou.json?rand="></el-option>
          <el-option
            label="杭州"
            value="http://www.wztf121.com/data/images/radar/single/zj_hangzhou.json?rand="></el-option>
          <el-option
            label="宁波"
            value="http://www.wztf121.com/data/images/radar/single/zj_ningbo.json?rand="></el-option>
          <el-option
            label="舟山"
            value="http://www.wztf121.com/data/images/radar/single/zj_zhoushan.json?rand="></el-option>
          <el-option
            label="金华"
            value="http://www.wztf121.com/data/images/radar/single/zj_jinhua.json?rand="></el-option>
          <el-option
            label="福州"
            value="http://www.wztf121.com/data/images/radar/single/zj_fuzhou.json?rand="></el-option>
          <el-option
            label="台湾"
            value="http://www.wztf121.com/data/images/radar/single/zj_taiwan.json?rand="></el-option>
        </el-select>
        <el-select
          ref="type1"
          v-show="yuntuTypeOne-0===1"
          v-model="yuntuType"
          class="control-select"
          popper-class="image-video-play-select"
          :popper-append-to-body="appendBody"
          @change="yuntuTypeSelect">
          <el-option
            label="华东雷达图"
            value="http://www.wztf121.com/data/images/radar/mingle/huadong.json?rand="></el-option>
        </el-select>
        <div class="control-time">
          3个小时
        </div>
      </div>
      <div class="image-video-play-body">
        <div
          class="image-video-play-icon"
          :class="[play ? 'image-video-play-stop' : '']"
          @click="playYuntu"
          :title="play ? '暂停' : '播放'"></div>
        <div class="image-video-play-icon-before" @click="beforeYuntu" title="后退"></div>
        <div class="image-video-play-icon-next" @click="nextYuntu" title="前进"></div>
        <div class="image-video-play-icon-range" ref="myRange">
          <div
            class="image-video-range-item"
            v-for="(value, index) of imgList"
            :key="index"
            :style="{left: (index + 1) * oneImagePercent + '%'}"
            @click="jumpToOtherPlayIndex(index)">
            <div
              class="range-item-hour"
              v-if="(oneImagePercent >= 10 && (index === 0 || (index !== 1 && index % 2 === 1))) || (oneImagePercent > 5 && oneImagePercent < 10 && index % 3 === 1)">
              {{ value.name.substr(8, 2) }}:{{ value.name.substr(10, 2) }}
            </div>
            <div
              class="range-item-day"
              v-if="(oneImagePercent >= 10 && (index === 0 || (index !== 1 && index % 2 === 1))) || (oneImagePercent > 5 && oneImagePercent < 10 && index % 3 === 1)">
              {{ value.name.substr(4, 2) }}月{{ value.name.substr(6, 2) }}日
            </div>
          </div>
          <div
            class="image-video-range-item-current"
            :style="{left: currentPlayIndexLeft + 'px'}"
            v-if="!canNotPlay"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageBlock from './imageBlock'
import { getCommonWeather } from 'api/warning/warning'

export default {
  props: {
    speedArr: {
      type: Array,
      default: function() {
        return ['0.5', '1.0', '1.5', '2.0']
      }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const currentSpeedIndex = this.speedArr.length > 0 ? (this.speedArr.indexOf('1.0') >= 0 ? this.speedArr.indexOf('1.0') : null) : null
    const currentSpeed = currentSpeedIndex !== null ? parseFloat(this.speedArr[currentSpeedIndex]) : null
    return {
      quanpingFlag: false, // 为false最小屏 true为大屏
      currentSpeedIndex: currentSpeedIndex, // 当前播放速度选择的索引
      yuntuTypeOne: '0',
      yuntuType: 'http://www.wztf121.com/data/images/radar/single/zj_wenzhou.json?rand=',
      imgList: [], // 播放的图片列表
      currentSpeed: currentSpeed, // 当前播放速度
      play: false, // false为暂停 true为播放
      currentPlayIndex: 0, // 当前播放图片的索引
      currentPlayIndexLeft: '', // 播放icon的css的left值
      moveCurrentPlayIndexFlag: null, // 移动定时函数的对象
      appendBody: false
    }
  },
  computed: {
    // 不可播放的标志
    canNotPlay() {
      return !this.imgList || this.imgList.length < 0
    },
    // 一张图片占全部图片的比例
    oneImagePercent() {
      if (this.canNotPlay) return 0
      return 100 / (this.imgList.length + 1)
    }
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.initPlay()
      }
    },
    imgList() {
      if (this.isShow) {
        this.initPlay()
      }
    }
  },
  methods: {
    yuntuTypeOneSelect(data) {
      if (data - 0 === 0) {
        this.yuntuType = 'http://www.wztf121.com/data/images/radar/single/zj_wenzhou.json?rand='
      } else if (data - 0 === 1) {
        this.yuntuType = 'http://www.wztf121.com/data/images/radar/mingle/huadong.json?rand='
      }
      this.yuntuTypeSelect()
    },
    getYuntuImg() {
      const url = this.yuntuType + parseInt(Math.random().toFixed(6) * 1000000)
      getCommonWeather(url).then((data) => {
        this.imgList = data.data
      })
    },
    // 全屏展示
    quanping() {
      this.quanpingFlag = !this.quanpingFlag
    },
    // 关闭云图
    close() {
      this.initPlay()
      this.$emit('weatherMap', -1)
    },
    // 改变播放速度
    changeSpeed(value, index) {
      if (index === this.currentSpeedIndex) return
      this.currentSpeedIndex = index
      this.currentSpeed = parseFloat(value)
    },
    // 选择云图类型
    yuntuTypeSelect() {
      this.getYuntuImg()
    },
    // 初始化
    initPlay() {
      this.play = false
      this.currentPlayIndex = 0
      this.currentPlayIndexLeft = (this.currentPlayIndex + 1) * this.oneImagePercent / 100 * this.$refs.myRange.offsetWidth
      this.clearMoveCurrentPlayItem()
    },
    // 播放或者暂停云图
    playYuntu() {
      this.play = !this.play
      if (this.play) {
        // 播放
        this.moveCurrentPlayItem()
      } else {
        // 暂停
        this.clearMoveCurrentPlayItem()
      }
    },
    /* *********************************************** */
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    },
    // 移动动画
    moveCurrentPlayItem() {
      this.moveCurrentPlayIndexFlag = setTimeout(() => {
        const allSpedd = this.$refs.myRange.offsetWidth // 整条距离
        const oneSpeed = this.oneImagePercent / 100 * allSpedd // 一格的距离
        const speed = 0.1 * oneSpeed * parseFloat(this.currentSpeed) // 需要移动的距离
        this.currentPlayIndexLeft += speed
        if (this.currentPlayIndexLeft >= allSpedd) {
          this.initPlay()
        } else {
          this.currentPlayIndex = Math.floor(this.currentPlayIndexLeft / oneSpeed) - 1
          this.moveCurrentPlayItem()
        }
      }, 100)
    },
    // 清除动画
    clearMoveCurrentPlayItem() {
      if (this.moveCurrentPlayIndexFlag) {
        clearTimeout(this.moveCurrentPlayIndexFlag)
        this.moveCurrentPlayIndexFlag = null
      }
    },
    // 后退
    beforeYuntu() {
      this.currentPlayIndex = this.currentPlayIndex <= 0 ? 0 : this.currentPlayIndex - 1
      this.currentPlayIndexLeft = (this.currentPlayIndex + 1) * this.oneImagePercent / 100 * this.$refs.myRange.offsetWidth
    },
    // 前进
    nextYuntu() {
      if (this.currentPlayIndex >= (this.imgList.length - 1)) return
      this.currentPlayIndex++
      this.currentPlayIndexLeft = (this.currentPlayIndex + 1) * this.oneImagePercent / 100 * this.$refs.myRange.offsetWidth
    },
    // 跳转到指定的节点
    jumpToOtherPlayIndex(index) {
      this.currentPlayIndex = index
      this.currentPlayIndexLeft = (this.currentPlayIndex + 1) * this.oneImagePercent / 100 * this.$refs.myRange.offsetWidth
    }
  },
  mounted() {
    this.getYuntuImg()
  },
  components: {
    ImageBlock
  }
}
</script>
<style scoped lang="less">
  .image-video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    width: 10.84rem;
    height: 7.96rem;
    .bg-image('./images/yuntu_bg');
    &.full {
      width: 100%;
      height: 100%;
    }
  }
  .image-video-play-main {
    width: 100%;
    height: 100%;
    padding: 0.38rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .image-video-play-title {
    font-size: 0.22rem;
    width: 100%;
    font-weight: 500;
    color: rgba(255, 231, 64, 1);
    margin-bottom: 0.1rem;
    position: relative;
  }
  .image-video-play-tool {
    position: absolute;
    z-index: 100;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
  }
  .image-video-play-tool .image-video-play-quanping, .image-video-play-tool .image-video-play-close {
    width: 0.26rem;
    height: 0.26rem;
    float: left;
    .bg-image('./images/fangda');
    cursor: pointer;
  }
  .image-video-play-tool .image-video-play-suoxiao {
    .bg-image('./images/suoxiao');
  }
  .image-video-play-tool .image-video-play-close {
    .bg-image('./images/close');
    margin-left: 0.16rem;
  }
  .image-video-play-img {
    width: 100% !important;
    height: 79% !important;
    background-color: #063752;
  }
  .image-video-play-control {
    width: 100%;
    height: 0.32rem;
    border: 0.01rem solid rgba(90, 159, 183, 1);
    padding-right: 0.1rem;
    margin-bottom: 0.1rem;
  }
  .image-video-play-control .control-select {
    float: left;
  }
  .image-video-play-control .control-select, .image-video-play-control .control-select /deep/ .el-input, .image-video-play-control .control-select /deep/ input {
    height: 100%;
    width: 1.7rem;
  }
  .image-video-play-control .control-select /deep/ input {
    background: transparent;
    border: none;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(205, 254, 255, 1);
  }
  .image-video-play-control .control-select /deep/ .el-input__icon {
    line-height: 0.26rem;
    color: rgba(205, 254, 255, 1);
  }
  .image-video-play-control .control-time {
    float: left;
    height: 100%;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(205, 254, 255, 1);
    line-height: 0.3rem;
  }
  .image-video-play-control .control-time:before {
    content: "";
    display: inline-block;
    .bg-image('./images/radio');
    width: 0.14rem;
    height: 0.14rem;
    vertical-align: middle;
  }
  .image-video-play-control .control-speed {
    float: right;
    height: 100%;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(205, 254, 255, 1);
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .control-speed .control-speed-inner {
    padding: 0.03rem 0.05rem;
    background: rgba(0, 30, 46, 1);
    border-radius: 0.13rem;
    display: flex;
    align-items: center;
    height: 0.24rem;
  }
  .control-speed .control-speed-inner .speed-icon {
    display: inline-block;
    margin: 0 0.05rem;
    height: 100%;
    text-align: center;
    line-height: 0.18rem;
    width: 0.4rem;
    color: rgba(205, 254, 255, 1);
    border-radius: 0.09rem;
    cursor: pointer;
  }
  .control-speed .control-speed-inner .current-speed {
    background: linear-gradient(180deg, rgba(129, 229, 253, 1) 0%, rgba(0, 132, 164, 1) 100%);
    color: #fff;
  }
  .image-video-play-body {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    align-items: center;
  }
  .image-video-play-body .image-video-play-icon {
    width: 0.58rem;
    height: 0.58rem;
    /*background: url(../../../assets/monitoring/imageVideo/stop.png) 0 0 no-repeat;*/
    background-size: 100% 100%;
    .bg-image('./images/stop');
    cursor: pointer;
  }
  .image-video-play-body .image-video-play-stop {
    .bg-image('./images/play');
  }
  .image-video-play-body .image-video-play-icon-before, .image-video-play-body .image-video-play-icon-next {
    width: 0.42rem;
    height: 0.42rem;
    .bg-image('./images/before');
    cursor: pointer;
  }
  .image-video-play-body .image-video-play-icon-next {
    .bg-image('./images/next');
  }
  .image-video-play-body .image-video-play-icon-range {
    width: 8.56rem;
    height: 0.16rem;
    background: linear-gradient(90deg, rgba(0, 131, 176, 1) 0%, rgba(10, 80, 105, 1) 100%);
    border-radius: 0.08rem;
    position: relative;
  }
  .image-video-play-body .image-video-play-icon-range .image-video-range-item {
    position: absolute;
    z-index: 10;
    height: 100%;
    width: 0.08rem;
    background: linear-gradient(180deg, rgba(129, 229, 253, 1) 0%, rgba(0, 132, 164, 1) 100%);
    border-radius: 0.04rem;
    transform: translateX(-50%);
    cursor: pointer;
  }
  .image-video-play-body .image-video-play-icon-range .image-video-range-item:hover {
    background: linear-gradient(180deg, rgba(236, 195, 0, 1) 0%, rgba(255, 163, 12, 1) 100%);
  }
  .image-video-range-item .range-item-hour, .image-video-range-item .range-item-day {
    position: absolute;
    left: 50%;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(205, 254, 255, 1);
    white-space: nowrap;
  }
  .image-video-range-item .range-item-hour {
    top: 0;
    transform: translate(-50%, -100%);
  }
  .image-video-range-item .range-item-day {
    transform: translate(-50%, 100%);
    bottom: -0.1rem;
  }
  .image-video-play-body .image-video-play-icon-range .image-video-range-item-current {
    position: absolute;
    z-index: 11;
    height: 100%;
    width: 0.08rem;
    background: linear-gradient(180deg, rgba(236, 195, 0, 1) 0%, rgba(255, 163, 12, 1) 100%);
    border-radius: 0.04rem;
    transform: translateX(-50%);
  }
  .image-video-play-body .image-video-play-icon-range .image-video-range-item-current:before {
    content: "";
    position: absolute;
    z-index: 10;
    width: 0.12rem;
    height: 0.1rem;
    .bg-image('./images/sanjiaoxing');
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
  }
</style>
<style scoped lang="less">
  /deep/ .image-video-play-control {
    .image-video-play-select {
      background: rgba(0, 81, 109, 1) !important;
      border: none !important;
    }
    .image-video-play-select .el-select-dropdown__item {
      padding: 0 10px;
      height: 22px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(205, 254, 255, 1);
      line-height: 22px;
      border-radius: 0;
    }
    .image-video-play-select .el-scrollbar__view {
      padding: 0;
    }
    .image-video-play-select .el-select-dropdown__item.selected {
      color: rgba(0, 81, 109, 1);
      background: rgba(193, 229, 255, 1);
    }
    .image-video-play-select .el-select-dropdown__item.hover {
      background: rgba(193, 229, 255, 1);
      color: rgba(0, 81, 109, 1);
    }
    .image-video-play-select .popper__arrow::after {
      border-bottom-color: rgba(0, 81, 109, 1) !important;
      top: 0 !important;
    }
  }
</style>
