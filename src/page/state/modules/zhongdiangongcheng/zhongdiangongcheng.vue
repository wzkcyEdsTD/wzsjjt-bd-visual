/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="重点工程"></ItemTitle>
    <!-- <div class="tip-box">
      <div class="item">
        <span class="icon orange"></span>
        单位/个
      </div>
    </div> -->
    <div class="pictu flex-1">
      <div class="roadTran flex-1">
        <ul>
          <!-- @click="jumpMap(item.name)" -->
          <li v-for="(item, index) in dataList" :key='index'>
            <div><b>{{item.name}}</b></div>
            <span>{{item.num||0}}</span></li>
          <!-- <li>多大的撒大安达市大多<span>55223</span></li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// <link href="style.css" rel="stylesheet" type="text/css" />;
// <link href="css/cartoon.css" rel="stylesheet" type="text/css" />;
import './style.css'
import ItemTitle from "../item-title/item-title";
import { getRoad } from "@/api/state/Road";
import { mapActions, mapGetters } from 'vuex'
import { getKeyProjectsData } from 'api/state/state'

export default {
  name: "Echart6",
  components: {
    ItemTitle
  },
  data() {
    return {
      echart: null,
      dataList: [
        // { name: '城市建设及基础设施项目', num: 0 },
        // { name: '工业项目', num: 0 },
        // { name: '交通能源项目', num: 0 },
        // { name: '现代服务业及其他项目', num: 0 },
        // { name: '农林水利项目', num: 0 },
        // { name: '社会发展项目', num: 0 }
      ]
    };
  },
  mounted() {
    this.initData()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    initData() {
      getKeyProjectsData().then((data) => {
        const newData = JSON.parse(JSON.stringify(data));
        const maxArr = []
        if (newData[0].name.length >= newData[1].name.length) {
          maxArr.push(newData[0])
          maxArr.push(newData[1])
        } else {
          maxArr.push(newData[1])
          maxArr.push(newData[0])
        }
        for (let i = 2; i < newData.length; i++) {
          if (newData[i].name.length >= maxArr[0].name.length) {
            maxArr[1] = maxArr[0]
            maxArr[0] = newData[i]
          } else if (newData[i].name.length > maxArr[1].name.length) {
            maxArr[1] = newData[i]
          }
        }
        const res = []
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].name !== maxArr[0].name && newData[i].name !== maxArr[1].name) {
            res.push(newData[i])
          }
        }
        res.splice(2, 0, maxArr[1])
        res.splice(0, 0, maxArr[0])
        this.dataList = res
      })
    },
    jumpMap(name) {
      this.SetSpecalTreeName(name)
      this.$router.push('/map')
    },
    ...mapActions('map', [
      'SetSpecalTreeName'
    ])
  },
};
</script>

<style scoped lang='less'>
  .roadTran {
    background: url(web/engineer-bg.png);
    width: 100%;
    background-size: 70%;
    background-position-y: 0px;
    background-position-x: 70px;
    background-repeat: no-repeat;
    margin-top: 0.4rem;
    color: #fff;
    height: 100%;
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 2.35rem;
      justify-content: space-between;
      align-content: space-between;
      margin-top: 0.4rem;
      li {
        height: 0.7rem;
        display: inline-block;
        padding-left: 0.15rem;
        cursor: pointer;
        margin-top: 0.08rem;
        span {
          color: #00d2ff;
          font-weight: 600;
          display: block;
          width: 100%;
          float: left;
        }
        div {
          width: 100%;
          b {
            width: 65%;
            display: block;
            font-size: 16px;
            font-weight: 400;
          }
        }
      }
    }
  }
  ul > li:nth-child(n + 4) {
    text-align: right;
    background-position: top right;
    padding-right: 0.12rem;
    padding-left: 0px !important;
    div {
      b {
        float: right;
      }
    }
  }
  ul > li:nth-child(1) {
    background: url('./web/engineer-frame1.png') no-repeat;
    line-height: 0.24rem;
  }
  ul > li:nth-child(2) {
    background: url('./web/engineer-frame2.png') no-repeat;
    line-height: 0.35rem;
  }
  ul > li:nth-child(3) {
    background: url('./web/engineer-frame3.png') no-repeat;
    line-height: 0.35rem;
  }
  ul > li:nth-child(4) {
    background: url('./web/engineer-frame4.png') no-repeat;
    line-height: 0.24rem;
  }
  ul > li:nth-child(5) {
    background: url('./web/engineer-frame5.png') no-repeat;
    line-height: 0.35rem;
    background-position-x: 50px;
  }
  ul > li:nth-child(6) {
    background: url('./web/engineer-frame6.png') no-repeat;
    line-height: 0.35rem;
  }
  @media screen and (min-height: 1050px) {
    .roadTran {
      margin-top: 0.3rem;
      ul {
        margin-top: 0.7rem;
        height: 2.4rem;
        li {
          height: 0.4rem;
          margin-top: 0.1rem;
        }
      }
    }
  }
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
      margin-top: 0.25rem;
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
</style>
