<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="消防救援能力"></ItemTitle>
    <div class="container flex-1">
      <div class="bg">
        <ul>
          <li class="item item1" @click="clickme(dataList[0].name)">
            <i class="icon"></i>
            <span>{{this.dataList[0].name}}</span>
            <b>{{this.dataList[0].value}}</b>
          </li>
          <li class="item item2" @click="clickme(dataList[2].name)">
            <i class="icon"></i>
            <span>{{this.dataList[2].name}}</span>
            <b>{{this.dataList[2].value}}</b>
          </li>
          <li class="item item3" @click="clickme(dataList[3].name)">
            <i class="icon"></i>
            <span>{{this.dataList[3].name}}</span>
            <b>{{this.dataList[3].value}}</b>
          </li>
          <li class="item item4" @click="clickme(dataList[5].name)">
            <i class="icon"></i>
            <span>{{this.dataList[5].name}}</span>
            <b>{{this.dataList[5].value}}</b>
          </li>
          <li class="item item5" style="height:1.1rem;width:1rem" @click="clickme(dataList[4].name)">
            <i class="icon"></i>
            <span>{{this.dataList[4].name}}</span>
            <b>{{this.dataList[4].value}}</b>
          </li>
          <li class="item item6" @click="clickme(dataList[1].name)">
            <i class="icon"></i>
            <span>{{this.dataList[1].name}}</span>
            <b>{{this.dataList[1].value}}</b>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { getFireSaveAbilityMainByUser } from 'api/save/save'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemTitle
  },
  data() {
    return {
      dataList: [
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 },
        { name: 0, value: 0 }
      ]
    }
  },
  methods: {
    // clickme(key) {
    //   this.SetSpecalTreeName(key)
    //   this.$router.push('/map')
    // },
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  },
  created() {
    getFireSaveAbilityMainByUser().then(res => {
      this.dataList = res.categoryViews
      // console.log(this.dataList)
    })
  }
}
</script>

<style scoped lang='less'>
  .container {
    overflow: hidden;
    position: relative;
    .bg {
      position: absolute;
      top: 54%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 4.42rem;
      height: 2.99rem;
      .bg-image('./images/fire_bg');
      > ul {
        position: relative;
        width: 100%;
        height: 100%;
        top: -0.1rem;
        .item {
          position: absolute;
          width: 0.82rem;
          height: 0.9rem;
          text-align: center;
          font-size: 0.16rem;
          cursor: pointer;
          .bg-image('./images/fire_frame');
          > i {
            display: block;
            margin: 0 auto 0.02rem;
          }
          > span {
            color: #fff;
            line-height: 0.2rem;
          }
          > b {
            color: #ffde00;
          }
          top: 1rem;
          left: 1rem;
          &.item1 {
            top: 0.54rem;
            left: 0.18rem;
            > i {
              width: 0.21rem;
              height: 0.28rem;
              .bg-image('./images/fire-hyd');
              margin-top: 0.08rem;
            }
          }
          &.item2 {
            top: 0.53rem;
            left: 1.28rem;
            > i {
              width: 0.26rem;
              height: 0.26rem;
              .bg-image('./images/fire_group');
              margin-top: 0.1rem;
            }
          }
          &.item3 {
            top: 0.2rem;
            left: 2.5rem;
            > i {
              width: 0.25rem;
              height: 0.26rem;
              .bg-image('./images/fire_people');
              margin-top: 0.15rem;
            }
          }
          &.item4 {
            top: 0.6rem;
            left: 3.36rem;
            > i {
              width: 0.34rem;
              height: 0.23rem;
              .bg-image('./images/fire_equip');
              margin-top: 0.2rem;
            }
          }
          &.item5 {
            top: 1.13rem;
            left: 2.5rem;
            > i {
              width: 0.40rem;
              height: 0.32rem;
              .bg-image('./images/fire_car');
              margin-top: 0.16rem;
            }
          }
          &.item6 {
            top: 1.48rem;
            left: 0.84rem;
            > i {
              width: 0.23rem;
              height: 0.23rem;
              .bg-image('./images/fire_state');
              margin-top: 0.2rem;
            }
          }
        }
      }
    }
  }
</style>
