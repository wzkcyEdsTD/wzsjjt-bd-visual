<template>
  <div class="wrapper" v-show="isShow">
    <div class="maquee" v-show="!isKong">
      <h3>
        <template v-if="data.total !== '0.00亿方' && $store.state.userInfo.districtName !== '洞头区'">
          {{title1}}:{{data.total}}
        </template>
        <span>{{title2}}(m)</span>
      </h3>
      <div class="box-wrapper" :id="myUuid" ref="wrapper">
        <div class="box-content" ref="ul">
          <ul class="box1">
            <li :key="index" v-for="(item,index) in data.details" :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)" class="">{{item.name}}</div>
            </li>
          </ul>
          <ul class="box2">
            <li :key="index" v-for="(item,index) in data.details" :class="{'active':item.kssw-0>item.xxsw-0}">
              <div @click="jumpMap(item)">
                <div class="perOne">
                  <span
                    :class="{'active':item.kssw-0>=item.xxsw-0&&item.xxsw-0!==0}"
                    :style="{'width':widthPerOne(item.kssw,item.xxsw)}"></span>
                </div>
                <div class="perTwo">
                  <span
                    :class="{'active':item.kssw-0>=item.xxsw-0&&item.xxsw-0!==0}"
                    :style="{'width':widthPerTwo(item.kssw,item.xxsw)}"></span>
                </div>
              </div>
            </li>
          </ul>
          <ul class="box3">
            <li
              :key="index"
              v-for="(item,index) in data.details"
              :class="{'active':item.kssw-0>=item.xxsw-0}">
              <div @click="jumpMap(item)">{{item.kssw}}</div>
            </li>
          </ul>
          <ul class="box4">
            <li
              :key="index"
              v-for="(item,index) in data.details"
              :class="{'active':item.kssw-0>=item.xxsw-0}">
              <div @click="jumpMap(item)">{{item.xxsw - 0 === 0 ? '-' : item.xxsw}}</div>
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
    },
    title1: {
      type: String,
      default: ''
    },
    title2: {
      type: String,
      default: ''
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
        // this.scrollTop = 0
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
            // this.scrollTop = 0
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
      // this.scrollTop = 0
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
        width: 80%;
        margin: auto;
        color: #FFF;
        font-size: 0.16rem;
        font-weight: 400;
        height: 0.4rem;
        line-height: 0.4rem;
        span {
          display: block;
          float: right;
          width: 30%;
          text-align: right;
          font-size: 0.14rem;
          color: #ffd800;
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
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          .box1 {
            width: 20%;
            float: left;
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
            &:before {
              content: '';
              display: block;
              height: 100%;
              position: absolute;
              left: 80%;
              top: 0;
              width: 0.02rem;
              border-left: 0.02rem dotted #ff8f07;
            }
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
            width: 16%;
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
          height: 0.25rem;
          background-color: rgba(0, 0, 0, 0);
          line-height: 0.25rem;
          font-size: 0.14rem;
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
