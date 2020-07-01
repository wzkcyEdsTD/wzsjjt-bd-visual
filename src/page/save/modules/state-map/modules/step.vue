<template>
  <div class="steps">
    <div class="lb-box" id="lb-1" v-show="listCount.index!==2">
      <!-- 轮播内容 -->
      <div class="lb-content" @mouseenter="mouseChange(true)" @mouseleave="mouseChange(false)">
        <div class="lb-item"></div>
        <div class="lb-item"></div>
        <div class="lb-item"></div>
      </div>
      <!-- 轮播标志 -->
      <ol class="lb-sign flex" @mouseenter="mouseChange(true)" @mouseleave="mouseChange(false)">
        <li v-for="(item,index1) in data" :key="index1" class="flex-1">
          <dl>
            <dt :class="{active2:index===index1}" @click="changeActive(index1)"></dt>
            <dd>{{item.name}}</dd>
          </dl>
        </li>
      </ol>
      <!-- 轮播控件 -->
      <div class="lb-ctrl left" @click="changeIndex(-1)">＜</div>
      <div class="lb-ctrl right" @click="changeIndex(1)">＞</div>
      <div class="lb-ctrl sos" :class="{'play':!isPlay}" @click="controlActive"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'SaveMapSteps',
  props: {
    data: {
      type: Array,
      default() {
        return [
        ]
      }
    },
    index: {
      type: Number,
      default: 0
    },
    listCount: {
      type: Object,
      default() {
        return {}
      }
    },
    isEnter: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data(val) {
      this.isPlay = false
      this.controlActive()
    },
    isEnter(val) {
      if (val) {
        clearInterval(this.inter)
      } else {
        if (this.isPlay) {
          this.startActive()
        } else {
          clearInterval(this.inter)
        }
      }
    }
  },
  data() {
    return {
      isPlay: true
    }
  },
  mounted() {
    this.startActive()
  },
  computed: {
    getName() {
      return this.data[this.index].name.split('(个)')[0]
    },
    ...mapState({
      'stepName': state => state.stateM.stepName
    })
  },
  methods: {
    ...mapActions('stateM', ['SetStepName']),
    mouseChange(bool) {
      if (bool) {
        this.$emit('mouseenter')
      } else {
        this.$emit('mouseleave')
      }
    },
    changeActive(index) {
      this.$emit('changeTimeDataIndex', index)
    },
    changeIndex(index) {
      let num = this.index + index
      if (num >= this.data.length) {
        num = 0
        this.changeTab(this.listCount.index)
      } else if (num <= -1) {
        num = this.data.length - 1
      }
      if (this.listCount.index === 2) {
        num = 0
        this.changeTab(this.listCount.index)
      }
      this.changeActive(num)
    },
    // 修改tab类
    changeTab(num) {
      if (num < this.listCount.count - 1) {
        num += 1
      } else {
        num = 0
      }
      this.$emit('listChange', num)
    },
    // 开始播放
    startActive() {
      if (this.inter) clearInterval(this.inter)
      this.inter = setInterval(() => {
        // console.log('开始播放')
        this.changeIndex(1)
      }, 200000)
    },
    // 播放/暂停按钮
    controlActive() {
      if (this.isPlay) {
        clearInterval(this.inter)
        this.isPlay = !this.isPlay
      } else {
        this.startActive()
        this.isPlay = !this.isPlay
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.inter)
  }
}
</script>

<style scoped lang="less">
  body {
    background-color: #252525;
  }
  .lb-box {
    width: 100%;
    height: 0.9rem;
    margin: 0.15rem auto;
    position: relative;
  }
  @media (max-width: 568px) {
    .lb-box {
      width: 76%;
      height: 2.2rem;
    }
  }
  .lb-content {
    color: #ffffff;
  }
  .lb-item {
    width: 100%;
    height: 100%;
    display: none;
  }
  .lb-item > a {
    width: 100%;
    height: 100%;
    display: block;
  }
  .lb-item > a > img {
    width: 100%;
    height: 100%;
  }
  .lb-item > a > span {
    width: 100%;
    display: block;
    bottom: 0;
    padding: 0.15rem;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
  }
  @media (max-width: 568px) {
    .lb-item > a > span {
      padding: 0.1rem;
    }
  }
  .lb-item.active {
    display: block;
    left: 0%;
  }
  .lb-item.active.left {
    left: -100%;
  }
  .lb-item.active.right {
    left: 100%;
  }
  /*  */
  .lb-item.next,
  .lb-item.prev {
    display: block;
    top: 0;
  }
  .lb-item.next {
    left: 100%;
  }
  .lb-item.prev {
    left: -100%;
  }
  .lb-item.next.left,
  .lb-item.prev.right {
    left: 0%;
  }
  .lb-sign {
    margin: auto;
    right: 0.1rem;
    top: 0.35rem;
    padding: 0.05rem 0.03rem;
    border-radius: 0.06rem;
    list-style: none;
    /*user-select: none;*/
    width: 95%;
    position: relative;
  }
  .lb-sign li {
    font-size: 0.16rem;
    font-weight: 500;
    line-height: 0.2rem;
    text-align: center;
    float: left;
    color: #ffffff;
    width: 33.33%;
  }
  .lb-sign li dl {
    width: auto;
    position: relative;
    &:before {
      content: '';
      display: block;
      width: 100%;
      height: 0.01rem;
      background: rgba(255, 255, 255, 0.3);
      top: 0.08rem;
      position: absolute;
      left: 0;
      z-index: -1;
    }
  }
  .lb-sign li:first-child dl:before {
    left: 50%;
    width: 50%;
  }
  .lb-sign li:last-child dl:before {
    width: 50%;
  }
  dt {
    cursor: pointer;
    border-radius: 50%;
    background: #181d22;
    margin: auto;
    width: 0.16rem;
    height: 0.16rem;
    border: 0.02rem #0380b9 solid;
  }
  .lb-sign li dd {
    margin: 0;
    line-height: 0.2rem;
    font-size: 0.16rem;
    margin-top: 0.05rem;
  }
  .lb-sign li:hover {
    color: #fff;
  }
  // .lb-sign dt.active {
  //   color: #000;
  //   background: -webkit-radial-gradient(#e40304, #b1080d, #68121b);
  // }
  .lb-ctrl {
    top: 0.45rem;
    transform: translateY(-50%);
    font-size: 0.24rem;
    font-weight: 900;
    /*user-select: none;*/
    background-color: rgba(0, 0, 0, 0);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 0.05rem;
    cursor: pointer;
    transition: all 0.1s linear;
  }
  @media (max-width: 568px) {
    .lb-ctrl {
      font-size: 0.18rem;
    }
  }
  .lb-ctrl.left {
    left: 0.15rem;
    position: absolute;
  }
  .lb-ctrl.right {
    right: 0.35rem;
    position: absolute;
  }
  .lb-ctrl.sos {
    left: -0.2rem;
    top: 0.48rem;
    position: absolute;
    width: 0.22rem;
    height: 0.22rem;
    background-image: url("../images/start.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .lb-ctrl.sos.play {
    background-image: url("../images/stop.png");
  }
  .active2 {
    background: #ffffff;
    // background: #68121b;
  }
  .steps {
    transform: translate(-50%, 0);
    width: 100%;
  }
  @media screen and (min-height: 1620px) {
  .steps {
    width: 120%;
    bottom: -12%;
  }
  }
</style>
