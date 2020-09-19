<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-08-06 14:12:52
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage />
      <RegionSimulateFlood ref="regionsimulateflood" v-if="showSubFrame == '3d1'" />
      <BimAnalyse ref="bimanalyse" v-if="showSubFrame == '3d2'" />
      <StationTour ref="stationtour" v-if="showSubFrame == '3d3'" />
      <trackBIM ref="trackbim" v-if="showSubFrame == '3d5'" />
      <UnderGround ref="underground" v-if="showSubFrame == '3d4'" />
      <NanTangModel v-if="showSubFrame == '3d6'" />
      <Riversline ref="riversline" v-if="showSubFrame == '3d7'" />
      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
      <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubTool == '3t2'" />
      <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
      <sightline ref="sightline" v-if="showSubTool =='3t4'" />
      <ShadowQuery ref="ShadowQuery" v-if="showSubTool=='3t5'" />
      <InfoFrame ref="infoframe" />
      <MedicalPopup ref="medicalPopup" />
      <MedicalInfoFrame ref="medicalInfoFrame" v-show="isMedicalInfoFrame" />
      <DetailPopup ref="detailPopup" />
      <RtmpVideo />
      <Population />
      <!--注意这边是两个 "==" 而不是一个 ↑-->
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./treeTool/TreeTool";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
import BimAnalyse from "./basicTools/BimAnalyse";
import StationTour from "./basicTools/StationTour";
import trackBIM from "./basicTools/trackBIM";
import Riversline from "./basicTools/Riversline";
import UnderGround from "./basicTools/UnderGround";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import InfoFrame from "./commonFrame/InfoFrame";
import Sightline from "@/components/map-view/basicTools/Sightline";
import ShadowQuery from "@/components/map-view/basicTools/ShadowQuery";
import NanTangModel from "./extraModel/NanTangModel";
import MedicalPopup from "./commonFrame/medicalPopup";
import MedicalInfoFrame from "./commonFrame/MedicalInfoFrame";
import DetailPopup from "./commonFrame/DetailPopup/DetailPopup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      showSubFrame: null,
      showSubTool: null,
      mapLoaded: false,
      handler: undefined,
      datalayer: undefined,
      isMedicalInfoFrame: false,
    };
  },
  computed: {
    ...mapGetters("map", ["medicalListWithGeometry"]),
  },
  components: {
    Coverage,
    RegionSimulateFlood,
    BimAnalyse,
    StationTour,
    trackBIM,
    UnderGround,
    Riversline,
    VisualizationAnalyse,
    SectionAnalyse,
    CesiumMapTool,
    InfoFrame,
    Sightline,
    ShadowQuery,
    NanTangModel,
    MedicalPopup,
    MedicalInfoFrame,
    DetailPopup,
    RtmpVideo,
    Population,
  },
  mounted() {
    this.init3DMap(() => {
      this.mapLoaded = true;
      this.initPostRender();
      this.initHandler();
    });
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth || !this.mapLoaded || !Object.keys(this.$refs).length)
          return;
        //  *****[medicalList] 医疗点位*****
        const medicalList = this.medicalListWithGeometry;
        if (medicalList && medicalList.length) {
          const extent = getCurrentExtent();
          const G_medicalList = [];
          medicalList.map((item) => {
            if (item.geometry && isContainByExtent(extent, item.geometry)) {
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              G_medicalList.push({ ...item, pointToWindow });
            }
          });
          this.$refs.medicalPopup &&
            this.$refs.medicalPopup.doPopup(G_medicalList);
        } else {
          this.$refs.medicalPopup && this.$refs.medicalPopup.doPopup([]);
        }
        //  *****[detailPopup]  详情查看点位*****
        const forceEntity = this.$refs.detailPopup.forceEntity;
        if (forceEntity.extra_data) {
          const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.earth.scene,
            forceEntity.position
          );
          this.$refs.detailPopup.renderForceEntity(pointToWindow);
        }
      });
    },
    initHandler() {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      this.handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick.id || typeof pick.id != "object") return;
        //  *****[detailPopup]  资源详情点*****
        if (pick.id.extra_data) {
          this.$refs.detailPopup.getForceEntity({
            extra_data: pick.id.extra_data,
            fix_data: pick.id.fix_data,
            position: pick.id._position._value,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.SetForceBimData([]);
        this.showSubFrame = value;
      });
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubTool = value;
      });
      this.$bus.$off("cesium-3d-switch");
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = window.earth.scene.layers.find("白模");
        if (_LAYER_) {
          _LAYER_.visibleDistanceMin = !value ? 1400 : 0;
        }
      });
    },
    init3DMap(fn) {
      const that = this;
      // 加载地图和影像地图
      var viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false, // 是否显示信息框
        selectionIndicator: false, // 是否显示选取指示器组件
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

      /*    this.datalayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.DataImage,
        })
      );
  */
      // 叠加mvt图层
      var mvtMap = viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        canvasWidth: 512,
        name: "testMVT",
        viewer: viewer,
      });
      var styles = new Cesium.Style3D();
      styles.bottomAltitude = 50;
      mvtMap.style3D = styles;
      mvtMap.refresh();
      this.$root.fwdata[12] = mvtMap;
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      //viewer.scene.globe.depthTestAgainstTerrain = false;
      window.earth = viewer; // 全局变量（优化性能）
      this.cameraMove();
      fn && fn();
      viewer.pickEvent.addEventListener((feature) => {
        console.log("pickEvent", feature);
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        that.SetForceBimData(_data_);
      });
    },
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
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
