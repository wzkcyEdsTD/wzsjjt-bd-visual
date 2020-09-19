<template>
  <div class="wrapper" v-show="isShow">
    <h3 class="tit">
      <span>{{time}}</span>
      实时人数/瞬时最大承载人数</h3>
    <div class="maquee" :id="myUuid" ref="wrapper">
      <!-- <ul ref="ul">
        <li
          @click="jumpMap(item)"
          :key="index"
          v-for="(item,index) in data"
          :class="{'warning':item.value * 100 / item.instantCount>100}">
          <div class="maquee_div1 maquee_public">{{item.name}}</div>
          <div class="maquee_div2 maquee_public">
            <span
              :style="{width:maxWidth(item)+'%', minWidth: item.value>0?'0.15rem':'auto'}"></span>
          </div>
          <div class="maquee_div3 maquee_public">{{item.value===null?0:item.value}}/{{item.instantCount}}</div>
        </li>
      </ul> -->
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
        <div class="custom-tree-node" slot-scope="{ data }" @click="jumpMap(data)">
          <!-- <span>{{ data.instantCount }}</span> -->
          <span v-show="!data.smid">{{data.name}}</span>
          <div v-show="data.smid" class="maquee_div1 maquee_public">{{data.name}}</div>
          <div v-show="data.smid" class="maquee_div2 maquee_public">
            <span
              :class="{'warning':data.value * 100 / data.instantCount>100}"
              :style="{width:maxWidth(data)+'%', minWidth: data.value>0?'0.15rem':'auto'}"></span>
          </div>
          <div v-show="data.smid" class="maquee_div3 maquee_public">{{data.value===null?0:data.value}}/{{data.instantCount}}</div>
          <!-- <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              Delete
            </el-button>
          </span> -->
        </div>
      </el-tree>
      <Kong v-show="isKong"></Kong>
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
    isShow: {
      type: Boolean,
      default: false
    },
    time: {
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
      monitorTime: 1000 * 60,
      defaultProps: {
        children: 'childs',
        label: 'name'
      }
    }
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
  mounted() {
    // $('#' + this.myUuid).on({
    //   mouseover: () => {
    //     this.scrollDestroyHandler()
    //   },
    //   mouseout: () => {
    //     this.scrollStartHandler()
    //   },
    //   scroll: () => {
    //     if ($('#' + this.myUuid)[0]) {
    //       this.scrollTop = $('#' + this.myUuid)[0].scrollTop
    //     }
    //   }
    // })
  },
  updated() {
    // if (this.isShow) {
    //   this.initScroll()
    // } else {
    //   this.scrollDestroyHandler()
    // }
    // const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
    // const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
    // if (ul <= wrapper) {
    //   this.monitor = setTimeout(() => {
    //     this.scrollTop = 0
    //     this.$emit('refresh')
    //   }, this.monitorTime)
    // }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    maxWidth(item) {
      let w = item.value * 100 / item.instantCount
      if (w > 100) {
        w = 100
      }
      return w
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
    position: relative;
    height: 100%;
    .tit {
      width: 85%;
      color: #00c6ff;
      font-size: 0.14rem;
      text-align: right;
      margin-left: 5%;
      line-height: 0.25rem;
    }
    .tit span {
      float: left;
      color: #2ee9ff;
    }
  }
  .maquee {
    width: 100%;
    height: 80%;
    position: absolute;
    top: 12%;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .maquee ul {
    width: 90%;
    margin: auto;
  }
  .maquee li {
    width: 100%;
    height: 0.32rem;
    background-color: rgba(0, 0, 0, 0);
    line-height: 0.25rem;
    font-size: 0.14rem;
    cursor: pointer;
    position: relative;
  }
  .maquee_public {
    float: left;
  }
  .maquee_div1 {
    width: 40%;
    text-align: left;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 0.1rem;
  }
  .maquee_div2 {
    width: 55%;
    // border: #1cb4fe solid 0.01rem;
    background-color: rgba(73, 106, 169, 0.4);
    border: 1px solid rgba(0, 198, 255, 0.4);
    height: 0.15rem;
    border-radius: 0.075rem;
    margin-top: 0.07rem;
  }
  .maquee_div3 {
    color: #6fe2ff;
    position: absolute;
    right: 0;
    padding-right: 0.46rem;
  }
  .maquee_div2 span {
    display: block;
    height: 0.13rem;
    border-radius: 0.065rem;
    float: left;
    background: linear-gradient(left, #05effc, #1b669b);
    &.warning{
      background: #ff8f07;
    }
  }
  .maquee li.warning .maquee_div2 span {
    background: #ff8f07;
  }
  .maquee li.warning .maquee_div3 {
    color: #ffffff;
  }
  .custom-tree-node{
    font-size: 0.14rem;
  }
</style>
