<template>
  <div class="scheduling">
    <div class="page_onduty">
      <div class="left">
        <record />
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
import record from "./modules/scheduling/record";
export default {
  name: "scheduling",
  components: {
    handle,
    record
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
