<template>
  <div class="wrapper" v-show="isShow">
    <div class="maquee" v-show="!isKong">
      <h3>
        <span>水闸名称</span>
        <span>闸下水位(m)</span>
      </h3>
      <div class="box-wrapper" :id="myUuid" ref="wrapper">
        <div class="box-content" ref="ul">
          <ul class="box1">
            <li :key="index" v-for="(item,index) in data.details" :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)" class="">{{item.name}}</div>
            </li>
          </ul>
          <!-- <ul class="box2">
            <li :key="index" v-for="(item,index) in data.details" :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)">
                <div class="perOne">
                  <span
                    :class="{'active':item.kssw-0>item.xxsw-0&&item.xxsw-0!==0}"
                    :style="{'width':widthPerOne(item.kssw,item.xxsw)}"></span>
                </div>
                <div class="perTwo">
                  <span
                    :class="{'active':item.kssw-0>item.xxsw-0&&item.xxsw-0!==0}"
                    :style="{'width':widthPerTwo(item.kssw,item.xxsw)}"></span>
                </div>
              </div>
            </li>
          </ul> -->
          <!-- <ul class="box3">
            <li
              :key="index"
              v-for="(item,index) in data.details"
              :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)">{{item.kssw}}</div>
            </li>
          </ul> -->
          <ul class="box4">
            <li
              :key="index"
              v-for="(item,index) in data.details"
              :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)">{{item.kssw}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Kong v-if="isKong"></Kong>
  </div>
</template>

<script>
import $ from 'jquery'
import { uuid } from 'common/js/util'
import Kong from 'components/noData/noData'
import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          total: '0.00亿方'
        }
      }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      isKong: false,
      monitor: null,
      monitorTime: 1000 * 60
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
  },
  updated() {
    if (this.isShow) {
      this.initScroll()
    } else {
      this.scrollDestroyHandler()
    }
    const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
    const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
    if (ul <= wrapper) {
      this.monitor = setTimeout(() => {
        this.scrollTop = 0
        this.$emit('refresh')
      }, this.monitorTime)
    }
  },
  methods: {
    widthPerOne(a, b) {
      let width = a / b * 100
      if (width > 100) {
        width = 100
      }
      if (b - 0 === 0) {
        width = 0
      }
      return width + '%'
    },
    widthPerTwo(a, b) {
      let width = a / b * 100
      if (width > 100) {
        width = width - 100
      } else {
        width = 0
      }
      if (b - 0 === 0) {
        width = 0
      }
      if (width > 100) {
        width = 100
      }
      return width + '%'
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
            this.$emit('refresh')
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
    },
    jumpMap(item) {
      console.log(item)
      this.SetSpecalPoint(item)
      if (this.$parent.btnIndex === 0) {
        this.$parent.dotIndex = [0, 0]
        this.$parent.changeDot()
      }
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
  },
  watch: {
    'data.details'() {
      this.scrollTop = 0
      if (!this.data.details.length) {
        this.isKong = true
      } else {
        this.isKong = false
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.monitor)
    this.scrollDestroyHandler()
  },
  components: {
    Kong
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    .maquee {
      width: 100%;
      background-color: rgba(0, 0, 0, 0);
      position: relative;
      h3 {
        width: 90%;
        margin: auto;
        color: #FFF;
        font-size: 0.16rem;
        font-weight: 400;
        height: 0.4rem;
        line-height: 0.4rem;
        span {
          display: block;
          float: left;
          text-align: center;
          font-size: 0.14rem;
          color: #ffd800;
        }
        span:nth-child(1){
          width:70%;
          color:#ffffff;
        }
        span:nth-child(2){
          width:30%;
        }
      }
      .box-wrapper {
        height: 2.3rem;
        margin: auto;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .box-content {
          width: 90%;
          margin: 0 auto;
          overflow: hidden;
          .box1 {
            width: 70%;
            float: left;
            text-align: center;
            > li > div {
              color: #FFF;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
          }
          .box2 {
            width: 47%;
            float: left;
            position: relative;
            > li {
              padding-top: 0.07rem;
              > div {
                background-color: #0e3c6d;
                height: 0.1rem;
                cursor: pointer;
                .perOne {
                  float: left;
                  width: 80%;
                  height: 100%;
                }
                .perTwo {
                  float: left;
                  width: 20%;
                  height: 100%;
                }
                span {
                  background-color: #0cc38d;
                  display: block;
                  height: 100%;
                  &.active {
                    background-color: #ff8f07;
                  }
                }
              }
            }
          }
          .box3 {
            width: 14%;
            float: left;
            > li > div {
              color: #159bfd;
              padding-left: 0.07rem;
              cursor: pointer;
            }
          }
          .box4 {
            width: 30%;
            float: left;
            > li > div {
              text-align: center;
              color: #ffd800;
              cursor: pointer;
            }
          }
        }
      }
      ul {
        li {
          width: 100%;
          margin: auto;
          height: 0.3rem;
          line-height: 0.3rem;
          font-size: 0.14rem;
          border-bottom: 1px solid rgba(136, 171, 218, 0.2);
        }
        li:nth-child(even){
          background-color:rgba(25, 45, 73, 0.4);
        }
      }
    }
  }
  @media screen and (max-height: 1000px) {
    .wrapper .maquee .box-wrapper {
      height: 1.9rem;
    }
  }
</style>
