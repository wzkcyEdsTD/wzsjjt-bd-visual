/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' :title="'自然灾害'"></ItemTitle>
    <div class="echarts-box flex-1">
      <div class="item flex flex-y" id="ri">
        <echartLeft class="flex-1" id="ri1"></echartLeft>
      </div>
      <!-- <div class="item flex flex-y" id="le">
        <echartRight class="flex-1"></echartRight>
      </div> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from '../item-title/item-title'
import echartLeft from './echart04-left3'
import echartRight from './echart04-right'

export default {
  name: 'Echart3',
  components: {
    ItemTitle,
    echartLeft,
    echartRight
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">
  .echarts-box {
    height: 100%;
    // #le{
    //     width: 100%;
    // }
    #ri{
        width: 100%;
    }
    .item {
      float: left;
      width: 60%;
      height: 100%;
      .title {
        min-width: 1.5rem;
        text-align: center;
        height: 0.3rem;
        line-height: 0.28rem;
        padding: 0 0.1rem;
        font-size: 0.12rem;
        color: @color-text;
        .bg-image('../../images/img-kuang');
        margin: 0.1rem auto;
        .danger {
          width: 0.12rem;
          height: 0.12rem;
          .bg-image('../../images/icon-danger');
          display: inline-block;
          margin-right: 0.05rem;
        }
        .video {
          width: 0.12rem;
          height: 0.12rem;
          .bg-image('../../images/icon-video');
          display: inline-block;
          margin-right: 0.05rem;
        }
        .bold {
          padding: 0 0.05rem;
          color: #0dd5f4;
          font-weight: bold;
        }
      }
      #ri1{
          width: 100%;
          height: 80%;
      }
    }
  }
</style>