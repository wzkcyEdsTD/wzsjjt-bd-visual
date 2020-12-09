/*
 * @Author: eds
 * @Date: 2020-07-29 14:46:44
 * @LastEditTime: 2020-09-17 14:17:47
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
  "CATEGORYNAME",
  "TYPEID",
  "TYPENAME",
  "ELEMENTNAME",
  "UNIQUEID",
  "DOCUMENTTITLE",
  "GROUPID",
  "FIELD_SMID",
  "FIELD_SMINDEXKEY",
  "FIELD_SMGEOMETRY",
  "INTERIORFACESAREA",
  "EXTERIORFACESAREA"
];
const BIM_JM = [
  "ALTITUDE",
  "ATT",
  "ATT1",
  "BIMID",
  "BOTTOMALTITUDE",
  "CENTER_X",
  "CENTER_Y",
  "DELTA_NS",
  "DELTA_WE",
  "FEATUREGUID",
  "FEATUREGUID_1",
  "FIELD_SMUSERID",
  "FIELD_SMUSERID_1",
  "GUID",
  "GUID_1",
  "HEIGHT",
  "LATITUDE",
  "LONGITUDE",
  "MODELNAME",
  "MODELNAME_1",
  "PARENTNAME",
  "PARENTNAME_1",
  "SMID",
  "SMUSERID",
  "SURFACEAREA",
  "TOPALTITUDE",
  "VERTEXCOUNT",
  "VOLUME",
  "YEAR",
  "YEAR_1",
  "VIDEO_URL",
];
//const BIM_BUILDING_DETAILS_HASH = { CATEGORYNAME: "部件" };
//const BIM_BUILDING_DETAILS_HASH = { CATEGORYNAME: "部件" };
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
  "SMSDRIW",
  "SMSDRIN",
  "SMSDRIE",
  "SMSDRIS",
  "SMLIBTILEID",
  "SMGEOMETRYSIZE",
  "SMGEOPOSITION",
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
    ...BIM_FINE_MODEL_KEYS,
    ...BIM_JM,
  ])
];

/** 映射字段 */
export const HASH_KEYS = {
  //...BIM_BUILDING_DETAILS_HASH,
  ...BIM_BUILDING_ROOM_HASH,
  ...BIM_AIRSTATION_DETAIL_HASH,
  ...BIM_FINE_MODEL_HASH
};
