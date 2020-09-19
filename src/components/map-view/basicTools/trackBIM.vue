<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'117px'}">
    <div class="trackbim tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="cameraMove">视角调整</el-button>
              <el-button class="elformbtn" v-show="false" @click="closeStationTour">关闭</el-button>
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
const LAYER_NAME = [
  "动车南站_站台屋顶",
  "动车南站_地下通道",
  "动车南站_摄像头",
  "动车南站_安全黄线",
  "穿山隧道",
  "动车南站_站台",
  "动车南站_售票厅",
  "动车南站_盲道",
  "动车南站_升降梯",
  "动车南站_站厅屋顶",
  "动车南站_屏蔽门",
  "动车南站_闸机",
  "动车南站_手扶梯",
  "动车南站_指示牌",
  "动车南站_自助终端",
  "动车南站_客服中心",
  "轨道桥墩",
  "动车南站_地下通道吊顶",
  "动车南站_消防设施",
  "动车南站_显示屏",
  "动车南站_市政通道",
];
export default {
  name: "trackBIM",
  data() {
    return {
      shallTree: false,
      keys: [],
      tourOn: false,
      // cesium Object
      viewer: undefined,
      flyManager: undefined,
      count: 0,
      fnScroll: () => {},
    };
  },
  watch: {},
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.initBimScene();
    this.cameraMove()
  },
  beforeDestroy() {
    this.clearStationTour();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    fnThrottle(fn, delay, atleast) {
      //节流函数
      let timer = null;
      let previous = null;
      return function () {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn();
            previous = null;
          }, delay);
        }
      };
    },
    //  相机移动
    cameraMove() {
      this.viewer.scene.camera.setView({
        destination: {
          x: -2866030.9448004854,
          y: 4849762.68619831,
          z: 2991379.081976952,
        },
        orientation: {
          heading: 5.276883674010309,
          pitch: -0.6268642470390189,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      this.viewer.scene.undergroundMode = true;
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYER_NAME.map(
          (d) => (this.viewer.scene.layers.find(d).visible = true)
        );
      } else {
        const { track_URL } = BimSourceURL;
        const promise = this.viewer.scene.open(track_URL);
        Cesium.when(promise, async (layers) => {
          this.viewer.scene.camera.setView({
            destination: {
              x: -2866030.9448004854,
              y: 4849762.68619831,
              z: 2991379.081976952,
            },
            orientation: {
              heading: 5.276883674010309,
              pitch: -0.6268642470390189,
              roll: 0,
            },
          });
          LAYER_NAME.map((d, index) => {
            if (index > 2) return undefined;
            const layer = this.viewer.scene.layers.find(d);
            const color = new Cesium.Color.fromCssColorString(
              "rgba(23,92,239,0.3)"
            );
            layer.selectedColor = color;
            layer.datasetInfo().then((result) => {
              this.keys = [...this.keys, ...result.map((v) => v.datasetName)];
              this.StationTreeData[0].children.push({
                id: d,
                label: d,
                children: result.map((v, index) => {
                  return {
                    id: `${d}_${index}`,
                    label: v.datasetName,
                    k: d,
                    startID: v.startID,
                    endID: v.endID,
                  };
                }),
              });
            });
          });
        });
      }
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = false));
      //this.flyManager && (this.flyManager = undefined);
      //LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = false));
    },
  },
};
</script>
