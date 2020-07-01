<template>
  <div class="wrapper flex flex-y">
    <div class="hospital" style="width:4.2rem;height:2.71rem">
      <div class="hospital_content">
        <div class="tip-box">
          <div class="item">
            <span class="icon orange"></span>
            单位/个
          </div>
        </div>
        <div class="hospital_module1 hospital_left hospital_pulic" @click="clickme(dataList[0].name)">
          <dl>
            <dd>{{this.dataList[0].name}}</dd>
            <dt>{{this.dataList[0].value}}</dt>
          </dl>
          <img src="./img/line_04.png" width="51" height="16" class="hospital_img1"/>
        </div>

        <div class="hospital_module2 hospital_left hospital_pulic" @click="clickme(dataList[1].name)">
          <dl>
            <dd>{{this.dataList[1].name}}</dd>
            <dt>{{this.dataList[1].value}}</dt>
          </dl>
          <img src="./img/line-03.png" width="31" height="41" class="hospital_img2"/>
        </div>

        <div class="hospital_module3 hospital_right hospital_pulic" @click="clickme(dataList[2].name)">
          <dl>
            <dd>{{this.dataList[2].name}}</dd>
            <dt>{{this.dataList[2].value}}</dt>
          </dl>
          <img src="./img/line_02.png" width="86" height="66" class="hospital_img3"/>
        </div>

        <div class="hospital_module4 hospital_right hospital_pulic" @click="clickme(dataList[3].name)">
          <dl>
            <dd>{{this.dataList[3].name}}</dd>
            <dt>{{this.dataList[3].value}}</dt>
          </dl>
          <img src="./img/line_01.png" width="47" height="29" class="hospital_img4"/>
        </div>

        <div
          flag="xz"
          class="hospital_build1"
          :style="active"></div>
        <div
          flag="jkzx"
          class="hospital_build2"
          :style="active"></div>
      </div>

      <!-- <div class="hospital_hid current" ref="acp">
        <ul>
          <li>
            <img src="./img/point_01.png" width="7" height="10"/>{{tip.text1}}
          </li>
          <li>
            <img src="./img/point_02.png" width="7" height="10"/>{{tip.text2}}
          </li>
          <li>
            <img src="./img/point_03.png" width="7" height="10"/>{{tip.text3}}
          </li>
          <li>
            <img src="./img/point_01.png" width="7" height="10"/>{{tip.text4}}
          </li>
        </ul>
      </div> -->
      <!-- <tip class="tip" ref="acp"></tip> -->
    </div>
  </div>
