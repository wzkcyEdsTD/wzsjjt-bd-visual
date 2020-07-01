/* eslint-disable */
<template>
  <div class="echart" ref="echart"></div>
</template>
<script>
/* eslint-disable */
import { getWaterProject, getWaterProjectMainByUserOH, getWaterProjectMainByUserLG, getWaterProjectMainByUserLW, getWaterProjectMainByUserLQS, getWaterProjectMainByUserDTQ, getWaterProjectMainByUserTSX } from "@/api/state/WaterProject";
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "TrafficSafety",
  data() {
    return {
      echart: null,
      font: 16,
      line: 10,
    };
  },
  mounted() {
    if(document.documentElement.clientWidth > 5000) this.font = 28
    if(document.documentElement.clientWidth > 5000) this.line = 50
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
        var scaleData = [];
        if (this.userInfo.districtName === '瓯海区' || this.userInfo.districtName === '文成县') {
          getWaterProjectMainByUserOH().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                },
                // 边框的设置
                // {
                //   radius: ["25%", "35%"],
                //   center: ["50%", "60%"],
                //   type: "pie",
                //   label: {
                //     normal: {
                //       show: false
                //     },
                //     emphasis: {
                //       show: false
                //     }
                //   },
                //   labelLine: {
                //     normal: {
                //       show: false
                //     },
                //     emphasis: {
                //       show: false
                //     }
                //   },
                //   tooltip: {
                //     show: false
                //   },
                //   data: [
                //     {
                //       value: 1,
                //       itemStyle: {
                //         color: "rgba(250,250,250,0.1)"
                //       }
                //     }
                //   ]
                // }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart
          })
        } else if (this.userInfo.districtName === '龙港市') {
          getWaterProjectMainByUserLG().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else if (this.userInfo.districtName === '泰顺县') {
          getWaterProjectMainByUserTSX().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else if (this.userInfo.districtName === '洞头区') {
          getWaterProjectMainByUserDTQ().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else if (this.userInfo.districtName === '乐清市') {
          getWaterProjectMainByUserLQS().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else if (this.userInfo.districtName === '龙湾区' || this.userInfo.districtName === '经开区') {
          getWaterProjectMainByUserLW().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else if (this.userInfo.districtName === '乐清市') {
          getWaterProjectMainByUserLG().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        } else {
          getWaterProject().then(res => {
            scaleData = res.categoryViews;
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              color: ["#ff7d00", "#fbcc03", "#15d2b5", "#0dd5f4","#1a57b2","#af7ded"],
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: ["24%", "34%"],
                  center: ["50%", "53%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "处";
                      },
                      textStyle: {
                        fontSize: this.font
                      },
                      position: "outside"
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: this.line,
                      length2: 5
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            myChart.on('click', (param) => {
              this.clickme(param.name)
            })
            this.echart = myChart;
          })
        }
        
      });
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
};
</script>
<style scoped lang='less'>
  .echart {
    .bg-image("./images/outside_lane");
    background-size: 1.05rem;
    background-position: 49.5% 55%;
    // background: url('./images/outside_lane.png') no-repeat 0px 0px;
  }
  //大屏适配
  @media screen and (min-width: 5000px) {
  .echart {
    background-position: 49.5% 67%;
  }
  }
</style>
