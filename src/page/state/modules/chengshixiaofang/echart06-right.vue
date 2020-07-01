/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ul class="tabs">
      <li v-show="userInfo.districtName === '瑞安市'" :class="{active: item.state}" v-for="(item, index) in tabsList" :key='index' @click="changeIndex(index)">{{item.name}}</li>
    </ul>
    <div class="city" @click="clickme('消防安全重点单位')">
      <div class="city_xf">{{title}}</div>
      <div class="city_sz">{{this.total}}&nbsp;</div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Echart6",
  data() {
    return {
      tabsList: [
        {
          name: '安全单位',
          state: true
        },
        {
          name: '高层建筑',
          state: false
        },
      ],
      nameList: [
        '重点防护单位',
        '高层建筑'
      ],
      title: '重点防护单位'
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  components: {},
  mounted() {
    if (this.userInfo.districtName === '瑞安市') {
      this.title = '消防重点安全单位'
    }
  },
  methods: {
    // 切换
    changeIndex(index) {
      this.tabsList = this.tabsList.map((val, i) => {
        if (i === index) {
          val.state = true
        } else {
          val.state = false
        }
        return val
      })
      this.title = this.nameList[index]
      if (this.userInfo.districtName === '瑞安市' && index === 0) {
        this.title = '消防重点安全单位'
      }
      this.$emit('changeIndex', index)
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
  .city {
    width: 1.75rem;
    height: 1.73rem;
    .bg-image('./images/city');
    position: relative;
    margin-top: 0.8rem;
    cursor: pointer;
  }
  .city_xf {
    color: white;
    font-size: 0.16rem;
    position: absolute;
    left: 0.54rem;
    top: 0.7rem;
    width: 100%;
  }
  .city_sz {
    color: #ffc600;
    font-size: 0.18rem;
    position: absolute;
    left: 0.59rem;
    top: 1rem;
    font-weight: bold;
  }
  .tabs{
  list-style: none;
  position: absolute;
  top: 0.75rem;
  right: 0rem;
  display: flex;
  z-index: 100;
  // flex-direction: column;
  li{
    cursor: pointer;
    border-radius: 0.1rem;
    font-size: 0.13rem;
    // margin-left: 0.1rem;
    color: #beccd4;
    padding: 0.03rem 0.1rem 0.05rem 0.25rem;
    margin-bottom: 0.08rem;
    background: url('./images/build02.png') no-repeat;
    background-position: 0.1rem center;
    box-shadow: 0px 0px 10px rgba(255,255,255,0.4) inset;
  }
  li:nth-child(2){
    // background-image: url('./img/waterMore.png');
    margin-left: 0.05rem
  }
  li.active{
    background-color: #084685;
    color: #fff;
  }
  li:nth-child(1).active{
    background-image: url('./images/unit.png');
  }
  li:nth-child(2).active{
    background-image: url('./images/build.png');
  }
}
</style>
