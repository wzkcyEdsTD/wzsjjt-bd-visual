<template>
  <div class="wrapper">
    <div class="tip">区域监测</div>
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    data() {
      this.initData()
    },
    resize() {
      if (this.echart) {
        this.echart.resize()
      }
    }
  },
  data() {
    return {
      echart: null
    }
  },
  computed: {
    ...mapGetters([
      'resize'
    ])
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        const dataName = []
        const dataShortName = []
        const dataNum = []
        this.data.forEach((item) => {
          dataName.push(item.name)
          dataShortName.push(item.name.slice(0, 2))
          dataNum.push(item.value)
        })
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              // return data[0].name + '：' + data[0].value
              return dataName[data[0].dataIndex] + '：' + Math.floor(data[0].value * 1000) / 1000
            }
          },
          grid: {
            show: false,
            top: 30,
            right: 35,
            left: 27,
            bottom: 0,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataShortName,
            axisLabel: {
              interval: 0,
              align: 'center',
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            }
          },
          yAxis: {
            nameTextStyle: {
              align: 'right'
            },
            name: '单位(mm)',
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ffff'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#333'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            }
          },
          series: [
            // {},
            {
              data: dataNum,
              type: 'line',
              symbol: 'none',
              areaStyle: {
                normal: { color: '#3a72c7' }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(255,0,0,0)', // 改变折线点的颜色
                  lineStyle: {
                    color: 'rgba(255,0,0,0)' // 改变折线颜色
                  }
                }
              },
              smooth: true
            }
          ]
        })
        this.echart = myChart
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .tip {
      position: absolute;
      color: #13cff4;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 0.16rem;
    }
    .echart {
      width: 100%;
      height: 100%;
    }
  }
</style>
