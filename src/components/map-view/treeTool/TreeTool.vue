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
        } else if (node.url) {
          const LAYER = window.earth.scene.layers.find(node.id);
          if (!LAYER) {
            const PROMISE = window.earth.scene.addS3MTilesLayerByScp(node.url, {
              name: node.id,
            });
            Cesium.when(PROMISE, async (layers) => {
              if(node.id=="白模"){
                const bm = window.earth.scene.layers.find("白模")
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
        } else {
          const LAYER = node.vectorTile
            ? this.imageLayer[node.id]
            : window.earth.scene.layers.find(node.id);
          LAYER &&
            (node.vectorTile ? (LAYER.show = false) : (LAYER.visible = false));
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
