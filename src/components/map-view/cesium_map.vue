<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-07-20 17:17:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <Coverage />
    <RegionSimulateFlood ref="regionsimulateflood" v-show="showSubFrame == '3d1'" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import Coverage from "./cesium_coverage";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null
    };
  },
  components: { Coverage, RegionSimulateFlood },
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
        skyAtmosphere: false, // 环绕地球边缘的蓝天和光晕效果，设置为false可将其关闭
        selectionIndicator: false, // 是否显示选取指示器组件
        // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: ServiceUrl.YJDem, // 政务网永嘉地形
          isSct: true // 地形服务源自SuperMap iServer发布时需设置isSct为true
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
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: Cesium.Cartesian3.fromDegrees(
          120.644676,
          27.8107288,
          55429.2629411
        ), // 120.68, 28.15, 8709.442331966013),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: -0.9557297073992652,
          roll: 6.283185307179579
          // 方位(direction)、上方向(up)以及方位角(heading)、俯仰角(pitch)、滚动角(roll)
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
