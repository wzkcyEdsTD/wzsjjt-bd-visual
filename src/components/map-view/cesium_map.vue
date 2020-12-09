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
<<<<<<< HEAD
    <div v-if="mapLoaded">
      <Coverage />
      <RegionSimulateFlood
        ref="regionsimulateflood"
        v-if="showSubFrame == '3d1'"
      />
      <BimAnalyse ref="bimanalyse" v-if="showSubFrame == '3d2'" />
      <StationTour ref="stationtour" v-if="showSubFrame == '3d3'" />
      <trackBIM ref="trackbim" v-if="showSubFrame == '3d5'" />
      <UnderGround ref="underground" v-if="showSubFrame == '3d4'" />
      <NanTangModel v-if="showSubFrame == '3d6'" />
      <Riversline ref="riversline" v-if="showSubFrame == '3d7'" />
      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
      <VisualizationAnalyse
        ref="visualizationanalyse"
        v-if="showSubTool == '3t2'"
      />
      <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
      <sightline ref="sightline" v-if="showSubTool == '3t4'" />
      <ShadowQuery ref="ShadowQuery" v-if="showSubTool == '3t5'" />
      <InfoFrame ref="infoframe" />
      <Tsaddress ref="tsaddress" />
      <Jingmoqipao ref="jingmoqipao" />
      <MedicalPopup ref="medicalPopup" />
      <MedicalInfoFrame ref="medicalInfoFrame" v-show="isMedicalInfoFrame" />
      <DetailPopup ref="detailPopup" />
      <RtmpVideo />
      <Population />
      <!--注意这边是两个 "==" 而不是一个 ↑-->
    </div>
=======
    <Coverage />
    <RegionSimulateFlood ref="regionsimulateflood" v-if="showSubFrame == '3d1'" />
    <BimAnalyse ref="bimanalyse" v-if="showSubFrame == '3d2'" />
    <StationTour ref="stationtour" v-if="showSubFrame == '3d3'" />
    <!-- <UnderGround ref="underground" v-if="showSubFrame == '3d4'" /> -->
    <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
    <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubTool == '3t2'" />
    <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
    <Sightline ref="sightline" v-if="showSubTool == '3t4'" />
    <Shadow ref="shadow" v-if="showSubTool =='3t5'"/>
    <InfoFrame ref="infoframe" />
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./cesium_coverage";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
import BimAnalyse from "./basicTools/BimAnalyse";
import StationTour from "./basicTools/StationTour";
<<<<<<< HEAD
import trackBIM from "./basicTools/trackBIM";
import Riversline from "./basicTools/Riversline";
import UnderGround from "./basicTools/UnderGround";
=======
// import UnderGround from "./basicTools/UnderGround";
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import InfoFrame from "./commonFrame/InfoFrame";
<<<<<<< HEAD
import Tsaddress from "./commonFrame/tsaddress";
import Jingmoqipao from "./commonFrame/jingmoqipao";
import Sightline from "@/components/map-view/basicTools/Sightline";
import ShadowQuery from "@/components/map-view/basicTools/ShadowQuery";
import NanTangModel from "./extraModel/NanTangModel";
import MedicalPopup from "./commonFrame/medicalPopup";
import MedicalInfoFrame from "./commonFrame/MedicalInfoFrame";
import DetailPopup from "./commonFrame/DetailPopup/DetailPopup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
=======
import Sightline from "./basicTools/Sightline";
import Shadow from "./basicTools/Shadow";
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      showSubFrame: null,
<<<<<<< HEAD
      showSubTool: null,
      mapLoaded: false,
      handler: undefined,
      datalayer: undefined,
      isMedicalInfoFrame: false,
=======
      showSubTool: true,
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
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
<<<<<<< HEAD
    trackBIM,
    UnderGround,
    Riversline,
=======
    // UnderGround,
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    VisualizationAnalyse,
    SectionAnalyse,
    CesiumMapTool,
    InfoFrame,
    Tsaddress,
    Jingmoqipao,
    Sightline,
