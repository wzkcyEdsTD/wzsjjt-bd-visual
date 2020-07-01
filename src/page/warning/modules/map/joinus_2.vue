<template>
  <div class="joinus_2 "   ref="acp">
    <div class="joinusCont">
      <h3>泽雅风景区<img src="./images/close.png" width="26" @click="onclick(0)"/></h3>
      <ul>
        <li><span>街道:</span><span>泽雅镇</span></li>
        <li><span>当前人数:</span><span>381</span></li>
        <li><span>瞬时承载客流量:</span><span>10000</span></li>
        <li><span>当天承载客流量:</span><span>10000</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    onclick(flag) {
      var acps = this.$refs.acp
      acps.style.display = 'none'
    } }
}
</script>

<style lang="less" scoped>
  .joinus_2{
    position: fixed;
    top:10%;
    left:30%;
    width: 250px;
    padding:0.1rem;
    background-color: rgba(12,33,57,0);
    z-index: 999;
    .joinusCont {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 4px;
      background-color: rgba(12, 33, 57, 0.8);
      color: #ffffff;
      font-size: 16px;
      * {
        margin: 0px;
        padding: 0px;
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
        cursor:pointer;
      }
      ul{
        margin-bottom:0.1rem;
      }
      li{
        color:#ffffff;
        width: 90%;
        margin: auto;
        line-height: 30px;
        height: 30px;
      }
      li span{
        width:50%;
        display: block;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
    }
  }
</style>
