<template>
  <div class="wrapper-typhoon-video" v-show="isShow">
    <div class="wrapper-content flex">
      <div class="wrapper-btn" @click="changePlay">
        <img v-show="isPlay" src="./images/pause.png" alt="">
        <img v-show="!isPlay" src="./images/play.png" alt="">
      </div>
      <div class="flex-1 wrapper-list">
        <div class="wrapper-list-box">
          <ul class="">
            <li class="item"></li>
            <li
              class="item"
              :class="{'active':playIndex===index,'showDown':index%4===0 || (index===data.length-1 && data.length > 2)}"
              :key="index"
              v-for="(item,index) in data">
              <span class="up">{{item[1] | time}}</span>
              <span class="down">{{item[1]| time}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isPlay: false,
      playIndex: 0,
      data: [],
      isBase64: false,
      t: null,
      currentType: '',
      playCount: 0
    }
  },
  methods: {
    // 清除
    remove() {
      this.isShow = false
      this.isPlay = false
      this.isBase64 = false
      this.playIndex = 0
      this.data = []
      this.pause()
    },
    // 显示
    show(data, bool, type) {
      // console.log('data: ' + JSON.stringify(data))
      if (data.length < 2) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.isPlay = false
      this.currentType = type
      this.pause()
      this.data = data
      if (bool) {
        if (type === '卫星云图') {
          this.playIndex = 0
          this.isBase64 = true
          this.$nextTick(_ => {
            this.$bus.emit('changeAddQixiangyuntuVideo', { type: this.data[0][2], img: this.data[0][3] })
          })
        } else if (type === '气象雷达') {
          this.playIndex = this.data.length - 1
          this.isBase64 = false
          this.$nextTick(_ => {
            this.$bus.emit('changeAddQixiangyuntuVideo', { type: '气象雷达', img: this.data[this.data.length - 1][0], bounds: this.data[this.data.length - 1][2] })
          })
        }
      }
    },
    // 定时自动播放
    autoPlay() {
      if (this.data.length <= 1) {
        return
      }
      this.t = setInterval(_ => {
        if (this.currentType === '卫星云图') {
          if (this.playIndex === this.data.length - 1) {
            this.playIndex = 0
            this.isPlay = false
            this.pause()
          } else {
            this.playIndex++
          }
        } else if (this.currentType === '气象雷达') {
          if (this.playIndex === this.data.length - 1 && this.playCount === 0) {
            this.playIndex = 0
          } else if (this.playIndex < this.data.length - 1) {
            this.playIndex++
            this.playCount++
          }
          if (this.playIndex === this.data.length - 1 && this.playCount !== 0) {
            this.isPlay = false
            this.pause()
            this.playCount = 0
          }
        }
      }, 1000)
    },
    pause() {
      if (this.t !== null) {
        clearInterval(this.t)
        this.t = null
      }
    },
    changePlay() {
      if (this.data.length <= 1) {
        return
      }
      this.isPlay = !this.isPlay
      if (this.isPlay) {
        this.autoPlay()
      } else {
        this.pause()
      }
    }
  },
  filters: {
    time: function(value) {
      const date = new Date(value * 1000)
      let h = date.getHours()
      let m = date.getMinutes()
      h = h < 10 ? '0' + h : h
      m = m < 10 ? '0' + m : m
      return h + ':' + m
    }
  },
  watch: {
    playIndex(index) {
      if (index > this.data.length - 1) {
        return
      }
      if (!this.isBase64) {
        this.$bus.emit('changeAddQixiangyuntuVideo', { type: '气象雷达', img: this.data[index][0], bounds: this.data[index][2] })
      } else {
        this.$bus.emit('changeAddQixiangyuntuVideo', { type: this.data[index][2], img: this.data[index][3] })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper-typhoon-video {
    width: 8.5rem;
    height: 0.56rem;
    position: fixed;
    left: 50%;
    bottom: 0.5rem;
    transform: translate(-50%, 0);
    z-index: 1;
    padding: 0 0.2rem;
    .bg-image('./images/play-bg');
    .wrapper-content {
      height: 100%;
      .wrapper-btn {
        height: 100%;
        cursor: pointer;
        > img {
          height: 100%;
          display: block;
        }
      }
      .wrapper-list {
        padding-left: 0.25rem;
        .wrapper-list-box {
          position: relative;
          height: 100%;
          > ul {
            height: 0.1rem;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
          .item {
            height: 0.1rem;
            border: 0.01rem solid #275587;
            width: 0.28rem;
            float: left;
            margin-right: 0.02rem;
            position: relative;
            &.active:before {
              content: '';
              display: block;
              width: 0.04rem;
              height: 0.1rem;
              position: absolute;
              left: -0.04rem;
              top: -0.01rem;
              background: #00fffa;
            }
            &:first-child {
              width: 0.14rem;
            }
            &:last-child {
              width: 0.14rem;
            }
            > span {
              color: #fff;
              position: absolute;
              &.down {
                top: 0.15rem;
                left: -0.27rem;
                width: 0.5rem;
                text-align: center;
                font-size: 0.12rem;
                display: none;
              }
              &.up {
                bottom: 0.15rem;
                left: -0.27rem;
                width: 0.5rem;
                text-align: center;
                font-size: 0.12rem;
                display: none;
                background: rgba(0, 0, 0, 0.9);
                height: 0.18rem;
                line-height: 0.18rem;
              }
            }
            &.showDown > span.down, &.active > span.up {
              display: block;
            }
          }
        }
      }
    }
  }
</style>
