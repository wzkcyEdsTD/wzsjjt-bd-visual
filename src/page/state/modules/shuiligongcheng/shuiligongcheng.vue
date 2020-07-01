/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="水利工程"></ItemTitle>
    <!-- <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位:处
      </div>
    </div> -->

    <div class="echarts-box flex-1">
      <div class="item flex flex-y">
        <echartLeft class="flex-1"></echartLeft>
      </div>
      <div class="item flex flex-y">
        <echartRight class="flex-1"></echartRight>
        <!-- <div class="eca">
        <div class="bg1">
          <img src="./images/outside_lane.png" alt />
        </div>
        <div class="bg2">
          <img src="../../images/img-yuan2.png" alt width="55" />
        </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import echartLeft from "./echart02-left";
import echartRight from "./echart02-right";

export default {
  name: "Echart3",
  components: {
    ItemTitle,
    echartLeft,
    echartRight
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.item-ind {
  color: #fff;
  font-size: 0.14rem;
  display: block;
  padding: 0 0.1rem;
  margin-top: 0.3rem;
  position: absolute;
  top: 12px;
  right: 10px;
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
.echarts-box {
  height: 100%;
  // .eca{
  //   position: relative;
  // }
  // .bg1,
  // .bg2 {
  //   position: absolute;
  //   top: -168px;
  //   left: 58px;
  // }
  // .bg2 {
  //   top: -142px;
  //   left: 85px;
  // }

  .item {
    float: left;
    width: 50%;
    height: 100%;
    .title {
      min-width: 1.5rem;
      text-align: center;
      height: 0.3rem;
      line-height: 0.28rem;
      padding: 0 0.1rem;
      font-size: 0.12rem;
      color: @color-text;
      .bg-image("../../images/img-kuang");
      margin: 0.1rem auto;
      .danger {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-danger");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .video {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-video");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .bold {
        padding: 0 0.05rem;
        color: #0dd5f4;
        font-weight: bold;
      }
    }
  }
}
.wrapper{
  position: relative;
}
.tip-box {
  text-align: right;
  position: absolute;
  right: -0.1rem;
  top: 0.15rem;
  .item {
    color: #fff;
    font-size: 0.16rem;
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

</style>
