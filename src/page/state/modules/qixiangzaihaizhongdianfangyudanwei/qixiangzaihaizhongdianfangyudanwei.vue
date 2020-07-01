/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="气象灾害重点防御单位"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/家
      </div>
    </div>
    <div class="echarts-box flex-1">
      <div class="item flex flex-y" id="le">
        <echartLeft class="flex-1" id="le1" :total='total'></echartLeft>
      </div>
      <div class="item flex flex-y" id="ri">
        <echartRight class="flex-1" :navList='dataList'></echartRight>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from '../item-title/item-title'
import echartLeft from './echart06-left'
import echartRight from './echart06-right'
import {getMeteLogByUser} from 'api/state/state'

export default {
  name: 'Echart6',
  components: {
    ItemTitle,
    echartLeft,
    echartRight
  },
  data() {
    return {
      dataList: [],
      total: 0
    }
  },
  mounted() {
    getMeteLogByUser().then(res => {
      this.dataList = res
      res.forEach(val => {
        this.total += val.value
      })
    })
  }
}
</script>
<style scoped lang="less">
.echarts-box {
  height: 100%;
  #le {
    width: 40%;
  }
  #ri {
    width: 60%;
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
    #ri1 {
      width: 100%;
    }
  }
}
.wrapper{
position: relative;}
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
    margin-top: 0.25rem;
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
