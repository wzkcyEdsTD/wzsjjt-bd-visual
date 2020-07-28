/*
 * @Author: eds
 * @Date: 2020-07-28 11:19:46
 * @LastEditTime: 2020-07-28 14:13:27
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyseFloorSection.js
 */

export const queryFloorByBottom = (context, forceObject, BimSourceURL) => {
  const that = this;
  const { SCENE_DATA_URL } = BimSourceURL;
  $.ajax({
    type: "post",
    url: `${SCENE_SQL_URL}/featureResults.rjson?returnContent=true`,
    data: JSON.stringify({
      datasetNames: ["F-03a_AS-9_merge:Merge_F_03a_AS_9__2018_1"],
      getFeatureMode: "SQL",
      queryParameter: {
        attributeFilter: "",
        ids: true
      }
    }),
    success: result => fn && fn(result),
    error: msg => console.log(msg)
  });
};
