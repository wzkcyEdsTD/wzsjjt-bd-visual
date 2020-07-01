<template>
  <div>分析研判
    <button @click="clickme" style="margin-top: 100px">测试</button>
  </div>
</template>

<script>
import loading from '../../components/mixins/loading'
import { mapActions } from 'vuex'

export default {
  name: 'Analysis',
  mixins: [loading],
  methods: {
    clickme() {
      this.SetSpecalTreeName('学校')
      this.$router.push('/map')
    },
    ...mapActions('map', [
      'SetSpecalTreeName'
    ])
  }
}
</script>

<style scoped lang="less">

</style>
