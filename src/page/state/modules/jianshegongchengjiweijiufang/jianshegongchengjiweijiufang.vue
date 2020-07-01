/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="建设工程及危旧房"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div>
    <div ref="echart" class="flex-1"></div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { getOldBuild, getOldBuildMainByUserLcq } from "@/api/state/OldBuild";
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Echart9",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null
    };
  },
  mounted() {
    this.initData();
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        if (this.userInfo.districtName === '鹿城区') {
          getOldBuildMainByUserLcq().then(res => {
            this.manageData(res)
          })
        } else {
          getOldBuild().then((res) => {
            this.manageData(res)
          })
        }
      });
    },
    manageData(res) {
      var dataname = [];
      var datanum = [];
      var that = this;
      that.dpr = 1;
      var fillImg = "../../../../static/image/cs1.png"
      if (this.userInfo.districtName === '平阳县') {
        res.categoryViews = res.categoryViews.filter(val => {
          return val.shortName !== '水路建设工程' && val.shortName !== '危旧房屋'
        })
      }
      for (var i = 0; i < res.categoryViews.length; i++) {
        datanum.push({
          value: res.categoryViews[i].value,
          name: res.categoryViews[i].name,
          symbol: "image://" + fillImg,
          symbolOffset: ["0", "0"]
        })
        dataname.push(res.categoryViews[i].shortName)
      }
      const myChart = this.$echarts.init(this.$refs.echart);
      myChart.setOption({
        // color: ['#bb0004', '#FFD48A'],
        tooltip: {
          trigger: 'item',
          position: 'top',
          axisPointer: { // 坐标轴指示器，，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          show: false,
          top: 20,
          right: 7,
          left: 68,
          bottom: 100
        },
        xAxis: {
          data: dataname,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 40,
            align: "center",
            margin: 25,
            textStyle: {
              color: "#fff", // 坐标值得具体的颜色
              fontSize: 14
            },
            // axisLine: {
            //     lineStyle: {
            //         color: '#1B5BBA',
            //     }
            // }
            interval: 0
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: "#92969a",
              type: "dotted"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#92969a"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff",// 坐标值得具体的颜色
              fontSize: 16
            }
          },
          // data:datanum,
          // symbol: "image://" + fillImg,
          //  symbolOffset: ["0", "0"]
        },
        series: [
          // {},
          {
            type: 'pictorialBar',
            barWidth: 30 * that.dpr,
            symbol: "image://" + fillImg,
            symbolSize: ['100%', '100%'],
            symbolClip: true,
            // symbolPosition: 'center',
            z: 10,
            label: {
              normal: {
                show: true,
                position: "top",
                formatter: "{c}",
                color: "#fff",
                fontSize: 16
              }
            },
            data: datanum,
          }]

      });
      this.echart = myChart;
      myChart.on('click', (params) => {
        console.log(params.data.name)
        // return
        this.clickme(params.data.name)
      })
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
};
</script>

<style scoped lang="less">
  .tip-box {
    text-align: right;
    margin-top: 0.14rem;
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
