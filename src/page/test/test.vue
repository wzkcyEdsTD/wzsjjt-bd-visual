<template>
  <div></div>
</template>
<script>
import loading from '../../components/mixins/loading'
import { test } from 'api/test/test'

export default {
  mixins: [loading],
  mounted() {
    test(1).then((data) => {
      console.log(data)
    })
  }
}
</script>
<style scoped lang="less">
</style>
