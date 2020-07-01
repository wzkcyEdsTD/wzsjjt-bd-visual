/* eslint-disable */
import * as types from './mutation-types'

const mutations = {
  [types.SET_STEPOFLEFT](state, data) {
    state.leftFlag = data.flag
    state.point= data.point
    state.point00= data.point00
    state.PointTotal= data.PointTotal
  },
  [types.SET_TEAMSTATISTICS](state, data) {
    state.TeamStatistics = data.categoryViews
    state.TeamTotal=data.totalCount
    state.point = data.categoryViews
    state.PointTotal0=data.totalCount
  },
  [types.SET_SHELTERSHPSTATISTICS](state, data) {
    state.SheltershpStatistics = data.categoryViews
    state.SheltershpTotal=data.totalCount
    state.point = data.categoryViews
    state.PointTotal0=data.totalCount
  }
}

export default mutations