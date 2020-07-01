<template>
  <!-- <div class="left">值班值守</div> -->
  <div class="page_onduty">
    <div class="left">
      <Navi />
    </div>
    <div class="right">
      <router-view />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Navi from './modules/navi/navi'
export default {
  name: "Onduty",
  components: {
    Navi,
  }
};
/* eslint-disable */
</script>

<style scoped lang="less">
.left,
.center,
.right {
  float: left;
}
.left{
  width: 13%;
}
.right{
  width: 87%;
}
</style>


