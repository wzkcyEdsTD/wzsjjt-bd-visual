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
      <el-input
        v-model="filterText"
        class="treeFilterInput"
        placeholder="搜索"
        size="small"
      />
      <div class="layerTreeContainer">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="id"
          :default-checked-keys="['注记分类']"
          :filter-node-method="filterNode"
          default-expand-all
          @check-change="checkChange"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.withExtraData">
              <i class="icon-search" @click="showSearchBox(data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
    </el-popover>
    <el-popover
      placement="right-end"
      width="280"
      trigger="click"
      class="layerPopover searchBox"
      v-model="serachBoxVisible"
    >
      <div class="searchHeader">
        <el-input
          v-model="searchText"
          class="searchFilterInput"
          placeholder="温州附近的医院有哪些？"
          size="small"
          @keyup.enter.native="searchFilter"
        />
        <div class="button-container">
          <div class="button-item">
            <i class="icon-common icon-clear" @click="searchClear"></i>
          </div>
          <div class="button-item">
            <i class="icon-common icon-back" @click="backToTree"></i>
          </div>
          <div class="button-item">
            <i class="icon-common icon-search" @click="searchFilter"></i>
          </div>
        </div>
      </div>
      <div class="result-wrapper">
        <ul class="result-list">
          <li
            class="result-item"
            :class="{
              checked: ~hospitalChecked.indexOf(item.attributes.SHORTNAME),
            }"
            v-for="item in extraSearchList"
            :key="item.attributes.SMID"
          >
            <div class="left">
              <p class="name">{{ item.attributes.SHORTNAME }}</p>
              <div class="address">
                <i class="icon-position"></i>
                <span>{{ item.attributes.ADDRESS }}</span>
              </div>
            </div>
            <div class="right">
              <input
                type="checkbox"
                :checked="
                  hospitalChecked.indexOf(item.attributes.SHORTNAME) >= 0
                "
                @click="checkedOne(item)"
              />
            </div>
          </li>
        </ul>
      </div>
    </el-popover>
    <img
      slot="reference"
      :class="{ animated: true, pulse: rotateIn }"
      style="animation-duration: 0.5s"
      :src="avatar"
      width="59px"
      height="60px"
      @click="visible = !visible"
    />
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters, mapActions } from "vuex";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EXTRA_DATA,
  CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
  SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
} from "config/server/cesiumTreeOption";
const Cesium = window.Cesium;

