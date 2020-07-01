/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="两客一危"></ItemTitle>
    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key='index' @click='goWarning(item.name)'>
        <div class="name">{{item.name}}</div>
        <div class="value" v-show="item.unit">
          {{item.value || 0}}(家)
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
import { getEnterPriseLcq } from 'api/state/state';
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
    getEnterPriseLcq().then(res => {
      console.log(typeof res.enterPriseCount)
      if (typeof res.enterPriseCount === 'number') {
        this.list.push({
          name: '两客一危企业',
          value: res.enterPriseCount,
          unit: '家'
        })
      }
      if (typeof res.monitorWarnCount === 'number' && typeof res.monitorCount === 'number') {
        this.list.push({
          name: '两客一危监测',
          value: res.monitorWarnCount, // 报警
          value2: res.monitorCount, // 总数,
          unit: ''
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
  background: url('./images/danger-bg.png') no-repeat; 
  .list{
    color: #fff;display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width:72%;
    margin: auto;
    margin-top: 0.8rem;
    .list-item{
      width: 100%;
      height: 0.8rem;
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.12rem 0.18rem 0.8rem;
      cursor: pointer;
    }
    .list-item:nth-child(1) {
     background: url('./images/qiye-bg.png') no-repeat; 
     background-size: 100% 0.76rem;
    }
     .list-item:nth-child(2) {
     background: url('./images/jiance-bg.png') no-repeat; 
     background-size: 100% 0.76rem;
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
