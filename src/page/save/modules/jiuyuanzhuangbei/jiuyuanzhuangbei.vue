<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="应急物资装备"></ItemTitle>
    <!-- <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div> -->
    <div class="echart-box flex-1">
      <div ref="echart" class="echart"></div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { getSaveEquip } from 'api/save/SaveEquip'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      bot: '50%'
    }
  },
  mounted() {
    if (document.documentElement.clientHeight > 1000) this.bot = '45%'
    this.initData()
    window.onresize = () => {
      this.echart.resize()
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        var dataName = []
        var dataNum = []
        getSaveEquip().then(res => {
          for (var i = 0; i < res.categoryViews.length; i++) {
            dataName.push(res.categoryViews[i].name)
            dataNum.push(res.categoryViews[i].value)
          }
          const myChart = this.$echarts.init(this.$refs.echart)
          myChart.setOption({
            tooltip: {
              trigger: 'item',
              axisPointer: {
                // 坐标轴指示器，，坐标轴触发有效
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              top: '13%',
              left: '10%',
              bottom: this.bot,
              right: '0%'
            },
            xAxis: [
              {
                data: dataName,
                axisLabel: {
                  rotate: 49,
                  align: 'right',
                  margin: 15,
                  padding: [0, 0, 0, 40],
                  width: '0.1rem',
                  height: '1rem',
                  textStyle: {
                    color: '#fff', // 坐标值得具体的颜色
                    fontSize: 16
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                splitLine: {
                  lineStyle: {
                    color: '#333'
                  }
                }
              }
            ],
            // title: {
            //   // text: '单位（个）',
            //   right: 0,
            //   top: 5,
            //   textStyle: {
            //     color: '#54b6ff',
            //     fontSize: 16
            //   }
            // },
            series: [
              {
                type: 'bar',
                barWidth: 20,
                data: dataNum,
                label: {
                  show: true,
                  position: 'top',
                  color: '#2bd0ff'
                },
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
                    {
                      offset: 0,
                      color: '#1764ff'
                    },
                    {
                      offset: 1,
                      color: '#56daff'
                    }
                  ])
                }
              }
            ]
          })
          myChart.on('click', (param) => {
            this.clickme(param.name)
          })

          this.echart = myChart
        })
      })
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    .echart {
      height: 100%;
      width: 100%;
    }
    position: relative;
    .tip-box {
      text-align: right;
      position: absolute;
      right: -0.1rem;
      top: 0.15rem;
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
  }
</style>
