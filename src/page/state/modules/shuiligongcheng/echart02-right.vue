/* eslint-disable */
<template>
  <!-- <div ref="echart"></div> -->
  <div class="wrapper">
    <div class="wrapper-item monitor">
      <div class="item-title">水情监测</div>
      <div class="item-content">
        <ul class="waterList">
          <li>
            <div @click="toMonitor('河道')">河道</div>
            <div @click="toMonitor('河道')">总数 {{data.riverMonitorTotal || 0}} 个</div>
            <div @click="toMonitor('河道')">报警 <span>{{data.riverMonitorWarn || 0}} 个</span></div>
          </li>
          <li>
            <div @click="toMonitor('水库')">水库<b v-show="userInfo.districtName==='温州市'">(大中型)</b></div>
            <div @click="toMonitor('水库')">总数 {{data.reservoirMonitorTotal || 0}} 个</div>
            <div @click="toMonitor('水库')">超汛限 <span>{{data.reservoirMonitorWarn || 0}} 个</span></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper-item wrapper-spc">
      <div class="item-title" style="cursor: pointer;" @click="toMonitor('shipingjiankon')">摄像头</div>
      <div class="item-content">
        <ul>
          <li @click="toMonitor('shipingjiankon')">总数 {{data.cameraTotal || 0}} 个</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapActions, mapState, mapGetters } from 'vuex'
import { getWaterProject, getWaterProjectMainByUserOH, getWaterProjectMainByUserLG, getWaterProjectMainByUserLW, getWaterProjectMainByUserLQS, getWaterProjectMainByUserDTQ, getWaterProjectMainByUserTSX } from "@/api/state/WaterProject";
// import { getWaterProject } from 'api/state/state'
export default {
  name: "TrafficLeft",
  data() {
    return {
      echart: null,
      dataname: [],
      datanum: [],
      echartWidth: 14,
      data: {
        waterCount: 10,
        waterWarn: 5
      }
    };
  },
  mounted() {
    if (this.userInfo.districtName === '瓯海区' || this.userInfo.districtName === '文成县') {
      getWaterProjectMainByUserOH().then(res => {
        this.data = res
      })
    } else if (this.userInfo.districtName === '龙港市') {
      getWaterProjectMainByUserLG().then(res => {
        this.data = res
      })
    } else if (this.userInfo.districtName === '乐清市') {
      getWaterProjectMainByUserLQS().then(res => {
        this.data = res
      })
    } else if (this.userInfo.districtName === '洞头区') {
      getWaterProjectMainByUserDTQ().then(res => {
        this.data = res
      })
    } else if (this.userInfo.districtName === '泰顺县') {
      getWaterProjectMainByUserTSX().then(res => {
        this.data = res
      })
    } else if (this.userInfo.districtName === '龙湾区' || this.userInfo.districtName === '经开区') {
      getWaterProjectMainByUserLW().then(res => {
        this.data = res
      })
    } else {
      getWaterProject().then(res => {
        this.data = res
      })
    }
    // 根据浏览器宽度修改宽度
    // if(document.documentElement.clientHeight > 1620) this.echartWidth = 20
    // window.onresize = () => {
    //   this.echart.resize();
    // }
  },
  computed: {
    ...mapState({
      'waterState': state => state.warning.waterState
    }),
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    // 前往监测预警
    toMonitor(type) {
      if (type !== this.waterState) this.SetCurrentWaterState(type)
      this.$router.push({ path: '/warning' })
    },
    ...mapActions('map', [
      'SetSpecalTreeName'
    ]),
    ...mapActions('warning', ['SetCurrentWaterState'])
  }
};
</script>
<style scoped lang='less'>
  .monitor {
    cursor: pointer;
  }
  .wrapper {
    padding-top: 0.7rem;
    color: #fff;
  }
  .wrapper-item {
    padding-left: 0.1rem;
    width: 100%;
    height: 1rem;
    background: url('./images/frame.png') no-repeat;
    background-size: 110% 100%;
    margin-bottom: 0.4rem;
  }
  .wrapper .wrapper-spc {
    height: 0.8rem;
    background: url('./images/frame1.png') no-repeat;
    background-size: 110% 100%;
  }
  .item-title {
    height: 0.3rem;
    line-height: 0.3rem;
  }
  .item-content > ul > li {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.3rem;
    cursor: pointer;
  }
  // .item-content>ul>li:nth-child(2) div:nth-child(1){
  //   background: url('./images/shuiku.png') no-repeat;
  // }
  .wrapper-item:nth-child(1) li {
    height: 0.6rem;
    padding-left: 0;
  }
  .wrapper-item:nth-child(1) li div:nth-child(1) {
    color: #24e8ff;
    padding-left: 0.2rem;
    margin-bottom: 0.05rem;
    background: url('./images/hedao.png') no-repeat;
  }
  .wrapper-item:nth-child(1) li:nth-child(2) div:nth-child(1) {
    background: url('./images/shuiku.png') no-repeat;
  }
  .wrapper-item:nth-child(2) li {
    background: url('./images/total.png') no-repeat;
    background-size: 0.2rem 0.2rem;
    background-position-y: calc((0.3rem - 0.1rem) / 2);
  }
  .wrapper-item:nth-child(2) li:nth-child(2) {
    background-image: url('./images/online.png');
  }
  // .item-content{
  //   background: url('./images/camera.png') no-repeat;
  //   background-position: 1.4rem calc((0.7rem - 52px) / 2);
  // }
  .wrapper-item:nth-child(2) .item-content {
    background: url('./images/camera.png') no-repeat;
    background-position: 1.6rem calc((0.7rem - 0.52rem) / 2);
  }
  // 水情监测
  .waterList {
    display: flex;
    justify-content: space-between;
    width: 90%;
    // margin-top: 5px;
    div {
      line-height: 0.2rem;
      height: 0.2rem;
      span {
        color: #ef5347;
      }
      b {
        font-size: 14px;
      }
    }
  }
  @media screen and (max-height: 1050px) {
    .wrapper {
      padding-top: 0.65rem;
    }
    .wrapper-item {
      margin-bottom: 0.2rem;
    }
  }
  //大屏适配
  @media screen and (min-width: 5000px) {
    .wrapper {
      padding-top: 0.55rem;
    }
    .wrapper-item:nth-child(1) li div:nth-child(1) {
      background-size: 30px 30px;
    }
    .wrapper-item:nth-child(1) li:nth-child(2) div:nth-child(1) {
      background-size: 30px 30px;
    }
    .item-content > ul > li {
      padding-left: 0.3rem;
    }
    .wrapper-item:nth-child(2) .item-content {
      background-size: 70px 70px;
    }
  }

</style>
