<template>
  <div class="item-title flex">
    <div class="tit-font" :class="{isPointer: isPointer}" @click="changeStep"><span>{{title}}</span></div>
    <div class="tit-img_01 flex-1"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ItemOfTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    isPointer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('stateM', ['SetStepName']),
    changeStep() {
      const name = this.title
      this.SetStepName(name)
    }
  }
}
</script>

<style scoped lang="less">
  .item-title {
    width: 100%;
    height: 0.4rem;
    background: url(./images/bg.png);background-repeat:no-repeat;background-size:100%;
  }
  .tit-img {
    margin-top: 0.06rem;
    margin-right: 0.05rem;
    width: 0.3rem;
    height: 0.14rem;
    float: left;
    .bg-image('./images/bg-title');
  }
  .tit-img_01{
    margin-top: 0.1rem;
    width: 57%;
    height: 0.08rem;
    float: left;
    .bg-image('./images/line_01');
  }
  .tit-font {
    color: #28afff;
    font-size: 0.18rem;
    line-height: 0.25rem;
    height: 0.35rem;float:left;font-weight:600;font-family:"é»‘ä½“";
    text-indent: 1.8em;
    .bg-image('./images/bg-title');
    background-size: 0.26rem 0.17rem;
    background-position: 0 0.04rem;
  }
  .tit-font span{
    margin-right:0.1rem;
  }
  .isPointer{
    cursor: pointer;
  }
</style>
