<template>
  <div class="wrapper" v-show="isShow">
    <div class="wrapper-box" :id="myUuid" ref="wrapper">
      <ul class="ul" ref="ul">
        <li @click="jumpMap(item)" :class="setSeverityClass(item.value)" :key="index" v-for="(item,index) in data">
          <div class="left">
           <div class="left_bot">{{setSeverityText(item.value)}}</div>
            <div class="left_top">{{item.name}}</div>
          </div>
          <div class="right">
            <div class="right_top">
              {{item.value | filterOneDecimal}}
              <span>mm</span>
            </div>
            <div class="right_bot">积水深度</div>
          </div>
        </li>
      </ul>
      <Kong v-if="isKong"></Kong>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { uuid } from 'common/js/util'
import Kong from 'components/noData/noData'
import { mapActions } from 'vuex'

const DANGER_NUM = 3
const WARNING_NUM = 2
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
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
    setSeverityClass(value) {
      let str = ''
      if (value >= DANGER_NUM) {
        str = 'danger'
      } else if (value >= WARNING_NUM) {
        str = 'warning'
      } else {
        str = 'success'
      }
      return str
    },
    setSeverityText(value) {
      let str = ''
      if (value >= DANGER_NUM) {
        str = '深度积水'
      } else if (value >= WARNING_NUM) {
        str = '轻度积水'
      } else if (parseInt(value) === 0) {
        str = '无积水'
      } else {
        str = '有积水'
      }
      return str
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
            this.scrollStartHandler()
          } else {
            this.scrollDestroyHandler()
          }
        }
      })
    },
    jumpMap(item) {
      this.SetSpecalPoint(item)
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
  },
  watch: {
    data() {
      this.scrollTop = 0
      if (!this.data.length) {
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

<style lang="less" scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .wrapper-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none
      }
      .ul {
        width: 3.72rem;
        margin: 0.09rem auto;
        li {
          width: 3.71rem;
          height: 0.4rem;
          list-style: none;
          margin-bottom: 0.08rem;
          background: rgba(27, 40, 72, 0.4);
          cursor: pointer;
          .left {
            width: calc(100% - 1.5rem);
            height: 0.4rem;
            float: left;
            text-align: center;
            margin-left: 0.14rem;
            /*margin-top: 0.09rem;*/
            .left_top {
              width: calc(100% - 0.9rem);
              height: 0.4rem;
              color: white;
              font-size: 0.14rem;
              /*margin-bottom: 0.03rem;*/
              line-height: 0.4rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              float: left;
            }
            .left_bot {
              width: 0.67rem;
              height: 0.2rem;
              font-size: 0.14rem;
              line-height: 0.2rem;
              margin-left: 0.08rem;
              border-radius: 4px;
              padding: 0px 5px;
              margin-top: 0.1rem;
              margin-right: 0.1rem;
              float: left;
            }
          }
          .right {
            width: 1.1rem;
            height: 0.34rem;
            float: right;
            color: white;
            text-align: center;
            margin-top: 0.03rem;
            border-radius: 0.04rem;
            margin-right: 0.03rem;
            .right_top {
              width: 100%;
              height: 0.17rem;
              font-size: 0.16rem;
              line-height: 0.17rem;
              /*margin-top: 0.1rem;*/
              /*float: left;*/
              span {
                font-size: 0.16rem;
              }
            }
            .right_bot {
              width:100%;
              height: 0.17rem;
              font-size: 0.13rem;
              line-height: 0.17rem;
              margin: 0 auto;
              /*float: left;*/
            }
          }
          &.danger {
            .left_bot {
              background: #4c3049;
              color: #bd3937;
            }
            .right {
              background: #a02d34;
            }
          }
          &.warning {
            .left_bot {
              background: #64584a;
              color: #bd7a12;
            }
            .right {
              background: #b6761e;
            }
          }
          &.success {
            .left_bot {
              background: #23443b;
              color: #0b9b3c;
            }
            .right {
              background: #2f7129;
            }
          }
        }
      }
    }
  }
</style>
