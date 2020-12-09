<!--
 * @Author: eds
 * @Date: 2020-08-06 15:51:22
 * @LastEditTime: 2020-08-06 17:04:17
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\rtmpVideo.vue
-->
<template>
  <div class="rtmpVideo">
    <i class="close" @click="closeRtmpVideo"></i>
    <iframe
      :src= SP
    ></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed:{
    ...mapGetters("map",["forceBimSP"]),
    SP(){
      console.log("视频监控",this.forceBimSP);
      return this.forceBimSP;
    }
  },
  methods: {
    closeRtmpVideo() {
      this.$parent.isRtmpVideoOpen = false;
    },
  },
};
</script>

<style lang="less" scoped>
.rtmpVideo {
  position: fixed;
  top: 100px;
  right: 400px;
  width: 400px;
  height: 300px;
  > iframe {
    width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    right: 4px;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image("../../../page/map/images/zoom-in");
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    z-index: 10;

    &:hover {
      transform: rotate(45deg);
    }
  }
}
</style>
