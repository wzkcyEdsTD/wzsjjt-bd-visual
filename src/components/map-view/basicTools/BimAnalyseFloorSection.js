/*
 * @Author: eds
 * @Date: 2020-07-28 11:19:46
 * @LastEditTime: 2020-07-30 17:24:22
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyseFloorSection.js
 */
import { BimSourceURL } from "config/server/mapConfig";
const { SCENE_SQL_URL } = BimSourceURL;
const URL = `${SCENE_SQL_URL}/featureResults.rjson?returnContent=true`;
const DATASOURCE_NAME = "第一栋";
const DATA_SETS = "组成部分@平台@梯段@楼梯@结构框架@结构柱@顶部扶栏@栏杆扶手@楼板@窗@门@墙"
  .split("@")
  .map(v => `${DATASOURCE_NAME}:${v}`);

/**
 * async SQL query
 * @param {*} datasets
 */
const do_SQL_QUERY = datasetNames => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "post",
      url: URL,
      data: JSON.stringify({
        datasetNames,
        getFeatureMode: "SQL",
        queryParameter: {
          attributeFilter: "",
          ids: true
        }
      }),
      success: result => resolve(result),
      error: msg => reject(msg)
    });
  });
};

/**
 * get SMIDS by floor
 * @param {*} context
 * @param {*} forceObject
 */
export const queryFloorByBottom = (context, forceObject) => {
  const SMIDS = [];
  DATA_SETS.map(async v => {
    const result = await do_SQL_QUERY([v]);
    SMIDS.concat(result.map(v => v.SmID));
  });
  console.log(SMIDS);
};
