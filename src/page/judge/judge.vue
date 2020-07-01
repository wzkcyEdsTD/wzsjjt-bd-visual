<template>
    <div class="page-judge">
        <iframe id="iframe" :src="src" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
  name: 'AnalysisAndJudge',
  created() {
    console.log(this.$route)
    if (Number(this.$route.query.type) === 2) {
      this.src = 'http://10.36.234.91:8090/SYGD3D/examples/index2.html'
      // this.src = 'http://yun.pashanhoo.com:8090/zentao/bug-browse-33.html'
    } else {
      this.src = 'http://10.36.245.193:9992/simpleAnalysis'
    }
  },
  mounted() {
    const iframe = document.getElementById('iframe')
    console.log(iframe)
    iframe.onload = () => {
      console.log('加载完成')
      this.$store.dispatch('changeLoad', false)
    }
  },
  data() {
    return {
      src: ''
    }
  },
  watch: {
    $route(newVal) {
      if (Number(newVal.query.type) === 2) {
        this.src = 'http://10.36.234.91:8090/SYGD3D/examples/index2.html'
        // this.src = 'http://yun.pashanhoo.com:8090/zentao/bug-browse-33.html'
      } else {
        this.src = 'http://10.36.245.193:9992/simpleAnalysis'
      }
    }
  }
}
</script>
<style scoped lang="less">
.page-judge{
  width: 100%;
  height: 100%;
  overflow-x : hidden;
  iframe{
    width: 100%;
    height: 100%;
  }
}
</style>
