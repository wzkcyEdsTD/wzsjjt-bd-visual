/* eslint-disable */
<template>
  <div class="ecahts06 flex flex-y">
    <div class="panel">
      <div class="maquee" ref="wrapper" :id="myUuid">
        <ul class="ul-rymodal flex flex-y" ref="ul">
          <li class="li-rymodal" v-for="(value,index) in navList" :key="value+index">
            <div class="maquee_div1 maquee_public" ref="acp11">{{value.name}}</div>
            <div class="maquee_div2 maquee_public">
              <span :style="{'width':value.value/dataMax*100 +'%'}" @click="clickme(value.name)"></span>
            </div>
            <!--            <div class="maquee_div3 maquee_public">{{value.value}}处</div>-->
            <div class="maquee_div3 maquee_public">{{value.value}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>

// import { getMeteLogByUser } from 'api/state/state'
import $ from 'jquery'
import { uuid } from 'common/js/util'

export default {
  name: 'E6',
  data() {
    return {
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid()
    }
  },
  props: {
    navList: {
      default: []
    }
  },
  computed: {
    dataMax() {
      let max = 1
      this.navList.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    }
  },
  mounted() {
    // getMeteLogByUser().then(res => {
    //   this.navList = res
    // })
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
  beforeDestroy() {
    this.scrollDestroyHandler()
  },
  watch: {
    navList() {
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
    }
  }
}
</script>

<style scoped lang='less'>
  .ecahts06 {
    * {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .panel {
      width: 2.7rem;
      background-color: rgba(0, 0, 0, 0);
      border-radius: 0.03rem;
      overflow: hidden;
      height: 2.2rem;
      margin-top: 0.8rem;
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
      height: 0.4rem;
      background-color: rgba(0, 0, 0, 0);
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
    .maquee_public {
      float: left;
    }
    .maquee_div1 {
      width: 24%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff;
      margin-right: 5px;
    }
    .maquee_div2 {
      width: 55%;
      margin-right: 2%;
      background-color: #1d538d;
      height: 0.12rem;
      border-radius: 0.06rem;
      margin-top: 6%;
    }
    .maquee_div3 {
      width: 16%;
      text-align: left;
      color: rgba(255, 255, 255, 0.7);
    }
    .maquee_div2 span {
      display: block;
      height: 0.12rem;
      border-radius: 0.04rem;
      float: left;
      background: -webkit-linear-gradient(left, #1b6bff, #00ffd2);
      background: -o-linear-gradient(left, #1b6bff, #00ffd2);
      background: -mos-linear-gradient(left, #1b6bff, #00ffd2);
      background: linear-gradient(left, #1b6bff, #00ffd2);
    }
    .li-rymodal {
      /*float: left;
      list-style: none;
      margin: 5px;*/
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
  }
  @media screen and (max-height: 1050px) {
    .ecahts06 .panel {
      height: 1.8rem;
    }
  }
</style>
