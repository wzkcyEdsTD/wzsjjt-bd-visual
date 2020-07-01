// 入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
import login from './modules/login'
import map from './modules/map'
import warning from './modules/warning'
import stateM from './modules/stateM/index'
import save from './modules/save'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
    login: login,
    map: map,
    warning,
    stateM: stateM,
    save
  }
})
