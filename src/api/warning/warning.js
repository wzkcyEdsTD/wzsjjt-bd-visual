/**
 * warning接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取监测预警分类信息ok
 * @returns {*}
 */
export function getRoleMonitorCategory() {
  const url = '/coverage/coverage/getRoleMonitorCategory'
  return get(url)
}

/**
 * 危化企业监测ok
 * @returns {*}
 */
export function getChemicalMonitorMainByUser() {
  const url = '/monitor/getChemicalMonitorMainByUser'
  return get(url)
}

/**
 * 瓯江口实时潮位
 * @returns {*}
 */
export function tideHighOJK() {
  const url = '/monitor/tideHighOJK'
  return get(url)
}

/**
 * 两客一危企业ok
 * @returns {*}
 */
export function getEnterpriseMainByUser(type, plate) {
  const url = '/monitor/getEnterpriseMainByUser'
  return get(url, { type, plate })
}

/**
 * 卫星云图
 * @returns {*}
 */
export function getLocalCloud() {
  const url = '/monitor/getLocalCloud'
  return get(url)
}

/**
 * 水情监测ok
 * @returns {*}
 */
export function getNatureDisasterByUser(type, riverType) {
  const url = '/monitor/getNatureDisasterByUser'
  return get(url, type, riverType)
}

/**
 * 积水点ok
 * @returns {*}
 */
export function getPondingMainByUser(type) {
  const url = '/monitor/getPondingMainByUser'
  return get(url, { type })
}

/**
 * 降雨分析
 * @returns {*}
 */
export function getRain() {
  const url = '/monitor/getRain'
  return get(url)
}

/**
 * 根据smid查询雨情详情 -不做
 * @returns {*}
 */
export function getRainMonitorDetailBySmid() {
  const url = '/monitor/getRainMonitorDetailBySmid'
  return get(url)
}

/**
 * 雨情监控ok
 * @returns {*}
 */
export function getRainMonitorMainByUser(type, timeType, time) {
  const url = '/monitor/getRainMonitorMainByUser'
  return get(url, { type: type, timeType: timeType, time: time })
}

/**
 * 气温监控
 * @returns {*}
 */
export function getQXTempMonitorMainByUser() {
  const url = '/monitor/getQXTempMonitorMainByUser'
  return get(url)
}

/**
 * 根据smid查询景区客流量详情-不做
 * @returns {*}
 */
export function getScenicDetailBySmid() {
  const url = '/monitor/getScenicDetailBySmid'
  return get(url)
}

/**
 * 景区ok
 * @returns {*}
 */
export function getScenicMainByUser() {
  const url = '/monitor/getScenicMainByUser'
  return get(url)
}

/**
 * 台风列表ok
 * @returns {*}
 */
export function getTyphoon() {
  const url = '/monitor/getTyphoon'
  return get(url)
}

/**
 * 台风列表-年份
 * @returns {*}
 */
export function getTyphoonForYear(year) {
  const url = '/typhoon/list/' + year
  return get(url)
}

/**
 * 台风详情ok
 * @param tfbh
 * @returns {*}
 */
export function getTyphoonDetail(tfbh) {
  const url = '/typhoon/history/' + tfbh
  return get(url)
}

/**
 * 气象雷达
 * @returns {*}
 */
export function getWeather() {
  const url = '/monitor/getWeather'
  return get(url)
}

/**
 * 天气预报ok
 * @returns {*}
 */
export function getWeatherReport() {
  const url = '/monitor/getWeatherReport'
  return get(url)
}

/**
 * 预警ok
 * @returns {*}
 */
export function getWeatherWarn() {
  const url = '/monitor/getWeatherWarn'
  return get(url)
}

/**
 * 获取第三方通用数据
 * @param src
 * @returns {*}
 */
export function getCommonWeather(src) {
  const url = '/monitor/getCommonWeather'
  return get(url, { url: src })
}

/**
 * 视频列表
 * @param src
 * @returns {*}
 */
export function getVideoType() {
  const url = '/monitor/getVideoType'
  return get(url)
}

/**
 * 获取视屏信息
 * @returns {*}
 */
export function getCityVideoInfo(district, name, page, pageSize, type) {
  const url = '/monitor/getCityVideoInfo'
  return get(url, { district, name, page, pageSize, type })
}

/**
 * 获取监控摄像头分类
 * @returns {*}
 */
export function getMonitorCamera() {
  const url = '/coverage/coverage/getMonitorCamera'
  return get(url)
}

/**
 * 查询雨情列表
 * @returns {*}
 */
