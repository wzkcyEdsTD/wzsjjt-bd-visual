<template>
  <div class="wrapper flex flex-y">
    <div class="roadTran">
      <div class="wrap" id="wra">
        <img src="./images/man.png" width="63" height="187"/>
        <div class="total">总人数<span>{{this.total}}</span></div>
<!--        <div class="unit">单位:<span>人</span></div>-->
        <div class="box">
          <div @click="clickme(dataList[0].name)" style="transform: rotateY(0deg) translateZ(1.7rem);">
            <h3>{{dataList[0].name}}</h3>
            <span>{{dataList[0].value}}</span>
          </div>
          <div @click="clickme(dataList[1].name)" style="transform: rotateY(45deg) translateZ(1.7rem);">
            <h3>{{dataList[1].name}}</h3>
            <span>{{dataList[1].value}}</span>
          </div>
          <div @click="clickme(dataList[2].name)" style="transform: rotateY(90deg) translateZ(1.7rem);">
            <h3>{{dataList[2].name}}</h3>
            <span>{{dataList[2].value}}</span>
          </div>
          <div @click="clickme(dataList[3].name)" style="transform: rotateY(135deg) translateZ(1.7rem);">
            <h3>{{dataList[3].name}}</h3>
            <span>{{dataList[3].value}}</span>
          </div>
          <div @click="clickme(dataList[4].name)" style="transform: rotateY(180deg) translateZ(1.7rem);">
            <h3>{{dataList[4].name}}</h3>
            <span>{{dataList[4].value}}</span>
          </div>

          <div @click="clickme(dataList[5].name)" style="transform: rotateY(225deg) translateZ(1.7rem);">
            <h3>{{dataList[5].name}}</h3>
            <span>{{dataList[5].value}}</span>
          </div>
          <div @click="clickme(dataList[6].name)" style="transform: rotateY(270deg) translateZ(1.7rem);">
            <h3>{{dataList[6].name}}</h3>
            <span>{{dataList[6].value}}</span>
          </div>
          <div v-if="userInfo.districtName !== '乐清市'" @click="clickme(dataList[7].name)" style="transform: rotateY(315deg) translateZ(1.7rem);">
            <h3>{{dataList[7].name}}</h3>
            <span>{{dataList[7].value}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getEmergencyExpertsMainByUser, getEmergencyExpertsMainByUserLQS } from 'api/save/save'

export default {
  data() {
    return {
      dataList: [{ name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }, {
        name: 0,
        value: 0
      }, { name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }],
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  created() {
    if (this.userInfo.districtName === '乐清市') {
      getEmergencyExpertsMainByUserLQS().then(res => {
        this.dataList = res.categoryViews
        this.total = res.total
        console.log(this.dataList)
      })
    } else {
      getEmergencyExpertsMainByUser().then(res => {
        this.dataList = res.categoryViews
        this.total = res.total
      })
    }
  }
}
</script>
<style scoped lang="less">
  @keyframes fn {
    0% {
      transform: rotateX(-15deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(-15deg) rotateY(360deg);
    }
  }
  .roadTran {
    background: url('./images/expert_bg.png');
    /* width:4.6rem; */
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0.24rem;
  }
  .wrap {
    width: 2rem;
    height: 3rem;
    padding-top: 0.4rem;
    right: 0;
    bottom: 0;
    margin: auto;
    transform-style: preserve-3d;
    position: relative
  }
  .box {
    width: 0.85rem;
    height: 0.9rem;
    position: relative;
    margin: auto;
    margin-top: 0.85rem;
    transform-style: preserve-3d;
    transform: rotateX(-10deg);
    animation: fn 30s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    position: relative;
    text-align: center
  }
  .box:hover {
    animation-play-state: paused;
  }
  .box > div {
    width: 0.85rem;
    height: 0.9rem;
    position: absolute;
    left: 0;
    top: 0;
    background-image: url('./images/frame.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer
  }
  .box h3 {
    color: #FFF;
    margin-top: 0.2rem;
    font-size: 0.16rem
  }
  .box span {
    color: #4cecff;
    display: block;
    width: 80%;
    margin: auto;
    height: 0.25rem;
    background-color: #0d3550;
    margin-top: 0.1rem;
    line-height: 0.25rem;
    font-size: 0.16rem
  }
  .wrap img {
    z-index: 1000;
    position: absolute;
    top: 0.2rem;
    left: 0.6rem
  }
  .wrap #wra h3 {
    top: 0rem;
  }
  .wrap h3 {
    position: static !important
  }

  @media screen and (min-height: 950px) {
    .wrap img {
      top: 0.5rem;
    }
  }
  .roadTran {
    height: 100%;
    width: 100%;
  }
  .total {
    position: absolute;
    font-size: 0.16rem;
    color: #ffffff;
    top: 0.05rem;
    right: -1.25rem;
    background-image: url('./images/expert_total.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0.06rem 0.15rem;
  }
  .total span {
    color: #0dd5f4;
    font-weight: 600;
    font-size: 0.18rem;
    margin: 0rem 0.05rem;
  }
  .unit {
    position: absolute;
    font-size: 0.16rem;
    color: #ffffff;
    top: 0.45rem;
    right: -1.2rem;
    color: #54b6ff;
  }
  @media screen and (min-height: 1000px) {
    .total{
      top: 0.1rem;
    }
  }
</style>
