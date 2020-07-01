/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位:人
      </div>
    </div>
    <div class="flex-1 relative">
      <div class="text-box-wrapper">
        <div class="text-box" @click="clickme(name)">
          <i class="bg"></i>
          <span class="text">
            容纳人数
            <b class="bold">{{num}}</b>
          </span>
        </div>
      </div>
      <div class="echart">
        <div class="panel">
          <div class="maquee" ref="wrapper" :id="myUuid">
            <ul class="ul-rymodal flex flex-y" ref="ul">
              <li class="li-rymodal" :key="index" v-for="(item,index) in data">
                <div class="maquee_div1 maquee_public">{{item.name}}</div>
                <div class="maquee_div2 maquee_public">
                  <span :style="{'width':item.value/dataMax*100 +'%'}"></span>
                </div>
                <div class="maquee_div3 maquee_public">{{item.value}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import $ from 'jquery'
import { uuid } from 'common/js/util'
import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    num: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid()
    }
  },
  computed: {
    dataMax() {
      let max = 0
      this.data.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        setTimeout(() => {
          const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
          const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
          if (ul > wrapper) {
            this.scrollTop = 0
            this.scrollStartHandler()
          } else {
            this.scrollDestroyHandler()
          }
        }, 100)
      })
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
        this.scrollTop = $('#' + this.myUuid)[0].scrollTop
      }
    })
  },
  methods: {
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            dom.scrollTop = 0
            this.scrollTop = 0
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
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  beforeDestroy() {
    this.scrollDestroyHandler()
  },
  components: {
    ItemTitle
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: relative;
    .tip-box {
      text-align: right;
      position: absolute;
      right: 0;
      top: 0.15rem;
      .item {
        color: #fff;
        font-size: 0.16rem;
        display: block;
        padding: 0 0.1rem;
        margin-top: -0.05rem;
        .icon {
          .bg-image('../../images/img-blue');
          width: 0.1rem;
          height: 0.11rem;
          display: inline-block;
          &.orange {
            .bg-image('../../images/img-orange');
          }
        }
      }
    }
    .text-box-wrapper {
      width: 1.5rem;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      .text-box {
        position: absolute;
        left: 52%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        cursor: pointer;
        .bg {
          .bg-image("./images/bn");
          width: 0.9rem;
          height: 0.76rem;
          display: block;
          margin: 0 auto;
        }
        .text {
          padding: 0.1rem 0;
          display: block;
          font-size: 0.16rem;
          color: @color-text;
          width: 1.6rem;
          .bold {
            font-weight: bold;
            color: #0dd5f4;
            padding: 0 0.05rem;
            font-size: 0.16rem;
          }
        }
      }
    }
    .echart {
      height: 100%;
      width: 100%;
      padding-left: 1.5rem;
      .panel {
        width: 3rem;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 0.03rem;
        overflow: hidden;
        height: 2.15rem;
        margin-top: 0.4rem;
        margin-left: 0.1rem;
      }
      .maquee {
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        overflow: auto;
        width: calc(100% + 0.1rem);
      }
      .maquee ul {
        width: 100%;
      }
      .maquee li {
        width: 100%;
        height: 0.3rem;
        background-color: rgba(0, 0, 0, 0);
        line-height: 0.3rem;
        font-size: 0.16rem;
      }
      .maquee_public {
        float: left;
      }
      .maquee_div1 {
        width: 28%;
        text-align: center;
        color: #fff;
        font-size: 0.16rem;
      }
      .maquee_div2 {
        width: 52%;
        margin-right: 2%;
        // background-color: #1d538d;
        height: 0.1rem;
        border-radius: 0.05rem;
        margin-top: 3%;
      }
      .maquee_div3 {
        width: 16%;
        text-align: left;
        color: #fff
      }
      .maquee_div2 span {
        display: block;
        height: 0.1rem;
        border-radius: 0.05rem;
        margin-top: 0.01rem;
        float: left;
        background: -webkit-linear-gradient(left, #fca95a, #0cdcf7);
        background: -o-linear-gradient(left, #fca95a, #0cdcf7);
        background: -mos-linear-gradient(left, #fca95a, #0cdcf7);
        background: linear-gradient(left, #fca95a, #0cdcf7);
      }
      .li-rymodal {
        /*float: left;
      list-style: none;
      margin: 0.05rem;*/
        list-style: none;
        white-space: nowrap;
        display: block;
      }
      .ul-rymodal {
        display: block;
        padding: 0;
        white-space: nowrap;
        overflow-y: scroll;
      }
      .ul-rymodal::-webkit-scrollbar {
        display: none;
      }
      span {
        cursor: pointer;
      }
    }
  }
  @media screen and (max-height: 1000px) {
    .wrapper .echart .maquee {
      height: 80%;
    }
  }
</style>
