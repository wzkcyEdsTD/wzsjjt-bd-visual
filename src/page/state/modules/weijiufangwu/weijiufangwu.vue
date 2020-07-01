/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="危旧房屋"></ItemTitle>
    <div class="echarts-box flex-1">
      <div class="item flex flex-y" id="ri">
        <echartLeft class="flex-1" id="ri1" :navList='dataList[index].data'></echartLeft>
      </div>
      <div class="item flex flex-y" id="le">
        <echartRight class="flex-1"  @changeIndex='changeIndex' :total='dataList[index].total'></echartRight>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getCityFire, getDangerHouseByUser_lcq } from 'api/state/state'
import ItemTitle from '../item-title/item-title'
import echartLeft from './echart06-left2'
import echartRight from './echart06-right'

export default {
  name: 'Echart6',
  components: {
    ItemTitle,
    echartLeft,
    echartRight
  },
  data() {
    return {
      dataList: [
        { // 消防
          data: [],
          total: {}
        },
        { // 高层
          data: [],
          total: {}
        }
      ],
      index: 0
    }
  },
  created() {
    getDangerHouseByUser_lcq().then(res => {
      this.dataList = [
        {
          level: res[0].level,
          data: res[0].list,
          total: {
            totalHouse: res[0].totalHouse,
            totalPeople: res[0].totalPeople
          }
        },
        {
          level: res[1].level,
          data: res[1].list,
          total: {
            totalHouse: res[1].totalHouse,
            totalPeople: res[1].totalPeople
          }
        }
      ].sort((a, b) => {
        return a.level - b.level
      })
    })
    // Promise.all([getCityFire(), getDistrictBuildingByUser()]).then(res => {
    //   this.dataList = [
    //     {
    //       data: res[0].categoryViews,
    //       total: res[0].totalCount
    //     },
    //     {
    //       data: res[1].info,
    //       total: res[1].total
    //     }
    //   ]
    // })
  },
  methods: {
    changeIndex(data) {
      this.index = data
    }
  }
}
</script>
<style scoped lang="less">
.echarts-box {
  height: 100%;
  #le {
    width: 40%;
  }
  #ri {
    width: 60%;
  }
  .item {
    float: left;
    width: 60%;
    height: 100%;
    .title {
      min-width: 1.5rem;
      text-align: center;
      height: 0.3rem;
      line-height: 0.28rem;
      padding: 0 0.1rem;
      font-size: 0.12rem;
      color: @color-text;
      .bg-image("../../images/img-kuang");
      margin: 0.1rem auto;
      .danger {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-danger");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .video {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-video");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .bold {
        padding: 0 0.05rem;
        color: #0dd5f4;
        font-weight: bold;
      }
    }
    #ri1 {
      width: 100%;
    }
  }
}
.wrapper{
position: relative;}
.tip-box {
  text-align: right;
  position: absolute;
  right: 0;
  top: 0.15rem;
  .item {
    color: #fff;
    font-size: 0.14rem;
    display: block;
    padding: 0 0.1rem;
    margin-top: 0.3rem;
    .icon {
      .bg-image('../../images/img-blue');
      width: 0.1rem;
      height: 0.11rem;
      display: inline-block;
      &.orange {
        .bg-image('../../images/img-orange');
      }
    }
  }
}
</style>
