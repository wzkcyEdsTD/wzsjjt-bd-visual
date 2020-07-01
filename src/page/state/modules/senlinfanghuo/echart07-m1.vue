/* eslint-disable */
<template>
  <div class="echart" ref="echart">{{list}}</div>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
  name: "TrafficSafety",
  props: {
    list: {
      // type: String,
      default: ""
    }
  },
  data() {
    return {
      echart: null
    };
  },
  computed: {
    ...mapGetters({
        risklevel: 'stateM/risklevel'
    })},
  mounted() {
    this.initData();
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  methods: {

    initData() {
      this.$nextTick(() => {
        var scaleData = JSON.parse(JSON.stringify(this.risklevel.childList[this.list].riskLevelViewList));
        scaleData = scaleData.sort((a, b) => {
          return a.name - b.name
        })
        const myChart = this.$echarts.init(this.$refs.echart);
        myChart.setOption({
          color: ["#d6110d", "#eb6307","#F8EB04","#2476F8"],
           tooltip: {
             position: ['50%', '50%'],
            trigger: "item",
            formatter: function(data) {
              return data.name+"级风险源" + "(" + data.value + ")";
            }
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: ["60%", "80%"],
              center: ["50%", "41%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  color: "#fff",
                  formatter: function(data) {
                    return data.name + "\n" + data.value;
                  },
                  textStyle: {
                    fontSize: 14
                  },
                  position: "outside"
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false,
                  length: 28,
                  length2: 20
                },
                emphasis: {
                  show: true
                }
              },
              data: scaleData
            },
            // 边框的设置
            {
              // radius: ["75%", "85%"],
              // center: ["50%", "50%"],
              type: "pie",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              tooltip: {
                show: false
              },
              data: [
                {
                  value: 1,
                  itemStyle: {
                    color: "rgba(250,250,250,0)"
                  }
                }
              ]
            }
          ]
        });
        this.echart = myChart;
      });
    }
  }
};
</script>
<style scoped lang='less'>
  .echart{
    height: 0.9rem;
  }
</style>
