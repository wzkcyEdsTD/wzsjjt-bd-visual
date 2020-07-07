<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-07-07 11:13:07
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <Coverage />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import Coverage from "components/map-view/cesium_coverage";
const Cesium = window.Cesium;

export default {
  components: { Coverage },
  mounted() {
    this.init3DMap();
  },
  methods: {
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
      // 叠加mvt图层
      viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        canvasWidth: 512,
        name: "testMVT",
        viewer: viewer
      });
      // 移除缓冲圈
      $("#loadingbar").remove();
      $(".cesium-widget-credits").hide(); // 隐藏supermap logo
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
