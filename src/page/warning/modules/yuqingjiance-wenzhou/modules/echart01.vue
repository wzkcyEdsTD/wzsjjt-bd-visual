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
        var fillImg = '../../../../static/image/cs1.png'
        const dataName = []
        const dataShortName = []
        const dataNum = []
        this.data.forEach((item) => {
          dataName.push(item.name)
          dataShortName.push(item.name.slice(0, 4))
          dataNum.push({
            value: item.value,
            symbol: 'image://' + fillImg,
            symbolOffset: [0, 0]
          })
        })
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              return dataName[data[0].dataIndex] + '：' + Math.floor(data[0].value * 10000) / 10000
            }
          },
          grid: {
            show: false,
            top: 40,
            right: 14,
            left: 65,
            bottom: 70
          },
          xAxis: {
            data: dataShortName,
            axisTick: {
              show: false
            },
            axisLabel: {
              rotate: 40,
              align: 'center',
              padding: [0, 0, 0, -50],
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              },
              interval: 0
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
              lineStyle: {
                color: '#333',
                type: 'dotted'
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
              type: 'pictorialBar',
              barWidth: 30,
              symbol: 'image://' + fillImg,
              symbolSize: ['100%', '100%'],
              symbolClip: true,
              // symbolPosition: 'center',
              z: 10,
              label: {
                normal: {
                  show: false,
                  position: 'top',
                  formatter: '{c}',
                  color: '#fff',
                  fontSize: 16
                }
              },
              data: dataNum
            }]

        })
        this.echart = myChart
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
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
