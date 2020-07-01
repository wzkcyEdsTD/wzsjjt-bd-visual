<template>
  <div class="wrapper" v-show="isShow">
    <div class="content flex flex-y">
      <h3 class="flex">
        <span style="width:0.5rem"></span>
        <span class="flex-1">编号</span>
        <span class="flex-1">中文名</span>
        <span class="flex-1">英文名</span></h3>
      <div class="box-wrapper flex-1">
        <div class="box relative" :id="myUuid" ref="wrapper">
          <ul ref="ul">
            <li class="flex" :key="index" v-for="(item,index) in data">
              <span style="width:0.5rem">
                <input :checked="checkedIndex===index" type="checkbox" @click="checkItem(item,index)">
              </span>
              <span class="flex-1">{{item.tfbh}}</span>
              <span class="flex-1">{{item.name}}</span>
              <span class="flex-1">{{item.ename}}</span>
            </li>
          </ul>
          <Kong v-show="isKong"></Kong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTyphoon } from 'api/warning/warning'
import { mapActions } from 'vuex'
import { uuid } from 'common/js/util'
import Kong from 'components/noData/noData'
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
      checkedIndex: -1,
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      monitor: null,
      isKong: false,
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
    this.initData()
  },
  updated() {
    if (this.isShow && this.data.length) {
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
    initData() {
      getTyphoon().then((data) => {
        if (data && data.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
        this.data = data
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
            this.scrollStartHandler()
          } else {
            this.scrollDestroyHandler()
          }
        }
      })
    },
    checkItem(item, index) {
      if (this.checkedIndex === index) {
        this.checkedIndex = -1
        this.SetTyphoonInfo({})
      } else {
        this.checkedIndex = index
        this.SetTyphoonInfo(item)
      }
    },
    ...mapActions('warning', [
      'SetTyphoonInfo'
    ])
  },
  beforeDestroy() {
    clearTimeout(this.monitor)
    this.scrollDestroyHandler()
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    height: 100%;
    font-size: 0;
    padding: 0.15rem 0;
    .content {
      border: 0.01rem solid #28446a;
      width: 85%;
      margin: auto;
      line-height: 0.3rem;
      color: #FFF;
      height: 100%;
      h3 {
        background-color: #28446a;
        font-size: 0.14rem;
        width: 100%;
        height: 0.3rem;
        color: white
      }
      .box-wrapper {
        position: relative;
        .box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
        }
      }
      span {
        display: block;
        float: left;
        text-align: center;
        > input {
          cursor: pointer;
        }
      }
      ul::-webkit-scrollbar {
        display: none
      }
      ul {
        overflow-y: scroll;
        li {
          width: 100%;
          height: 0.3rem;
          font-size: 0.14rem
        }
      }
    }
  }
</style>
