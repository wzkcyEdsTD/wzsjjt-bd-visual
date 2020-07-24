<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
 * @LastEditTime: 2020-07-24 15:00:29
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'200px'}">
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree">
                  <el-tree
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
                    @check-change="checkChange"
                  />
                </div>
                <el-button slot="reference">图层选择</el-button>
              </el-popover>
              <el-button class="elformbtn" @click="closeBimAnalyse">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bimframe" v-if="forceBimData.length">
      <div class="_bimframe_">
        <i class="close" @click="closeBimFrame"></i>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="详细信息" name="bim">
            <table>
              <tbody>
                <tr v-for="(d,i) in forceBimData" :key="i">
                  <td>{{d.k}}</td>
                  <td>{{d.v}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="房间信息" name="room">
            <table>
              <tbody>
                <tr v-for="(d,i) in forceRoomData" :key="i">
                  <td>{{d.k}}</td>
                  <td>{{d.v}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
const LAYER_NAME = "Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge";
export default {
  name: "BimAnalyse",
  data() {
    return {
      BimTreeData: [],
      forceBimData: [],
      forceRoomData: [],
      activeTab: "bim",
      // cesium Object
      viewer: undefined,
      handler: undefined,
      lastHouseEntity: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearBimAnalyse();
    this.handler = undefined;
    this.viewer = undefined;
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.viewer.pickEvent.addEventListener((feature) => {
        that.forceBimData = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
      });
      that.handler.setInputAction((e) => {
        let position = that.viewer.scene.pickPosition(e.position);
        !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        that.bindDataSQL({ x: longitude, y: latitude, z: height });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //  相机移动
    cameraMove() {
      this.viewer.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: {
          x: -2875652.7880414873,
          y: 4843023.435651329,
          z: 2993391.653376218,
        },
        orientation: {
          heading: 0,
          pitch: -0.5655775824490981,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
      } else {
        const { SCENE_URL, SCENE_DATA_URL } = BimSourceURL;
        // const promise = this.viewer.scene.open(SCENE_URL);
        const promise = this.viewer.scene.addS3MTilesLayerByScp(
          "http://172.20.83.223:8090/iserver/services/3D-Placement_house_merge/rest/realspace/datas/Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge/config",
          {
            name: LAYER_NAME,
          }
        );
        console.log("start loading...");
        Cesium.when(promise, async (layers) => {
          console.log("end loading...");
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
          layer.setQueryParameter({
            url: SCENE_DATA_URL,
            dataSourceName: "F-03a_AS-9_merge",
            dataSetName: "Merge_F_03a_AS_9__2018_1",
            isMerge: true,
          });
          const color = new Cesium.Color.fromCssColorString(
            "rgba(23,92,239,0.3)"
          );
          layer.selectedColor = color;
        });
      }
    },
    //  属性表SQL查询（三维每）
    bindDataSQL({ x, y, z }) {
      const that = this;
      const { SCENE_SQL_URL } = BimSourceURL;
      $.ajax({
        type: "post",
        url: SCENE_SQL_URL,
        data: JSON.stringify({
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "INTERSECT",
          datasetNames: ["172.20.83.196_swdata:Block_2D"],
          geometry: {
            id: 0,
            parts: [1],
            points: [{ x, y }],
            type: "POINT",
          },
        }),
        success: (result) => {
          that.onQueryComplete(JSON.parse(result).features, z);
        },
        error: (msg) => {
          console.log(msg);
        },
      });
    },
    //  楼层贴皮
    onQueryComplete(features, height) {
      if (this.lastHouseEntity) {
        this.viewer.entities.remove(this.lastHouseEntity);
        this.lastHouseEntity = null;
        this.forceRoomData = [];
      }
      const selectedFloors = features.filter(({ fieldNames, fieldValues }) => {
        const BOTTOM = fieldNames.indexOf("BOTTOM");
        const LSG = fieldNames.indexOf("LSG");
        const isTheFloor =
          BOTTOM > -1 &&
          LSG > -1 &&
          parseFloat(fieldValues[BOTTOM]) <= height &&
          parseFloat(fieldValues[BOTTOM]) + parseFloat(fieldValues[LSG]) >=
            height;
        return isTheFloor;
      });
      const selectedFeature = selectedFloors.length ? selectedFloors[0] : null;
      if (
        !selectedFeature ||
        !selectedFeature.geometry ||
        !selectedFeature.geometry.points
      )
        return;
      var bottomHeight = Number(
        selectedFeature.fieldValues[
          selectedFeature.fieldNames.indexOf("BOTTOM")
        ]
      ); // 底部高程
      var extrudeHeight = Number(
        selectedFeature.fieldValues[selectedFeature.fieldNames.indexOf("LSG")]
      ); // 层高（拉伸高度）
      Cesium.GroundPrimitive.bottomAltitude = bottomHeight; // 矢量面贴对象的底部高程
      Cesium.GroundPrimitive.extrudeHeight = extrudeHeight; // 矢量面贴对象的拉伸高度
      var points3D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
      for (var pt of selectedFeature.geometry.points) {
        points3D.push(pt.x, pt.y);
      }
      this.lastHouseEntity = this.viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
          material: new Cesium.Color(223 / 255, 199 / 255, 0 / 255, 0.4),
        },
        clampToS3M: true, // 贴在S3M模型表面
      });
      this.forceRoomData = selectedFeature.fieldNames.map((k, i) => {
        return { k, v: selectedFeature.fieldValues[i] };
      });
    },
    //  树结构改变
    checkChange(...params) {
      console.log(params);
    },
    //  关闭BIM分析模块
    closeBimAnalyse() {
      this.clearBimAnalyse();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    //  清除BIM模块
    clearBimAnalyse() {
      this.viewer.scene.layers.find(LAYER_NAME).visible = false;
    },
    //  关闭详情框
    closeBimFrame() {
      this.forceBimData = [];
      this.forceRoomData = [];
      this.activeTab = "bim";
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./BimAnalyse.less");
</style>
