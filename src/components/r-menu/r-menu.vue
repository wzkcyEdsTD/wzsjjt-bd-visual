<template>
  <div class='page-r-menu' ref="rMenu" v-show="isShow">
    <input class="hidden-input" type="text" ref="input" @blur="hide"/>
    <el-card>
      <div
        :class="item.line?'has-line':''"
        class="item"
        v-for="(item,index) in this.data"
        :key="index"
        @click="clickItem(item)"
        @mousedown="stopBlur">
        <img v-if="item.icon" :src="item.icon"/>
        <i v-else></i>
        <span>{{item.text}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RMenu',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    line: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      nodeData: {}
    }
  },
  methods: {
    show(e, data) {
      this.$refs.rMenu.style.left = e.pageX - 14 + 'px'
      this.$refs.rMenu.style.top = e.pageY - 54 + 'px'
      this.isShow = true
      this.nodeData = data
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    hide() {
      this.isShow = false
    },
    stopBlur(e) {
      e.preventDefault()
    },
    clickItem(item) {
      this.$refs.input.blur()
      this.$emit('click', item, this.nodeData)
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/stylus">
  /deep/ .el-card__body {
    padding: 0;
    min-width: 0.8rem;
  }
  .page-r-menu {
    position: fixed;
    .hidden-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      z-index: -1;
      outline: none;
      border: none;
    }
    .item {
      line-height: 0.22rem;
      font-size: 0.14rem;
      color: #222;
      cursor: pointer;
      padding: 0.06rem 0.08rem;
      &.has-line {
        border-top: 0.01rem solid #999;
      }
      &:first-child {
        border-top: none;
      }
      &:hover {
        background-color: #ecf5ff;
        color: #66b1ff;
      }
      > i, > img {
        width: 0.14rem;
        height: 0.14rem;
        display: inline-block;
      }
      > span {
        font-size: 0.14rem;
        line-height: 0.14rem;
        display: inline-block;
        padding: 0 0.02rem;
      }
    }
  }
</style>
