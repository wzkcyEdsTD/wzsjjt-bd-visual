/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="海洋渔业"></ItemTitle>

<!--    <div class="tip-box">-->
<!--      <div class="item-spc">-->
<!--        <span class="icon orange"></span>-->
<!--        单位/个-->
<!--      </div>-->
<!--    </div>-->
    <div class="_wrap flex-1">
<!--      <div class="tit">-->
<!--        <div class="icon12">-->
<!--          <img class="img_icon" src="./images/sea.png" alt />-->
<!--        </div>-->
<!--        <div class="title">-->
<!--          <span>-->
<!--            渔船数量-->
<!--            <b class="bold">37</b>个-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
      <div class="ce_left" @click="clickme('渔港')" style="cursor: pointer">
        <div class="online">
          <i>{{total1 || 0}}</i>
        </div>
        <div>
          <div class="item">
            <span class="icon green"></span>
            渔港(个)
          </div>
        </div>
      </div>
      <div class="ce_left" @click="toBoat" style="cursor: pointer">
        <div class="outline">
          <i>{{online || 0}}/{{total || 0}}</i>
        </div>
        <div>
          <div class="item boot">
            <span class="icon orange"></span>
            渔船在线数/总数(只)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { getfishBoot, getFishPort } from 'api/state/state';
import {mapActions} from "vuex";
import { getJCYJMenuOrder } from 'api/warning/warning'
export default {
  name: "Echart12",
  components: {
    ItemTitle
  },
  methods: {
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    toBoat() {
      if (this.index >= 0) {
        this.$router.push({path: '/warning'})
        this.SetCurrentPoints('yuchuanjiance')
      }
    },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme']),
    ...mapActions('warning', ['SetCurrentPoints'])
  },
  data() {
    return {
      echart: null,
      total: 0,
      online: 0,
      total1: 0,
      index: -1
    };
  },
  created() {
    getJCYJMenuOrder().then(res => {
      this.index = res.findIndex(val => {
        return val.vueUrl === 'yuchuanjiance'
      })
    })
    getfishBoot().then(res => {
      this.total = res.total
      this.online = res.online
    })
    getFishPort().then(res => {
      this.total1 = res
    })
  }
};
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  .tip-box {
    text-align: right;
    position: absolute;
    right: 0;
    top: 0.45rem;
    .item-spc {
      color: #fff;
      font-size: 0.14rem;
      display: block;
      padding: 0 0.1rem;
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
  ._wrap {
    width: 100%;
    height: 100%;
  }
  .img_icon{
    display: block;
  }
  .tit {
    width: 100%;
    height: 0.50rem;
    margin-top: 0.5rem;
  }
  .title {
    float: left;
    width: 1.27rem;
    min-width: 1.50rem;
    text-align: center;
    height: 0.30rem;
    line-height: 0.28rem;
    padding: 0 0.10rem;
    font-size: 0.16rem;
    color: @color-text;
    .bg-image("../../images/img-kuang");
    margin: 0.07rem auto;
    margin-left: 0.10rem;
    .bold {
      padding: 0 0.05rem;
      color: #0dd5f4;
      font-weight: bold;
    }
  }
  .icon12 {
    width: 0.40rem;
    float: left;
    margin-top: 0.08rem;
    margin-left: 1.28rem;
  }
  .ce_left {
    width: 1.73rem;
    height: 1.60rem;
    margin-left: 0.35rem;
    margin-top: 0.9rem;
    float: left;
  }
  .online,.outline{
    height: 1.28rem;
    background: url("./images/state_online.png") no-repeat 0.10rem -0.10rem;
    position: relative;
  }
  .outline{
    background: url("./images/state_outline.png") no-repeat 0.10rem -0.10rem;
  }
  i {
    width: 100%;
    color: #01ddff;
    position: absolute;
    font-weight: 600;
    /*left: 0.54rem;*/
    top: 0.13rem;
    font-size: 0.24rem;
    text-align: center;
    letter-spacing: 0.05rem;
  }
  .item {
    color: #fff;
    font-size: 0.16rem;
    display: block;
    padding: 0 0.10rem;
    margin-left: 0.7rem;
    margin-top:0.3rem;
    position: relative;
    &.boot{
      margin-left: 0;
    }
    .icon {
      /*<!--.bg-image("../../images/img-blue");-->*/
      width: 0.25rem;
      height: 0.25rem;
      display: inline-block;
      margin-right: 0.08rem;
      position: absolute;
      left: -0.25rem;
      bottom: -0.04rem;
      &.green {
        background: url("./images/icon_on.png") no-repeat;
        background-size: 95%;
      }
      &.orange {
        background: url("./images/icon_out.png") no-repeat;
        background-size: 100%;
      }
    }
  }
  @media screen and (min-height:950px){
    .ce_left {
      margin-top:1rem;
    }
  }
  @media screen and (max-height: 1050px) {
    .item {
      margin-top:0.1rem;
    }
  }
  @media screen and (min-height: 1620px) {
  .li_1{
    left:32%;
  }
  .ce_left{
    margin-left: 0.6rem;
    margin-top: 0.2rem;
  }
  .online{
    background-size: 65%;
  }
  .outline{
    background-size: 65%;
  }
  .item{
    margin-left: 0.2rem;
    margin-top: 0rem;
  }
  }
}
//大屏适配
@media screen and (min-width: 5000px) {
.wrapper {
 .ce_left{
   margin-left: 0.3rem;
   margin-top: 0.9rem;
 }
  i{
    width: 90%;
  }
  .online{
    background-size: 80%;
  }
  .outline{
    background-size: 80%;
  }
  .item{
    margin-left: 0.55rem;
    margin-top: 0.2rem;
  }
}
}
</style>
