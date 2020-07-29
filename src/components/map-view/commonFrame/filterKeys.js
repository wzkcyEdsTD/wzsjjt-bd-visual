/*
 * @Author: eds
 * @Date: 2020-07-29 14:46:44
 * @LastEditTime: 2020-07-29 17:45:46
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\filterKeys.js
 */
const BIM_BUILDING_DETAILS_KEYS = [
  "SMID",
  "SMUSERID",
  "SMINDEXKEY",
  "SMGEOMETRY",
  "ELEMENTID",
  "CATEGORYID",
  "TYPEID",
  "TYPENAME",
  "ELEMENTNAME",
  "UNIQUEID",
  "DOCUMENTTITLE",
  "GROUPID"
];
const BIM_BUILDING_DETAILS_HASH = { CATEGORYNAME: "部件" };

const BIM_BUILDING_ROOM_KEYS = [
  "SMID",
  "SMUSERID",
  "SMAREA",
  "SMPERIMETER",
  "SMGEOMETRY",
  "Z",
  "LSG",
  "BOTTOM",
  "FLOOR",
  "UNIT",
  "BLOCK"
];
const BIM_BUILDING_ROOM_HASH = {};

const BIM_AIRSTATION_DETAIL_KEYS = [
  "SMID",
  "SMUSERID",
  "SMINDEXKEY",
  "SMGEOMETRY",
  "FIELD_SMUSERID",
  "ELEMENTID",
  "SECTIONDIAMETE",
  "TYPEID",
  "TYPENAME",
  "ELEMENTNAME",
  "UNIQUEID",
  "DOCUMENTTITLE",
  "GROUPID"
];
const BIM_AIRSTATION_DETAIL_HASH = {};

const BIM_FINE_MODEL_KEYS = [
  "MODELNAME",
  "PARENTNAME",
  "LONGITUDE",
  "LATITUDE",
  "ALTITUDE",
  "BIMID"
];
const BIM_FINE_MODEL_HASH = {};

/** 过滤字段 */
export const FILTER_KEYS = [
  ...new Set([
    ...BIM_BUILDING_DETAILS_KEYS,
    ...BIM_BUILDING_ROOM_KEYS,
    ...BIM_AIRSTATION_DETAIL_KEYS,
    // ...BIM_FINE_MODEL_KEYS
  ])
];

/** 映射字段 */
export const HASH_KEYS = {
  ...BIM_BUILDING_DETAILS_HASH,
  ...BIM_BUILDING_ROOM_HASH,
  ...BIM_AIRSTATION_DETAIL_HASH,
  // ...BIM_FINE_MODEL_HASH
};
