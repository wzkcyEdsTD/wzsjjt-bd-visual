/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="森林防火"></ItemTitle>
    <!-- <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="item in 2" :key="item"> -->
    <div class="echart-box flex-1">
      <div class="box-item" v-for="(item, index) in dataList" :key='index' @click="clickme(item.name)" style="cursor:pointer">
        <div class="title">{{item.shortname}}</div>
        <div class="item-nums">
          <div class="yellow">{{item.count}}(个)</div>
          <div>总面积</div>
          <div class="yellow">{{item.area.toFixed(2)}}公顷</div>
        </div>
      </div>
      <img src="./images/07-bg.png" alt="">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import e07m1 from "./echart07-m1"
import { getStgyl } from "@/api/state/state";
import { mapGetters, mapActions } from 'vuex'
// import Swiper from "swiper";
export default {
  name: "Echart5",
  components: {
    ItemTitle,
    e07m1,
  },
  data() {
    return {
      echart: null,
      dataList: [
        {
          name: '国有林场',
          count: '1234',
          area: 12345
        },
        {
          name: '国有林场',
          count: '1234',
          area: 12345
        },
        {
          name: '国有林场',
          count: '1234',
          area: 12345
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      risklevel: 'stateM/risklevel'
    })
  },
  methods: {
    ...mapActions({
      SetRiskLevelAction: "stateM/SetRiskLevel"
    }),
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  created() {
    getStgyl().then(res => {
      this.dataList = res;
      // this.SetRiskLevelAction(res)
    })

  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    .echart-box {
      width: 100%;
      height: 100%;
      margin-top: 0.4rem;
      position: relative;
      .box-item{
        background: url('./images/item-bg.png') no-repeat;
        // background-position: center bottom;
        background-size: 100%;
        width: 1.3rem;
        height: 1.5rem;
        position: absolute;
        top: 0.2rem;
        z-index: 10;
        // transition: all 1s linear;

        .title{
          text-align: center;
          height: 0.4rem;
          line-height: 0.4rem;
          color: #4cbfff;
        }
      }
      .box-item:nth-child(1){
        top: 0.7rem;
        left: calc(10% - 0.3rem);
        animation: item1 3.5s ease-in-out infinite alternate;
      }
      .box-item:nth-child(2){
        top:0.1rem;
        left: calc(50% - 0.6rem);
        animation: item1 3.5s ease-in-out 1.2s infinite alternate;
      }
      .box-item:nth-child(3){
        top: 1rem;
        left: calc(100% - 1.3rem);
        // transform: translateX(-50%);
        animation: item1 3.5s ease-in-out 2s infinite alternate;
      }
      img{
        position: absolute;
        bottom: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
      }
      /*}*/
    }

    .item-nums{
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      height: 0.7rem;
      justify-content: space-around;
      .yellow{
        color: #fff98b;
      }
    }
    /deep/ .el-carousel__arrow--right {
      display: none;
    }
    /deep/ .el-carousel__arrow--left {
      display: none;
    }
    /deep/ .el-carousel__button {
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 0.1rem;
      background: #3ecbe0;
    }
    .u1 li {
      position: relative;
    }
    .li_1, .li_12, .li_2 {
      position: absolute;
      left: 24%;
      top: 32%;
      font-size: 0.14rem;
      color: white;
    }
    .li_1 {
      width: 50px;
      height: 15px;
      text-align: center;
    }
    .li_2 {
      left: 1%;
      top: 81%;
      width: 0.97rem;
      text-align: center;
      cursor: pointer;
    }
    .li_12 {
      left: 40%;
    }

    @media screen and (max-height: 1050px) {
      .echart-box ul {
        margin-top: 0.4rem;
      }
      .echart-box .u2 li {
        margin-top: 0.05rem;
      }
      .box-item:nth-child(3){
        top: 0.6rem !important;}
    }
  }
  //大屏适配
  @media screen and (min-height: 1620px) {
    .wrapper {
      .li_1 {
      left: 32%;
    }
      .echart-box ul{
        margin-top: 0.4rem;
      }
      .echart-box .u2 li{
        margin-top: 0.06rem;
      }
   }
  }
  @keyframes item1 {
    from{transform: translateY(0);}
    to{transform: translateY(0.08rem);}
  }
</style>
