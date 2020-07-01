/* eslint-disable */
import * as types from './mutation-types'
import state from './state'
// import { getRiskLevel } from "@/api/state/RiskLevel";

// 从左上角list.vue来的数据
export const SetStepOfLeft = function ({ commit }, data) {
  let point = []
  let point00 = [
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' }
  ]
  let PointTotal=0
  if (data == 0) {
    point = state.TeamStatistics
    PointTotal=state.TeamTotal
    point00 = [
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' }
    ]
  }
  if (data == 1) {
    point = state.TeamStatistics
    PointTotal=state.TeamTotal
    point00 = [
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' }
    ]
  }
  if (data == 2) {
    point = state.SheltershpStatistics
    PointTotal=state.SheltershpTotal
    point00 = [
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' }
    ]
  }
  let dataList = {
    point00:point00,
    point: point,
    PointTotal:PointTotal
  }
  commit(types.SET_STEPOFLEFT, dataList)
}


export const SetTeamStatistics = function ({ commit }, data) {
  commit(types.SET_TEAMSTATISTICS, data)
}

export const SetSheltershpStatistics = function ({ commit }, data) {
  console.log(data)
  commit(types.SET_SHELTERSHPSTATISTICS, data)
}
