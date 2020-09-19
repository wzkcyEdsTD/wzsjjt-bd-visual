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
    ...mapGetters("map", ["forceBimData", "forceRoomData"]),
  },
  watch: {
    forceBimData(n, o) {
      n && (this.activeTab = "bim");
    },
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    closeBimFrame() {
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>