<<<<<<< HEAD
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
=======
    Shadow,
  },
  mounted() {
    this.init3DMap();
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceJMData"]),
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
        var position = window.earth.scene.pickPosition(e.position);
        window.position = position;
        if (pick.primitive.name == "精模") {
          console.log("相机参数1", window.earth.scene.camera.position);
          console.log("相机参数2", window.earth.scene.camera.heading);
          console.log("相机参数3", window.earth.scene.camera.pitch);
          console.log("相机参数4", window.earth.scene.camera.roll);
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          console.log("笛卡尔坐标之后", window.earth.scene.canvas.height,position);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          console.log("高度", longitude, latitude);
          var centeroptX = parseFloat(longitude);
          var centeroptY = parseFloat(latitude);
          var arg1 = centeroptY;
          var arg2 = 0.004054;
          var r1, r2, m, n;
          try {
            r1 = arg1.toString().split(".")[1].length;
          } catch (e) {
            r1 = 0;
          }
          try {
            r2 = arg2.toString().split(".")[1].length;
          } catch (e) {
            r2 = 0;
          }
          m = Math.pow(10, Math.max(r1, r2));
          //动态控制精度长度
          n = (r1 = r2) ? r1 : r2;
          var b = ((arg1 * m - arg2 * m) / m).toFixed(n);
          var centeropt = {
            y: parseFloat(b),
            x: parseFloat(centeroptX),
            z: 200,
            heading: 6.174710006191949,
            pitch: -0.2350783651746684,
            roll: 6.283185307179577,
          };
          window.earth.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              centeropt.x,
              centeropt.y,
              centeropt.z
            ), //经度、纬度、高度
            orientation: {
              heading: centeropt.heading,
              pitch: centeropt.pitch,
              roll: centeropt.roll,
            },
            duration: 3,
          });
          var canvasHeight = window.earth.scene.canvas.height;
          var scenePosition = window.earth.scene.camera.position;
          var windowPosition = new Cesium.Cartesian2();
          console.log("window.earth.scene",window.earth.scene);
          console.log("scenePosition",scenePosition);
          console.log("windowPosition",windowPosition);
          Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.earth.scene, scenePosition, windowPosition);
          console.log("坐标测试",windowPosition.y);
        }

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
    init3DMap() {
      const that = this;
      // 加载地图和影像地图
      //       var viewer = new Cesium.Viewer("cesiumContainer", {
      //   infoBox: false, // 是否显示信息框
      //   selectionIndicator: false, // 是否显示选取指示器组件
      //   // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
      //   terrainProvider: new Cesium.CesiumTerrainProvider({
      //     url: ServiceUrl.YJDem, // 政务网永嘉地形
      //   }),
      // });

      // // 添加三维影像
      // var imagelayer = viewer.imageryLayers.addImageryProvider(
      //   new Cesium.SuperMapImageryProvider({
      //     url: ServiceUrl.SWImage,
      //   })
      // );
      // imagelayer.transparentBackColor = new Cesium.Color(0.0, 0.0, 0.0, 1);
      // imagelayer.transparentBackColorTolerance = 0.1;
      // var viewer = new Cesium.Viewer("cesiumContainer", {
      //   infoBox: false, // 是否显示信息框
      //   selectionIndicator: false, // 是否显示选取指示器组件
      //   // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
      //   terrainProvider: new Cesium.CesiumTerrainProvider({
      //     url: ServiceUrl.YJDem, // 政务网永嘉地形
      //   }),
      // });
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
      //console.log("mvt",this.$root.fwdata[12]);
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      //viewer.scene.globe.depthTestAgainstTerrain = false;
      window.earth = viewer; // 全局变量（优化性能）
      this.cameraMove();
      fn && fn();
      viewer.pickEvent.addEventListener((feature) => {
        //console.log("pickEvent", feature);
        //console.log("点的位置", window.earth.scene.pickPosition(e.position));
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        var azf = false;
        for (let i = 0; i < _data_.length; i++) {
          if (_data_[i].k == "所属楼层") {
            azf = true;
            break;
          }
        }
        if (azf) {
          that.SetForceBimData(_data_);
          window.a = _data_;
          this.$refs.bimanalyse.eventRegsiter();//先调用详细信息后在调用房间信息防止楼板信息不再同一层的
          //console.log("安置房",_data_);
          //console.log("window.a初始化",window.position);
        } else {
          that.SetForceJMData(_data_);
          //console.log("精模");
        }
        //console.log("数据服务参数",_data_);
        //that.SetForceBimData(_data_);
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
<<<<<<< HEAD
=======
      window.earth = viewer; // 全局变量（优化性能）
      // store.dispatch('cesium', viewer)
      // this.initPop();
      viewer.pickEvent.addEventListener((feature) => {
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        that.SetForceBimData(_data_);
      });
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
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
