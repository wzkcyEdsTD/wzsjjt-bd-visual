/* eslint-disable */
<template>
  <div id="battery" ref="battery"></div>
</template>
<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { getCityPipe } from "@/api/state/CityPipe";

export default {
  name: "LifelineLeft",
  data() {
    return {
      echart: null
    }
  },
  mounted() {
    this.initData();
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize()
      }
    };
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        var msg = {
          data: [],
          total: 0.3,
          percentdata: [],
          leftname: [],
          leftFullname: []
        };
        getCityPipe().then(res => {
            for (var i = 0; i < res.pipeList.length; i++) {
              if (res.pipeList[i].name.length > 4) {
                msg.leftname.push(res.pipeList[i].name.slice(0, 2) + res.pipeList[i].name.slice(-2))
              } else {
                msg.leftname.push(res.pipeList[i].name)
              }
              msg.leftFullname.push(res.pipeList[i].name)
              msg.data.push(res.pipeList[i].value)
            }
            // this.leftFullname = msg.leftFullname
            // console.log(res.pipeList)
            // console.log(msg.data)

            var data = [];
            var totaldata = [];
            var percentdata = [];
            var coverData = []
            var maxLength = Math.max.apply(null, msg.data);

            msg.data.forEach((item, index) => {
              totaldata.push(item + '千米');
              percentdata.push({
                value: item < maxLength * 0.2 ? maxLength * 0.2 : item,
                name: msg.leftFullname[index]
              });
              coverData.push({
                value: maxLength * 1.2,
                name: msg.leftFullname[index]
              })
            });
            var fillImg = "../../../../static/image/img-gongshui.png";
            const myChart = this.$echarts.init(this.$refs.battery);
            myChart.setOption({
              grid: {
                top: "20%",
                left: "35%",
                bottom: "10%",
                right: '41%'
              },
              xAxis: [
                {
                  show: false
                }
              ],
              yAxis: [
                {
                  name: '单位(千米)',
                  axisTick: "none",
                  axisLine: "none",
                  offset: "10",
                  axisLabel: {
                    margin: -3,
                    textStyle: {
                      color: "#fff",
                      fontSize: "16"
                    }
                  },
                  triggerEvent: true,
                  data: msg.leftname
                },
                {
                  axisTick: "none",
                  axisLine: "none",
                  type: "category",
                  axisLabel: {
                    margin: 10,
                    textStyle: {
                      color: "#d9dddf",
                      fontSize: "16"
                    },
                  },
                  data: totaldata
                },
                {
                  name: "",
                  nameGap: "50",
                  nameTextStyle: {
                    color: "#000",
                    fontSize: "14"
                  },
                  axisLine: {
                    lineStyle: {
                      color: "rgba(0,0,0,0)"
                    }
                  },
                  data: totaldata
                }
              ],
              series: [
                {
                  name: "", // blue bar
                  type: "bar",
                  //symbol: "image://" + fillImg,
                  barWidth: 12,
                  stack: "b",
                  legendHoverLink: false,
                  //symbolOffset: [5, 0],
                  itemStyle: {
                    normal: {
                      //barBorderRadius: 5,
                      color: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        1,
                        1,
                        [
                          {
                            offset: 0,
                            color: "#f9aa5c" // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "#0fdbf5" // 100% 处的颜色
                          }
                        ],
                        false
                      ),
                    }
                  },
                  //symbolSize: ["67%", 13],
                  //symbolBoundingData: 100,
                  //symbolClip: true,
                  data: percentdata,
                  label: {
                    normal: {
                      show: false,
                      fontSize: 16
                    },
                    position: "insideTop"
                  },
                  animationEasing: "elasticOut"
                },
                {
                  name: "外框",
                  type: "bar",
                  yAxisIndex: 2,
                  barGap: "0%",
                  data: coverData,
                  barWidth: 20,
                  clickable: false,

                  // barCategoryGap:'200',
                  itemStyle: {
                    normal: {
                      color: "#131a27", // 填充色
                      barBorderColor: "#c7cad0", // 边框色
                      barBorderWidth: 1, // 边框宽度
                      barBorderRadius: 0, // 圆角半径
                      label: {
                        // 标签显示位置
                        show: false,
                        position: "insideLeft" // insideTop 或者横向的 insideLeft
                      }
                    }
                  },
                  z: 0
                }
              ]
            });
            this.echart = myChart;
            const me = this
            myChart.on("click", function(obj) {
              if (obj.seriesType === 'bar') {
                me.SetSpecalTreeName(obj.data.name)
                me.$router.push('/map')
              } else {
                let name = obj.value.slice(0, 2) + '地下' + obj.value.slice(2)
                me.SetSpecalTreeName(name)
                me.$router.push('/map')
              }
              // me.SetSpecalTreeName(obj.data.name)
              // me.$router.push('/map')
            })
          }
        )
      });
    },
    ...mapActions('map', [
      'SetSpecalTreeName'
    ])
  }
};
</script>
<style scoped lang='less'>
</style>
