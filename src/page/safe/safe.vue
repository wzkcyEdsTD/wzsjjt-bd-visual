<template>
  <div class="page-safe">
    <iframe id="iframe" src="http://10.36.245.193:9992/safetySupervision" frameborder="0"></iframe>
    <!-- <iframe src="http://yun.pashanhoo.com:8090/zentao/bug-browse-33.html" frameborder="0"></iframe> -->
  </div>
</template>

<script>

export default {
  name: 'Plan',
  mounted() {
    const iframe = document.getElementById('iframe')
    iframe.onload = () => {
      this.$store.dispatch('changeLoad', false)
    }
  }
}
</script>

<style scoped lang="less">
.page-safe{
  width: 100%;
  height: 100%;
  overflow-x : hidden;
  iframe{
    width: 100%;
    height: 100%;
  }
}
</style>
