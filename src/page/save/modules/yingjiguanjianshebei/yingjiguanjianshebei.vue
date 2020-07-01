<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="应急关键设备"></ItemTitle>
    <div class="container flex-1">
      <ul class="box">
        <!-- <li class="item flex" @click="clickme(dataList[0] && dataList[0].name)">
          <img src="./images/clothes.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[0] && this.dataList[0].name}}</span>
            <b>
              {{this.dataList[0] && this.dataList[0].value}}
              <span>{{this.dataList[0] && this.dataList[0].unit}}</span>
            </b>
          </div>
        </li> -->
        <li class="item flex" v-for="(item, index) in dataList" @click="clickme(item.name)" :key="index">
          <img :src="item.src" alt/>
          <div class="flex-1">
            <span>{{item.name}}</span>
            <b>
              {{item.value}}
              <span>{{item.unit}}</span>
            </b>
          </div>
        </li>
        <!-- <li class="item flex" @click="clickme(dataList[1] && dataList[1].name)">
          <img src="./images/jiushengquan.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[1].name}}</span>
            <b>
              {{this.dataList[1].value}}
              <span>{{this.dataList[1] && this.dataList[1].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[2] && dataList[2].name)">
          <img src="./images/shuibeng.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[2].name}}</span>
            <b>
              {{this.dataList[2].value}}
              <span>{{this.dataList[2] && this.dataList[2].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[3] && dataList[3].name)">
          <img src="./images/charge_boat.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[3].name}}</span>
            <b>
              {{this.dataList[3].value}}
              <span>{{this.dataList[3] && this.dataList[3].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[4] && dataList[4].name)">
          <img src="./images/paoshengqi.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[4].name}}</span>
            <b>
              {{this.dataList[4].value}}
              <span>{{this.dataList[4] && this.dataList[4].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[5] && dataList[5].name)">
          <img src="./images/ele.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[5].name}}</span>
            <b>
              {{this.dataList[5].value}}
              <span>{{this.dataList[5] && this.dataList[5].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[6] && dataList[6].name)">
          <img src="./images/rub_dhy.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[6].name}}</span>
            <b>
              {{this.dataList[6].value}}
              <span>{{this.dataList[6] && this.dataList[6].unit}}</span>
            </b>
          </div>
        </li>
        <li class="item flex" @click="clickme(dataList[7] && dataList[7].name)">
          <img src="./images/weixing.png" alt/>
          <div class="flex-1">
            <span>{{this.dataList[7].name}}</span>
            <b>
              {{this.dataList[7].value}}
              <span>{{this.dataList[7] && this.dataList[7].unit}}</span>
            </b>
          </div>
        </li> -->
      </ul>
      <!--        </el-carousel-item>-->
      <!--        <el-carousel-item>-->
      <!--          <ul class="box">-->
      <!--            <li></li>-->
      <!--          </ul>-->
      <!--        </el-carousel-item>-->
      <!--      </el-carousel>-->
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import cnchar from 'cnchar'
import { getEquipmentMainByUser } from 'api/save/save'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      interval: 1000 * 5,
      dataList: [
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' },
        // { name: 0, value: '0' }
      ]
    }
  },
  mounted() {
    getEquipmentMainByUser().then(res => {
      if (res.categoryViews) {
        this.dataList = res.categoryViews.slice(0, 9).map(val => {
          console.log(val.name)
          try {
            val.src = require(`./images/${cnchar.spell(val.name, 'first', 'low')}.png`)
          } catch (e) {
            val.src = require(`./images/jsj.png`)
          }
          return val
        })
      }
    })
  },
  methods: {
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
    .container {
      position: relative;
      .box {
        overflow: hidden;
        position: absolute;
        top: 45%;
        left: 0;
        transform: translate(0, -50%);
        .item {
          width: 33.33%;
          float: left;
          margin: 0.15rem 0;
          cursor: pointer;
          > img {
            width: 0.5rem;
            height: 0.4rem;
          }
          > div {
            height: 0.58rem;
            > span {
              color: #00ccff;
              display: block;
              font-size: 0.16rem;
              line-height: 0.26rem;
            }
            > b {
              color: #f2ec81;
              font-size: 0.16rem;
              line-height: 0.26rem;
              display: block;
              > span {
                color: #fff;
                padding-left: 0.1rem;
              }
            }
          }
        }
      }
    }
  }
  /deep/ .el-carousel__arrow--right {
    display: none;
  }
  /deep/ .el-carousel__arrow--left {
    display: none;
  }
  /deep/ .el-carousel__button {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 0.1rem;
    background: #3ecbe0;
  }
</style>
