<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
<<<<<<< HEAD
 * @LastEditTime: 2020-09-16 16:21:51
=======
 * @LastEditTime: 2020-07-28 20:12:29
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
<<<<<<< HEAD
  <div class="ThreeDContainer ThreeToTop BimThreeLeft" :style="{width:'125px'}">
=======
  <div class="ThreeDContainer ThreeToTop" :style="{width:'200px'}">
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
<<<<<<< HEAD
              <el-popover placement="top" title="楼层控制" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="true">
                  <!--整栋楼层门窗显隐-->
=======
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree">
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
                  <el-tree
                    :data="wholeBuildingTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree1"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check-change="checkChange"
                  />
                  <!--楼层控制树-->
                  <el-tree
                    :check-on-click-node="true"
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
<<<<<<< HEAD
                    ref="tree"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check="treeHandler"
=======
                    @check-change="checkChange"
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
                  />
                </div>
                <el-button slot="reference">楼层控制</el-button>
              </el-popover>
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
<<<<<<< HEAD
import { queryFloorByBottom } from "./BimAnalyseFloorSection";
import floors from "./floors.json";
import parts from "./parts.json";
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
const LAYER_NAME = "Block1";
const DATASOURCE_NAME = "第一栋";
const DATA_SETS = "门@窗@墙@楼板@结构柱@结构框架@梯段@平台"
  .split("@")
  .map(v => `${DATASOURCE_NAME}:${v}`);
