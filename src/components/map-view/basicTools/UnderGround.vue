<!--
 * @Author: eds
 * @Date: 2020-07-28 15:58:33
<<<<<<< HEAD
 * @LastEditTime: 2020-09-03 15:35:00
=======
 * @LastEditTime: 2020-07-28 20:16:55
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\UnderGround.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '290px' }">
    <div class="underground tframe" id="toolbar">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
<<<<<<< HEAD
              <el-button class="elformbtn" @click="digUnderGround"
                >倾斜开挖</el-button
              >
              <el-button class="elformbtn" @click="clearUnderGround"
                >清除</el-button
              >
              <el-button class="elformbtn" @click="closeUnderGround"
                >关闭</el-button
              >
              <br />
              <label class="UnderGroundTitle">图层透明:</label>
              <input
                type="range"
                style="width: 70%; margin-top: 13px"
                value="0"
                min="0"
                max="1"
                step="0.02"
                title="调整地上图层透明度"
                data-bind="value: overGroundAlpha, valueUpdate: 'input'"
              />
=======
              <el-button class="elformbtn" @click="closeUnderGround">关闭</el-button>
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
import { ServiceUrl } from "config/server/mapConfig";
const Cesium = window.Cesium;
<<<<<<< HEAD
const LAYER_NAME = [
  "东方管线",
  // "GSFuShuSheShi",
  // "GSLineNode",
  // "GSLine"
];
=======
import { mapGetters, mapActions } from "vuex";
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
export default {
  name: "UnderGround",
  data() {
    return {
      // cesium Object
      viewer: undefined,
<<<<<<< HEAD
      handlerPolygon: undefined,
      overGroundLayer: undefined,
      globe: undefined,
      scene: undefined,
      tooltip: undefined,
      promise: undefined,
=======
      handler: undefined,
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    };
  },
  created() {
    this.viewer = window.earth;
<<<<<<< HEAD
    this.scene = this.viewer.scene;
    this.scene = this.viewer.globe;
    this.handlerPolygon = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Polygon
    );
    //this.tooltip = this.createTooltip(viewer._element)
=======
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
<<<<<<< HEAD
    //this.clearUnderGround();
    this.handlerPolygon.destroy;
=======
    this.clearUnderGround();
    this.handler = undefined;
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    this.viewer = undefined;
    this.overGroundLayer = undefined;
    this.scene = undefined;
    this.promise = undefined;
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
<<<<<<< HEAD
      //监听滑动条变化，改变alpha的值，设置地表透明度
      var viewModel = {
        color: "#ffffff",
        overGroundAlpha: 0,
      };
      Cesium.when(this.promise, function (layers) {
        //这里要跟图层一起加载，不能放到场景初始化的时候，否则会找不到这个图层导致没有效果进行
        //that.viewer.scene.globe.globeAlpha = 0;
        //获取地球表面的透明度 默认为1 1为不透明 0为完全透明
        //const abc = that.viewer.scene.globe.globeAlpha;
        //这里是用来找到这个场景里的所有图层
        const imageryLayers = window.earth.scene.imageryLayers;
        console.log("image", imageryLayers);
        //找到 YX_2019_SW 图层 这个方法等同于scene.find
        that.overGroundLayer = imageryLayers.get(1);
        //进行图层的透明控制
        Cesium.knockout.track(viewModel);
        var tlbar = document.getElementById("toolbar");
        Cesium.knockout.applyBindings(viewModel, tlbar);
        Cesium.knockout.getObservable(viewModel, "overGroundAlpha").subscribe(
          // 设置地表图层透明度 1为不透明 0为透明
          function (newValue) {
            that.overGroundLayer.transparentBackColorTolerance = newValue;
            if (newValue == 1) {
              that.viewer.scene.globe.globeAlpha = 0;
            } else if (newValue != 1) {
              that.viewer.scene.globe.globeAlpha = 1;
            }
          }
        );
        that.handlerPolygon.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            that.viewer.enableCursorStyle = false;
            that.viewer._element.style.cursor = "";
            $("body").removeClass("drawCur").addClass("drawCur");
          } else {
            that.viewer.enableCursorStyle = true;
            $("body").removeClass("drawCur");
          }
        });
        that.handlerPolygon.movingEvt.addEventListener(function (
          windowPosition
        ) {
          if (windowPosition.x < 2000 && windowPosition.y < 2000) {
            //this.tooltip.setVisible(false);
            return;
          }
          // if (that.handlerPolygon.isDrawing) {
          //   this.tooltip.showAt(
          //     windowPosition,
          //     "<p>点击确定开挖区域中间点</p><p>右键单击结束绘制,进行开挖</p>"
          //   );
          // } else {
          //   this.tooltip.showAt(
          //     windowPosition,
          //     "<p>点击绘制开挖区域第一个点</p>"
          //   );
          // }
        });
        that.handlerPolygon.drawEvt.addEventListener(function (result) {
          if (!result.object.positions) {
            // this.tooltip.showAt(result, "<p>请绘制正确的多边形</p>");
            that.handlerPolygon.polygon.show = false;
            that.handlerPolygon.polyline.show = false;
            that.handlerPolygon.deactivate();
            that.handlerPolygon.activate();
            return;
          }
          var array = [].concat(result.object.positions);
          //this.tooltip.setVisible(false);
          var positions = [];
          for (var i = 0, len = array.length; i < len; i++) {
            //获取经纬度和高度
            var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            if (
              positions.indexOf(longitude) == -1 &&
              positions.indexOf(latitude) == -1
            ) {
              positions.push(longitude);
              positions.push(latitude);
              positions.push(height);
            }
          }
          that.viewer.scene.globe.removeAllExcavationRegion();
          //开挖深度
          that.viewer.scene.globe.addExcavationRegion({
            name: "ggg",
            position: positions,
            height: 1000,
            transparent: false,
          });
          that.handlerPolygon.polygon.show = false;
          that.handlerPolygon.polyline.show = false;
          that.handlerPolygon.deactivate();
          that.handlerPolygon.activate();
        });
        that.handlerPolygon.activate();
      });
    },
    //  初始化BIM场景
    initBimScene() {
      const that = this;
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYER_NAME.map(
          (d) => (this.viewer.scene.layers.find(d).visible = true)
        );
        that.globe = that.viewer.scene.globe;
        //开启地下模式
        that.viewer.scene.undergroundMode = true;
        //设置相机最小缩放距离,距离地表-1000米
        that.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000;
        // 关闭裙边
        that.viewer.scene.terrainProvider.isCreateSkirt = false;
        that.viewer.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            120.793885014263,
            27.8071459704,
            150
          ),
          orientation: {
            heading: 2.3280016887452777,
            pitch: -1.570742020609205,
            roll: 0,
          },
        });
      } else {
        const { UNDERGROUND_SCENE_URL } = BimSourceURL;
        //that.promise = this.viewer.scene.open(UNDERGROUND_SCENE_URL);
        that.promise = window.earth.scene.addS3MTilesLayerByScp(
          "http://172.20.83.223:8098/iserver/services/3D-DongFangGuanXian/rest/realspace/datas/%E4%B8%9C%E6%96%B9%E7%AE%A1%E7%BA%BF/config",
          {
            name: "东方管线",
          }
        );
        // that.promise = window.earth.scene.addS3MTilesLayerByScp(
        //   "http://172.20.83.223:8098/iserver/services/3D-mongodb3/rest/realspace/datas/GSFuShuSheShi/config",
        //   {
        //     name: "GSFuShuSheShi"
        //   }
        // );
        // const GSLine = window.earth.scene.addS3MTilesLayerByScp(
        //   "http://172.20.83.223:8098/iserver/services/3D-mongodb3/rest/realspace/datas/GSLine/config",
        //   {
        //     name: "GSLine"
        //   }
        // );
        // const GSLineNode = window.earth.scene.addS3MTilesLayerByScp(
        //   "http://172.20.83.223:8098/iserver/services/3D-mongodb3/rest/realspace/datas/GSLineNode/config",
        //   {
        //     name: "GSLineNode"
        //   }
        // );
        that.globe = that.viewer.scene.globe;
        //开启地下模式
        that.viewer.scene.undergroundMode = true;
        //设置相机最小缩放距离,距离地表-1000米
        that.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000;
        // 关闭裙边
        that.viewer.scene.terrainProvider.isCreateSkirt = false;
        // that.viewer.scene.camera.setView({
        //   // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        //   destination: {
        //     x: -2885689.43805791,
        //     y: 4865993.322893596,
        //     z: 2991429.755893625,
        //   },
        //   orientation: {
        //     heading: 2.3280016887452777,
        //     pitch: -1.570742020609205,
        //     roll: 0,
        //   },
        // });
        that.viewer.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            120.793885014263,
            27.8071459704,
            150
          ),
          orientation: {
            heading: 2.3280016887452777,
            pitch: -1.570742020609205,
            roll: 0,
          },
        });
      }

      //打开地下管线
      //that.promise = that.viewer.scene.open(UNDERGROUND_SCENE_URL);
      //console.log("管线",that.promise);
    },
    //  倾斜开挖
    digUnderGround() {
      this.eventRegsiter();
    },
    //  关闭地下管线分析模块
=======
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
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    closeUnderGround() {
      console.log("相机参数1", window.earth.scene.camera.position);
      console.log("相机参数2", window.earth.scene.camera.heading);
      console.log("相机参数3", window.earth.scene.camera.pitch);
      console.log("相机参数4", window.earth.scene.camera.roll);
      this.clearUnderGround();
      // 设置地表图层透明度
      this.viewer.scene.globe.globeAlpha = 1;
      LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = false));
      const imageryLayers = window.earth.scene.imageryLayers;
      this.overGroundLayer = imageryLayers.get(1);
      this.overGroundLayer.transparentBackColorTolerance = 0;
      this.$bus.$emit("cesium-3d-event", { value: null });
      this.viewer.scene.camera.setView({
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
    },
<<<<<<< HEAD
    //  清除选中内容
    clearUnderGround() {
      const that = this;
      that.viewer.scene.globe.removeAllExcavationRegion();

      //that.handlerPolygon.polygon.show = false;
      //that.handlerPolygon.polyline.show = false;
    },
=======
    //  清除BIM模块
    clearUnderGround() {},
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  },
};
</script>
<style>
.UnderGroundTitle {
  margin-left: 2px;
  float: left;
}
</style>


