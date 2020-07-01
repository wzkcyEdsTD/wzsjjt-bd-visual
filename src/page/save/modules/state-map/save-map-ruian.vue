<template>
  <div>
    <div id="map">
      <div class="map1">
        <img id="mapView" src="./images/ruian-map.png" alt/>
        <list class="list1" :data="list" :index="listIndex" @listChange="listChange"></list>
        <total class="total" :total="total"></total>
        <point :data="pointData"></point>
        <steps
          @mouseenter="isEnter=true"
          @mouseleave="isEnter=false"
          class="steps"
          ref='steps'
          :data="timeData"
          :listCount='{count: list.length, index: listIndex}'
          :index="timeDataIndex"
          :isEnter="isEnter"
          @listChange="listChange"
          @changeTimeDataIndex="changeTimeDataIndex"></steps>
      </div>
    </div>
  </div>
</template>
<script>
import point from './modules/point-ruian'
import list from './modules/list'
import total from './modules/total'
import steps from './modules/step'
import saveMap from 'common/js/saveMap'

export default {
  name: 'SaveMapRuiAn',
  mixins: [saveMap],
  components: {
    list,
    total,
    point,
    steps
  }
}
</script>
<style scoped>
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
    background: url("images/map.png");
    background-size: 100% 100%;
  }
  .map1 {
    position: relative;
    width: 45%;
    margin: auto;
    height: auto;
    margin-top: 9%;
  }
  .list1,
  .list2,
  .list3 {
    position: fixed;
    left: 27%;
    top: 0.9rem;
    /* width: 183px;
    height: 58px; */
    line-height: 0.75rem;
  }
  .list2 {
    top: 2.23rem;
  }
  .list3 {
    top: 2.91rem;
  }
  .total {
    position: fixed;
    /* line-height: 75px; */
    left: 52%;
    top: 1rem;
  }
  .bottomlist {
    position: fixed;
    right: 28%;
    bottom: 16%;
    /* line-height: 35px; */
  }
  .steps {
    position: absolute;
    bottom: -15%;
    left: 55%;
    line-height: 0.35rem;
  }
  #mapView {
    width: 100%;
  }
  @media screen and (min-height: 1050px) {
    .map1{
      margin-top: 10.5%;
    }
  }
</style>