=======
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
const LAYER_NAME = "Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge";
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
export default {
  name: "BimAnalyse",
  data() {
    return {
<<<<<<< HEAD
      shallTree: false,
      keys: [],
      //这个树节点是楼层控制树节点
      BimTreeData: [
        {
          label: "楼层控制",
          id: 1,
          children: []
        }
      ],
      //这个树节点是整栋楼的部件显隐
      wholeBuildingTreeData: [
        {
          label: "整栋楼控制",
          id: 1,
          children: [
            // {
            //   label: "门",
            //   id: 2,
            // },
            // {
            //   label: "窗",
            //   id: 3,
            // },
            // {
            //   label: "墙",
            //   id: 4,
            // },
            // {
            //   label: "楼板",
            //   id: 5,
            // },
            // {
            //   label: "结构柱",
            //   id: 6,
            // },
            // {
            //   label: "结构框架",
            //   id: 7,
            // },
            // {
            //   label: "楼梯",
            //   id: 8,
            // },
            // {
            //   label: "平台",
            //   id: 9,
            // },
          ]
        }
      ],
      BimHash: {},
      endID: 0,
      //  floor IDS
      IDS: [],
      FLOOR_ON: false,
      //  cesium Object
      viewer: undefined,
      handler: undefined,
      lastHouseEntity: undefined,
      //  节流
      count: 0,
      fnScroll: () => {}
    };
  },
  computed: {
    ...mapGetters("map", ["forceBimIDS", "forceBimData"])
  },
  watch: {
    // BimTreeData: {
    //   handler(n, o) {
    //     n[0].children.length == 1 && (this.shallTree = true);
    //   },
    //   deep: true,
    // },
  },
=======
      BimTreeData: [],
      // cesium Object
      viewer: undefined,
      handler: undefined,
      lastHouseEntity: undefined,
    };
  },
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  created() {
    this.viewer = window.earth;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  async mounted() {
    this.initBimScene();
    // this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearBimAnalyse();
    this.handler = undefined;
    this.viewer = undefined;
  },
  methods: {
<<<<<<< HEAD
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS"
    ]),
    // ...mapGetters("map", ["forceBimIDS","forceBimData"]),
    //树节点点击的时候触发的事件
    treeHandler() {
      window.earth.entities.removeAll();
      var ids1 = this.$refs.tree.getCheckedKeys();
      var result = [];
      for (const item of ids1) {
        //这段循环填充result
        if (item > 100) {
          //如果item大于100
          //由于节点里面的item值是101,102,103,104 所以需要除100 对他进行获得层数的操作
          result.push(parseInt(item / 100)); //取层数
          //进行取余 精确获得是第几层的门，第几层的窗···
          switch (item % 100) {
            case 1: //门
              result.push("doors");
              break;
            case 2: //窗
              result.push("windows");
              break;
            case 3: //墙
              result.push("walls");
              break;
            case 4: //地板
              result.push("floors");
              break;
            case 5: //结构柱
              result.push("struct");
              break;
            case 6: //结构框架
              result.push("structframework");
              break;
            case 7: //楼梯
              result.push("stairs");
              break;
            case 8: //平台
              result.push("platform");
              break;
            default:
              break;
          }
        }
      }
      result = [...new Set(result)]; //进行数组的去重
      var IDS = [];
      var floorids = [];
      var partsids = [];
      for (const item of result) {
        if (typeof item == "number") {
          //这里用来进行item的类型判断 如果为number类型
          floors["f" + item].forEach(el => {
            floorids.push(el);
          });
        } else {
          //如果是string类型
          parts[item].forEach(el => {
            partsids.push(el);
          });
        }
      }
      //对这个floorids进行数组进行过滤，查找最大的那个数组中包含的小数组的元素取相同的
      IDS = floorids.filter(item => partsids.indexOf(item) > -1);
      //找到这个楼层
      this.layer = this.viewer.scene.layers.find(LAYER_NAME);
      //让此时这个IDS数组里面的部件为true，就可以显示出对应的楼层
      this.layer.setObjsVisible(IDS, true);
    },
    //获取第几层
    getFloors() {
      let floors = [];
      for (let i = 1; i < 19; i++) {
        floors.push({
          label: `第${i}层`,
          id: i,
          children: this.getFloorParts(i)
        });
      }
      this.BimTreeData[0].children = floors;
    },
    //获取到当前节点已经被勾选上的楼层
    doSqlQuery(arr) {
      let IDS = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element > 0 && element < 19) {
          for (const key in floors) {
            floors["f" + element].forEach(item => {
              IDS.push(item);
            });
          }
        }
      }
      console.log("安置房", IDS);
      this.layer = this.viewer.scene.layers.find(LAYER_NAME);
      this.layer.setObjsVisible(IDS, true);
    },
    // doSqlQuery1(arr) {
    //   console.log(arr);
    //   that.layer = this.viewer.scene.layers.find(LAYER_NAME);
    //   that.layer.setObjsVisible(IDS, true);
    //   return;
    //   console.log("选中的楼层", arr);
    //   const that = this;
    //   if (arr.length == 19) {
    //     //这里用于判断如果树节点的值全部被勾上也就是（19）的时候，复原整栋楼
    //     this.$bus.$emit("cesium-3d-floorDIS", false);
    //     return;
    //   }
    //   //这个方法用来折叠里面的代码，不做任何使用
    //   //里面的代码是用来查询
    //   function zhedie() {
    //     // if (/all/.test(SQL)) {
    //     //   this.$bus.$emit("cesium-3d-floorDIS", false);
    //     //   return;
    //     // }
    //     //let IDS = [];
    //     //for循环 用来控制多选楼层
    //     // for (let j = 0; j < arr.length; j++) {
    //     //   if (arr[j] > 0 && arr[j] < 19) {
    //     //     var SQL = "所属楼层 = '" + arr[j] + "F'";
    //     //     var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    //     //     //这个是用来把SQL传进去
    //     //     getFeatureParam = new SuperMap.REST.FilterParameter({
    //     //       attributeFilter: SQL,
    //     //     });
    //     //     //查找的数据表
    //     //     getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    //     //       queryParameter: getFeatureParam,
    //     //       toIndex: -1,
    //     //       datasetNames: DATA_SETS,
    //     //      // datasetNames: ["第一栋:门"],
    //     //       //dataSourceName：第一栋 name：结构框架
    //     //     });
    //     //     that.layer = this.viewer.scene.layers.find(LAYER_NAME);
    //     //     var url =
    //     //       "http://172.20.83.223:8098/iserver/services/data-Placement_house_onetable/rest/data";
    //     //     getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
    //     //       url,
    //     //       {
    //     //         eventListeners: {
    //     //           processCompleted: (queryEventArgs) => {
    //     //             //获取到当个楼层的所有部件
    //     //             const selectedFeatures = queryEventArgs.originResult.features;
    //     //             for (let i = 0; i < selectedFeatures.length; i++) {
    //     //               const CategoryName = selectedFeatures[i].fieldValues["8"]; //获取部件类型
    //     //               const value = selectedFeatures[i].fieldValues["0"]; //获取SMID值
    //     //               console.log(selectedFeatures[i].fieldValues["0"]);
    //     //               return
    //     //              // const floor = selectedFeatures[i].fieldValues["22"]; //获取到当前的楼层
    //     //               IDS.push(parseInt(value) + this.BimHash[CategoryName] - 1);//每个图层组件的起始id + smid -1 就是当前组件在cesium实例里的真实组件id
    //     //             }
    //     //             //为ture的时，单层楼层可见 此时ids为这个楼层中所有的部件SIMID
    //     //             console.log("新IDS", IDS);
    //     //             that.layer.setObjsVisible(IDS, true);
    //     //             //resolve(IDS);
    //     //           },
    //     //           processFailed: () => {
    //     //             console.log("出错了");
    //     //             alert("查询失败！");
    //     //           },
    //     //         },
    //     //       }
    //     //     );
    //     //     getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    //     //     console.log("查询SQL", SQL);
    //     //   }
    //     // }
    //   }
    // },
    //直接写死门、窗、户····
    getFloorParts(i) {
      let floors = [
        {
          label: `门`,
          id: i * 100 + 1
        },
        {
          label: `窗`,
          id: i * 100 + 2
        },
        {
          label: `墙`,
          id: i * 100 + 3
        },
        {
          label: `楼板`,
          id: i * 100 + 4
        },
        {
          label: `结构柱`,
          id: i * 100 + 5
        },
        {
          label: `结构框架`,
          id: i * 100 + 6
        },
        {
          label: `梯段`,
          id: i * 100 + 7
        },
        {
          label: `平台`,
          id: i * 100 + 8
        }
      ];
      return floors;
    },
    fnThrottle(fn, delay, atleast) {
      //节流函数
      let timer = null;
      let previous = null;
      return function() {
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
=======
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    //  事件绑定
    eventRegsiter() {
      console.log("调用成功");
      const that = this;
<<<<<<< HEAD
      this.$bus.$off("cesium-3d-floorDIS");
      this.$bus.$on("cesium-3d-floorDIS", value => {
        const layer = this.viewer.scene.layers.find(LAYER_NAME);
        if (value) {
          layer.setObjsVisible(this.forceBimIDS, true);
        } else {
          const IDS = [];
          const endID = this.endID;
          for (let i = 0; i < endID + 1; i++) {
            IDS.push(i);
          }
          layer.setObjsVisible(IDS, true);
        }
      });
      let position = window.position;
      !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      that.bindDataSQL({ x: longitude, y: latitude, z: height });
=======
      that.handler.setInputAction((e) => {
        let position = that.viewer.scene.pickPosition(e.position);
        !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        that.bindDataSQL({ x: longitude, y: latitude, z: height });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    },
    //  相机移动
    cameraMove() {
      this.viewer.scene.camera.setView({
        destination: {
<<<<<<< HEAD
          x: -2875539.090787695,
          y: 4842735.556374235,
          z: 2993566.8100139066
        },
        orientation: {
          heading: 0.00000410168472608774,
          pitch: -0.5655332606839059,
          roll: 0
        }
=======
          x: -2875652.7880414873,
          y: 4843023.435651329,
          z: 2993391.653376218,
        },
        orientation: {
          heading: 0,
          pitch: -0.5655775824490981,
          roll: 0,
        },
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
      } else {
        const { SCENE_URL, SCENE_DATA_URL } = BimSourceURL;
        const promise = this.viewer.scene.addS3MTilesLayerByScp(
          "http://172.20.83.223:8090/iserver/services/3D-Placement_house_merge/rest/realspace/datas/Merge_F_03a_AS_9__2018_1@F-03a_AS-9_merge/config",
          {
            name: LAYER_NAME,
          }
        );
<<<<<<< HEAD
        Cesium.when(promise, async layers => {
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
          layer.setQueryParameter({
            url: SCENE_DATA_URL,
            dataSourceName: "第一栋",
            isMerge: true
=======
        console.log("start loading...");
        Cesium.when(promise, async (layers) => {
          console.log("end loading...");
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
          layer.setQueryParameter({
            url: SCENE_DATA_URL,
            dataSourceName: "F-03a_AS-9_merge",
            dataSetName: "Merge_F_03a_AS_9__2018_1",
            isMerge: true,
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
          });
          const color = new Cesium.Color.fromCssColorString(
            "rgba(23,92,239,0.3)"
          );
          layer.selectedColor = color;
<<<<<<< HEAD
          layer.datasetInfo().then(result => {
            console.log("result", result);
            const bimHash = {};
            let endID = 0;
            this.keys = [...this.keys, ...result.map(v => v.datasetName)];
            this.getFloors();
            this.wholeBuildingTreeData[0].children.push({
              id: 0, //DATASOURCE_NAME,
              label: "第1栋", //DATASOURCE_NAME,
              children: result.map((v, index) => {
                bimHash[v.datasetName] = v.startID;
                endID = endID <= v.endID ? v.endID : endID;
                return {
                  id: `${DATASOURCE_NAME}_${index}`,
                  label: v.datasetName,
                  startID: v.startID,
                  endID: v.endID
                };
              })
            });
            this.endID = endID;
            this.bimHash = bimHash;
            console.log(bimHash);
          });
=======
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
        });
      }
    },
    //  属性表SQL查询（三维每）
    bindDataSQL({ x, y, z }) {
      console.log("sql", x, y, z);
      const that = this;
      const { SCENE_SQL_URL } = BimSourceURL;
      $.ajax({
        type: "post",
        url: SCENE_SQL_URL,
        data: JSON.stringify({
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "INTERSECT",
          datasetNames: ["172.20.83.196_swdata:Block_2D"],
          geometry: {
            id: 0,
            parts: [1],
            points: [{ x, y }],
            type: "POINT"
          }
        }),
        success: result => {
          //console.log("result",JSON.parse(result).features)
          that.onQueryComplete(JSON.parse(result).features, z);
        },
        error: msg => {
          console.log(msg);
        }
      });
    },
    //  楼层贴皮
    onQueryComplete(features, height) {
      if (this.lastHouseEntity) {
        this.viewer.entities.remove(this.lastHouseEntity);
        this.lastHouseEntity = null;
        this.SetForceRoomData([]);
      }
      var louceng = "";
      for (let i = 0; i < window.a.length; i++) {
        if (window.a[i].k == "所属楼层") {
          louceng = window.a[i].v;
        }
      }
      const selectedFloors = features.filter(({ fieldNames, fieldValues }) => {
        // const BOTTOM = fieldNames.indexOf("BOTTOM");
         const LSG = fieldNames.indexOf("LSG");
        // const isTheFloor =
        //   BOTTOM > -1 &&
        //   LSG > -1 &&
        //   parseFloat(fieldValues[BOTTOM]) <= height &&
        //   parseFloat(fieldValues[BOTTOM]) + parseFloat(fieldValues[LSG]) >=
        //     height;
        const  longFloor = fieldNames.indexOf("楼层");
        const isTheFloor =
          fieldValues[longFloor] == louceng &&
          LSG > -1;
        return isTheFloor;
      });
      const selectedFeature = selectedFloors.length ? selectedFloors[0] : null;
      if (
        !selectedFeature ||
        !selectedFeature.geometry ||
        !selectedFeature.geometry.points
      )
        return;
      var bottomHeight = Number(
        selectedFeature.fieldValues[
          selectedFeature.fieldNames.indexOf("BOTTOM")
        ]
      );
      var extrudeHeight = Number(
        selectedFeature.fieldValues[selectedFeature.fieldNames.indexOf("LSG")]
      ); // 层高（拉伸高度）
<<<<<<< HEAD
      //  获取该楼层所有ids
      queryFloorByBottom(
        this,
        //Math.floor(bottomHeight / extrudeHeight) + "F",
        louceng,
        // "7F",
        this.bimHash,
        layer
      );
=======
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
      Cesium.GroundPrimitive.bottomAltitude = bottomHeight;
      Cesium.GroundPrimitive.extrudeHeight = extrudeHeight;
      var points3D = [];
      for (var pt of selectedFeature.geometry.points) {
        points3D.push(pt.x, pt.y);
      }
      this.lastHouseEntity = this.viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
          material: new Cesium.Color(223 / 255, 199 / 255, 0 / 255, 0.4)
        },
        clampToS3M: true // 贴在S3M模型表面
      });
      this.SetForceRoomData(
        selectedFeature.fieldNames.map((k, i) => {
          return { k, v: selectedFeature.fieldValues[i] };
        })
      );
    },
    //  树结构改变
    checkChange(...params) {
<<<<<<< HEAD
      window.earth.entities.removeAll();
      const array = [];
      const nodes = this.$refs.tree1
        .getCheckedNodes()
        .filter(v => !v.children)
        .map(v => {
          for (let i = v.startID; i < v.endID + 1; i++) {
            array.push(i);
          }
        });
      const layer = this.viewer.scene.layers.find(LAYER_NAME);
      this.fnThrottle(layer.setObjsVisible(array, true), 1000);
=======
      console.log(params);
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
    },
    //  关闭BIM分析模块
    closeBimAnalyse() {
      this.clearBimAnalyse();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearBimAnalyse() {
      console.log(this.viewer.scene.layers);
      this.viewer.scene.layers.find(LAYER_NAME).visible = false;
    },
    //  关闭详情框
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