export default {
  name: "TreeTool",
  data() {
    return {
      rotateIn: true,
      visible: true,
      serachBoxVisible: false,
      filterText: "",
      searchText: "",
      forceNode: {},
      extraSearchList: [],
      hospitalChecked: [],
      data: CESIUM_TREE_OPTION,
      imageLayer: {},
      avatar: require("common/images/coverage.png"),
      // handler: undefined,
      //  cesium Object
      entityMap: {},
      featureMap: {}, //  源数据,量小
      dsjdt: "",
    };
  },
  computed: {
    ...mapGetters("map", [
      ...CESIUM_TREE_EXTRA_DATA,
      ...CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
    ]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.eventRegsiter();
  },
  // beforeDestroy() {
  //   this.handler.destroy();
  // },
  methods: {
    ...mapActions("map", ["SetForceBimName"]), //SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY资源图层的参数
    eventRegsiter() {
      // this.handler = new Cesium.ScreenSpaceEventHandler(
      //   window.earth.scene.canvas
      // );
      // this.handler.setInputAction((e) => {
      //   const position = window.earth.scene.pickPosition(e.position);
      //   const cartographic = Cesium.Cartographic.fromCartesian(position);
      //   const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      //   const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      //   const queryPoint = { x: longitude, y: latitude };
      //   console.log(queryPoint);
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    /**
     * 专题数据
     * @param {object} node
     */
    getPOIPickedFeature(node) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID <= 1000`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            const fields = await getIserverFields(url, newdataset);
            treeDrawTool(this, res, node, fields);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },
    checkChange(node, checked, c) {
      if (checked) {
        node.componentEvent &&
          node.componentKey &&
          this.$bus.$emit(node.componentEvent, {
            value: node.componentKey,
          });
        if (node.type == "mvt" && node.id) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;
            //  若该节点有额外数据/模块,则触发
            node.withExtraData
              ? fixTreeWithExtra(
                  this.featureMap[node.id],
                  this[node.withExtraData],
                  node,
                  this
                )
              : null;
          } else {
            this.getPOIPickedFeature(node);
          }
        } else if (node.type == "model") {
          if (node.dlurl) {
            //精模
            //window.earth.scene.globe.globeAlpha = 0;
            var ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
            window.earth.terrainProvider = ellipsoidProvider;
            const LAYERJM = window.earth.scene.layers.find(node.id);
            if (!LAYERJM) {
              const PROMISEJM = window.earth.scene.addS3MTilesLayerByScp(
                node.url,
                {
                  name: node.id,
                }
              );
              const dlurl = window.earth.scene.addS3MTilesLayerByScp(
                node.dlurl,
                {
                  name: "dlurl",
                }
              );
              const zburl = window.earth.scene.addS3MTilesLayerByScp(
                node.zburl,
                {
                  name: "zburl",
                }
              );
              const qturl = window.earth.scene.addS3MTilesLayerByScp(
                node.qturl,
                {
                  name: "qturl",
                }
              );
              const dxurl = window.earth.scene.addS3MTilesLayerByScp(
                node.dxurl,
                {
                  name: "dxurl",
                }
              );
              const lurl = window.earth.scene.addS3MTilesLayerByScp(node.lurl, {
                name: "lurl",
              });
              const newurl = window.earth.scene.addS3MTilesLayerByScp(
                node.newurl,
                {
                  name: "newurl",
                }
              );
              const riverurl = window.earth.scene.addS3MTilesLayerByScp(
                node.riverurl,
                {
                  name: "riverurl",
                }
              );
              console.log("riverurl",riverurl);
              //               console.log("图层高度1", window.earth.scene.layers);
              // var layerlength = window.earth.scene.layers._layers.values;
              // console.log("长度",layerlength)
              // for (let g = 0; g < layerlength.length; g++) {
              //   if (layerlength[g].name == "riverurl") {
              //     console.log("成功1");
              //     layerlength[g].style3D.bottomAltitude = 0.5;
              //     console.log("成功2");
              //   }
              // }
              console.log("图层高度2", window.earth.scene.layers);
              //var styles = new Cesium.Style3D();
              //styles.bottomAltitude = 50;
              //riverurl.style3D = styles;
              //riverurl.refresh();
              Cesium.when(PROMISEJM, async (layers) => {
                const _LAYERJM_ = window.earth.scene.layers.find(node.id);
                node.dataBind &&
                  _LAYERJM_.setQueryParameter({
                    ...node.dataBind,
                    url: node.dataurl,
                    isMerge: true,
                  });
              });
              var mvtMap = this.$root.fwdata[12];
              var mapboxStyle = mvtMap.mapboxStyle;
              var layers = mapboxStyle.layers;
              for (let j = 0; j < layers.length; j++) {
                if (layers[j].type == "line") {
                  mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //显示某个图层
                }
              }
              this.SetForceBimName("精模");

            } else {
              LAYERJM.visible = true;
              this.SetForceBimName("精模");
              var layerlength = window.earth.scene.layers._layers.values;
              for (let i = 0; i < layerlength.length; i++) {
                if (layerlength[i].name == "dlurl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "zburl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "qturl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "dxurl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "lurl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "newurl") {
                  layerlength[i].visible = true;
                }
                if (layerlength[i].name == "riverurl") {
                  layerlength[i].visible = true;
                }
              }
              var mvtMap = this.$root.fwdata[12];
              var mapboxStyle = mvtMap.mapboxStyle;
              var layers = mapboxStyle.layers;
              for (let j = 0; j < layers.length; j++) {
                if (layers[j].type == "line") {
                  mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //显示某个图层
                }
              }
            }
          } else if (node.url) {
            const LAYER = window.earth.scene.layers.find(node.id);
            if (!LAYER) {
              const PROMISE = window.earth.scene.addS3MTilesLayerByScp(
                node.url,
                {
                  name: node.id,
                }
              );
              Cesium.when(PROMISE, async (layers) => {
                if (node.id == "白模") {
                  this.dsjdt = window.earth.imageryLayers.addImageryProvider(
                    new Cesium.SuperMapImageryProvider({
                      layers: "DSJ",
                      url:
                        "http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000",
                    })
                  );
                  const bm = window.earth.scene.layers.find("白模");
                  var style = bm.style3D;
                  bm.selectColorType = Cesium.SelectColorType.REPLACE;
                  var style3D = new Cesium.Style3D();
                  var color = Cesium.Color.fromCssColorString("#696969");
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
              this.dsjdt = window.earth.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  layers: "DSJ",
                  url:
                    "http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000",
                })
              );
            }
          }
        } else if (node.type == "bim") {
          ["安置房BIM分析", "机场BIM场景", "S1线轨道BIM场景"].filter(
            (v) => v != node.id && this.$refs.tree.setChecked(v, false)
          );
        } else if (node.type == "image") {
          const LAYER = this.imageLayer[node.id];
          this.imageLayer[
            node.id
          ] = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              url: node.url,
              name: node.id,
            })
          );
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
              console.log("查询成功", queryEventArgs);
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
        }
        node.camera &&
          this.setview(
            node.cameraDone
              ? node.camera
              : Cesium.Cartesian3.fromDegrees(...node.camera)
          );
      } else {
        window.earth.imageryLayers.remove(this.dsjdt);
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.imageLayer[node.id];
        if (LAYER) {
          LAYER.show = false;
          LAYER.visible = false;
        }
        if (
          node.icon &&
          this.entityMap[node.id] &&
          window.earth.dataSources.length
        ) {
          this.entityMap[node.id].show = false;
          if (node.withExtraData) {
            this[node.saveExtraDataByGeometry]([]);
          }
        }
        if (node.componentKey) {
          const eventNode = this.$refs.tree
            .getCheckedNodes()
            .filter((v) => v.componentKey);
          this.$bus.$emit(node.componentEvent, {
            value: eventNode.length ? eventNode[0].componentKey : null,
          });
        } else if (node.dlurl) {
          this.SetForceBimName([]);
          console.log("相机参数1", window.earth.scene.camera.position);
          console.log("相机参数2", window.earth.scene.camera.heading);
          console.log("相机参数3", window.earth.scene.camera.pitch);
          console.log("相机参数4", window.earth.scene.camera.roll);
          var layerlength = window.earth.scene.layers._layers.values;
          window.earth.scene.terrainProvider = new Cesium.CesiumTerrainProvider(
            {
              url:
                "http://172.20.83.223:8098/iserver/services/3D-dem/rest/realspace/datas/dem@2018dem", // 政务网永嘉地形
              requestWaterMask: true,
            }
          );
          for (let i = 0; i < layerlength.length; i++) {
            if (layerlength[i].name == "dlurl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "zburl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "qturl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "dxurl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "lurl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "newurl") {
              layerlength[i].visible = false;
            }
            if (layerlength[i].name == "riverurl") {
              layerlength[i].visible = false;
            }
          }
          var mvtMap = this.$root.fwdata[12];
          var mapboxStyle = mvtMap.mapboxStyle;
          var layers = mapboxStyle.layers;
          for (let j = 0; j < layers.length; j++) {
            if (layers[j].type == "line") {
              mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示某个图层
            }
          }
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
        } else if (node.fwmurl) {
          const LAYERA = window.earth.scene.layers.find(node.id);
          if (LAYERA) {
            LAYERA.show = false;
            LAYERA.visible = false;
          }
          var fwm = window.earth.entities._entities._array;
          console.log("相机参数1", window.earth.scene.camera.position);
          console.log("相机参数2", window.earth.scene.camera.heading);
          console.log("相机参数3", window.earth.scene.camera.pitch);
          console.log("相机参数4", window.earth.scene.camera.roll);
          for (let a = 0; a < fwm.length; a++) {
            if (fwm[a]._id.indexOf(node.label) != -1) {
              window.earth.entities._entities._array[a].show = false;
            }
          }
        }
      }
    },
    showSearchBox(node) {
      this.visible = false;
      this.serachBoxVisible = true;
      this.forceNode = node;
      this.$nextTick().then(() => this.$refs.tree.setCheckedKeys([node.label]));
      this.searchFilter();
    },
    searchClear() {
      this.searchText = "";
      this.extraSearchList = [];
      this.hospitalChecked = [];
      this.searchFilter();
    },
    backToTree() {
      this.searchClear();
      this.serachBoxVisible = false;
      this.visible = true;
    },
    searchFilter() {
      if (!this.serachBoxVisible) return;
      const withExtraDataGeometry = this[this.forceNode.withExtraDataGeometry];
      const allSearchList = Object.keys(withExtraDataGeometry).map((key) => {
        return withExtraDataGeometry[key];
      });
      this.extraSearchList = this.searchText
        ? allSearchList.filter((item) => {
            return item.attributes.SHORTNAME.indexOf(this.searchText) >= 0;
          })
        : allSearchList;
    },
    checkedOne(item) {
      let idIndex = this.hospitalChecked.indexOf(item.attributes.SHORTNAME);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.hospitalChecked.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.hospitalChecked = [];
        this.hospitalChecked.push(item.attributes.SHORTNAME);

        // 移动到对应实例位置
        const { x, y } = item.geometry;
        window.earth.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(x, y - 0.0042, 500),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0,
          },
        });
        // window.earth.zoomTo({
        //   position: new Cesium.Cartesian3(geometry.x, geometry.y, 0),
        // });
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
