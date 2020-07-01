/* eslint-disable */
<template>
  <div class="navi">
    <div
      v-for="(value,index) in navList"
      :key="value+index"
      :class="{active:value.router===currentIndex}"
      @click="goRouter(value.router)"
    >{{value.task}}</div>
  </div>
</template>
<script>
/* eslint-disable */
// import "../../icon/iconfont.css";
export default {
  name: "nav1",
  data() {
    return {
      navList: [
        { task: "日 常 排 班", router: "scheduling" },
        { task: "排 班 表 格", router: "workFrom" },
        { task: "案 件 接 报", router: "case_report" },
        { task: "人 员 管 理", router: "management" }
      ],
      currentIndex: "scheduling"
    };
  },
  methods: {
    goRouter(router) {
      this.$router.push({ path: `/onduty/${router}` });
      //当currentIndex=router时active为true
      this.currentIndex = router;
    }
  },
  mounted() {
    //刷新或初始化时先给currentIndex赋值
    let str = this.$router.history.current.path;
    // console.log(this.$router.history)
    let re = /\/\w+$/;
    // console.log(re)
    let arr = str.match(re);
    // console.log(arr)
    str = arr[0].slice(1);
    // console.log(str)
    this.currentIndex = str;
  },

  created() {}
};
</script>
<style>
.navi {
  padding-top: 54px;
  width: 249px;
  height: 910px;
  background: #0f193c;
  overflow-y: scroll;
}
.navi div {
  width: 150px;
  height: 164px;
  font-size: 29px;
  padding: 32px;
  padding-top: 46px;
  padding-left: 46px;
  /* color: #eced30; */
  cursor: pointer;
  color: white;
  line-height: 36px;
  margin-left: 53px;
  margin-bottom: 35px;
  background: url("../../images/img_k.png") no-repeat -40px -60px;
}
.navi .active {
  color: #eced30;
}
</style>
