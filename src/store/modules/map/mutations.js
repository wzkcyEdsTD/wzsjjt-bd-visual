/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-07-28 14:16:11
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\store\modules\map\mutations.js
 */
// 定义修改操作
import * as types from "./mutation-types";

const mutations = {
  [types.SET_COLLAPSE1](state, bool) {
    state.collapse1 = bool;
  },
  [types.SET_COLLAPSE2](state, bool) {
    state.collapse2 = bool;
  },
  [types.SET_LEGEND_SHOW](state, bool) {
    state.legendShow = bool;
  },
  [types.SET_TREE](state, data) {
    state.tree = data;
  },
  [types.SET_CURRENT_MAP_TYPE](state, data) {
    state.currentMapType = data;
  },
  [types.SET_TREE_CHECKED_LIST](state, data) {
    state.treeCheckedList = data;
  },
  [types.SET_TYPE_INDEX](state, data) {
    state.typeIndex = data;
  },
  [types.SET_CURRENT_ONE_POINT](state, data) {
    state.currentOnePoint = data;
  },
  [types.SET_MAP_LOADED](state, data) {
    state.mapLoaded = data;
  },
  [types.SET_SPECAL_TREE_NAME](state, data) {
    state.specalTreeName = data;
  },
  [types.SET_SPLIT_SCREEN](state, data) {
    state.splitScreen = data;
  },
  [types.SET_NAME_LIST](state, data) {
    state.nameList = data;
  },
  [types.SET_FORCE_MAP_TYPE](state, data) {
    state.forceMapTypeBase = data;
  },
<<<<<<< HEAD
  [types.SET_FORCE_BIM_IDS](state, data) {
    state.forceBimIDS = data;
  },
  [types.SET_FORCE_BIM_DATABYTYPE](state, data) {
    state.forceBimDataByType = data;
  },
=======
>>>>>>> 3364ecdc0e13c6a5963175d2223d849284b28271
  [types.SET_FORCE_BIM_DATA](state, data) {
    state.forceBimData = data;
  },
  [types.SET_FORCE_BIM_SP](state,data){
    state.forceBimSP = data;
  },
  [types.SET_FORCE_BIM_NAME](state, data) {
    state.forceBimName = data;
  },
  [types.SET_FORCE_ROOM_DATA](state, data) {
    state.forceRoomData = data;
  },
  [types.SET_HOSPITAL_LIST](state, data) {
    state.hospitalList = data;
  },
  [types.SET_MEDICAL_LIST_WITH_GEOMETRY](state, data) {
    state.medicalListWithGeometry = data;
  },
  [types.SET_MEDICAL_LIST](state, data) {
    state.medicalList = data;
  },
  [types.SET_RTMP_LIST](state, data) {
    state.rtmpList = data;
  },
  [types.SET_IS_INFO_FRAME](state, bool) {
    state.isInfoFrame = bool;
  }
};

export default mutations;
