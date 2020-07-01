<template>
  <div class="total">
    <div class="tot_title">总数</div>
    <div
      class="tot_num"
      :class="{'number-item': !isNaN(item), 'mark-item': isNaN(item) }"
      v-for="(item,index) in orderNum"
      :key="index">
        <span v-if="!isNaN(item)">
          <i ref="numberItem">0123456789</i>
        </span>
      <span class="comma" v-else>{{item}}</span>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      orderNum: [0, 0, 0, 0, 0, 0] // 默认订单总数
    }
  },
  watch: {
    total() {
      this.change()
    }
  },
  mounted() {
    this.change()
  },
  methods: {
    change() {
      setTimeout(() => {
        this.toOrderNum(this.total)
      }, 500)
    },
    // 设置文字滚动
    setNumberTransform() {
      const numberItems = this.$refs.numberItem // 拿到数字的ref，计算元素数量
      const numberArr = this.orderNum.filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },
    // 处理总订单数字
    toOrderNum(num) {
      num = num.toString()
      // 把订单数变成字符串
      if (num.length < 6) {
        num = '0' + num // 如未满八位数，添加"0"补位
        this.toOrderNum(num) // 递归添加"0"补位
      } else if (num.length === 6) {
        // 订单数中加入逗号
        // num = num.slice(0, 2) + ',' + num.slice(2, 5) + ',' + num.slice(5, 8)
        this.orderNum = num.split('') // 将其便变成数据，渲染至滚动数组
      } else {
        // 订单总量数字超过八位显示异常
        this.$message.warning('总量数字过大')
      }
      this.setNumberTransform()
    }
  }
}
</script>
<style scoped lang="less">
  /* 默认逗号设置 */
  .mark-item {
    width: 0.1rem;
    height: 1rem;
    margin-right: 0.05rem;
    line-height: 0.1rem;
    font-size: 0.48rem;
    position: relative;
    & > span {
      position: absolute;
      width: 100%;
      bottom: 0;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }
  }
  /*滚动数字设置*/
  .number-item {
    width: 0.41rem;
    height: 0.75rem;
    /* 背景图片 */
    //   background: green;
    //   background-size: 100% 100%;
    // background: #ccc;
    list-style: none;
    margin-right: 0.05rem;
    // background:rgba(250,250,250,1);
    //   border-radius: 0.04rem;
    //   border: 1px solid rgba(221, 221, 221, 1);
    & > span {
      position: relative;
      display: inline-block;
      margin-right: 0.1rem;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
      & > i {
        font-style: normal;
        position: absolute;
        top: 0.04rem;
        left: 50%;
        transform: translate(-50%, 0);
        transition: transform 1s ease-in-out;
        letter-spacing: 0.1rem;
        font-family:Digital-7Mono;
        font-size:0.35rem;
      }
    }
  }
  .number-item:last-child {
    margin-right: 0;
  }
  .tot_title,
  .tot_num {
    float: left;
    font-size: 0.32rem;
    height: 0.5rem;
    line-height: 0.5rem;
    margin-right: 0.15rem;
    margin-left: 0.2rem;
  }
  .tot_title{
    background-image:-webkit-linear-gradient(bottom,#3faeff,#bae6ff);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    font-weight: bold;
  }
  .tot_num {
    width: 0.3rem;
    height: 0.4rem;
    margin-top: 0.05rem;
    line-height: 0.4rem;
    .bg-image("../images/total_frame");
    color: #ffffff;
    margin-right: 0.1rem;
    margin-left: 0rem;
  }
  .total {
    width: 3.5rem;
    height: 0.5rem;
    background: none;
    .bg-image("../images/num_bg");
  }
</style>
