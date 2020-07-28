<!--
 * @Author: eds
 * @Date: 2020-07-28 09:41:59
 * @LastEditTime: 2020-07-28 17:15:31
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\StationTour.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'600px'}">
    <div class="stationtour tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree">
                  <el-tree
                    :data="StationTreeData"
                    show-checkbox
                    node-key="id"
                    @check-change="checkChange"
                  />
                </div>
                <el-button slot="reference">图层选择</el-button>
              </el-popover>
              <el-button class="elformbtn" :disabled="!tourOn" @click="startStationTour">开始漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="pauseStationTour">暂停漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="stopStationTour">停止漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="cameraMove">视角调整</el-button>
              <el-button class="elformbtn" @click="closeStationTour">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
import { mapActions } from "vuex";
const LAYER_NAME = "Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge";
export default {
  name: "StationTour",
  data() {
    return {
      StationTreeData: [],
      tourOn: false,
      // cesium Object
      viewer: undefined,
      flyManager: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
    const routes = new Cesium.RouteCollection(this.viewer.entities);
    routes.fromFile("./static/fpf/机场站内漫游.fpf");
    this.flyManager = new Cesium.FlyManager({
      scene: this.viewer.scene,
      routes: routes,
    });
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.clearStationTour();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.flyManager.stopArrived.addEventListener(function (routeStop) {
        routeStop.waitTime = 0.4; // 在每个站点处停留1s
      });
      that.flyManager.readyPromise.then(() => {
        that.tourOn = true;
      });
    },
    //  相机移动
    cameraMove() {
      this.viewer.scene.camera.setView({
        destination: {
          x: -2889836.1221072627,
          y: 4839196.223723019,
          z: 2985417.9096547803,
        },
        orientation: {
          heading: 5.276883674010309,
          pitch: -0.510722024776082,
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
        const { STATION_SCENE_URL } = BimSourceURL;
        // const promise = this.viewer.scene.open(SCENE_URL);
        const promise = this.viewer.scene.open(STATION_SCENE_URL);
        Cesium.when(promise, async (layers) => {
          layers.map((d) => console.log(d));
        });
      }
    },
    //  树结构改变
    checkChange(...params) {
      console.log(params);
    },
    startStationTour() {
      this.flyManager && this.flyManager.play();
    },
    pauseStationTour() {
      this.flyManager && this.flyManager.pause();
    },
    stopStationTour() {
      this.flyManager && this.flyManager.stop();
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      this.flyManager && (this.flyManager = undefined);
      // this.viewer.scene.layers.find(LAYER_NAME).visible = false;
    },
  },
};
</script>
