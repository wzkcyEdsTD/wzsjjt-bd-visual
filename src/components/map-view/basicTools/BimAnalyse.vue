<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
 * @LastEditTime: 2020-07-23 10:57:46
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'680px'}">
    <div class="bimanalayse tframe">
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
    <div class="bimframe" v-if="forceBimData.length">
      <div class="_bimframe_">
        <i class="close" @click="closeBimFrame"></i>
        <p>详细信息</p>
        <table>
          <tbody>
            <tr v-for="(d,i) in forceBimData" :key="i">
              <td>{{d.k}}</td>
              <td>{{d.v}}</td>
            </tr>
          </tbody>
        </table>
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
      // cesium Object
      viewer: undefined
    };
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.viewer = undefined;
    this.clearBimAnalyse();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      this.viewer.pickEvent.addEventListener(feature => {
        this.forceBimData = Object.keys(feature).map(k => {
          return { k, v: feature[k] };
        });
        console.log(this.forceBimData);
      });
    },
    //  相机移动
    cameraMove() {
      this.viewer.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: {
          x: -2875652.7880414873,
          y: 4843023.435651329,
          z: 2993391.653376218
        },
        orientation: {
          heading: 0,
          pitch: -0.5655775824490981,
          roll: 0
        }
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
            name: LAYER_NAME
          }
        );
        console.log("start loading...");
        Cesium.when(promise, async layers => {
          console.log("end loading...");
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
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
      }
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
    }
  }
};
</script>

<style lang="less" scoped>
.ThreeDContainer {
  .bimframe {
    position: fixed;
    top: 100px;
    bottom: 40px;
    overflow: hidden;
    right: 30px;
    width: 320px;
    background: rgba(11, 20, 35, 0.8);
    border: 1px solid rgba(81, 161, 201, 0.6);
    color: white;
    box-sizing: border-box;
    padding: 10px;

    ._bimframe_ {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .close {
        position: absolute;
        right: 4px;
        top: 0;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image("../../../page/map/images/zoom-in");
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
          transform: rotate(45deg);
        }
      }
      > p {
        font-size: 20px;
        font-weight: bold;
        line-height: 34px;
      }
      > table {
        tr {
          border-bottom: 1px #fff solid;
        }
        td {
          line-height: 28px;
        }
      }
    }
  }
}
</style>
