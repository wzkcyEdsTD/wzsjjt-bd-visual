/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="道路隐患"></ItemTitle>
    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key='index' @click='goWarning(item.name)'>
        <div class="name">{{item.name}}</div>
        <div class="value" v-show="item.unit">
          {{item.value}}({{item.unit}})
        </div>
        <div class="value" v-show='!item.unit'>
          <div class="value1"><span class="lu">报警数</span>&nbsp;&nbsp;<span class="lu">{{item.value}}</span></div>
          <div class="value2"><span class="hong">总数</span>&nbsp;&nbsp;<span class="hong">{{item.value2}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { roadHazards } from 'api/state/Road';
import {mapActions} from "vuex";
export default {
  name: "Echart12",
  components: {
    ItemTitle
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    roadHazards().then(res => {
      if (typeof res.high_polka_road === 'number') {
        this.list.push({
          name: '高边坡、驳坎路段',
          value: res.high_polka_road,
          unit: '个'
        })
      }
      if (typeof res.customersDangerMonitor_wran === 'number' && typeof res.customersDangerMonitor_total === 'number') {
        this.list.push({
          name: '两客一危监测',
          value: res.customersDangerMonitor_wran, // 报警
          value2: res.customersDangerMonitor_total, // 总数,
          unit: ''
        })
      }
      if (typeof res.customers_dangerous === 'number') {
        this.list.push({
          name: '两客一危企业',
          value: res.customers_dangerous,
          unit: '家'
        })
      }
      if (typeof res.flood_waterlogged_road === 'number') {
        this.list.push({
          name: '易淹易涝路段',
          value: res.flood_waterlogged_road,
          unit: '个'
        })
      }
      if (typeof res.road_water_cliff === 'number') {
        this.list.push({
          name: '临水临崖道路',
          value: res.road_water_cliff,
          unit: '个'
        })
      }
      if (typeof res.accident_area === 'number') {
        this.list.push({
          name: '事故多发点',
          value: res.accident_area,
          unit: '个'
        })
      }
    })
  },
  methods: {
    goWarning(data) {
      if (data === '两客一危监测') {
        this.$router.push({path: '/warning'})
        this.SetCurrentPoints('liangkeyiweijiance')
      } else {
        this.clickme(data)
      }
    },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme']),
    ...mapActions('warning', ['SetCurrentPoints'])
  }
};
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  .list{
    color: #fff;
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .list-item{
      width: 45%;
      height: 0.6rem;
      margin-bottom: 0.2rem;
      display: flex;
      background: url('./images/border.png') no-repeat;
      background-size: 100% 0.58rem;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.05rem;
      cursor: pointer;
    }
    .value{
      display: flex;
      flex-direction: column;
      color: #ffca00;
      .hong{
        color:#f47e86;
        line-height: 0.22rem;
      }
      .lu{
        color:#00ffff;
        line-height: 0.22rem;
      }
    }
    // .name{
    //   width: 75%;
    // }
    // .value{
    //   width: 25%;
    // }
  }
}
</style>
