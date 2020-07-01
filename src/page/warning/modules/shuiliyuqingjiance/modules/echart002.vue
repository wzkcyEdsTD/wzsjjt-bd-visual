<template>
  <div class="wrapper">
    <div class="tip">站点top10</div>
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

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
        this.data.forEach((item) => {
          dataName.push(item.name)
          dataShortName.push(item.name.slice(0, 3))
        })
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          grid: {
            show: false,
            top: 30,
            right: 14,
            left: 65,
            bottom: 40
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              return dataName[data[1].dataIndex] + '：' + Math.floor(data[1].value * 1000) / 1000
            }
          },
          xAxis: [
            {
              type: 'category',
              color: '#fff',
              data: dataShortName,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: true,
                alignWithLabel: true
              },
              axisLabel: {
                rotate: 40,
                align: 'center',
                interval: 0,
                margin: 20,
                color: '#fff',
                textStyle: {
                  fontSize: 14
                }
              }
            }
          ],
          yAxis: [
            {
              nameTextStyle: {
                align: 'right'
              },
              name: '单位(mm)',
              type: 'value',
              min: 0,
              max: 1,
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#ffff'
                }
              },
              axisTick: {
                show: false,
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
            }
          ],
          series: [
            {
              silent: true,
              cursor: 'default',
              barGap: '-100%',
              type: 'bar',
              data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
              barWidth: 10,
              itemStyle: {
                color: '#1d538d',
                barBorderRadius: [5, 5, 5, 5],
                shadowBlur: 4
              }
            },
            {
              type: 'bar',
              data: this.data,
              barWidth: 10,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(
                    0,
                    0,
                    1,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#00f3c2' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#2969ff' // 100% 处的颜色
                      }
                    ],
                    false
                  ),
                  barBorderRadius: [5, 5, 5, 5],
                  shadowColor: 'rgba(18,72,92,0.4)',
                  shadowBlur: 4
                }
              }
            }
          ]
        })
        this.echart = myChart
        const me = this
        myChart.off('click')
        myChart.on('click', function(obj) {
          me.SetSpecalPoint(obj.data)
        })
      })
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
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
