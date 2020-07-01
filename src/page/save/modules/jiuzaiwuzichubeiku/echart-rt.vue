<template>
  <div class="wrapper flex flex-y">
    <div class="echart-box flex-1">
      <div class="box-item" v-for="(item, index) in data" :key='item.name' @mouseenter="enter(item)" @mouseleave="leave(item)" @click="changeItem(index, item)">
        <p>{{item.name}}</p>
        <div>{{item.value}}</div>
        <img :src='item.src'>
        <div class="goods_hid">
          <ul>
            <li v-for="(item1,index1) in item.wzDetailList" :key="index1">
              <span><b :title="item1.name.length>3?item1.name:''">{{item1.name}} </b>: {{item1.value}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div ref="echart" class="echart"></div> -->
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { mapActions } from 'vuex'
import { getMaterialWarehouseStatistics } from 'api/save/save'
// import func from '../../../../../vue-temp/vue-editor-bridge'

export default {
  props: {
  },
  data() {
    return {
      echart: null,
      item: 10,
      src: require('./images/store-icon.png'),
      data: []
    }
  },
  mounted() {
    getMaterialWarehouseStatistics().then((data) => {
      this.data = data.wzList.map(val => {
        val.src = require('./images/store-icon.png')
        return val
      })
    })
    // window.onresize = () => {
    //   this.echart.resize()
    // }
  },
  watch: {
    data(val) {
      console.log(val)
      // this.initData()
    }
  },
  methods: {
    enter(item) {
      item.src = require('./images/store-icon-sel.png')
    },
    leave(item) {
      item.src = require('./images/store-icon.png')
    },
    initData() {
      const result = this.data.map((val, index) => {
        val.name = `${val.name}(${val.value})`
        return val
      })
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.echart)
        myChart.setOption({
          color: [
            '#00acff',
            '#32d37e',
            '#FBA95A',
            '#7341F4',
            '#F3EC7F',
            '#00f0ff',
            '#f57654'
          ],
          tooltip: {
            trigger: 'item',
            formatter: function(data) {
              return data.name
            }
          },
          legend: {
            left: '50%',
            top: '5%',
            orient: 'vertical',
            itemGap: this.item,
            inactiveColor: '#ff6600',
            textStyle: {
              color: '#fff',
              fontSize: 16
            },
            formatter: function(data) {
              // return `${data.name}(${data.value})`
              return data
            }
          },
          grid: {
            top: '10%',
            right: '10%',
            left: '10%',
            bottom: '10%'
          },
          calculable: true,
          series: [
            {
              label: {
                normal: {
                  show: false
                }
              },
              name: '面积模式',
              type: 'pie',
              radius: [30, 70],
              center: ['25.5%', '50%'],
              roseType: 'area',
              data: result
            }
          ]
        })
        this.echart = myChart
      })
    },
    changeItem(index, item) {
      this.currentIndex = index
      this.clickme(item.name)
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  components: {
    ItemTitle
  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    .echart-box {
      background: url("./images/store-bg.gif") no-repeat 100%;
      // background-size: 4.55rem;
      .echart {
        width: 100%;
        height: 100%;
      }
    }
  }
  .box-item{
    position: absolute;
    width: 1.5rem;
    height: 0.5rem;
    text-align: center;
    left: 3.5rem;
    top: 1.5rem;
    cursor: pointer;
    div{
      color: #fffbb7;
      z-index: 25;
      position: relative;
    }
    p{
      background-image:-webkit-linear-gradient(bottom,#34bdff,#ffffff);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      font-weight: 550;
      margin-bottom: 0.1rem;
    }
    img{
      position: absolute;
      left: 0.45rem;
      bottom: -0.3rem;
    }
  }
  .box-item:nth-child(2){
    left: 2.3rem;
    top: 1rem
  }
  .box-item:nth-child(3){
    left: 3.5rem;
    top: 0.5rem;
  }
  .box-item:nth-child(4){
    left: -0.2rem;
    top: 1.2rem
  }
  .box-item:nth-child(5){
    left: 1.3rem;
    top: 0.7rem
  }
  .box-item:nth-child(6){
    left: 2.2rem;
    top: 0.1rem;
  }
  .box-item:nth-child(7){
    left: 0.3rem;
    top: 0.2rem;
  }
  .box-item:hover>.goods_hid{
    display: block;
    z-index: 900;
  }
  .box-item>.goods_hid {
    position: absolute;
    right: 50%;
    top: 130%;
    padding: 0.1rem 0.2rem;
    font-size: 0.16rem;
    background-color: rgba(0,41,83,0.9);
    border-radius: 0.08rem;
    box-shadow: rgb(86, 197, 255,0.8) 0px 0px 18px inset;
    z-index: 900;
    width: 4.5rem;
    letter-spacing: 0.01rem;
    max-height: 30vh;
    overflow: auto;
    display: none;
    &::-webkit-scrollbar {
      // display: none;
    }
    li {
      height: 0.3rem;
      list-style-type: none;
      color: #fff;
      width: 50%;
      float: left;
      > span {
        display: block;
        height: 100%;
        > b {
          max-width: 60%;
          float: left;
          .no-wrap();
        }
      }
    }
  }
</style>