</template>
<script>
import { getSaveAbilityMainByUser } from 'api/save/save'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      msg: 'HelloWorld,I am PC',
      active: '',
      tip: {
        text1: '', text2: '', text3: '', text4: ''
      },
      dataList: [{ name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }, { name: 0, value: 0 }]
    }
  },
  created() {
    getSaveAbilityMainByUser().then(res => {
      // console.log(res.categoryViews);
      this.dataList = res.organizations
      // console.log(this.dataList)
    })
  },
  methods: {
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
    // mouseOver(flag) {
    //   // this.active = "background-color:black";
    //   // 操作dom 获取p标签改变其样式
    //   var acps = this.$refs.acp
    //   acps.style.display = 'block'
    //   // acps.style.color="red";
    //   // console.log(1)
    //   if (flag === 'xz') {
    //     this.tip = { text1: 'A型:10000ml', text2: 'B型:10000ml', text3: 'AB型:10000ml', text4: 'O型:10000ml' }
    //   } else if (flag === 'jkzx') {
    //     this.tip = { text1: '疫苗A:3000支', text2: '疫苗B:3000支', text3: '疫苗C:3000支', text4: '疫苗D:3000支' }
    //   }
    // },
    // // 移出
    // mouseLeave() {
    //   // this.active = "";
    //   this.$refs.acp.style.display = 'none'
    //   // console.log(2)
    // }
  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    .echart-box {
      width: 100%;
      height: 100%;
    }
    position: relative;
    .hospital_content {
      width: 100%;
      height: 95%;
      background-image: url("./img/build_bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
    }
    .hospital_left dl {
      float: left;
    }
    .hospital_content dl dt {
      text-align: center;
      color: #0dd5f4;
      height: 0.25rem;
      line-height: 0.25rem;
      font-weight: 600;
    }
    .hospital_pulic {
      font-size: 0.16rem;
      color: #fff;
      cursor: pointer;
    }
    .hospital_img1 {
      margin-top: 0.1rem;
      margin-left: 0.1rem
    }
    .hospital_img2 {
      margin-top: 0.1rem;
      margin-left: 0.1rem;
    }
    .hospital_module1 {
    }
    .hospital_right dl {
      float: right;
    }
    .hospital_right img {
      float: right;
    }
    .hospital_img3 {
      margin-top: 0.1rem;
      margin-right: 0.1rem;
    }
    .hospital_img4 {
      margin-top: 0.1rem;
      margin-right: 0.1rem;
    }
    .hospital_build1 {
      position: absolute;
      top: 0.9rem;
      left: 60%;
      background-image: url("./img/build_left.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 0.46rem;
      height: 1.2rem;
    }
    .hospital_build2 {
      position: absolute;
      width: 0.53rem;
      height: 1.02rem;
      background-image: url("./img/build_right.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      top: 0.9rem;
      left: 25%;
    }
    .hospital_build1:hover {
      background-image: url("./img/build_left_select.png");
    }
    .hospital_build2:hover {
      background-image: url("./img/build_right_select.png");
    }
    .hospital_module1 {
      position: absolute;
      top: 0.75rem;
      left: 4%;
    }
    .hospital_module2 {
      position: absolute;
      top: 0.2rem;
      left: 20%;
    }
    .hospital_module3 {
      position: absolute;
      top: 0.2rem;
      right: 7%;
    }
    .hospital_module4 {
      position: absolute;
      top: 0.6rem;
      right: 6%;
    }
    .hospital_tip {
      position: absolute;
      color: #fff;
      bottom: 0.05rem;
      text-align: center;
      width: 100%;
      font-size: 0.16rem;
    }
    .hospital_tip img {
      vertical-align: middle;
      margin-right: 0.1rem;
      font-size: 0.14rem;
    }
    .hospital_hid {
      padding: 0.1rem 0.2rem;
      font-size: 0.16rem;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 0.08rem;
      box-shadow: rgb(24, 224, 255) 0px 0px 18px inset;
      position: absolute;
      top: 0.9rem;
      left: 2.8rem;
      display: none
    }
    .hospital_hid li {
      height: 0.3rem;
      // line-height: 0.3rem;
      list-style-type: none;
      color: #fff;
    }
    .hospital_hid li img {
      margin-top: 0.05rem;
      margin-right: 0.05rem;
    }
    img {
      margin: 0;
      padding: 0;
    }
    @keyframes mymove {
      0% {
        top: 0.45rem;
      }
      100% {
        top: 0.9rem;
      }
    }
    .current {
      animation: mymove 2s alternate;
      -webkit-animation: mymove 2s alternate; /* Safari and Chrome */
    }
    .unit {
      position: absolute;
      font-size: 0.16rem;
      color: #54b6ff;
      top: 0rem;
      left: 0rem;
    }
    .tip-box {
      text-align: right;
      position: absolute;
      right: -0.25rem;
      top: -0.35rem;
      .item {
        color: #fff;
        font-size: 0.14rem;
        display: block;
        padding: 0 0.1rem;
        margin-top: 0.3rem;
        .icon {
          .bg-image('../../../images/img-blue');
          width: 0.1rem;
          height: 0.11rem;
          display: inline-block;
          &.orange {
            .bg-image('../../../images/img-orange');
          }
        }
      }
    }
    // .tip{
    //   position: absolute;
    //   top: 90px;
    //   left: 310px;
    // }
  }
</style>
