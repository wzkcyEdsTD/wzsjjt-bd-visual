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
    <div class="echart-box flex-1" v-if="userInfo.districtName !== '经开区'">
      <div ref="echart" class="echart"></div>
    </div>
    <div class="echart-jk" v-else>
      <div class="e_wrap" :class="'active' + selectIndex">
        <div
          class="wz"
          :class="{active: selectIndex === index}"
          v-for='(item, index) in dataList'
          :key='"wz" + index'
          @mouseleave="startTimer"
          @mouseenter="highLight(index)"
          @click="clickme(item.name)">{{item.name}}
        </div>
        <div
          class="sz"
          :class="{active: selectIndex === index}"
          v-for='(item, index) in dataList'
          :key='"sz" + index'
          @mouseleave="startTimer"
          @mouseenter="highLight(index)"
          @click="clickme(item.name)">{{item.value}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { getUnderGroudByUser } from 'api/state/state'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "dixiakongjian",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      item: 22,
      radIN:45,
      radOut:60,
      sumNum: 512,
      font:16,
      name: '地下空间',
      secondName: '地下空间',
      selectIndex: 0,
      timer: null
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
    this.name = '地下空间'
    this.secondName = '地下空间'
    getUnderGroudByUser().then(res => {
      this.dataList = res.list
      this.initData(res)
    })
    window.onresize = () => {
      if (this.echart) {
        this.echart.resize();
      }
    };
  },
  methods: {
    initData(data) {
      this.$nextTick(() => {
        let scaleData
        this.sumNum = data.count
        scaleData = data.list
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
            left: "60%",
            top:"40%",
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
        // if (this.userInfo.districtName !== '永嘉县') {
        //   options.series[0].roseType = 'area'
        // }
        myChart.setOption(options);
        this.echart = myChart;
      });
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.selectIndex >= this.dataList.length - 1) {
          this.selectIndex = 0
        } else {
          this.selectIndex += 1
        }
      }, 4000)
    },
    ...mapActions('map', ['SetSpecalTreeName', 'SetFourColorSpecalTreeName', 'clickme']),
    // 鼠标移动高亮
    highLight(index) {
      this.selectIndex = index
      this.stopTimer()
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
    top:0.35rem;
  }
  .echart-jk {
    height: 100%;
    width: 100%;
    padding: 1rem 0 0 0.5rem;
  }
  .e_wrap {
    width: 100%;
    height: 2.4rem;
    background: url('./images/windmill.png') no-repeat 0.7rem 0.38rem;
    position: relative;
    margin-top: -0.5rem;
  }
  .e_wrap.active0 {
    background: url('./images/light_blue.png') no-repeat 0.7rem 0.38rem;
    background-size: 55%;
  }
  .e_wrap.active1 {
    background: url('./images/dark_blue.png') no-repeat 0.7rem 0.38rem;
    background-size: 55%;
  }
  .e_wrap.active2 {
    background: url('./images/orange.png') no-repeat 0.7rem 0.38rem;
    background-size: 55%;
  }
  .e_wrap.active3 {
    background: url('./images/yellow.png') no-repeat 0.7rem 0.38rem;
    background-size: 55%;
  }
  .wz, .sz {
    color: white;
    font-size: 0.16rem;
    position: absolute;
    cursor: pointer;
    z-index: 9;
  }
  .sz {
    text-align: center;
    display: inline-block;
    width: 0.5rem;
    cursor: pointer;
  }
  .wz:nth-child(1) {
    left: 0.20rem;
    top: 0.3rem;
  }
  .wz.active:nth-child(1) {
    color: #00ddff;
  }
  .wz.active:nth-child(2) {
    color: #27aaff;
  }
  .wz.active:nth-child(3) {
    color: #f19c4a;
  }
  .wz.active:nth-child(4) {
    color: #ffcf00;
  }
  .wz:nth-child(2) {
    left: 3rem;
    top: 0.36rem;
  }
  .wz:nth-child(3) {
    left: -0.3rem;
    top: 2rem
  }
 .wz:nth-child(4) {
    left: 3rem;
    top: 2rem;
  }
  .sz:nth-child(5) {
    left: 1.12rem;
    top: 0.76rem;
  }
  .sz:nth-child(6) {
    left: 2.08rem;
    top: 0.82rem;
  }
  .sz:nth-child(7) {
    left: 1.03rem;
    top: 1.7rem;
  }
  .sz:nth-child(8) {
    left: 2rem;
    top: 1.78rem;
  }
  @media screen and (max-height: 1050px) {
    .title {
      top:0.35rem;
    }
  }
  @media screen and (min-height: 1050px) {
    .echart-box {
      background-position-y: 71%;
    }
       .e_wrap{
     margin-top:-0.2rem;
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
