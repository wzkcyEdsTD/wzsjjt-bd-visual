<template>
  <!-- 排班表格 -->
  <div class="workFrom">
    <div>
        <tab/>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import tab from "./modules/scheduling/table";
export default {
  components: {
    tab
  },
  

};
/* eslint-disable */

</script>

<style scoped>
 html,body{
   width: 100%;
 }
/* .workFrom{
  margin-left: -60px;
} */
</style>

