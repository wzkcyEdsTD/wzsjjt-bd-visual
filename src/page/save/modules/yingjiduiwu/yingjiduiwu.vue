<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="应急队伍"></ItemTitle>
    <div class="total">总数<span>{{total}}</span></div>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/支
      </div>
    </div>
    <div class="echart-box flex-1">
      <div ref="echart" class="echart"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ItemTitle from '../item-title/item-title'
import { getEmergencyTeamMainByUser, getEmergencyTeamMainByUserLQS } from 'api/save/save'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'resize',
      'userInfo'
    ])
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
        var fontSize = 16
        var lineHeight = 22
        var height = 22
        var width = 140
        var borderRadius = 7
        var dataname = []
        var scaleData = []
        if (this.userInfo.districtName === '乐清市') {
          getEmergencyTeamMainByUserLQS().then(
            res => {
              for (var i = 0; i < res.categoryViews.length; i++) {
                scaleData = res.categoryViews
              }
              this.total = res.totalCount
              const myChart = this.$echarts.init(this.$refs.echart)
              var option = {
                color: ['#21d05f',
                  '#0DD5F4',
                  '#FFC638',
                  '#db7a1d',
                  '#5467F6',
                  '#ee7b7e',
                  '#d451dc'],
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                  show: false,
                  orient: 'vertical',
                  left: 10,
                  data: dataname
                },
                calculable: true,
                series: [
                  {
                    name: '应急队伍',
                    type: 'pie',
                    center: ['50.5%', '50%'],
                    avoidLabelOverlap: true,
                    radius: ['30%', '36%'],
                    tooltip: {
                      trigger: 'item'
                    },
                    label: {
                      position: 'outer',
                      alignTo: 'labelLine',
                      margin: 20,
                      //   backgroundColor: 'rgba(0,148,204,0.5)',
                      // backgroundColor: 'rgba(188,157,80,0.9)',
                      // backgroundColor: 'rgba(67,125,242,0.5)',
                      backgroundColor: '#31508c',
                      borderColor: '#85aaf7',
                      //   borderColor: '#2090d9',
                      borderWidth: 2,
                      borderRadius: borderRadius,
                      formatter: function(params) {
                        var index = ''
                        if (params.data.hover === true) index = '1'
                        // return `\{a|${params.name}\} \n\{b${index}|${params.value}(个)\}`
                        return `\{a|${params.name}\} \n\{b${index}|${params.value}\}`
                      },
                      fontWeight: 'bold',
                      rich: {
                        a: {
                          fontSize: fontSize,
                          lineHeight: lineHeight,
                          height: height,
                          width: width,
                          color: 'white',
                          align: 'center',
                          borderRadius: [borderRadius, borderRadius, 0, 0]
                        },
                        b: {
                          fontSize: fontSize,
                          lineHeight: lineHeight,
                          height: height,
                          width: width,
                          color: 'white',
                          align: 'center',
                          borderRadius: [0, 0, borderRadius, borderRadius]
                        },
                        b1: {
                          fontSize: fontSize,
                          lineHeight: 32,
                          height: 32,
                          width: 126,
                          color: 'white',
                          align: 'center',
                          borderRadius: [0, 0, borderRadius, borderRadius]
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: true,
                        length: 19,
                        length2: 19
                      },
                      emphasis: {
                        show: true
                      }
                    },
                    data: scaleData
                  }
                ]
              }
              myChart.setOption(option)
              this.echart = myChart
              myChart.on('mouseover', (params) => {
                scaleData.forEach((v, k) => {
                  if (params.name === v.name) {
                    option.series[0].data[k].hover = true
                    myChart.setOption(option)
                  }
                })
              })
              myChart.on('mouseout', (params) => {
                scaleData.forEach((v, k) => {
                  if (params.name === v.name) {
                    option.series[0].data[k].hover = false
                    myChart.setOption(option)
                  }
                })
              })
              myChart.on('click', (params) => {
                this.clickme(params.data.name)
              })
            })
        } else {
          getEmergencyTeamMainByUser().then(
            res => {
              for (var i = 0; i < res.categoryViews.length; i++) {
                scaleData = res.categoryViews
              }
              this.total = res.totalCount
              const myChart = this.$echarts.init(this.$refs.echart)
              var option = {
                color: ['#21d05f',
                  '#0DD5F4',
                  '#FFC638',
                  '#db7a1d',
                  '#5467F6',
                  '#ee7b7e',
                  '#d451dc'],
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                  show: false,
                  orient: 'vertical',
                  left: 10,
                  data: dataname
                },
                calculable: true,
                series: [
                  {
                    name: '应急队伍',
                    type: 'pie',
                    center: ['50.5%', '50%'],
                    avoidLabelOverlap: true,
                    radius: ['30%', '36%'],
                    tooltip: {
                      trigger: 'item'
                    },
                    label: {
                      position: 'outer',
                      alignTo: 'labelLine',
                      margin: 20,
                      //   backgroundColor: 'rgba(0,148,204,0.5)',
                      // backgroundColor: 'rgba(188,157,80,0.9)',
                      // backgroundColor: 'rgba(67,125,242,0.5)',
                      backgroundColor: '#31508c',
                      borderColor: '#85aaf7',
                      //   borderColor: '#2090d9',
                      borderWidth: 2,
                      borderRadius: borderRadius,
                      formatter: function(params) {
                        var index = ''
                        if (params.data.hover === true) index = '1'
                        // return `\{a|${params.name}\} \n\{b${index}|${params.value}(个)\}`
                        return `\{a|${params.name}\} \n\{b${index}|${params.value}\}`
                      },
                      fontWeight: 'bold',
                      rich: {
                        a: {
                          fontSize: fontSize,
                          lineHeight: lineHeight,
                          height: height,
                          width: width,
                          color: 'white',
                          align: 'center',
                          borderRadius: [borderRadius, borderRadius, 0, 0]
                        },
                        b: {
                          fontSize: fontSize,
                          lineHeight: lineHeight,
                          height: height,
                          width: width,
                          color: 'white',
                          align: 'center',
                          borderRadius: [0, 0, borderRadius, borderRadius]
                        },
                        b1: {
                          fontSize: fontSize,
                          lineHeight: 32,
                          height: 32,
                          width: 126,
                          color: 'white',
                          align: 'center',
                          borderRadius: [0, 0, borderRadius, borderRadius]
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: true,
                        length: 19,
                        length2: 19
                      },
                      emphasis: {
                        show: true
                      }
                    },
                    data: scaleData
                  }
                ]
              }
              myChart.setOption(option)
              this.echart = myChart
              myChart.on('mouseover', (params) => {
                scaleData.forEach((v, k) => {
                  if (params.name === v.name) {
                    option.series[0].data[k].hover = true
                    myChart.setOption(option)
                  }
                })
              })
              myChart.on('mouseout', (params) => {
                scaleData.forEach((v, k) => {
                  if (params.name === v.name) {
                    option.series[0].data[k].hover = false
                    myChart.setOption(option)
                  }
                })
              })
              myChart.on('click', (params) => {
                this.clickme(params.data.name)
              })
            })
        }
      })
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  watch: {
    resize() {
      if (this.echart) {
        this.echart.resize()
      }
    }
  }
}
</script>
<style scoped lang='less'>
  .echart-box {
    .bg-image("./images/bg");
    background-size: 1.4rem;
    margin-top: 0.3rem;
    .echart {
      width: 100%;
      height: 100%;
    }
  }
  .wrapper {
    position: relative;
  }
  .tip-box {
    text-align: right;
    position: absolute;
    right: 0;
    top: 0.5rem;
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
  .total {
    position: absolute;
    font-size: 0.16rem;
    color: #ffffff;
    top: 0.4rem;
    right: 0rem;
    background-image: url('./images/expert_total.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0.06rem 0.15rem;
  }
  .total span {
    color: #0dd5f4;
    font-weight: 600;
    font-size: 0.18rem;
    margin: 0rem 0.05rem;
  }
</style>
