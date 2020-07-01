<template>
  <div style="height: 100%">
    <div id="map">
      <div class="map1" @mouseenter="mouseChange(true)" @mouseleave="mouseChange(false)">
        <img id="mapView" src="./images/wencheng-map.png" alt/>
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
import point from './modules/point-wencheng'
import list from './modules/list'
import total from './modules/total'
import steps from './modules/step'
import saveMap from 'common/js/saveMap'

export default {
  name: 'SaveMapWenCheng',
  mixins: [saveMap],
  components: {
    list,
    total,
    point,
    steps
  }
}
</script>
<style scoped lang="less">
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
    background: url("images/map.png");
    background-size: 100% 100%;
  }
  .map1 {
    position: relative;
    width: 40%;
    height: auto;
    margin-top: 3%;
    margin-left: 28%;
  }
  .list1,
  .list2,
  .list3 {
    position: absolute;
    left: -5%;
    top: -0.1rem;
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
    position: absolute;
    /* line-height: 75px; */
    right: -5%;
    top: 0.5rem;
  }
  .bottomlist {
    position: absolute;
    right: -22%;
    bottom: 6%;
    /* line-height: 35px; */
  }
  .steps {
    position: absolute;
    bottom: -8%;
    left: 60%;
    line-height: 0.35rem;
    width: 120% !important;
  }
  #mapView {
    width: 100%;
  }
  /deep/ .map1>.wrapper{
    bottom: 6%;
    right: -2rem;
  }
  @media screen and (min-height: 1050px) {
    .steps {
      bottom: -10%;
    }
    .map1{
      margin-top: 10%;
    }
    .list1,
    .list2,
    .list3 {
      top: -1.1rem;
    }
    .total {
    top: -0.5rem;
  }
  }
</style>
