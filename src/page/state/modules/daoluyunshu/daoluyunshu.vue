/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="道路运输"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div>
    <div class="pictu flex-1">
      <div class="roadTran flex-1" :class="{yongjia: isYongJia}">
        <ul class="left">
           <!-- @click="jumpMap(item.name)" -->
          <li class="left" v-for="(item, index) in leftDataList" :key='index' @click="jumpMap(item.name)">{{item.name}}<span>{{item.value}}</span></li>
          <!-- <li>多大的撒大安达市大多<span>55223</span></li> -->
        </ul>
        <ul class="right">
          <li class="right" v-for="(item, index) in rightDataList" :key='index' @click="jumpMap(item.name)">{{item.name}}<span>{{item.value}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// <link href="style.css" rel="stylesheet" type="text/css" />;
// <link href="css/cartoon.css" rel="stylesheet" type="text/css" />;
import './style.css'
import './css/cartoon.css'
import ItemTitle from "../item-title/item-title";
import { getRoad, getRoadMainByUserRA, getRoadMainByUserRCQ } from "@/api/state/Road";
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Echart6",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      isYongJia: false,
      leftDataList: [{ name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }],
      rightDataList: [{ name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }]
    };
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    jumpMap(name) {
      this.SetSpecalTreeName(name)
      this.$router.push('/map')
    },
    ...mapActions('map', [
      'SetSpecalTreeName'
    ])
  },
  created() {
    if (this.userInfo.districtName === '瑞安市') {
      getRoadMainByUserRA().then(res => {
        const dataList = res.categoryViews.slice(0, 10)
        this.leftDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 ===0
        })
        this.rightDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 !==0
        })
      })
    } else if (this.userInfo.districtName === '鹿城区') {
      getRoadMainByUserRCQ().then(res => {
        const dataList = res.categoryViews.slice(0, 10)
        this.leftDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 ===0
        })
        this.rightDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 !==0
        })
      })
    } else {
      getRoad().then(res => {
        if (this.userInfo.districtName === '永嘉县' || this.userInfo.districtName === '平阳县') {
          this.isYongJia = true
          res.categoryViews = res.categoryViews.filter(val => {
            return val.name !== '市域轨道站点'
          })
        }
        const dataList = res.categoryViews.slice(0, 10)
        this.leftDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 ===0
        })
        this.rightDataList = dataList.filter((v, i) => {
          return (i + 1) % 2 !==0
        })
      })
    }
  }
};
</script>

<style scoped lang='less'>
  .roadTran{
    background:url(web/light_bg.gif);
    width:100%;
    background-size:120%;
    background-position-y: -80px;
    background-position-x: -50px;
    background-repeat:no-repeat;
    margin-top:0.5rem;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: space-between;
    ul{
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 2.2rem;
      justify-content: space-between;
      align-content: space-between;
      // align-items: center; 
      li{
        height: 0.4rem;
        display: inline-block;
        background: url('./images/title_left.png') no-repeat;
        padding-left: 0.35rem;
        line-height: 0.28rem;
        cursor: pointer;
        // margin-top: 0.1rem;
        span{
          color:#00d2ff;
          margin-left: 0.15rem;
          font-weight: 600;
        }
      }
    }
  }
  // .yongjia ul li {
  //   height: 0.5rem;
  //   &:nth-child(n + 5){
  //     text-align: right;
  //     background: url('./images/titile_right.png') no-repeat;
  //     background-position: top right;
  //     padding-right: 0.35rem;
  //   }
  // }
  ul>li.right{
    text-align: right;
    background: url('./images/titile_right.png') no-repeat;
    background-position: top right;
    padding-right: 0.35rem;
    margin-top:0.05rem !important;
    height: 0.3rem;
  }
  @media screen and (min-height: 1050px) {
    .roadTran{
      margin-top:0.05rem;
     background-position-y: -20px;
      ul{
        margin-top:0.7rem;
        height: 2.4rem;
        li{
          height: 0.4rem;
          margin-top: 0.1rem;
        }
      }
    }
  }

  .wrap {
    width:2rem;
    height:2rem;
    padding-top: 0.2rem;
    right:0;
    bottom:0;
    margin:auto;
    transform-style:preserve-3d;
    position:relative
  }
  .wrap h3{
    position:absolute;
    top:1.2rem;
    left:0.7rem;
    color:#ffe400;
    font-weight:600;
    font-size: 0.18rem;
  }
  #earth {
    position:absolute;
    z-index: 4;
    width:1rem;
    height:1rem;
    border-radius:1.8rem;
    overflow:hidden;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border:0.01rem solid #00cbff;
    box-shadow: 0 0 0.1rem 0.05rem rgba(119,216,255,0.4);
    background-size:1.28rem 1.28rem;
    background-repeat:no-repeat;
    background-position: -0.14rem -0.14rem;
    animation-timing-function: linear;
    background-image:url(web/circular.png);
  }


  #earthGravity {
    position:absolute;
    height:0.5rem;
    width:0.5rem;
    top:calc(50% - 0.25rem);
    left:calc(50% - 0.25rem);
    animation-timing-function: linear;
    z-index:0;
  }

  #earth dl{
    margin:auto;
    font-size:0.16rem;
    margin-top:0.3rem;
    margin-left:0rem;
    text-align:center;
    font-weight:500}
  #earth dd{
    color:#ffffff;
    font-size:0.15rem}
  #earth dt{
    color:#04dbf5;
    font-size:0.18rem;
    margin-top: 0.02rem}
  .wrapper{
    position: relative;
  }
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

  .cartoonX_01{
    animation: gravityRotationX_01 20s infinite;
  }
  .cartoonY_01{
    animation:gravityRotationY_01 20s infinite;
  }
  .cartoonX_02{
    animation: gravityRotationX_02 20s infinite;
  }
  .cartoonY_02{
    animation:gravityRotationY_02 20s infinite;
  }
  .cartoonX_03{
    animation: gravityRotationX_03 20s infinite;
  }
  .cartoonY_03{
    animation:gravityRotationY_03 20s infinite;
  }
  .cartoonX_04{
    animation: gravityRotationX_04 20s infinite;
  }
  .cartoonY_04{
    animation:gravityRotationY_04 20s infinite;
  }
  .cartoonX_05{
    animation: gravityRotationX_05 20s infinite;
  }
  .cartoonY_05{
    animation:gravityRotationY_05 20s infinite;
  }
  .cartoonX_06{
    animation: gravityRotationX_06 20s infinite;
  }
  .cartoonY_06{
    animation:gravityRotationY_06 20s infinite;
  }
  .cartoonX_07{
    animation: gravityRotationX_07 20s infinite;
  }
  .cartoonY_07{
    animation:gravityRotationY_07 20s infinite;
  }
  .cartoonX_08{
    animation: gravityRotationX_08 20s infinite;
  }
  .cartoonY_08{
    animation:gravityRotationY_08 20s infinite;
  }
</style>
