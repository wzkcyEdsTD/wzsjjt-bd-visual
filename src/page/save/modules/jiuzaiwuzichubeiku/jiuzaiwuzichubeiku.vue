<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="应急重点物资统计"></ItemTitle>
    <!-- <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div> -->
    <div class="flex-1">
      <div class="content">
        <!-- <div class="box-lf">
          <div
            v-for="(item,index) in typeList"
            :key="'a'+index"
            class="title"
            :class="{'active':currentIndex===index}"
            @click="changeItem(index,item)"
          ><span>{{item.name}}&nbsp;<label class="item-value">{{item.value}}</label></span>
            <div class="goods_hid">
              <ul>
                <li v-for="(item1,index1) in item.wzDetailList" :key="index1">
                  <span><b :title="item1.name.length>3?item1.name:''">{{item1.name}} </b>: {{item1.value}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div> -->
         <!-- @click="changeItem(index, item)" -->
        <div class="box">
          <div class="echart-box flex-1">
            <div class="box-item" v-for="(item, index) in data" :key='index' @mouseenter="enter(item)" @mouseleave="leave(item)" @click="changeItem(index, item)">
              <p>{{item.name}}</p>
              <div>{{item.value}}</div>
              <img :src='item.src'>
              <div class="goods_hid">
                <ul>
                  <li v-for="(item1,index1) in item.wzDetailList" :key="index1">
                    <span><b :title="item1.name.length>3?item1.name:''">{{item1.name}}:  </b>{{item1.value}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- <div ref="echart" class="echart"></div> -->
          </div>
          <!-- <EchartRT class="echart" :data="data"></EchartRT> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import EchartRT from './echart-rt'
import { getMaterialWarehouseStatistics } from 'api/save/save'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemTitle,
    EchartRT
  },
  data() {
    return {
      data: [],
      typeList: [],
      currentIndex: 0,
      listIndex: -1
    }
  },
  mounted() {
    getMaterialWarehouseStatistics().then((data) => {
      this.data = data.wzList.map(val => {
        val.src = require('./images/store-icon.png')
        return val
      })
    })
  },
  methods: {
    enter(item) {
      item.src = require('./images/store-icon-sel.png')
    },
    leave(item) {
      item.src = require('./images/store-icon.png')
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
  }
}
</script>

<style scoped lang='less'>
  // .box-bar{
  //   height: 13px;
  //   width: 75%;
  //   background: #fff;
  //   float: left;
  // }
  // .item-value{
  //   float: right;
  //   line-height: 13px;
  // }
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .tip-box {
      text-align: right;
      position: absolute;
      right: -0.05rem;
      top: 0.2rem;
      z-index: 9999;
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
    .content {
      width: 100%;
      height: 100%;
      position: relative;
      .box-lf {
        width: 35%;
        position: absolute;
        z-index: 999;
        left: 0.03rem;
        top: 45%;
        transform: translate(0, -50%);
        .title {
          float: left;
          width: 2.2rem;
          min-width: 1.67rem;
          text-align: left;
          height: 0.26rem;
          line-height: 0.26rem;
          /*padding: 0 0.1rem;*/
          font-size: 0.16rem;
          margin: 0.04rem auto;
          color: #fff;
          cursor: pointer;
          position: relative;
          label{
            color:#1bbdf2;
            font-weight: 600;
          }
          &.active {
            /*color: #0dd5f4;*/
          }
          &:hover > .goods_hid {
            display: block !important;
          }
          .goods_hid {
            position: absolute;
            left: 10%;
            top: 100%;
            padding: 0.1rem 0.2rem;
            font-size: 0.16rem;
            background-color: #142f3f;
            border-radius: 0.08rem;
            box-shadow: rgb(24, 224, 255) 0px 0px 18px inset;
            z-index: 9999;
            width: 5rem;
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
                text-align: left;
                > b {
                  width: 55%;
                  float: left;
                  .no-wrap();
                }
              }
            }
          }
        }
      }
      .box {
        width: 100%;
        height: 100%;
        color: white;
        // position: absolute;
        // left: 40%;
        // top: 0;
      }
    }
  }
  .echart-box {
    background: url("./images/store-bg.gif") no-repeat 100%;
    // background-size: 4.55rem;
    width: 100%;
    height: 94%;
    .echart {
      width: 100%;
      height: 100%;
    }
  }
  .box-item{
    position: absolute;
    width: 1.5rem;
    height: 0.5rem;
    text-align: center;
    left: 1.5rem;
    top: 0.4rem;
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
    left: 0.1rem;
    top: 0.8rem
  }
  .box-item:nth-child(3){
    left: 3.2rem;
    top: 0.7rem;
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
    width: 5.2rem;
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
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      > span {
        display: block;
        height: 100%;
        text-align: left;
        > b {
          width: 55%;
          float: left;
          .no-wrap();
        }
      }
    }
  }
</style>