export function getTimeRainInfo(time, districtName, type) {
  const url = '/monitor/getTimeRainInfo'
  return get(url, { time: 0, name: districtName, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询区域测站雨情
 * @returns {*}
 */
export function getDistructRainInfo(time, type) {
  const url = '/monitor/getDistructRainInfo'
  return get(url, { time: 0, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询渔船信息
 * @returns {*}
 */
export function getFishBoatInfo(name) {
  const url = '/monitor/getFishBoatInfo'
  return get(url, { name })
}

/**
 * 查询渔船信息
 * @returns {*}
 */
export function getFishBoatDetailSmid(smid) {
  const url = '/monitor/getFishBoatDetailSmid'
  return get(url, { smid: smid })
}

/**
 * 获取区县和类别
 * @returns {*}
 */
export function getDistrictAndTypeInfo() {
  const url = '/monitor/getDistrictAndTypeInfo'
  return get(url)
}

/**
 * 获取风力列表
 * @returns {*}
 */
export function getQXWindMonitor() {
  const url = '/monitor/getQXWindMonitor'
  return get(url)
}

/**
 * 获取风力列表
 * @returns {*}
 */
export function getQXWindDetail(smid) {
  const url = '/monitor/getQXWindDetail'
  return get(url, { smid })
}

/**
 * 获取视频列表
 * @returns {*}
 */
export function getVideoInfo(code, name) {
  const url = '/coverage/coverage/getMonitorCamera'
  return get(url, { '区县码': code, name: name })
}

/**
 * 获取所有视频列表
 * @returns {*}
 */
export function getAllMonitorCamera(name) {
  const url = '/coverage/coverage/getAllMonitorCamera'
  return get(url, { name })
}

/**
 * 获取所有收藏视频列表
 * @returns {*}
 */
export function getAllUserMonitorCamera(name) {
  const url = '/coverage/coverage/getAllUserMonitorCamera'
  return get(url, { name })
}

/**
 * 获取区县的一级分类
 * @returns {*}
 */
export function getFirstVideoLevel() {
  const url = '/videoMonitor/getFirstVideoLevel'
  return get(url)
}

/**
 * 获取视频目录树
 * @returns {*}
 */
export function getVideoTree(code, id, idCollection, name, smidList) {
  const url = '/videoMonitor/getVideoTree'
  return get(url, { code, id, idCollection, name, smidList })
}

/**
 * 获取视频二级目录树
 * @returns {*}
 */
export function getVideoTreeDetail(code, id, idCollection, name, smidList) {
  const url = '/videoMonitor/getVideoTreeDetail'
  return get(url, { code, id, idCollection, name, smidList })
}

/**
 * 获取视频列表
 * @returns {*}
 */
export function getMonitorCameraDetail(name, datatype, district) {
  console.log(name)
  const url = '/coverage/coverage/getMonitorCameraDetail'
  return get(url, { datatype: datatype, cameraName: name, district: district })
}

/**
 * 获取监测预警配置
 * @returns {*}
 */
export function getJCYJMenuOrder(code) {
  const url = '/columnInfo/getJCYJMenuOrder'
  return get(url)
}

/**
 * 获取地灾列表信息
 * @returns {*}
 */
export function getPointInfo() {
  const url = '/monitor/getPointInfo'
  return get(url)
}

/**
 * 获取雨量设备信息
 * @returns {*}
 */
export function getRainDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getRainDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取倾角设备信息
 * @returns {*}
 */
export function getIncDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getIncDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取GPS设备信息
 * @returns {*}
 */
export function getPointGpsDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getPointGpsDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取地表位移设备信息
 * @returns {*}
 */
export function getPointDispDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getPointDispDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取预警信息
 * @returns {*}
 */
export function getWarningByUser() {
  const url = '/monitor/getWarningByUser'
  return get(url)
}

/**
 * 单兵设备
 * @param src
 * @returns {*}
 */
export function getIndividualData() {
  const url = '/monitor/getIndividualData'
  return get(url)
}

export function getPointList() {
  const url = '/monitor/getPointList'
  return get(url)
}

/**
 * 水闸监测
 * @param src
 * @returns {*}
 */
export function getWaterGateMainByUser() {
  const url = '/monitor/getWaterGateMainByUser'
  return get(url)
}

/**
 * 预警列表
 * @param src
 * @returns {*}
 */
export function getWarnList(name, end_time, start_time, warn_type) {
  const url = '/monitor/getWarnList'
  return get(url, { name, end_time, start_time, warn_type })
}

/**
 * 地灾监测列表
 * @param src
 * @returns {*}
 */
export function getDeviceList(name) {
  const url = '/monitor/getDeviceList'
  return get(url, { name })
}

/**
 * 地灾监测详情
 * @param src
 * @returns {*}
 */
export function getDeviceDetail(dataType, deviceId, startTime, endTime, tablename, timeType) {
  const url = '/monitor/getDeviceDetail'
  return get(url, { dataType, deviceId, startTime, endTime, tablename, timeType })
}

/**
 * 卫星电话
 * @param src
 * @returns {*}
 */
export function getSatellitePhone() {
  const url = '/monitor/getSatellitePhone'
  return get(url)
}

/**
 * 通用转发
 * @param src
 * @returns {*}
 */
export function forward(src) {
  const url = '/typhoon/forward'
  return get(url, { 'url': src })
}

/**
 * 通用转发图片
 * @param src
 * @returns {*}
 */
export function forwardAFileAll(src, bool) {
  const url = '/typhoon/forwardAFileAll'
  if (bool === undefined) {
    bool = true
  }
  return get(url, { 'url': src, 'isBase': bool })
}

/**
 * 查询水闸详情
 * @returns {*}
 */
export function getWaterGateDetailBySmid(smid, start_time, end_time) {
  const url = '/monitor/getWaterGateDetailBySmid'
  return get(url, { smid, start_time, end_time })
}

/**
 * 获取水利服务URL详情
 * @returns {*}
 */
export function getServiceUrl() {
  const url = '/monitor/getServiceUrl'
  return get(url)
}

/**
 * 获取洞头水情监测列表
 * @returns {*}
 */
export function getDTWaterMonitorMain() {
  const url = '/monitor/getDTWaterMonitorMain'
  return get(url)
}

/**
 * 获取洞头水闸详情
 * @returns {*}
 */
export function getDTWaterGateDetailBySmid(smid) {
  const url = '/monitor/getDTWaterGateDetailBySmid'
  return get(url, { smid })
}

/**
 * 获取洞头水库详情
 * @returns {*}
 */
export function getDTReservoirMonitorDetailBySmid(smid) {
  const url = '/monitor/getDTReservoirMonitorDetailBySmid'
  return get(url, { smid })
}

/**
 * 通用post转发接口
 * @returns {*}
 */
export function forwardPost(jsonObject) {
  const url = '/typhoon/forwardPost'
  return post(url, jsonObject)
}

/**
 * 获取用户收藏的摄像头
 * @returns {*}
 */
export function getUserVideoInfo() {
  const url = '/monitor/getUserVideoInfo'
  return get(url)
}

/**
 * 获取用户收藏列表
 * @returns {*}
 */
export function getUserVideos(code, name) {
  const url = '/coverage/coverage/getUserVideos'
  return get(url, {
    '区县码': code,
    name
  })
}

/**
 * 获取用户收藏详情
 * @returns {*}
 */
export function getMonitorUserCameraDetail(cameraName, datatype, district) {
  const url = '/coverage/coverage/getMonitorUserCameraDetail'
  return get(url, { cameraName, datatype, district })
}

/**
 * 添加收藏
 * @param smid
 * @returns {*}
 */
export function addUserVideo(smid) {
  const url = '/coverage/coverage/addUserVideo'
  return get(url, { smid })
}

/**
 * 取消收藏
 * @param smid
 * @returns {*}
 */
export function deleteUserVideo(smid) {
  const url = '/coverage/coverage/deleteUserVideo'
  return get(url, { smid })
}

/**
 * 查询两客一危监测点数据
 * @param {*} sql
 * @param {*} tablename
 */
export function getLiangkeyiweiList(sql, tablename, type = 0) {
  const url = '/monitor/getLiangkeyiweiList'
  return get(url, {
    sql,
    tablename,
    type
  })
}

/**
 * 地点查询
 * @param {*} sql
 * @param {*} tablename
 */
export function querylongitudeAndLatitude(name) {
  const url = '/monitor/querylongitudeAndLatitude'
  return get(url, { name })
}

/**
 * 查询渔船监测点数据
 * @param {*} sql
 * @param {*} tablename
 */
export function getYuchuanjianceList(sql, tablename) {
  const url = '/monitor/getYuchuanjianceList'
  return get(url, {
    sql,
    tablename
  })
}

/**
 * 查询雨情监测点(文成县)
 * @param {*} startTime
 * @param {*} endTime
 * @param {*} type
 */
export function getWcxRainMonitorPoint(startTime, endTime, type) {
  const url = '/monitor/getWcxRainMonitorPoint'
  return get(url, {
    startTime,
    endTime,
    type
  })
}

/**
 * 查询水利雨情监测点(非文成县)
 */
export function getRainMonitorPoint() {
  const url = '/monitor/getRainMonitorPoint'
  return get(url)
}

/**
 * 温州雨情
 * @param type
 * @param timeType
 * @param time
 * @returns {*}
 */
export function getWZRainMonitor(type, timeType, time) {
  const url = '/monitor/getWZRainMonitor'
  return get(url, { type: type, timeType: timeType, time: time })
}

/**
 * 查询雨情列表
 * @returns {*}
 */
export function getWZTimeRainInfo(time, districtName, type) {
  const url = '/monitor/getWZTimeRainInfo'
  return get(url, { time: 0, name: districtName, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询区域测站雨情
 * @returns {*}
 */
export function getWZDistructRainInfo(time, type) {
  const url = '/monitor/getWZDistructRainInfo'
  return get(url, { time: 0, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询渔船信息-瓯江口定制
 * @param name
 * @returns {*}
 */
export function getFishBoatInfoOJK(name) {
  const url = '/monitor/getFishBoatInfoOJK'
  return get(url, { name })
}
