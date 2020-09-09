<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-07-30 16:39:34
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\treeTool\treeTool.vue
-->
<template>
  <div class="coverage">
    <el-popover
      placement="right-end"
      title="图层选择"
      width="280"
      trigger="click"
      class="layerPopover"
      v-model="visible"
    >
      <el-input v-model="filterText" class="treeFilterInput" placeholder="搜索" size="small" />
      <div class="layerTreeContainer">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="id"
          :default-checked-keys="['设施分类']"
          :filter-node-method="filterNode"
          default-expand-all
          @check-change="checkChange"
        />
      </div>
    </el-popover>
    <img
      slot="reference"
      :class="{animated: true, pulse: rotateIn}"
      style="animation-duration: 0.5s;"
      :src="avatar"
      width="59px"
      height="60px"
      @click="visible = !visible"
    />
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters } from "vuex";
import { CESIUM_TREE_OPTION } from "config/server/cesiumTreeOption";
const Cesium = window.Cesium;
export default {
  name: "TreeTool",
  data() {
    return {
      rotateIn: true,
      visible: true,
      filterText: "",
      data: CESIUM_TREE_OPTION,
      imageLayer: {},
      avatar: require("common/images/coverage.png"),
      //  cesium Object
      handler: undefined,
      fgmshow: false,
      fwmshow: false,
    };
  },
  computed: {
    ...mapGetters(["map"]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.handler.destroy();
  },
  methods: {
    eventRegsiter() {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      this.handler.setInputAction((e) => {
        const position = window.earth.scene.pickPosition(e.position);
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const queryPoint = { x: longitude, y: latitude };
        console.log(queryPoint);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },
    checkChange(node, checked, c) {
      if (checked) {
        if (node.componentKey) {
          ["安置房BIM分析", "机场BIM场景", "S1线轨道BIM场景"].filter(
            (v) => v != node.id && this.$refs.tree.setChecked(v, false)
          );
          this.$bus.$emit(node.busEvent, { value: node.componentKey });
        } else if (node.vectorTile) {
          const LAYER = this.imageLayer[node.id];
          LAYER
            ? (LAYER.show = true)
            : (this.imageLayer[
                node.id
              ] = window.earth.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  url: node.url,
                  name: node.id,
                })
              ));
        } else if (node.ids) {
          //注记分类
          var mvtMap = this.$root.fwdata[12];
          var mapboxStyle = mvtMap.mapboxStyle;
          var layers = mapboxStyle.layers;
          for (let j = 0; j < layers.length; j++) {
            if (layers[j].id == node.ids) {
              mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示某个图层
            }
          }
        } else if (node.fwmurl) {
          //倾斜摄影+覆盖面
          const LAYERS = window.earth.scene.layers.find(node.id);
          if (!LAYERS) {
            const PROMISES = window.earth.scene.addS3MTilesLayerByScp(
              node.url,
              {
                name: node.id,
              }
            );
            var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
            var names = node.label.split("(")[0];
            getFeatureParam = new SuperMap.REST.FilterParameter({
              attributeFilter: "NAME like '%" + names + "%'",
            });
            getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
              {
                queryParameter: getFeatureParam,
                toIndex: -1,
                datasetNames: ["172.20.83.196_ersjdata:" + "QXSY"],
              }
            );
            getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
              node.fwmurl,
              {
                eventListeners: {
                  processCompleted: onQueryComplete,
                  processFailed: processFailed,
                },
              }
            );
            getFeatureBySQLService.processAsync(getFeatureBySQLParams);
            function onQueryComplete(queryEventArgs) {
              var selectedFeatures = queryEventArgs.originResult.features;
              for (var i = 0; i < selectedFeatures.length; i++) {
                addFeature(selectedFeatures[i]);
              }
            }
            function processFailed(queryEventArgs) {
              alert("查询失败！");
            }
            function getLonLatArray(points) {
              var point3D = [];
              points.forEach(function (point) {
                point3D.push(point.x);
                point3D.push(point.y);
              });
              return point3D;
            }
            function addFeature(feature) {
              var lonLatArr = getLonLatArray(feature.geometry.points);
              window.earth.entities.add({
                id: node.label + feature.ID,
                name: node.label + feature.ID,
                polyline: {
                  positions: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
                  width: 5,
                  material: new Cesium.Color(0 / 255, 255 / 255, 0, 1),
                  classificationType: Cesium.ClassificationType.S3M_TILE, //矢量线贴对象
                },
              });
            }
            Cesium.when(PROMISES, async (layers) => {
              const _LAYERSW_ = window.earth.scene.layers.find(node.id);
              node.dataBind &&
                _LAYERSW_.setQueryParameter({
                  ...node.dataBind,
                  url: node.dataurl,
                  isMerge: true,
                });
            });
          } else {
            LAYERS.visible = true;
            var fwms = window.earth.entities._entities._array;
            for (let c = 0; c < fwms.length; c++) {
              if (fwms[c]._id.indexOf(node.label) != -1) {
                window.earth.entities._entities._array[c].show = true;
              }
            }
          }
        } else if (node.fgmurl) {//精模+小区范围线
          const LAYERJM = window.earth.scene.layers.find(node.id);
          if (!LAYERJM) {
            const PROMISEJM = window.earth.scene.addS3MTilesLayerByScp(
              node.url,
              {
                name: node.id,
              }
            );
            const FGM = window.earth.scene.addVectorTilesMap({
              url: node.fgmurl,
              canvasWidth: 512,
              name: "fgm" + node.id,
            });
            Cesium.when(PROMISEJM, async (layers) => {
              const _LAYERJM_ = window.earth.scene.layers.find(node.id);
              _LAYERJM_.coverImageryLayer = FGM
              node.dataBind &&
                _LAYERJM_.setQueryParameter({
                  ...node.dataBind,
                  url: node.dataurl,
                  isMerge: true,
                });
            });
          } else {
            LAYERJM.visible = true;
            var layerlengths = window.earth.scene.imageryLayers._layers;
            for (let g = 0; g < layerlengths.length; g++) {
              if (layerlengths[g].imageryProvider._url == node.fgmurl) {
                window.earth.scene.imageryLayers._layers[g].show = true;
              }
            }
          }
        } else if (node.url) {
          const LAYER = window.earth.scene.layers.find(node.id);
          if (!LAYER) {
            const PROMISE = window.earth.scene.addS3MTilesLayerByScp(node.url, {
              name: node.id,
            });
            Cesium.when(PROMISE, async (layers) => {
              console.log(node.label);
              if (node.label == "白模") {
                console.log("白模");
                const bm = window.earth.scene.layers.find("白模");
                var style = bm.style3D;
                var colors = Cesium.Color.CYAN;
                var style3D = new Cesium.Style3D();
                var color = new Cesium.Color(colors);
                style3D.fillForeColor = color;
                bm.style3D = style3D;
                bm.refresh();
              }
              const _LAYER_ = window.earth.scene.layers.find(node.id);
              node.dataBind &&
                _LAYER_.setQueryParameter({
                  ...node.dataBind,
                  url: node.dataurl,
                  isMerge: true,
                });
            });
          } else {
            LAYER.visible = true;
          }
        }
        node.camera &&
          this.setview(
            node.cameraDone
              ? node.camera
              : Cesium.Cartesian3.fromDegrees(...node.camera)
          );
      } else {
        if (node.componentKey) {
          const eventNode = this.$refs.tree
            .getCheckedNodes()
            .filter((v) => v.componentKey);
          this.$bus.$emit(node.busEvent, {
            value: eventNode.length ? eventNode[0].componentKey : null,
          });
        } else if (node.ids) {
          var mvtMap = this.$root.fwdata[12];
          var mapboxStyle = mvtMap.mapboxStyle;
          var layers = mapboxStyle.layers;
          console.log("layers", layers);
          for (let j = 0; j < layers.length; j++) {
            if (layers[j].id == node.ids) {
              mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //隐藏某个图层
            }
          }
        } else {
          const LAYER = node.vectorTile
            ? this.imageLayer[node.id]
            : window.earth.scene.layers.find(node.id);
          LAYER &&
            (node.vectorTile ? (LAYER.show = false) : (LAYER.visible = false));
          //将覆盖面图层隐藏
          if (node.fgmurl) {
            var layerlength = window.earth.scene.imageryLayers._layers;
            console.log(layerlength);
            for (let i = 0; i < layerlength.length; i++) {
              if (layerlength[i].imageryProvider._url == node.fgmurl) {
                window.earth.scene.imageryLayers._layers[i].show = false;
              }
            }
          } else if (node.fwmurl) {
            var fwm = window.earth.entities._entities._array;
            console.log("相机参数1", window.earth.scene.camera.position);
            console.log("相机参数2", window.earth.scene.camera.healing);
            console.log("相机参数3", window.earth.scene.camera.pitch);
            for (let a = 0; a < fwm.length; a++) {
              if (fwm[a]._id.indexOf(node.label) != -1) {
                window.earth.entities._entities._array[a].show = false;
              }
            }
          }
        }
      }
    },
    // 三维定位
    setview(cameraSight) {
      window.earth.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: cameraSight,
        orientation: {
          heading: 5.6326,
          pitch: -0.40149976501196627,
          roll: 6.283185307179572,
        },
      });
    },
  },
};
</script>

<style lang="less">
@import url("./TreeTool.less");
</style>
