<template>
  <div class="wrapper">
    <div class="tip"><span style="margin-right:0.3rem">24小时水情监测</span><div><span></span>当前值</div><div><span style="background-color:#ff0000"></span>预警值</div></div>
    <div class="tip_2">单位(米)</div>
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      echart: null
    }
  },
  mounted() {
    this.initData()
    window.onresize = () => {
      this.echart.resize()
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        var dataname = [
          '10:11',
          '13:11',
          '16:11',
          '19:11',
          '22:11',
          '01:11',
          '04:11',
          '07:11',
          '10:11'
        ]
        var datanum = [
          '0.45',
          '0.1',
          '0.4',
          '0.3',
          '0.2',
          '0.3',
          '0.4',
          '0.25',
          '1'
        ]
        var datawarn = [
          '0.8',
          '0.8',
          '0.8',
          '0.8',
          '0.8',
          '0.8',
          '0.8',
          '0.8',
          '0.8'
        ]
        var datatype = ['07:11',
          '10:11'
        ]
        // 以上是用到的数据
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            show: true,
            top: 55,
            right: 35,
            left: 27,
            bottom: 30,
            containLabel: true
          },
          legend: {
            left: 'left',
            data: datatype
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataname,
            axisLabel: {
              interval: 0,
              align: 'center',
              margin: 10,
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            },
            splitLine: {
              show: true
            },
            axisLine: {
              show: false
            }
          },
          series: [
            // {},
            {
              data: datanum,
              type: 'line',
              symbol: 'none',
              areaStyle: {
                normal: { color: 'rgba(255,0,0,0)' }
              },
              itemStyle: {
                normal: {
                  color: '#ffffff', // 改变折线点的颜色
                  lineStyle: {
                    color: '#50bcff' // 改变折线颜色
                  }
                }
              },
              smooth: true
            },
            {
              data: datawarn,
              type: 'line',
              symbol: 'none',
              areaStyle: {
                normal: { color: 'rgba(255,0,0,0)' }
              },
              itemStyle: {
                normal: {
                  color: '#ffffff', // 改变折线点的颜色
                  lineStyle: {
                    color: 'rgba(255,0,0)' // 改变折线颜色
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
      top: -20%;
      left: 33.5%;
      transform: translate(-50%, 0);
      font-size: 0.16rem;
    }
    .tip_2{
      position: absolute;
      color: #ffffff;
      top: -13%;
      left: 10%;
      transform: translate(-50%, 0);
      font-size: 0.14rem;
    }
    .tip div{
      float: left;
      line-height: 25px;
      margin-top:0.65rem;
      color:#ffffff !important;
      cursor: pointer;
    }
    .tip span{
      float: left;
      display: block;
    }
    .tip div span{
      width: 12px;
      height: 12px;
      background-color: #0cdcf7;
      margin-top:7px;
      margin-right: 8px;
      margin-left: 8px;
      border-radius: 6px;
    }
    .echart {
      width: 100%;
      height: 100%;
    }
  }
</style>
