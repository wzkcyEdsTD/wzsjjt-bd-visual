<template>
  <!-- 人员管理 -->
  <div class="management">
    <div class="page_manage">
      <div class="left">
        <manage />
      </div>
      <div class="right">
        <handle />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import handle from "./modules/scheduling/handle"
import manage from "./modules/peo_manage/peo_manage";
/* eslint-disable */
export default {
  name: "management",
  components: {
    handle,
    manage
  }
};
</script>

<style scoped>
.left,.right {
  float: left;
  width: 47%;
}
/* .scheduling{
  overflow-x: scroll !important;
} */
html,body{
   width: 100%;
 }

</style>
