<template>
  <div class="page-not-found">
    <div class="box">
      <span class="tip">Error，页面出错啦！！ 请点击返回首页或者后退页面~</span>
      <div class="btn-group">
        <span class="btn" @click="home">返回首页</span>
        <span class="btn" @click="back">后退</span>
      </div>
    </div>
  </div>
</template>
<script>
import loading from '../mixins/loading'

export default {
  mixins: [loading],
  mounted() {
  },
  methods: {
    home() {
      this.$router.push('/')
    },
    back() {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="less">
  .page-not-found {
    text-align: center;
    color: #fff;
    .box {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10%;
      transform: translate(-50%, -50%);
      .tip {
        font-size: 0.3rem;
      }
      .btn-group {
        margin-top: 0.4rem;
        .btn {
          display: inline-block;
          background: #fff;
          color: #333;
          width: 1rem;
          height: 0.4rem;
          line-height: 0.4rem;
          cursor: pointer;
          margin: 0 0.2rem;
          font-size: 0.16rem;
        }
      }
    }
  }
</style>
