<template>
  <div class="case_report">
    <div class="case">
      <div class="left">
        <casee />
      </div>
      <div class="right">
        <handle />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import handle from "./modules/scheduling/handle";
/* eslint-disable */
import casee from "./modules/case/case";
export default {
  name: "case_report",
  components: {
    handle,
    /* eslint-disable */
    casee,
  }
};
/* eslint-disable */
</script>

<style scoped>
.left,
.right {
  float: left;
}
/* .scheduling{
  overflow-x: scroll !important;
} */
html,body{
   width: 100%;
 }
 .left,.right{
   width: 47%;
 }
</style>
