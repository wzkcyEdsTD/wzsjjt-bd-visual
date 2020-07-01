/* eslint-disable */
<template>
  <div class="wrapper">
    <ItemTitle :isPointer='true' title="人员密集场所"></ItemTitle>
    <div class="box">
      <div class="content-wrapper">
        <div class="text-box-wrapper">
          <div class="text-box" @click="clickme('人员密集场所')" style="cursor: pointer">
            <i class="bg"></i>
            <span class="text">
              密集场所
              <b class="bold">{{this.total}}</b>
            </span>
          </div>
        </div>
        <div class="echart">
          <div class="panel">
            <div class="maquee" ref="wrapper" :id="myUuid">
              <ul class="ul-rymodal flex flex-y" ref="ul">
                <li class="li-rymodal" :key="index" v-for="(item,index) in dataList">
                  <div class="maquee_div1 maquee_public">{{item.name}}</div>
                  <div class="maquee_div2 maquee_public" @click="clickme(item.name)">
                    <span :style="{'width':item.value/dataMax*100 +'%'}" @click="clickme(item.name)"></span>
                  </div>
                  <div class="maquee_div3 maquee_public">{{item.value}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="tip-box">
          <div class="item">
            <span class="icon orange"></span>
            单位/个
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import ItemTitle from '../item-title/item-title'
import $ from 'jquery'
import { uuid } from 'common/js/util'
import { getPersonDense } from "@/api/state/PersonDense";

export default {
  name: 'Echart01new',
  components: {
    ItemTitle
  },
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
    }
  },
  data() {
    return {
      scrollTop: 0,
      scrollFlag: null,
      dataList: [],
      total: 0,
      myUuid: 'uuid' + uuid()
    }
  },
  created() {
    getPersonDense().then(
      res => {
        this.dataList = res.categoryViews.filter(val => {
          return val.value !== 0
        })
        this.total = res.totalCount
      }
    )
  },
  computed: {
    dataMax() {
      let max = 0
      this.dataList.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    }
  },
  watch: {
    dataList() {
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
    this.initData()
    $('#' + this.myUuid).on({
      mouseover: () => {
        this.scrollDestroyHandler()
      },
      mouseout: () => {
        this.scrollStartHandler()
      },
      scroll: () => {
        if (!$('#' + this.myUuid)[0]) return
        this.scrollTop = $('#' + this.myUuid)[0].scrollTop
      }
    })

  },
  methods: {
    initData() {
      this.$nextTick(() => {
        getPersonDense().then(
          res => {
            this.dataList = res.categoryViews.filter(val => {
              return val.value !== 0
            })
            this.total = res.totalCount
          }
        )
      })
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
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
    .box {
      padding-top: 0.4rem;
      width: 100%;
      height: 100%;
    }
    .content-wrapper {
      height: 100%;
      width: 100%;
      position: relative;
    }
    .tip-box {
      text-align: right;
      position: absolute;
      right: 0;
      top: 0.05rem;
      .item {
        color: #fff;
        font-size: 0.14rem;
        display: block;
        padding: 0 0.1rem;
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
        /*left: 50%;*/
        top: 37%;
        /*transform: translate(-50%, -50%);*/
        text-align: center;
        .bg {
          .bg-image("./images/img-zrzh");
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
          width: 1.5rem;
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
      padding-top: 0.35rem;
      .panel {
        width: 3rem;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 0.03rem;
        overflow: hidden;
        height: 86%;
      }
      .maquee {
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        overflow: auto;
        width: 100%;
      }
      .maquee ul {
        width: 100%;
      }
      .maquee li {
        width: 100%;
        height: 0.36rem;
        background-color: rgba(0, 0, 0, 0);
        line-height: 0.36rem;
        font-size: 0.14rem;
      }
      .maquee_public {
        float: left;
      }
      .maquee_div1 {
        width: 34%;
        text-align: right;
        color: #fff;
        font-size: 0.16rem;
        margin-right: 0.05rem;
      }
      .maquee_div2 {
        width: 45%;
        margin-right: 2%;
        background-color: rgba(45, 92, 144, 0.4);
        height: 0.1rem;
        border-radius: 0.05rem;
        margin-top: 4.5%;
        margin-left: 1%;
        cursor: pointer;
      }
      .maquee_div3 {
        width: 15%;
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
</style>
