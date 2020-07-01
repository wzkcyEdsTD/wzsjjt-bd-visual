<template>
  <div class="wrapper">
    <div class="btn-wrapper">
      <div class="bt btClick" :class="{active : currentIndex === 0}" @click="changeCurrentIndex(0)">
        <img src="./images/list.png" class="button1"/>
      </div>
      <list v-if="currentIndex===0" @close="changeCurrentIndex"></list>
    </div>
    <TyphoonInfo></TyphoonInfo>
  </div>
</template>

<script>
import List from './list'
import TyphoonInfo from '../qixiangxinxi/modules/typhoon-info'

export default {
  data() {
    return {
      currentIndex: -1
    }
  },
  mounted() {
  },
  methods: {
    changeCurrentIndex(num) {
      if (this.currentIndex === num) {
        this.currentIndex = -1
      } else {
        this.currentIndex = num
      }
    }
  },
  components: {
    List,
    TyphoonInfo
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    .btn-wrapper {
      position: relative;
      .bt {
        width: 0.28rem;
        height: 0.28rem;
        cursor: pointer;
        background-color: rgba(56, 203, 218, 0.4);
        border: 0.02rem solid #38cbda;
        font-size: 0;
        &:hover, &.active {
          background-color: rgba(56, 203, 218, 1);
        }
      }
      .button1 {
        width: 0.18rem;
        height: 0.18rem;
        margin: 0.03rem;
      }
    }
  }
</style>
