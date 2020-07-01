<template>
  <div class="wrapper spc" @mouseenter="mouseChange(true)" @mouseleave="mouseChange(false)">
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>
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
    // data: {
    //   deep: true,
    //   handler() {
    //     console.log(555)
    //     // this.initData()
    //   }
    // }
  },
  data() {
    return {
      myChart: null
    }
  },
  created() {
    // console.log(this.data.length)
  },
  mounted() {
    // console.log(this.data)
    this.initData()
  },
  methods: {
    mouseChange(bool) {
      if (bool) {
        this.$emit('mouseenter')
      } else {
        this.$emit('mouseleave')
      }
    },
    initData() {
      // console.log(123)
      this.$nextTick(() => {
        const legendArr = []
        const seriesArr = []
        const yearAr = []
        this.data.forEach((item, index) => {
          if (index === 0) {
            item.list.forEach((item1) => {
              yearAr.push(item1.name)
            })
          }
          legendArr.push(item.type)
          seriesArr.push({
            name: item.type,
            type: 'line',
            data: item.list,
            smooth: true
          })
        })
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          color: ['#c4874b', '#00ffff', '#fff000'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legendArr,
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          grid: {
            left: '10%',
            right: '15%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: yearAr,
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            }
          },
          series: seriesArr
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
    right: -0.6rem;
    bottom: -2%;
    width: 2.4rem;
    height: 2.4rem;
    z-index: 2;
    .echart {
      width: 100%;
      height: 100%;
    }
  }
  @media screen and (max-height: 1050px) {
    .wrapper{
      bottom: 4%;
    }
  }
  //大屏适配
  @media screen and (min-width: 5000px) {
  .wrapper {
    right: -20%;
  }
  }
</style>
