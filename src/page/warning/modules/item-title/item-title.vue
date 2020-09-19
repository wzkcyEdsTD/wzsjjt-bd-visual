<template>
  <div class="item-title">
    <div class="tit-img"></div>
    <div class="tit-font">
      <span>{{title}}</span>
      <span v-if="num.length">(<b :style="{'color':color}">{{num}}</b>)</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    num: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#0ed6f5'
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .input-with-select.el-input.el-input-group.el-input-group--append {
    width: 1.1rem;
    float: right;
    margin-right: 0.5rem;
    height: 0.24rem;
    margin-top: 0.06rem;
    /deep/ .el-input-group__append {
      padding-left: 0.01rem;
      padding-right: 0.01rem;
      background: transparent;
      border-color: #43bafe;
    }
    .el-input__inner {
      background: transparent;
      border-color: #43bafe;
      color: #fff;
      height:0.24rem;
    }
    button {
      background: transparent;
      color: #43bafe;
      // padding-left: 0.01rem;
      // padding-right: 0.01rem;
    }
  }
  /deep/ .el-input-group--append .el-input__inner, .el-input-group__prepend {
    height: 0.3rem;
  }
  .item-title {
    width: 100%;
    height: 0.35rem;
    .bg-image('./images/bg');
  }
  .tit-img {
    margin-left: 0.1rem;
    margin-top: 0.1rem;
    margin-right: 0.1rem;
    width: 0.03rem;
    height: 0.15rem;
    float: left;
    .bg-image('./images/bg-title');
  }
  .tit-font {
    color: white;
    font-size: 0.18rem;
    line-height: 0.35rem;
    height: 0.35rem;
    font-weight: 700;
    > span {
      float: left;
      display: block;
    }
  }
</style>
