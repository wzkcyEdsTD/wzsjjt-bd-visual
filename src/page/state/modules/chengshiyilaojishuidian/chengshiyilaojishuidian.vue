/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' :title="'城市易涝积水点'"></ItemTitle>
    <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div>
    <div class="echarts-box flex-1">
      <div class="item flex flex-y" id="ri">
        <div class="rollList flex flex-y">
          <div class="panel">
            <div class="maquee" ref="wrapper" id="maquee">
              <ul class="ul-rymodal flex flex-y" ref="ul">
                <li class="li-rymodal" v-for="(value,index) in navList[name].list" :key="value+index">
                  <div class="maquee_div1 maquee_public" ref="acp11">{{value.name}}</div>
                  <div class="maquee_div2 maquee_public">
                    <span :style="{'width':value.value/dataMax*100 +'%'}"></span>
                  </div>
                  <!--            <div class="maquee_div3 maquee_public">{{value.value}}å¤„</div>-->
                  <div class="maquee_div3 maquee_public">{{value.value}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="item flex flex-y" id="le">
        <!-- //切换按钮 -->
       <ul class="tabs">
         <li :class="{active: item.state}" v-for="(item, index) in tabsList" :key='index' @click="changeState(index)">{{item.name}}</li>
       </ul>
        <img src="./img/water.png" style="cursor: pointer" @click="clickme(name)" alt="">
        <div class="total-name" style="cursor: pointer" @click="clickme(name)">{{name}}<b>{{navList[name].total}}</b></div>
<!--        <div class="total" @click="clickme(name)"></div>-->
        <!-- <echartRight class="flex-1"></echartRight> -->
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import ItemTitle from "../item-title/item-title";
import { getStyld } from 'api/state/state';
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "Echart10",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      data: {},
      name: '易涝点',
      navList: {
        '积水点': {
          list: [],
          total: 0
        },
        '易涝点': {
          list: [],
          total: 0
        }
      },
      scrollTop: 0,
      scrollFlag: null,
      total: 0,
      tabsList: [
        {
          name: '易涝点',
          state: true
        },
        {
          name: '积水点',
          state: false
        },
      ]
    };
  },
  computed: {
    dataMax() {
      let max = 1
      this.navList[this.name].list.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    },
    detailList() {
      return [...this.navList[this.name].list]
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    let ri = document.getElementById('ri')
    // ri.attachEvent = function(e) {
    // }
    if (this.userInfo.districtName === '平阳县') {
      this.tabsList = this.tabsList.filter(val => {
        return val.name !== '积水点'
      })
    }
    if (this.userInfo.districtName === '苍南县') {
      this.tabsList = this.tabsList.filter(val => {
        return val.name !== '易涝点'
      })
      this.name = '积水点'
      this.tabsList[0].state = true
    }
    getStyld().then(res => {
      res.forEach(val => {
        this.navList[val.name] = val
      })
      // this.navList = res.slice(0, -1)
      // this.total = res.slice(-1)[0].value
    })
    // getForecastMainByUser().then((data) => {
    //   this.data = data
    // })
    const doc = document.getElementById('maquee')
    doc.onmouseenter = () => {
      this.scrollDestroyHandler()
    }
    doc.onmouseleave= () => {
      this.scrollStartHandler()
    }
    doc.onscroll = () => {
       this.scrollTop = doc.scrollTop
    }
    this.scrollStartHandler()
  },
  beforeDestroy() {
    this.scrollDestroyHandler()
  },
  methods: {
    // 易涝积水切换
    changeState(index) {
      this.tabsList = this.tabsList.map(val => {
        val.state = false
        return val
      })
      this.name = this.tabsList[index].name
      this.tabsList[index].state = true
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = document.getElementById('maquee')
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            dom.scrollTop = 0
            this.scrollTop = 0
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    },
    // 移入
    mouseOver() {
      // this.active = "background-color:black";
      // 操作dom 获取p标签改变其样式
      var acps = this.$refs.acp;
      acps.style.display = "block";
      // acps.style.color="red";
    },
    // 移出
    mouseLeave() {
      // this.active = "";
      this.$refs.acp.style.display = "none";
    },
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
};
</script>
<style scoped lang="less">
  .wrapper{
    position: relative;
  .tip-box {
    text-align: right;
    position: absolute;
    right: 0;
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
  }}
  .echarts-box {
  height: 100%;
  #le {
    width: 40%;
    position: relative;
    img{
      width: 100%;
      position: absolute;
      top: 54%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  #ri {
    width: 60%;
  }
  .item {
    float: left;
    width: 60%;
    height: 100%;
    box-sizing: border-box;
    .total{
      font-size: 0.18rem;
      color:#fedb5d;
      position: absolute;
      top: 70%;
      width: 100%;
      text-align: center;
      color: #ffc600;
      font-weight: bold;
    }
    .total-name{
      font-size: 0.16rem;
      color:#ffffff;
      position: absolute;
      top: 78%;
      width: 100%;
      text-align: center;
      b{
        color:#fedb5d;
        margin-left: 0.1rem;
      }
    }
    .title {
      min-width: 1.5rem;
      text-align: center;
      height: 0.3rem;
      line-height: 0.28rem;
      padding: 0 0.1rem;
      font-size: 0.12rem;
      color: @color-text;
      .bg-image("../../images/img-kuang");
      margin: 0.1rem auto;
      .danger {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-danger");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .video {
        width: 0.12rem;
        height: 0.12rem;
        .bg-image("../../images/icon-video");
        display: inline-block;
        margin-right: 0.05rem;
      }
      .bold {
        padding: 0 0.05rem;
        color: #0dd5f4;
        font-weight: bold;
      }
    }
    #ri1 {
      width: 100%;
    }
  }
}
.tabs{
  list-style: none;
  position: absolute;
  top: 0.75rem;
  right: 0rem;
  display: flex;
  // flex-direction: column;
  li{
    cursor: pointer;
    border-radius: 0.1rem;
    font-size: 0.14rem;
    margin-left: 0.1rem;
    color: #beccd4;
    padding: 0.03rem 0.1rem 0.03rem 0.3rem;
    margin-bottom: 0.08rem;
    background: url('./img/flood.png') no-repeat;
    background-position: 0.1rem center;
    box-shadow: 0px 0px 10px rgba(255,255,255,0.4) inset;
  }
  li:nth-child(2){
    background-image: url('./img/waterMore.png');
  }
  li.active{
    background-color: #084685;
    color: #fff;
  }
  li:nth-child(1).active{
    background-image: url('./img/flood-act.png');
  }
  li:nth-child(2).active{
    background-image: url('./img/water-act.png');
  }
}
.wrapper{
position: relative;}
.tip-box {
  text-align: right;
  position: absolute;
  right: 0;
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
.rollList {
    * {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .panel {
      width: 2.7rem;
      background-color: rgba(0, 0, 0, 0);
      border-radius: 0.03rem;
      overflow: hidden;
      height: 2.2rem;
      margin-top: 0.6rem;
    }
    .maquee {
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      overflow: auto;
      width: calc(100% + 0.1rem);
    }
    .maquee ul {
      width: 100%;
    }
    .maquee li {
      width: 100%;
      height: 0.4rem;
      background-color: rgba(0, 0, 0, 0);
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
    .maquee_public {
      float: left;
    }
    .maquee_div1 {
      width: 26%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff;
    }
    .maquee_div2 {
      width: 46%;
      margin-right: 8%;
      margin-left: 4%;
      // background-color: #1d538d;
      background: url('./img/bg.png') no-repeat;
      background-size: 100% 0.12rem;
      height: 0.12rem;
      transform: skewX(-45deg);
      margin-top: 6%;
    }
    .maquee_div3 {
      width: 16%;
      text-align: left;
      color: rgba(255, 255, 255, 0.7);
    }
    .maquee_div2 span {
      display: block;
      height: 0.12rem;
      // border-radius: 0.04rem;
      // transform: skewX(-45deg);
      float: left;
      background: -webkit-linear-gradient(left, #1b6bff, #00ffd2);
      background: -o-linear-gradient(left, #1b6bff, #00ffd2);
      background: -mos-linear-gradient(left, #1b6bff, #00ffd2);
      background: linear-gradient(left, #1b6bff, #00ffd2);
    }
    .li-rymodal {
      /*float: left;
      list-style: none;
      margin: 5px;*/
      list-style: none;
      white-space: nowrap;
      display: block;
    }
    .ul-rymodal {
      display: block;
      padding: 0;
      white-space: nowrap;
      overflow-y: scroll;
    }
    .ul-rymodal::-webkit-scrollbar {
      display: none;
    }
  }
  @media screen and (max-height: 1050px) {
    .rollList .panel {
      height: 1.78rem;
    }
  }
</style>

