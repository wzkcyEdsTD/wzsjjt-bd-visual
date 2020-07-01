<template>
  <div class="image-block">
    <img :src="src" :style="{ 'transform': scaleValue }" ref="img">
    <div class="image-block-tool" v-if="useTool">
      <div class="scale-big tool-button" v-if="useBig" title="放大" @click="scaleBig"></div>
      <div class="scale-small tool-button" v-if="useSmall" title="缩小" @click="scaleSmall"></div>
      <div class="scale-choose tool-button" v-if="useScaleChoose" @click="quanping"></div>
      <div class="scale-text tool-button" v-if="useBig || useSmall">{{ scaleArr[currentScaleIndex] }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    scaleArr: { // 放大缩小的比例列表
      type: Array,
      default: function() {
        return ['50%', '71%', '100%', '140%', '196%', '274%', '384%', '400%']
      }
    },
    useTool: { // 是否使用工具类
      type: Boolean,
      default: true
    },
    useBig: { // 是否使用放大
      type: Boolean,
      default: true
    },
    useSmall: { // 是否使用缩小
      type: Boolean,
      default: true
    },
    useScaleChoose: { // 是否使用比例选择
      type: Boolean,
      default: true
    }
  },
  data() {
    const currentScaleIndex = this.scaleArr.indexOf('100%')
    return {
      currentScaleIndex: currentScaleIndex // 当前放大比例的索引
    }
  },
  computed: {
    scaleValue() {
      const value = parseFloat(this.scaleArr[this.currentScaleIndex])
      if (!value) return 'scale(1)'
      return `scale(${value / 100})`
    }
  },
  methods: {
    // 绑定滚轮事件
    attachRollerHandler(dom) {
      const vm = this

      function scrollFunc(e) {
        e = e || window.event
        if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) { // 当滑轮向上滚动时
            vm.scaleBig()
          }
          if (e.wheelDelta < 0) { // 当滑轮向下滚动时
            vm.scaleSmall()
          }
        } else if (e.detail) { // Firefox滑轮事件
          if (e.detail > 0) { // 当滑轮向下滚动时
            vm.scaleSmall()
          }
          if (e.detail < 0) { // 当滑轮向上滚动时
            vm.scaleBig()
          }
        }
      }

      // IE、Opera注册事件
      if (document.attachEvent) {
        dom.attachEvent('onmousewheel', scrollFunc)
      } else if (document.addEventListener) { // Firefox使用addEventListener添加滚轮事件
        dom.addEventListener('DOMMouseScroll', scrollFunc, false)
      }
      dom.onmousewheel = scrollFunc // Safari与Chrome属于同一类型
    },
    scaleBig() {
      this.currentScaleIndex++
      if (this.currentScaleIndex >= this.scaleArr.length) this.currentScaleIndex = this.scaleArr.length - 1 // 超过最大时
    },
    scaleSmall() {
      this.currentScaleIndex--
      if (this.currentScaleIndex < 0) this.currentScaleIndex = 0 // 超过最小时
    },
    quanping() {
      this.currentScaleIndex = this.scaleArr.indexOf('100%')
    }
  },
  created() {
  },
  mounted() {
    this.attachRollerHandler(this.$refs.img)
  }
}
</script>
<style scoped>
  .image-block {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
  }
  .image-block img {
    object-fit: contain;
    border: none;
    padding: 0;
  }
  .image-block-tool {
    position: absolute;
    z-index: 100;
    top: 10px;
    right: 10px;
    border: 0px;
    background-repeat: repeat-x;
    height: 26px;
    background: url(./images/image_tool_bg.png);
    line-height: 26px;
    padding-left: 10px;
  }
  .image-block-tool .tool-button {
    width: 24px;
    height: 24px;
    margin: 0 2px 0 2px;
    border: 0px;
    cursor: pointer;
    background-position: center center;
    background-repeat: no-repeat;
    float: left;
  }
  .image-block-tool .scale-big {
    background: url(./images/tool.png) no-repeat 0px 0px;
  }
  .image-block-tool .scale-small {
    background: url(./images/tool.png) no-repeat 0px -24px;
  }
  .image-block-tool .scale-choose {
    background: url(./images/tool.png) no-repeat 0px -48px;
  }
  .image-block-tool .scale-text {
    color: white;
    width: 40px;
    line-height: 25px;
    text-align: center;
    font-size: 0.14rem;
  }
</style>
