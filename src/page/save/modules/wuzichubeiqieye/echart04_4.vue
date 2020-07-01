<template>
  <div class="wrapper flex flex-y">
    <div class="goods">
      <div class="goods_content">
        <!--/*运输企业开始 -->
        <h3 class="tit">
          <img src="./img/goods_sub.png"/>
          <span @click="clickme('运输企业')" style="cursor: pointer">
            运输企业
            <b style="color: #24a1dd;font-weight: 600">（&nbsp;{{data.transportCount}}&nbsp;家&nbsp;）</b>
          </span>
          <img src="./img/goods_sub.png"/>
        </h3>
        <div class="content_wrap2 public">
          <div class="w1">
            <span>
              日运输能力
              <b>{{data.transportAbility}}（吨）</b>
            </span>
          </div>
          <div class="w1">
            <span>
              运输车辆(船舶)数量
              <b>{{data.transportCarNum}}（艘）</b>
            </span>
          </div>
        </div>
      </div>

      <!-- <ol class="activeOL"></ol> -->
    </div>
  </div>
</template>
<script>

import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
}

</script>
<style scoped lang='less'>
  .wrapper {
    h3 {
      font-weight: 400;
      margin-bottom: 0.15rem;
      margin-top: 0.15rem;
      height: 0.3rem;
      text-align: center;
      font-size: 0.16rem;
    }
    .echart-box {
      width: 100%;
      height: 100%;
    }
    .goods {
      width: 4.4rem;
      height: 3.2rem;
      color: #fff;
    }
    span {
      color: #fff;
      line-height: 0.25rem;
    }
    .goods_content {
      height: 100%;
      width: 100%;
      margin: auto;
      // margin-top: 0.55rem;
    }
    .content_wrap1 {
      width: 4.8rem;
      height: 1rem;
    }
    .public h3 {
      width: 4.5rem;
      font-weight: 400;
      height: 0.25rem;
      line-height: 0.3rem;
      text-align: center;
      letter-spacing: 0.05rem;
      // margin-top: 0.15rem;
      font-size: 0.16rem;
      font-weight: 400;
    }
    .content_wrap1 img {
      vertical-align: middle;
    }
    .content_wrap1 b {
      color: #24a1dd;
      font-weight: 600;
    }
    .content_wrap1 span {
      margin-left: 0.15rem;
    }
    .content_wrap2 span{
      margin-left: 0;
      padding-left: 0.2rem;
      background: url('./img/dot.png') no-repeat;
      background-size: 0.15rem;
      background-position: 0px;
      display: flex;
      justify-content: space-between;
    }
    .content_module {
      width: 100%;
    }
    .content_module {
      width: 32.5%;
      margin-top: 0.1rem;
      float: left;
    }
    .content_top {
      width: 100%
    }
    .module_01 {
      float: left;
      margin-top: 0.05rem;
    }
    .module_02 {
      float: left;
      line-height: 0.25rem;
    }
    .module_02 dd {
      font-size: 0.16rem;
    }
    .module_02 dt {
      font-size: 0.16rem;
    }
    .module_01 img {
      display: block;
    }
    .content_wrap2 {
      width: 4.45rem;
      background-image: url("./img/frame_01.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 0px;
      font-size: 0.16rem;
      margin-top: 0px;
      margin-left: 2%;
      padding-top: 0.18rem;
      padding-bottom: 0.2rem;
      margin-top: 0.1rem;
    }
    //   .content_wrap2 div {
    //   }
    .module_02 dt {
      color: #fffbb7;
    }
    .content_wrap2 b {
      color: #fffbb7;
      margin-left: 0.1rem;
      margin-right: 0.1rem;
    }
    .content_wrap2 h3 {
      margin-top: 0px;
    }
    ol li {
      display: inline;
      margin: 0px 0px 0px 0.03rem;
    }
    #tit1 {
      width: 4.82rem;
    }
    .w1 {
      width: 3.26rem;
      margin-left: 6%;
      font-size: 0.16rem;
      margin: 0 auto;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      padding-bottom: 0.1rem;
    }
    b {
      color: #fffbb7;
      font-weight: 500;
    }
    h3 span {
      margin-left: 0.12rem;
      margin-right: 0.15rem;
    }
  }
  @media screen and (max-height: 1078px) {
    .wrapper .content_module {
      margin-top: 0;
    }
    .wrapper .content_wrap1 {
      height: 0.8rem;
    }
    .wrapper .content_wrap2 {
      margin-top: 0;
      padding-top: 0.1rem;
      background-size: 100% 100%;
    }
  }
</style>
