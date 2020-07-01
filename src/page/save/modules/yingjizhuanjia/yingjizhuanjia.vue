<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="应急专家"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位:人
      </div>
    </div>
    <echart01left class="flex-1"/>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import echart01left from './echart01_left'

export default {
  components: {
    ItemTitle,
    echart01left
  }
}
</script>

<style lang="less" scoped>
  .wrapper{
    position: relative;
  }
  .tip-box {
    text-align: right;
    position: absolute;
    right: 0;
    top: 0.55rem;
    .item {
      color: #fff;
      font-size: 0.14rem;
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
