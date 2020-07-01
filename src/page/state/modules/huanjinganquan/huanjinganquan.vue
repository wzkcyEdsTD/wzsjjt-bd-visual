 /* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :title="name"></ItemTitle>
    <div class="title">
          <span>
            {{secondName}}
            <b class="bold">{{sumNum}}</b>个
          </span>
        </div>
    <div class="echart-box flex-1">
      <div ref="echart" class="echart"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { getUnderGroudByUser } from 'api/state/state'
import { mapGetters } from 'vuex'
export default {
  name: "Echart12",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      item: 5,
      radIN:30,
      radOut:100,
      sumNum: 512,
      font:16,
      name: '环境安全',
      secondName: '重大风险企业'
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    if(document.documentElement.clientHeight > 1050) this.item = 10
    if(document.documentElement.clientWidth > 5000) this.radIN = 50
    if(document.documentElement.clientWidth > 5000) this.radOut = 160
    if(document.documentElement.clientWidth > 5000) this.item = 15
    if(document.documentElement.clientWidth > 5000) this.font = 24
    this.initData();
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  methods: {
    initData(data) {
      this.$nextTick(() => {
        let scaleData = [
          { value: 135, name: "化工类" },
          { value: 45, name: "电镀类" },
          { value: 98, name: "污水处理类" },
          { value: 35, name: "医院类" },
          { value: 23, name: "染色类" },
          { value: 51, name: "电解类" },
          { value: 65, name: "加油站类" },
          { value: 60, name: "表面处理类" }
        ];
        const myChart = this.$echarts.init(this.$refs.echart);
        let options = {
          color: [
            "#00a2ff",
            "#00f0ff",
            "#FBA95A",
            "#F3EC7F",
            "#f57654",
            "#32d37e",
            "#9b74ff",
            "#2243ea"
          ],
          tooltip: {
            trigger: "item",
            formatter: function(data) {
              return data.name + "(" + data.value + ")";
            }
          },
          legend: {
            left: "69%",
            top:"28%",
            itemGap:this.item,
              orient:'vertical',
              inactiveColor:"#ff6600",
              // color:"#fff",
              // borderColor:"#fff",
              // pageTextStyle:"#fff",
              textStyle:{
                color:"#fff",
                fontSize:this.font
              },
            normal: {
              show: false,
              formatter: function(data) {
                return data.name + "(" + data.value + ")";
              },
              color: "#fff",
              orient:'vertical'
            }
          },
          calculable: true,
          series: [
            {
              label: {
                normal: {
                  show: false
                }
              },
              name: "面积模式",
              type: "pie",
              radius: [this.radIN, this.radOut],
              center: ["30%", "63%"],
              // roseType: "area",
              data: scaleData
            }
          ]
        }
        if (this.userInfo.districtName !== '永嘉县') {
          options.series[0].roseType = 'area'
        }
        myChart.setOption(options);
        this.echart = myChart;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.wrapper {
  .echart-box {
    background: url('./images/store.png') no-repeat 27.6% 65%;
    background-size: 0.52rem;
    .echart {
      width: 100%;
      height: 100%;
    }
  }
   position: relative;
   .title {
    float: left;
    width: 2.0rem;
    min-width: 1.7rem;
    text-align: center;
    height: 0.3rem;
    line-height: 0.28rem;
    padding: 0 0.1rem;
    font-size: 0.16rem;
    color: @color-text;
    .bg-image("../../images/img-kuang");
    margin-left: 0.1rem;
     margin-top: 0.1rem;
     margin-right: 0.1rem;
    .bold {
      padding: 0 0.05rem;
      color: #0dd5f4;
      font-weight: bold;
    }
    position: absolute;
    left: 1.4rem;
    top:0.35rem;
  }
  @media screen and (max-height: 1050px) {
    .title {
      top:0.35rem;
    }
  }
  @media screen and (min-height: 1050px) {
    .echart-box {
      background-position-y: 65%;
    }
  }
}
//大屏适配
@media screen and (min-width: 5000px) {
.wrapper .echart-box{
  margin-top: 0.2rem;
}
}
</style>
