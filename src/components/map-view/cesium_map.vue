<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-07-28 17:16:36
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <Coverage />
    <RegionSimulateFlood ref="regionsimulateflood" v-if="showSubFrame == '3d1'" />
    <BimAnalyse ref="bimanalyse" v-if="showSubFrame == '3d2'" />
    <StationTour ref="stationtour" v-if="showSubFrame == '3d3'" />
    <!-- <UnderGround ref="underground" v-if="showSubFrame == '3d4'" /> -->
    <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
    <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubTool == '3t2'" />
    <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
    <InfoFrame ref="infoframe" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./cesium_coverage";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
import BimAnalyse from "./basicTools/BimAnalyse";
import StationTour from "./basicTools/StationTour";
// import UnderGround from "./basicTools/UnderGround";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import InfoFrame from "./commonFrame/InfoFrame";
const Cesium = window.Cesium;
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showSubFrame: null,
      showSubTool: null,
    };
  },
  components: {
    Coverage,
    RegionSimulateFlood,
    BimAnalyse,
    StationTour,
    // UnderGround,
    VisualizationAnalyse,
    SectionAnalyse,
    CesiumMapTool,
    InfoFrame,
  },
  mounted() {
    this.init3DMap();
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.showSubFrame = value;
      });
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubTool = value;
      });
    },
    init3DMap() {
      const that = this;
      // 加载地图和影像地图
      var viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false, // 是否显示信息框
        selectionIndicator: true, // 是否显示选取指示器组件
        // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: ServiceUrl.YJDem, // 政务网永嘉地形
        }),
      });
      // 添加三维影像
      var imagelayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.SWImage,
        })
      );
      imagelayer.transparentBackColor = new Cesium.Color(0.0, 0.0, 0.0, 1);
      imagelayer.transparentBackColorTolerance = 0.1;
      // 叠加四大流域范围
      var promiseroute11 = Cesium.GeoJsonDataSource.load(
        "/static/yjjson/四大流域.json"
      );
      promiseroute11
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          var Routes11 = dataSource.entities.values;

          for (var i = 0; i < Routes11.length; i++) {
            var pg = Routes11[i];
            // pg.polygon.material = Cesium.Color.ALICEBLUE.withAlpha(0.0)
            pg.polygon.fill = false;
            pg.polygon.Width = 2;
            // pg.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
            pg.polygon.outline = false;
            // pg.polygon.outlineWidth = 5
            // pg.polygon.outlineColor = Cesium.Color.YELLOW

            var linePositions = pg.polygon.hierarchy._value.positions;
            viewer.entities.add({
              polyline: {
                positions: linePositions,
                material: Cesium.Color.YELLOW,
                width: 2,
                clampToGround: true,
              },
              name: pg.name,
            });
          }
        })
        .otherwise(function (error) {
          window.alert(error);
        });
      // 叠加mvt图层
      viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        canvasWidth: 512,
        name: "testMVT",
        viewer: viewer,
      });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      viewer.scene.camera.setView({
        destination: {
          //方位(direction)
          x: -2885689.43805791,
          y: 4865993.322893596,
          z: 2977614.8110983055,
        },
        orientation: {
          heading: 0.003115109744838307, //方位角(heading)
          pitch: -0.5846590801356228, //俯仰角(pitch)
          roll: 0, //滚动角(roll)
        },
      });
      window.earth = viewer; // 全局变量（优化性能）
      // store.dispatch('cesium', viewer)
      // this.initPop();
      viewer.pickEvent.addEventListener((feature) => {
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        that.SetForceBimData(_data_);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
  }
}
</style>
