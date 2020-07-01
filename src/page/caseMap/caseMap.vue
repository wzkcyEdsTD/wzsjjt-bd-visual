<template>
  <div class="page-map">
    <div class="map">
      <Map ref="map" :onePoint="onePoint"></Map>
    </div>
    <Disaster @addPoint="addPoint"></Disaster>
  </div>
</template>
<script>
import loading from '../../components/mixins/loading'
import Disaster from 'components/disaster/disaster'
import Map from 'components/disaster/map'

export default {
  mixins: [loading],
  data() {
    return {
      onePoint: {}
    }
  },
  methods: {
    addPoint(data) {
      this.onePoint = JSON.parse(JSON.stringify(data))
    }
  },
  components: {
    Disaster,
    Map
  }
}
</script>
<style scoped lang="less">
  /*/deep/ .mapboxgl-control-container {*/
  /*  display: none !important;*/
  /*}*/
</style>
