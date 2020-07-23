<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-07-23 16:31:57
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
    <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubFrame == '3d3'" />
    <SectionAnalyse ref="sectionanalyse" v-if="showSubFrame == '3d4'" />
    <CesiumMapTool ref="cesiummaptool" v-if="showSubFrame == '3d5'" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./cesium_coverage";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
import BimAnalyse from "./basicTools/BimAnalyse";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import CesiumMapTool from "./basicTools/CesiumMapTool";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null
    };
  },
  components: {
    Coverage,
    RegionSimulateFlood,
    BimAnalyse,
    VisualizationAnalyse,
    SectionAnalyse,
    CesiumMapTool
  },
  mounted() {
    this.init3DMap();
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubFrame = value;
      });
    },
    init3DMap() {
      // 加载地图和影像地图
      var viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false, // 是否显示信息框
        selectionIndicator: true, // 是否显示选取指示器组件
        // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: ServiceUrl.YJDem // 政务网永嘉地形
        })
      });
      // 添加三维影像
      var imagelayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.SWImage
        })
      );
      imagelayer.transparentBackColor = new Cesium.Color(0.0, 0.0, 0.0, 1);
      imagelayer.transparentBackColorTolerance = 0.1;
      // 叠加四大流域范围
      var promiseroute11 = Cesium.GeoJsonDataSource.load(
        "/static/yjjson/四大流域.json"
      );
      promiseroute11
        .then(function(dataSource) {
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
                clampToGround: true
              },
              name: pg.name
            });
          }
        })
        .otherwise(function(error) {
          window.alert(error);
        });
      // 叠加mvt图层
      viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        canvasWidth: 512,
        name: "testMVT",
        viewer: viewer
      });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      viewer.scene.camera.setView({
        destination: {  //方位(direction)
          x: -2885689.43805791,
          y: 4865993.322893596,
          z: 2977614.8110983055
        },
        orientation: {
          heading: 0.003115109744838307,  //方位角(heading)
          pitch: -0.5846590801356228,     //俯仰角(pitch)
          roll: 0                         //滚动角(roll)
        }
      });
      window.earth = viewer; // 全局变量（优化性能）
      // store.dispatch('cesium', viewer)
      // this.initPop();
    }
  }
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
