/* eslint-disable */
<template>
  <div class="bottom_list">
    <h3>
      <div class="list_name" style="color:#28afff">{{data.name}}</div>
      <div class="list_num">{{data.typeTotalCount}}</div>
    </h3>
    <ul ref='scroll'>
      <div ref="scrollContent">
        <li v-for="(item,index) in data.typeList" :key="index" @click="clickme(item.name === '建筑工程'? '房屋建筑和市政基础设施工程':(item.name === '老旧社区'?'老旧社区（小区）':item.name))" v-show='item.name!=="地质灾害易发区"'>
          <div class="list_name">{{item.name}}</div>
          <div class="list_num">{{item.value}}</div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'StateMapBottomList',
  props: {
    data: {
      type: Object,
      default() {
        return {
          typeList: [],
          typeTotalCount: 0,
          name: ''
        }
      }
    },
    scroll: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        if (this.$refs.scroll) {
          this.$refs.scroll.scrollTop = 0
        }
        this.stopScroll()
        this.$nextTick(() => {
          this.startScroll()
        })
      }
    },
    scroll: {
      handler(val) {
        // 根据值控制是否滚动
        if (val) {
          this.startScroll()
          this.$emit('mouseLeave')
        } else {
          this.stopScroll()
          this.$emit('mouseEnter')
        }
      }
    }
  },
  data() {
    return {
      timer: null
    }
  },
  methods: {
    // clickme(name) {
    //   this.SetSpecalTreeName(name)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme']),
    // 开始滚动
    startScroll() {
      if (!this.$refs.scroll) return
      if (this.timer) this.stopScroll()
      this.timer = setInterval(() => {
        if (!this.$refs || !this.$refs.scroll) {
          this.stopScroll()
          return
        }
        if (this.$refs.scroll.scrollTop + this.$refs.scroll.clientHeight - 20 >= this.$refs.scrollContent.scrollHeight || !this.$refs.scroll || !this.scroll) {
          this.stopScroll()
        } else {
          this.$refs.scroll.scrollTop += 1
        }
      }, 150)
    },
    // 停止滚动
    stopScroll() {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  beforeDestroy() {
    this.stopScroll()
  }
}
</script>

<style scoped lang="less">
  .bottom_list {
    z-index: 200;
    /*width: 1.56rem;*/
    // height: 1.44rem;
  }
  .bottom_list h3 {
    font-size: 0.18rem;
    height: 0.45rem;
    line-height: 0.45rem;
    .bg-image("../images/h3_bg");
  }
  .bottom_list ul {
    font-size: 0.16rem;
    padding: 0.1rem;
    max-height: 2.5rem;
    // height: 250px;
    overflow-y: scroll;
    .bg-image("../images/content_bg");
  }
  li {
    /*width: 1.5rem;*/
    height: 0.16rem;
    margin-bottom: 0.14rem;
    font-size: 0.16rem;
    cursor: pointer;
  }
  .list_name, .list_num {
    float: left;
    text-align: left;
    // width: 0.87rem;
    height: 0.15rem;
    color: white;
    margin-right: 0.15rem;
  }
  .list_num {
    width: 0.28rem;
    height: 0.15rem;
    text-align: right;
    font-size: 0.14rem;
    color: #ffea00;
    float: right
  }
  li .list_num{
    margin-right: 0;
  }
  //大屏适配
  @media screen and (min-height: 1620px) {
    .bottomlist {
      right: -18%;
      bottom: 4%;
    }
  .bottom_list ul{
    max-height: 320px;
  }
  }
  // .list_name:hover{
  //     color: #0fb4d1;
  // }
</style>
