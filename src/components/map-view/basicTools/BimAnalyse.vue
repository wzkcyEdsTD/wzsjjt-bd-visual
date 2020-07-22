<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
 * @LastEditTime: 2020-07-22 17:14:40
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
  <div class="ThreeDContainer">
    <div class="bimanalayse tframe" :style="{width:'680px'}">
      <el-form>
        <el-row>
          <el-col :span="8" v-if="BimTreeData.length">
            <el-form-item>
              <el-popover placement="top" title="图层选择" width="400" trigger="click">
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
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="closeBimAnalyse">关闭</el-button>
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
export default {
  name: "BimAnalyse",
  data() {
    return {
      BimTreeData: [],
      // cesium Object
      viewer: undefined
    };
  },
  created() {
    this.viewer = window.earth;
  },
  mounted() {
    this.initBimScene(() => {
      this.eventRegsiter();
    });
  },
  beforeDestroy() {
    this.viewer = undefined;
    this.clearBimAnalyse();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      this.viewer.pickEvent.addEventListener(function(feature) {
        console.log(feature);
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const { SCENE_URL, SCENE_DATA_URL } = BimSourceURL;
      // const promise = this.viewer.scene.open(SCENE_URL);
      const promise = this.viewer.scene.addS3MTilesLayerByScp(
        "http://172.20.83.223:8090/iserver/services/3D-Placement_house_merge/rest/realspace/datas/Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge/config",
        {
          name: "Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge"
        }
      );
      console.log("start loading...");
      Cesium.when(promise, async layers => {
        console.log("end loading...");
        const layer = this.viewer.scene.layers.find(
          "Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge"
        );
        layer.setQueryParameter({
          url: SCENE_DATA_URL,
          dataSourceName: "F-03a_AS-9_merge",
          dataSetName: "Merge_F_03a_AS_9__2018_1",
          isMerge: true
        });
        console.log(layer);
        // layer.datasetInfo().then(result => {
        //   console.log(result);
        // });
      });
      fn && fn();
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
    clearBimAnalyse() {}
  }
};
</script>
