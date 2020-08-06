<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-06 10:42:48
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe" v-if="fixedForceBimData.length">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="详细信息" name="bim">
          <table>
            <tbody>
              <tr v-for="(d,i) in fixedForceBimData" :key="i">
                <td>{{d.k}}</td>
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
                <td>{{d.k}}</td>
                <td>{{d.v}}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
export default {
  name: "InfoFrame",
  data() {
    return { activeTab: "bim" };
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  computed: {
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    fixedForceBimData() {
      return this.forceBimData
        .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
        .map(({ k, v }) => {
          return { k: HASH_KEYS[k] || k, v };
        });
    },
    fixedForceRoomData() {
      return this.forceRoomData
        .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
        .map(({ k, v }) => {
          return { k: HASH_KEYS[k] || k, v };
        });
    },
  },
  watch: {
    forceBimData(n, o) {
      n && (this.activeTab = "bim");
    },
  },
  methods: {
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    openFloorStructure() {
      this.$bus.$emit("cesium-3d-floorDIS", true);
    },
    closeFloorStructure() {
      this.$bus.$emit("cesium-3d-floorDIS", false);
    },
    closeBimFrame() {
      this.closeFloorStructure();
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>
