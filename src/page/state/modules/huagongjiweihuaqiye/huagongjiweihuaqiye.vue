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
import { getChemicalData } from 'api/state/state'
import { mapGetters } from 'vuex'

export default {
  name: "dixiakongjian",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      item: 10,
      itemTop: '35%',
      radIN: 45,
      radOut: 60,
      sumNum: 0,
      font: 16,
      name: '化工及危化企业',
      secondName: '化工及危化企业'
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    if (document.documentElement.clientHeight > 1050) this.item = 10
    if (document.documentElement.clientHeight > 1050) this.itemTop = '40%'
    if (document.documentElement.clientWidth > 5000) this.radIN = 50
    if (document.documentElement.clientWidth > 5000) this.radOut = 160
    if (document.documentElement.clientWidth > 5000) this.item = 15
    if (document.documentElement.clientWidth > 5000) this.font = 24
    this.name = '化工及危化企业'
    this.secondName = '化工及危化企业'
    getChemicalData().then(res => {
      this.sumNum = res.total
      this.initData(res.data)
    })
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  methods: {
    initData(data) {
      const me = this
      this.$nextTick(() => {
        data.forEach((item) => {
          item.value = item.num
        })
        const myChart = this.$echarts.init(this.$refs.echart);
        let options = {
          color: [
            "#2090d8",
            "#1a57b2",
            "#0bd6f4",
            "#fbcc03",
            "#fba95a",
            "#af7ded",
            "#0bd6f4"
          ],
          tooltip: {
            trigger: "item",
            formatter: function(data) {
              return data.name + "(" + data.value + ")";
            }
          },
          legend: {
            left: "60%",
            top: me.itemTop,
            itemGap: this.item,
            orient: 'vertical',
            inactiveColor: "#ff6600",
            textStyle: {
              color: "#fff",
              fontSize: this.font
            },
            normal: {
              show: false,
              formatter: function(data) {
                return data.name + "(" + data.value + ")";
              },
              color: "#fff",
              orient: 'vertical'
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
              type: "pie",
              radius: [this.radIN, this.radOut],
              center: ["30%", "63%"],
              data: data
            }
          ]
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
      background: url('./images/store.png') no-repeat 22.2% 73.4%;
      background-size: 1.32rem;
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
      top: 0.35rem;
    }
    @media screen and (max-height: 1050px) {
      .title {
        top: 0.35rem;
      }
    }
    @media screen and (min-height: 1050px) {
      .echart-box {
        background-position-y: 71%;
      }
    }
  }
  //大屏适配
  @media screen and (min-width: 5000px) {
    .wrapper .echart-box {
      margin-top: 0.2rem;
    }
  }
</style>
