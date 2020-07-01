<template>
  <div>
    <div id="map">
      <div class="map1">
        <img id="mapView" src="./images/detail.png" alt/>
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
import point from './modules/point-wenzhou'
import list from './modules/list'
import total from './modules/total'
import steps from './modules/step'
import saveMap from 'common/js/saveMap'

export default {
  name: 'SaveMapWenZhou',
  mixins: [saveMap],
  components: {
    point,
    list,
    total,
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
    height: auto;
    margin-top: 10%;
    margin-left: 25%;
  }
  .list1,
  .list2,
  .list3 {
    position: fixed;
    left: 30%;
    top: 0.65rem;
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
    top: 0.75rem;
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
  @media screen and (max-height: 1050px) {
    .map1 {
      margin-top: 12%;
    }
    .steps {
      bottom:4%;
    }
  }
</style>
