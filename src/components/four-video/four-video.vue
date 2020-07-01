<template>
  <div class="wrapper_1 flex flex-y" v-show="isShow">
    <div class="video-header">
      直播视频
      <i class="close" @click="close"></i>
    </div>
    <div class="video-content flex-1">
      <div class="video_p_div">
        <div class="video_div">
          <iframe :src="path1" style="height: 100%;width: 100%;"></iframe>
        </div>
        <div class="video_div">
          <iframe :src="path2" style="height: 100%;width: 100%;"></iframe>
        </div>
      </div>
      <!-- <div class="video_p_div">
        <div class="video_div">
          <iframe :src="path3" style="height: 100%;width: 100%;"></iframe>
        </div>
        <div class="video_div">
          <iframe :src="path4" style="height: 100%;width: 100%;"></iframe>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'FourVideo',
  data() {
    return {
      isShow: false,
      url: '',
      path1: 'http://10.36.226.2:8080/video/index.html?url=rtmp://10.37.253.38:1935/domain=31000000002000000000&resource=31000000001320000012-0&quality=2&src=0',
      path2: 'http://10.36.226.2:8080/video/index.html?url=rtmp://10.37.253.38:1935/domain=31000000002000000000&resource=31000000001320000071-0&quality=2&src=0',
      path3: 'http://10.36.226.2:8080/video/index.html?url=rtmp://10.37.245.8:1935/service/PuId-ChannelNo=122242000100000001-008566&PlayMethod=0&StreamingType=1&FCode=9',
      path4: 'http://10.36.226.2:8080/video/index.html?url=rtmp://10.37.245.8:1935/service/PuId-ChannelNo=122242000100000001-008349&PlayMethod=0&StreamingType=1&FCode=9'
    }
  },
  mounted() {
    this.$bus.$on('changeShow', (data) => {
      this.isShow = data
    })
  },
  methods: {
    close() {
      this.isShow = false
      this.url = ''
    },
    show(url) {
      this.url = url
      this.isShow = true
    }
  }
}
</script>

<style scoped lang="less">
.video_p_div{
  height: 100%;
  width: 100%;
  display: flex;
}
.video_div{
  padding: 10px;
  width: 100%;
  border:1px solid #2a526d
}
.video{
  height: 100%;
  padding: 1px;
}
.video-js {
  height: 100%;
}
  .wrapper_1 {
    position: fixed;
    width: 46%;
    height: 40%;
    background: #1d4a60;
    border: 0.02rem solid #1a96c7;
    z-index: 999;
    top: 59%;
    left: 27%;
    border-radius: 0.04rem;
    .video-content {
      padding: 0 0.2rem 0.3rem;
      > iframe {
        width: 100%;
        height: 100%;
        display: block;
        background: #000;
      }
    }
    .video-header {
      font-size: 0.24rem;
      font-weight: bold;
      color: #ffc824;
      text-align: center;
      line-height: 0.46rem;
      position: relative;
      .close {
        position: absolute;
        right: 0.13rem;
        top: 0.13rem;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image('images/close');
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
          transform: rotate(45deg);
        }
      }
    }
  }
  .wrapper {
    position: fixed;
    width: 80%;
    height: 80%;
    background: #1d4a60;
    border: 0.02rem solid #1a96c7;
    z-index: 999;
    top: 10%;
    left: 10%;
    border-radius: 0.04rem;
    .video-content {
      padding: 0 0.2rem 0.3rem;
      > iframe {
        width: 100%;
        height: 100%;
        display: block;
        background: #000;
      }
    }
    .video-header {
      font-size: 0.24rem;
      font-weight: bold;
      color: #ffc824;
      text-align: center;
      line-height: 0.46rem;
      position: relative;
      .close {
        position: absolute;
        right: 0.13rem;
        top: 0.13rem;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image('images/close');
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
          transform: rotate(45deg);
        }
      }
    }
  }
</style>
