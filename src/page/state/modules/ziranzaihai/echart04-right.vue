/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
      <div class="tip">
          <div class="tip_1">
              <div class="tip_white">
                  <!-- {{result}} -->
                  隐患体规模等级：
              </div>
              <div class="tip_yellow">
                  <!-- {{result}} -->
                  大型({{result.top}})个
              </div>
              <div class="tip_yellow">
               小型({{result.top}})个
                </div>
          </div>
           <div class="tip_1">
              <div class="tip_white">
                  <!-- {{result}} -->
                  隐患治理状态：
              </div>
              <div class="tip_yellow">
                  <!-- {{result}} -->
                  治理中({{result.bot}})个
              </div>
              <div class="tip_yellow">
                  <!-- {{result}} -->
                  治理完成({{result.bot}})个
              </div>
          </div>
      </div>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "Echart4",
  data() {
    return {
      result:this.$store.state.stateM.natural
    };
  },
  // watch: {
  //    '$store.state.stateM.natural':function(prev,next){
  //       this.result=prev
  //   }
  // },
};
</script>


<style scoped lang="less">
    .tip{
        width: 1.67rem;
        height:2.15rem;
        .bg-image('./images/nature_frame');
        margin-top: 20%;
        margin-left: 0.15rem;
        padding-top: 0.4rem;
	    animation: mymove 2s alternate;
        -webkit-animation: mymove 2s alternate; /* Safari and Chrome */
    }
@keyframes mymove {
  0% {background-size: 90%;
  }
    100% {background-size: 100%;
  }
}
    .tip_1{
      margin-top: 0.09rem;
      width: 1.12rem;
      margin-left: 0.31rem
    }
    .tip_white{
      height: 0.14rem;
      margin-top: 0.09rem;
        color: white;
        font-size: 0.14rem;
        margin-left: 0rem
    }
    .tip_yellow{
      height: 0.14rem;
      margin-top: 0.09rem;
        color: #fedb5d;
        margin-left: 0rem;
		font-size: 0.14rem;
		animation: mymove 2s alternate;
        -webkit-animation: mymove1 2s alternate; /* Safari and Chrome */
    }
   @keyframes mymove1 {
  0% {font-size: 0.1rem;
  }
    100% {font-size: 0.12rem;
  }
}
</style>
