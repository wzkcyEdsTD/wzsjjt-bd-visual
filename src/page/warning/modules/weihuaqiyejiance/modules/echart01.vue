<template>
  <div class="wrapper" ref="echart" v-show="isShow">
    <Kong v-if="isKong"></Kong>
  </div>
</template>

<script>
import Kong from 'components/noData/noData'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    isShow: {
      type: Boolean,
      default: false
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
      echart: null,
      isKong: false,
      monitor: null,
      monitorTime: 1000 * 60
    }
  },
  computed: {
    ...mapGetters([
      'resize'
    ])
  },
  mounted() {
    window.onresize = () => {
      this.echart.resize()
    }
    this.monitor = setInterval(() => {
      this.$emit('refresh')
    }, this.monitorTime)
  },
  beforeDestroy() {
    clearInterval(this.monitor)
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        const nameArr = []
        if (this.data.length) {
          this.data.forEach((item) => {
            nameArr.push(item.name)
          })
          // 以上是需要的数据
          const fillImg = '../../../../static/image/cs1.png'
          const myChart = this.$echarts.init(this.$refs.echart)
          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              show: false,
              top: 28,
              right: 7,
              left: 47,
              bottom: 50
            },
            xAxis: {
              data: nameArr,
              axisTick: {
                show: false
              },
              axisLabel: {
                rotate: 40,
                align: 'center',
                margin: 27,
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#92969a',
                    type: 'dotted'
                  }
                },
                axisLine: {
                  lineStyle: {
                    type: 'solid',
                    color: '#fff',
                    width: 2
                  }
                }
              }
            },
            yAxis: {
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#92969a',
                  type: 'dotted'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#92969a'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                }
              }
            },
            series: [
              {
                type: 'pictorialBar',
                barWidth: 30,
                symbol: 'image://' + fillImg,
                symbolSize: ['100%', '100%'],
                symbolClip: true,
                z: 10,
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    color: '#fff',
                    fontSize: 14
                  }
                },
                data: this.data
              }
            ]
          })
          this.echart = myChart
          const me = this
          myChart.off('click')
          myChart.on('click', function(obj) {
            me.SetSpecalPoint(obj.data)
          })
        } else {
          this.isKong = true
        }
      })
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
  },
  components: {
    Kong
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
  }
</style>
