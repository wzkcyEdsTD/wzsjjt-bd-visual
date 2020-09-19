<template>
  <div class="wrapper" v-show="isShow">
    <div class="dot-white" @click="changeDot">
      <img v-if="dot" src="../../item-title/images/dot_white.png"/>
      <img v-else src="../../item-title/images/dot_blue.png"/>
    </div>
    <div class="content-wrapper">
      <div class="box" :id="myUuid" ref="wrapper">
        <ul ref="ul">
          <li :key="index" v-for="(item,index) in data" @click="showItem(item)">
            <img :src="item._img">
            <div>{{item.WARN_CONTENT}}</div>
          </li>
        </ul>
      </div>
    </div>
    <Kong v-show="isKong"></Kong>
  </div>
</template>

<script>
import { getWeatherWarn, forwardAFileAll } from 'api/warning/warning'
import { uuid } from 'common/js/util'
import Kong from 'components/noData/noData'
import { mapActions } from 'vuex'
import $ from 'jquery'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Kong
  },
  data() {
    return {
      data: [],
      flag: false,
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      monitor: null,
      isKong: false,
      monitorTime: 1000 * 60,
      dot: true
    }
  },
  updated() {
    if (this.isShow && this.data && this.data.length) {
      this.initScroll()
      // this.changeDot()
    } else {
      this.scrollDestroyHandler()
    }
    const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
    const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
    if (ul <= wrapper) {
      clearTimeout(this.monitor)
      this.monitor = setTimeout(() => {
        this.scrollTop = 0
        this.initData()
      }, this.monitorTime)
    }
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.changeDot()
      }
    }
  },
  mounted() {
    $('#' + this.myUuid).on({
      mouseover: () => {
        this.scrollDestroyHandler()
      },
      mouseout: () => {
        this.scrollStartHandler()
      },
      scroll: () => {
        if ($('#' + this.myUuid)[0]) {
          this.scrollTop = $('#' + this.myUuid)[0].scrollTop
        }
      }
    })
    this.initData()
  },
  methods: {
    ...mapActions('warning', [
      'SetQixiangWarning',
      'SetSpecalPoint'
    ]),
    // 展示单个信息
    showItem(item) {
      item.alias = 'yujingxinxi'
      item.smid = '0001'
      item.location = item.LON + ',' + item.LAT
      this.SetSpecalPoint(item)
    },
    // 修改图层
    changeDot() {
      this.dot = !this.dot
      if (!this.dot) {
        this.SetQixiangWarning(this.data)
      } else {
        this.SetQixiangWarning([])
      }
    },
    initData(bool) {
      getWeatherWarn().then((data) => {
        if (data && data.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
        this.flag = true

        const newData = JSON.parse(JSON.stringify(data))
        if (newData.length > 0) {
          let forwardIndex = 0
          for (let i = 0; i < newData.length; i++) {
            // 已经转发
            const url = 'http://www.wz121.com/static/images/warn_icon/eb/' + newData[i].TYPENUM + newData[i].LEAVELNUM + '.png'
            forwardAFileAll(url, true).then(data => {
              newData[i]._img = 'data:image/png;base64,' + data
              forwardIndex++
              if (forwardIndex === newData.length) {
                this.data = newData.filter(val => {
                  console.log(val.WARN_CONTENT.indexOf(this.$store.state.userInfo.districtName))
                  if (val.WARN_CONTENT.indexOf(this.$store.state.userInfo.districtName) > 0 || this.$store.state.userInfo.districtName === '温州市') {
                    return true
                  }
                  return false
                })
              }
            })
          }
        } else {
          this.data = []
        }
        if (bool) this.changeDot()
      })
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            this.scrollTop = 0
            this.scrollDestroyHandler()
            this.initData()
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    },
    initScroll() {
      this.$nextTick(() => {
        const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
        if (ul) {
          clearInterval(this.t)
          const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
          if (ul > wrapper) {
            // this.scrollTop = 0
            this.scrollStartHandler()
          } else {
            this.scrollDestroyHandler()
          }
        }
      })
    }
  },
  beforeDestroy() {
    clearTimeout(this.monitor)
    this.scrollDestroyHandler()
  }
}
</script>

<style scoped lang="less">
  .dot-white {
    text-align: right;
    padding-right: 0.15rem;
    img {
      cursor: pointer;
    }
  }
  .wrapper {
    position: relative;
    height: 100%;
    .content-wrapper {
      padding: 0.1rem 0;
      height: calc(100% - 0.2rem);
      width: 100%;
      position: absolute;
      top: 0.2rem;
      left: 0;
      .box {
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;
        > ul {
          li {
            cursor: pointer;
            position: relative;
            margin-top: 0.2rem;
            img {
              width: 0.6rem;
              position: absolute;
              top: 0.02rem;
              left: 0.2rem;
            }
            div {
              padding-left: 1rem;
              padding-right: 0.1rem;
              line-height: 0.2rem;
              color: #43878F;
              font-size: 0.16rem;
            }
          }
        }
      }
    }
    // .kong {
    //   width: 100%;
    //   height: 100%;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   z-index: 1;
    //   .bg-image('./images/no-warning');
    //   background-size: 3.25rem 1.45rem;
    // }
  }
</style>
