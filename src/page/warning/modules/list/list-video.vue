<template>
  <div class="wrapper" v-show="isShow">
    <div class="content flex flex-y">
      <h3 class="flex">
        <span class="flex-1" :key="'a'+index" v-for="(item,index) in fild">{{item.name}}</span>
      </h3>
      <div class="box-wrapper flex-1">
        <div class="box" ref="wrapper" :id="myUuid">
          <ul ref="ul">
            <li @click="jumpMap(item)" class="flex" :key="'b'+index" v-for="(item,index) in data">
              <span class="flex-1" :key="'c'+index2" v-for="(item2,index2) in fild">{{item[item2.fild]}}</span>
            </li>
          </ul>
          <Kong v-if="isKong"></Kong>
        </div>
      </div>
    </div>
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
      type: Array,
      default() {
        return []
      }
    },
    fild: {
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
  watch: {
    data() {
      console.log(this.data)
      this.scrollTop = 0
      if (!this.data || !this.data.length) {
        this.isKong = true
      } else {
        this.isKong = false
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
          const dom = $('#' + this.myUuid)[0]
          if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight - 50) {
            this.$emit('next')
          }
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
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight - 50) {
            this.$emit('next')
          }
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
      this.$emit('itemClick', item)
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
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
    height: 100%;
    font-size: 0;
    padding: 0.15rem 0;
    .content {
      width: 85%;
      margin: auto;
      line-height: 0.3rem;
      color: #FFF;
      height: 100%;
      h3 {
        // background-color: #28446a;
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
          li:nth-child(even) {
            background-color: rgba(25, 45, 73, 0.4);
          }
        }
      }
      span {
        display: block;
        float: left;
        text-align: center;
        padding: 0 0.05rem;
        .no-wrap();
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
          font-size: 0.14rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(136, 171, 218, 0.2);
        }
      }
    }
  }
</style>
