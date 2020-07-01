<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="医疗救援能力"></ItemTitle>
    <div class="container flex-1">
      <div class="box-wrapper">
        <div class="tip-box">
          <div class="item">
            <span class="icon orange"></span>
            单位/个
          </div>
        </div>
        <ul class="box">
          <li class="item" v-for='(item, index) in dataList' :key='index' @click='clickme(item.name)'>
            <!-- <div class="img-box"> -->
              <!-- <img src="./images/ylcbk.png" alt/> -->
            <!-- </div> -->
            <div class="text-box">
              <span>{{item.name}}</span>
              <b>
                {{item.value}}
                <!--                    <span>(个)</span>-->
              </b>
            </div>
          </li>
          <!-- <li class="item" @mouseover="mouseOver" @mouseleave="mouseLeave">
            <div class="img-box">
              <img src="./images/hosp_hos.png" alt/>
            </div>
            <div class="text-box">
              <span>{{dataList[5].name}}</span>
              <b>
                {{dataList[5].value}}
              </b>
            </div>
          </li> -->
        </ul>
      </div>
      <!-- <el-carousel :interval="interval" arrow="never">
        <el-carousel-item>
        </el-carousel-item>
        <el-carousel-item>
          <div class="box-wrapper">
            <echart03_1/>
          </div>
        </el-carousel-item>
      </el-carousel> -->
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import echart03_1 from './echart03/echart03_1'
import { getSaveAbilityMainByUser } from 'api/save/save'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ItemTitle,
    echart03_1
  },
  data() {
    return {
      interval: 1000 * 5,
      dataList: [
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 }]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
  },
  created() {
    getSaveAbilityMainByUser().then(res => {
      const list = res.goods.filter(val => {
        return val.name !== '救护场所(医院)'
      })
      this.dataList = [...list, ...res.organizations]
      if (this.userInfo.districtName === '平阳县') {
        this.dataList = this.dataList.filter(val => {
          return val.name !== '救护车辆' && val.name !== '血站'
        })
      }
      // console.log(this.dataList)
    })
  },
  methods: {
    mouseOver() {
      // this.active = "background-color:black";
      // 操作dom 获取p标签改变其样式
      var acps = this.$refs.acp
      acps.style.display = 'block'
      // acps.style.color="red";
      // console.log(1);
    },
    // 移出
    mouseLeave() {
      // this.active = "";
      this.$refs.acp.style.display = 'none'
      // console.log(2);
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
    .container{
      background-image: url('./images/hos-bg.png');
      background-position: -55px -30px
    }
    .box-wrapper {
      position: relative;
      padding-top: 0.1rem
    }
    @media screen and (min-height: 1000px) {
  .box-wrapper{
    padding-top:0.3rem;}
  }
    .tip-box {
      text-align: right;
      position: absolute;
      right: -1.4rem;
      top: -0.25rem;
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
    .container {
      .box-wrapper {
        width: 70%;
        /*overflow: hidden;*/
        position: absolute;
        // top: 48%;
        // transform: translate(0, -50%);
        .box {
          overflow: hidden;
          margin: 0 auto;
          margin-top:0rem;
          .item {
            width: 50%;
            height: 0.8rem;
            cursor: pointer;
            float: left;
            position: relative;
            // padding-left: 0.5rem;
            // .bg-image("./images/hosp_bg");
            &:nth-child(odd) {
              /*margin-right: 0.2rem;*/
            }
            .img-box {
              width: 0.45rem;
              height: 0.45rem;
              margin-top: 0.1rem;
              position: relative;
              background: url('./images/jhcl.png') no-repeat;
              background-size: 0.45rem 0.45rem;
              > img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            .text-box {
              position: absolute;
              width: 90%;
              height: 0.58rem;
              // padding: 0.03rem 0;
              right: 0rem;
              top: 0.05rem;
              // padding-left: 0.53rem;
              background: url('./images/hospital-frame.png') no-repeat;
              text-align: center;
              > span {
                color: #fff;
                display: block;
                font-size: 0.16rem;
                line-height: 0.3rem;
              }
              > b {
                color: #ffde00;
                font-size: 0.16rem;
                line-height: 0.28rem;
                display: block;
                > span {
                  color: #00c3ff;
                }
              }
            }
          }
          .item:nth-child(2) .img-box{
            background-image: url('./images/yljhsb.png');
          }
          .item:nth-child(3) .img-box{
            background-image: url('./images/jjzhzx.png');
          }
          .item:nth-child(4) .img-box{
            background-image: url('./images/xz.png');
          }
          .item:nth-child(5) .img-box{
            background-image: url('./images/yljg.png');
          }
          .item:nth-child(6) .img-box{
            background-image: url('./images/jkzx.png');
          }
          .item:nth-child(7) .img-box{
            background-image: url('./images/xz.png');
          }
          .item:nth-child(8) .img-box{
            background-image: url('./images/yljg.png');
          }
        }
        .box-bottom {
          margin-top: 0.1rem;
          text-align: center;
          color: #fff;
          font-size: 0.16rem;
          height: 18px;
          > img {
            vertical-align: middle;
          }
          > span {
            height: 0.18rem;
            line-height: 0.18rem;
            vertical-align: middle;
          }
        }
      }
    }
    .hospital_hid {
      width: 1.7rem;
      padding: 0.1rem 0.2rem;
      font-size: 0.16rem;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 0.08rem;
      box-shadow: rgb(24, 224, 255) 0px 0px 0.18rem inset;
      position: absolute;
      top: 0.3rem;
      left: 2.4rem;
      display: none;
    }
    .hospital_hid ul {
      width: 1.5rem;
    }
    .hospital_hid li {
      width: 1.4rem;
      margin-top: 0.06rem;
      float: left;
      height: 0.3rem;
      line-height: 0.3rem;
      list-style-type: none;
      color: #fff;
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
    /deep/ .el-carousel__indicators {
      bottom: -0.1rem;
    }
  }
</style>
