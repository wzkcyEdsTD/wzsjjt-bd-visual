<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-07-28 16:38:22
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe" v-if="forceBimData.length">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
<<<<<<< HEAD
      <div class="inforFrameH">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="详细信息" name="bim" class="detailedInformation">
            <button v-if="isMAX2012" @click="openRtmpVideo">查看监控</button>
            <table>
              <tbody>
                <tr
                  v-for="(d,i) in fixedForceBimData"
                  :key="i"
                  v-infinite-scroll="fixedForceBimData"
                >
                  <td>{{d.k}}:</td>
                  <td>{{d.v}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="房间信息" name="room" v-if="fixedForceRoomData.length">
            <div v-if="forceBimIDS.length">
              <button @click="openFloorStructure">查看楼层结构</button>
              <button @click="closeFloorStructure">关闭楼层结构</button>
            </div>
            <table>
              <tbody>
                <tr v-for="(d,i) in fixedForceRoomData" :key="i">
                  <td>{{d.k}}:</td>
                  <td>{{d.v}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <rtmpVideo v-if="isMAX2012 && isRtmpVideoOpen" />
=======
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
        <el-tab-pane label="房间信息" name="room" v-if="forceRoomData.length">
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
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "InfoFrame",
  data() {
    return { activeTab: "bim" };
  },
  computed: {
<<<<<<< HEAD
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    isMAX2012() {
      return ~this.forceBimData.map(item => item.k).indexOf("VIDEO_URL");
    },
    fixedForceBimData() {
      return [
        ...this.forceBimData
          .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
          .map(({ k, v }) => {
            return { k: HASH_KEYS[k] || k, v };
          })
      ];
    },
    fixedForceRoomData() {
      return this.forceRoomData
        .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
        .map(({ k, v }) => {
          return { k: HASH_KEYS[k] || k, v };
        });
    }
=======
    ...mapGetters("map", ["forceBimData", "forceRoomData"]),
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  },
  watch: {
    forceBimData(n, o) {
      n && (this.activeTab = "bim");
    }
  },
  methods: {
<<<<<<< HEAD
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
      "SetForceBimSP"
    ]),
    openRtmpVideo() {
      var SP = "";
      for (let i = 0; i < this.forceBimData.length; i++) {
        if (this.forceBimData[i].k == "VIDEO_URL") {
          SP = this.forceBimData[i].v;
        }
      }
      this.SetForceBimSP(SP);
      this.isRtmpVideoOpen = true;
    },
    openFloorStructure() {
      window.earth.entities.removeAll();
      var LC = "";
      var component = [
        "门",
        "窗",
        "墙",
        "楼板",
        "结构柱",
        "结构框架",
        "梯段",
        "平台"
      ];
      var dataSetNames = component.map(function(value, index) {
        return "第一栋:" + value;
      });
      dataSetNames.push("Block_2D:Block1_2D");
      for (let i = 0; i < this.forceBimData.length; i++) {
        if (this.forceBimData[i].k == "所属楼层") {
          LC = "'" + this.forceBimData[i].v + "'";
        }
      }
      LC = "所属楼层 = " + LC;
      console.log(LC);
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        // name:"墙@第一栋",
        attributeFilter: LC
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: dataSetNames
        //数据源：二维数据
        //数据集：Building
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-Placement_house_onetable/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async res => {
            console.log("查询成功", res.originResult.features);
            var selectedFeatures = res.originResult.features;
            var Polygon_selected = [];
            var unit_list = ["A户型", "B户型", "C户型", "楼梯间"];
            var color_list = [
              new Cesium.Color(1.0, 0.0, 0.0, 0.5),
              new Cesium.Color(1, 1, 0, 0.5),
              new Cesium.Color(0, 112 / 255, 192 / 255, 0.5),
              new Cesium.Color(0, 178 / 255, 80 / 255, 0.5)
            ];
            for (var i = 0; i < selectedFeatures.length; i++) {
              if (selectedFeatures[i].fieldNames.indexOf("部件") == -1) {
                Polygon_selected.push(selectedFeatures[i]);
              }
            }
            for (var i = 0; i < Polygon_selected.length; i++) {
              addFeature(Polygon_selected[i]);
            }
            function addFeature(feature) {
              var unit = feature.fieldValues[10];
              var center = feature.geometry.center;
              var color_type = color_list[unit_list.indexOf(unit)];
              var lonLatArr = getLonLatArray(feature.geometry.points);
              var bottom = feature.fieldValues[8];
              var LSG = feature.fieldValues[7];
              var headheight = parseFloat(bottom) + parseFloat(LSG);
              window.earth.entities.add({
                id: feature.ID,
                name: "单体化标识面",
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
                  material: color_type,
                  height: bottom,
                  extrudedHeight: headheight
                },
                position: Cesium.Cartesian3.fromDegrees(
                  center.x,
                  center.y,
                  headheight + 1
                ),
                label: {
                  text: unit,
                  font: "32px sans-serif",
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2.0
                }
              });
            }
            function getLonLatArray(points) {
              var point3D = [];
              points.forEach(function(point) {
                point3D.push(point.x);
                point3D.push(point.y);
              });
              return point3D;
            }
          },
          processFailed: msg => console.log("查询失败", msg)
        }
      });

      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
      this.$bus.$emit("cesium-3d-floorDIS", true);
    },
    closeFloorStructure() {
      window.earth.entities.removeAll();
      this.$bus.$emit("cesium-3d-floorDIS", false);
    },
=======
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    closeBimFrame() {
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
<<<<<<< HEAD
      this.SetForceBimIDS([]);
    }
  }
=======
    },
  },
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
};
</script>
<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>

<style>
.inforFrameH .el-tabs__nav-wrap {
  height: 67px;
}
.inforFrameH .el-tabs__nav-scroll {
  margin-top: 10px;
}
/* .inforFrameH .el-tabs__item{
  margin-left: 19px;
} */
/*去除下划线 element默认样式坑爹的玩意*/
.inforFrameH .el-tabs__active-bar {
  background-color: transparent !important;
}
/* .inforFrameH .el-tabs__nav-wrap::after {
  position: static !important;
}
.inforFrameH >>> .el-tabs__nav-wrap::after {
  position: static !important;
} */
.inforFrameH .el-tabs__header {
  height: 37px;
}
</style>
