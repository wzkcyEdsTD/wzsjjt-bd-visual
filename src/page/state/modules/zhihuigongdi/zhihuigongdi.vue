<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="智慧工地"></ItemTitle>
    <div class="flex-1">
      <div class="content">
        <div class="box">
          <div class="item item1">
            <span>工地人数</span>
            <span>{{numData.build_worker_num}}人</span>
          </div>
          <div class="item item2">
            <span>工棚</span>
            <span>{{numData.temp_house_num}}个</span>
          </div>
          <div class="item item3" @click="clickme">
            <span>监控视频</span>
            <span>{{numData.camera_num}}个</span>
          </div>
          <div class=" item4">
            <span>在建工地</span>
            <span>{{numData.build_num}}个</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { smartConstructionSite } from 'api/state/state'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      numData: {}
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    clickme() {
      this.$router.push({ path: '/warning' })
      this.SetCurrentWaterState('shipingjiankon')
    },
    initData() {
      smartConstructionSite().then((data) => {
        this.numData = data
      })
    },
    ...mapActions('warning', ['SetCurrentWaterState'])
  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    position: relative;
    .content {
      height: 100%;
      padding-top: 0.4rem;
      .box {
        background: url("./images/construct-bg.png") no-repeat 100%;
        height: 100%;
        position: relative;
        margin-top: 55px;
        .item {
          .bg-image('./images/construct-frame');
          width: 123px;
          height: 128px;
          > span {
            color: #fff;
            display: block;
            text-align: center;
            font-size: 0.16rem;
            line-height: 0.2rem;
            &:first-child {
              margin-top: 45px;
            }
          }
          > span + span {
            color: #ffba00;
          }
        }
        .item1 {
          position: absolute;
          left: 30px;
          top: 10px;
        }
        .item2 {
          position: absolute;
          right: 65px;
          top: -80px;
          background-size: 80%, 80%;
        }
        .item3 {
          position: absolute;
          right: 5px;
          top: 60px;
          cursor: pointer;
        }
        .item4 {
          position: absolute;
          width: 100px;
          margin-left: -44px;
          left: 50%;
          top: 25%;
          > span {
            color: #00fffc;
            display: block;
            text-align: center;
            font-size: 0.16rem;
            line-height: 0.2rem;
            &:first-child {
              margin-top: 32px;
            }
          }
          > span + span {
            color: #ffba00;
            font-weight:600;
          }
        }
      }
    }
  }
</style>
