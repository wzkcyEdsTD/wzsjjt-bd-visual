/* eslint-disable */
<template>
  <div class="echart" ref="echart"></div>
</template>
<script>
/* eslint-disable */
import { getCityPipe } from "@/api/state/CityPipe";
import { mapActions } from 'vuex'

export default {
  name: "TrafficSafety",
  data() {
    return {
      echart: null
    };
  },
  mounted() {
    this.initData();
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  methods: {
    ...mapActions('map', [
      'SetSpecalTreeName'
    ]),
    initData() {
      this.$nextTick(() => {
        var scaleData = [];
        getCityPipe().then(
          res => {
            //      res.countList.forEach((item, index) => {
            //   let newObj = {};
            //   for (var i = 0; i < ['name', 'value'].length; i++) {
            //     newObj[ ['name', 'value'][i]] = item[Object.keys(item)[i]]
            //   }
            //   scaleData.push(newObj);
            // })
            scaleData = res.countList
            const myChart = this.$echarts.init(this.$refs.echart);
            myChart.setOption({
              tooltip: {
                trigger: 'item'
              },
              color: ["#faa24c", "#0272fe", "#fbcc03", "#02ceff"],
              series: [
                {
                  name: "",
                  type: "pie",
                  radius: ["25%", "35%"],
                  center: ["50%", "50%"],
                  avoidLabelOverlap: true,
                  label: {
                    normal: {
                      show: true,
                      color: "#fff",
                      fontSize: 14,
                      formatter: function(data) {
                        return data.name + "\n" + data.value + "个";
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length: 8,
                      length2: 4
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: scaleData
                }
              ]
            });
            this.echart = myChart;
            myChart.on('click', (param) => {
              this.SetSpecalTreeName(param.name)
              this.$router.push('/map')
            })
          })
      });
    }
  }
};
</script>
<style scoped lang='less'>
  .echart {
    // .bg-image("./images/city-incircle");
    background: url(./images/city-incircle.png) no-repeat 48% 50%;
    background-size: 100px;
  }
</style>
