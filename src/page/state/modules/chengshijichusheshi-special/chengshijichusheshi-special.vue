/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="城市基础设施"></ItemTitle>
    <div class="container flex-1">
      <ul class="box">
        <li class="item flex" v-for="(item, index) in dataList" :key="index" @click="clickme(item.name)">
          <img :src="item.src" alt/>
          <div class="flex-1">
            <span>{{item.name === '燃气经营供应点和储备站' ? '燃气供应点和储备站' : item.name}}</span>
            <b>
              {{item.value}}
              <span>个</span>
            </b>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ItemTitle from '../item-title/item-title'
import { mapActions } from 'vuex'
import { getCityBaseInfo } from 'api/state/state'

export default {
  name: 'Echart3',
  components: {
    ItemTitle
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    getCityBaseInfo().then(res => {
      this.dataList = res.map(val => {
        if (val.name === '通信铁塔') {
          val.src = require('./images/xstxtt.png')
        } else if (val.name === '燃气经营供应点和储备站') {
          val.src = require('./images/rqjygydhcbz.png')
        } else if (val.name === '自来水厂') {
          val.src = require('./images/zlsc.png')
        } else if (val.name === '污水处理厂') {
          val.src = require('./images/wsclc.png')
        } else if (val.name === '电塔') {
          val.src = require('./images/dt.png')
        }
        return val
      })
    })
  },
  methods: {
    ...mapActions('map', [
      'clickme'
    ])
  }
}
</script>

<style scoped lang="less">
  .dot-white {
    cursor: pointer;
    width: 0.32rem;
    height: 0.35rem;
    float: right;
    > img {
      margin: 0 auto;
      display: block;
      width: 0.12rem;
      height: 0.19rem;
      margin-top: 0.08rem;
    }
  }
  .wrapper {
    position: relative;
    .title-btn-group {
      position: absolute;
      top: 0;
      right: 0;
      height: 0.35rem;
      line-height: 0.35rem;
      font-size: 0.14rem;
      margin-right: 0.05rem;
      .dot-white {
        cursor: pointer;
        width: 0.32rem;
        height: 0.35rem;
        float: right;
        > img {
          margin: 0 auto;
          display: block;
          width: 0.18rem;
          height: 0.19rem;
          margin-top: 0.08rem;
        }
      }
    }
    .container {
      position: relative;
      .box {
        overflow: hidden;
        position: absolute;
        top: 55%;
        transform: translate(0, -50%);
        width: 100%;
        .item {
          width: 50%;
          float: left;
          padding: 8px 0;
          border-radius: 8px;
          border:2px solid rgba(0,0,0,0);
          &.active{
          border:2px solid #099bde;
          box-shadow:rgb(9, 155, 222,0.5) 0px 0px 18px inset;
          }
          cursor: pointer;
          > img {
            width: 0.48rem;
            height: 0.54rem;
          }
          > div {
            height: 0.58rem;
            margin-left: 0.08rem;
            > span {
              color: #fff;
              display: block;
              font-size: 0.16rem;
              line-height: 0.26rem;
            }
            > b {
              color: #FDB468;
              font-size: 0.16rem;
              line-height: 0.26rem;
              display: block;
              > span {
                color: #FDB468;
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
  .item-list{
    color: #fff;
  }
</style>
