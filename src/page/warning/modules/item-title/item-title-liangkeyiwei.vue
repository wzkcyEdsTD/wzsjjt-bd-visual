<template>
  <div class="item-title">
    <div class="tit-img"></div>
    <div class="tit-font">
      <span>{{title}}</span>
      <span class="wrapper-btn" v-if="numOne.length || numTwo.length">
        <b @click="changeIndex(0)" v-if="numOne.length" :class="{'active':activeIndex===0}">{{numOne}}</b>
        <b @click="changeIndex(1)" v-if="numTwo.length" :class="{'active':activeIndex===1}">{{numTwo}}</b>
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    numOne: {
      type: String,
      default: ''
    },
    numTwo: {
      type: String,
      default: ''
    },
    colorOne: {
      type: String,
      default: '#0ed6f5'
    },
    colorTwo: {
      type: String,
      default: '#0ed6f5'
    },
    defaultActiveIndex: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: '#f00'
    }
  },
  data() {
    return {
      activeIndex: this.defaultActiveIndex
    }
  },
  methods: {
    changeIndex(index) {
      if (this.activeIndex !== index && this.$parent.monitorType.length && this.$parent.dotIndex === 1) {
        this.dotIndex = (this.$parent.dotIndex + 1) % 2
        let obj = {}
        const list = []
        var findOut = false
        for (let i = 0; i < this.$parent.monitorType.length; i++) {
          if (this.$parent.monitorType[i].alias === this.$parent.point) {
            obj = JSON.parse(JSON.stringify(this.$parent.monitorType[i]))
            // i = this.monitorType.length
            findOut = true
          }
          if (this.$parent.monitorType[i].alias.indexOf(this.$parent.point) >= 0) {
            const obj = JSON.parse(JSON.stringify(this.$parent.monitorType[i]))
            obj.checked = Boolean(this.$parent.dotIndex)
            obj.from = this.$parent.point
            obj.currentType = index
            list.push(obj)
          }
          if (findOut === true) {
            break
          }
        }
        obj.checked = Boolean(this.$parent.dotIndex)
        obj.from = this.$parent.point
        this.$parent.SetCurrentMonitorTypeArr(list)
      }
      this.activeIndex = index
      this.$emit('changeIndex', index)
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .input-with-select.el-input.el-input-group.el-input-group--append {
    width: 1.1rem;
    float: right;
    margin-right: 0.5rem;
    height: 0.24rem;
    margin-top: 0.06rem;
    /deep/ .el-input-group__append {
      padding-left: 0.01rem;
      padding-right: 0.01rem;
      background: transparent;
      border-color: #43bafe;
    }
    .el-input__inner {
      background: transparent;
      border-color: #43bafe;
      color: #fff;
      height:0.24rem;
    }
    button {
      background: transparent;
      color: #43bafe;
      // padding-left: 0.01rem;
      // padding-right: 0.01rem;
    }
  }
  /deep/ .el-input-group--append .el-input__inner, .el-input-group__prepend {
    height: 0.3rem;
  }
  .item-title {
    width: 100%;
    height: 0.35rem;
    .bg-image('./images/bg');
  }
  .tit-img {
    margin-left: 0.1rem;
    margin-top: 0.1rem;
    margin-right: 0.1rem;
    width: 0.03rem;
    height: 0.15rem;
    float: left;
    .bg-image('./images/bg-title');
  }
  .tit-font {
    color: white;
    font-size: 0.18rem;
    line-height: 0.35rem;
    height: 0.35rem;
    font-weight: 700;
    > span {
      float: left;
      display: block;
      &.wrapper-btn {
        padding-left: 0.05rem;
      }
      > b {
        cursor: pointer;
        float: left;
        border: 0.01rem solid #159bfd;
        background-color: transparent;
        color: #159bfd;
        padding: 0 0.1rem;
        font-size: 0.14rem;
        border-radius: 0.02rem;
        height: 0.22rem;
        line-height: 0.22rem;
        margin-top: 0.07rem;
        &.active {
          background-color: #159bfd;
          color: #fff;
        }
      }
    }
  }
</style>
