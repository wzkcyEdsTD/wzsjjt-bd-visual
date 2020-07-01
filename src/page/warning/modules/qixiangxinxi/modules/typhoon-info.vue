<template>
  <div class="wrapper" v-show="isShow">
    <div class="info" v-if="data.tfbh">
      <div class="title"><span>{{data.tfbh}}</span>{{data.name}}({{data.ename}})</div>
      <ul class="info-ul">
        <li class="flex">
          <span>时间:</span>
          <b class="flex-1">{{data.end_time}}</b></li>
        <li class="flex">
          <span>强度:</span>
          <b class="flex-1">{{data.points[data.points.length-1].strong}}</b></li>
        <li class="flex">
          <span>中心位置:</span>
          <b class="flex-1">{{data.points[data.points.length-1].longitude}}°E ,
            {{data.points[data.points.length-1].latitude}}°N</b></li>
        <li class="flex">
          <span>风力风速:</span>
          <b class="flex-1">{{data.points[data.points.length-1].power}}级
            {{data.points[data.points.length-1].speed}}米/秒</b>
        </li>
        <li class="flex">
          <span>中心气压:</span>
          <b class="flex-1">{{data.points[data.points.length-1].pressure}}百帕</b>
        </li>
        <li class="flex">
          <span>移速移向:</span>
          <b class="flex-1"><span v-if="data.points[data.points.length-1].move_speed">{{data.points[data.points.length-1].move_speed}}公里/每小时 </span>{{data.points[data.points.length-1].move_dir}}</b>
        </li>
        <li class="flex">
          <span>风圈半径:</span>
          <b class="flex-1">
            <span class="block" v-if="maxSeven[0] && maxSeven[3]">7级 {{maxSeven[0]}}-{{maxSeven[3]}}公里</span>
            <span class="block" v-if="maxTen[0] && maxTen[3]">10级 {{maxTen[0]}}-{{maxTen[3]}}公里</span>
          </b>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTyphoonDetail } from 'api/warning/warning'

export default {
  data() {
    return {
      isShow: false,
      data: {}
    }
  },
  computed: {
    maxSeven() {
      const data = this.data.points[this.data.points.length - 1].radius7_quad
      const arr = []
      for (const i in data) {
        arr.push(data[i])
      }
      return arr.sort((a, b) => {
        return a - b
      })
    },
    maxTen() {
      const data = this.data.points[this.data.points.length - 1].radius10_quad
      const arr = []
      for (const i in data) {
        arr.push(data[i])
      }
      return arr.sort((a, b) => {
        return a - b
      })
    },
    ...mapGetters('warning', [
      'typhoonInfo'
    ])
  },
  watch: {
    typhoonInfo() {
      if (!this.typhoonInfo.tfbh) {
        this.isShow = false
        this.data = {}
      } else {
        this.initData()
        this.isShow = true
      }
    }
  },
  methods: {
    initData() {
      getTyphoonDetail(this.typhoonInfo.tfbh).then((data) => {
        this.data = data[0]
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .info {
    position: fixed;
    top: 0.85rem;
    right: 5rem;
    padding: 0.25rem;
    font-size: 0.16rem;
    border: 0.01rem solid #79F1FF;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0.05rem #79F1FF;
    border-radius: 0.04rem;
    color: #fff;
    .title {
      height: 0.35rem;
      line-height: 0.35rem;
      width: 100%;
      .bg-image('../../item-title/images/bg');
      padding: 0 0.1rem;
      > span {
        color: #FA9900;
        padding-right: 0.1rem;
      }
    }
    .info-ul {
      > li {
        line-height: 0.26rem;
        > span {
          width: 1rem;
          padding-right: 0.05rem;
          text-align: right;
          color: #57A7AD;
        }
        > b {
          font-weight: 400;
          color: #53CBF2;
        }
      }
    }
  }
</style>
