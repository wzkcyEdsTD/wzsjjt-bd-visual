<template>
  <div class="joinus " ref="acp">
    <div class="joinusCont">
      <h3>林溪<img src="./images/close.png" width="26" @click="onclick(0)"/></h3>
      <div class="time"><span>2020-02/28 10:11-02/29 10:11</span><span class="spc">测站所属:瑞安市文化站</span></div>
      <div class="chart">
        <echartBOTTON class="flex-1"></echartBOTTON>
      </div>
      <div class="triangle"></div>
    </div>
  </div>
</template>

<script>
import echartBOTTON from './echartBOTTON'
export default {
  components: {
    // list,
    // total,
    // point,
    echartBOTTON
  },
  methods: {
    onclick(flag) {
      var acps = this.$refs.acp
      acps.style.display = 'none'
    } }
}
</script>

<style lang="less" scoped>
  .joinus{
    position: fixed;
    top:10%;
    left:30%;
    width: 500px;
    background-color: rgba(12,33,57,0);
    z-index: 999;
    .joinusCont{
      width:100%;
      height: 100%;
      position:relative;
      border-radius: 4px;
      background-color: rgba(12,33,57,0.8);
      color:#ffffff;
      font-size: 16px;
      *{
        margin:0px;
        padding:0px;
      }
      .time{
        font-size: 16px;
        width:92%;
        margin: auto;
        text-align: left;
        height:35px;
        line-height: 35px;
      }
      .spc{
        float: right;
      }
      h3{
        margin:0px;
        padding:0px;
        text-align: left;
        width:92%;
        margin: auto;
        height: 35px;
        font-size: 20px;
        line-height:35px;
        color:#0d95c7;
        position:relative;
      }
      h3 img{
        position: absolute;
        right:0;
        top:4px;
        cursor: pointer;
      }
      .chart{
        width:100%;
        height: 300px;
      }
      .triangle{
        width: 0px;
        height: 0px;
        position: absolute;
        top:100%;
        left:45%;
        border-top: 30px solid rgba(12,33,57,0.8);
        border-right: 20px solid rgba(0,0,0,0);
        border-bottom: 30px solid rgba(0,0,0,0);
        border-left: 20px solid rgba(0,0,0,0);
      }
    }
  }
</style>
