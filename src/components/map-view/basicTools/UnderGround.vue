<!--
 * @Author: eds
 * @Date: 2020-07-28 15:58:33
 * @LastEditTime: 2020-07-28 20:16:55
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\UnderGround.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'200px'}">
    <div class="underground tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="closeUnderGround">关闭</el-button>
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UnderGround",
  data() {
    return {
      // cesium Object
      viewer: undefined,
      handler: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.clearUnderGround();
    this.handler.destory()
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
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
    initBimScene(fn) {},
    //  关闭BIM分析模块
    closeUnderGround() {
      this.clearUnderGround();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearUnderGround() {},
  },
};
</script>
