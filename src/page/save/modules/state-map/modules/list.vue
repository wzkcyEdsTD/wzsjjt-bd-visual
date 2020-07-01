<template>
  <div class="listBox">
    <div
      class="list"
      :class="{active:index1==index}"
      :key="index1"
      @click="itemClick(index1)"
      v-for="(item,index1) in data">
      <div class="tit-font">{{item}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StateMapList',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    itemClick(index) {
      this.$emit('listChange', index)
    }
  }
}
</script>

<style scoped lang="less">
  .list {
    width: 1.83rem;
    height: 0.76rem;
    // .bg-image("../images/middle_sub");
    background: url("../images/middle_sub.png") no-repeat center bottom;
    background-size: 1.83rem 0.85rem;
    cursor: pointer;
  }
  // .list:hover {
  //   // .bg-image("../images/middle_sub_select");
  //   background: url("../images/middle_sub_select.png") no-repeat center 100%;
  //   background-size: 183px 75px;
  //   .tit-font {
  //     color: white;
  //   }
  // }
  .tit-font {
    color: #32beff;
    font-size: 0.16rem;
    // line-height:0.35rem;
    // height: 0.35rem;
    margin-left: -0.03rem;
  }
  .list:hover{
    background: url("../images/middle_sub_select.png") no-repeat center bottom;
    background-size: 1.83rem 0.85rem;
    .tit-font {
      color: white;
    }
  }
  .active {
    background: url("../images/middle_sub_select.png") no-repeat center bottom;
    background-size: 1.83rem 0.85rem;
    .tit-font {
      color: white;
    }
  }
</style>
