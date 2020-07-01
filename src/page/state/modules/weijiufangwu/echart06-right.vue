/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <ul class="tabs">
      <li :class="{active: item.state}" v-for="(item, index) in tabsList" :key='index' @click="changeIndex(index)">{{item.name}}</li>
    </ul>
    <div class="city" @click="clickme('消防安全重点单位')">
      <div class="city_xf">{{nameList[0]}}</div>
      <div class="city_sz">{{total.totalHouse}}&nbsp;</div>
       <div class="old_xf">{{nameList[1]}}</div>
      <div class="old_sz">{{total.totalPeople}}&nbsp;</div>
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
          name: 'C级',
          state: true
        },
        {
          name: 'D级',
          state: false
        },
      ],
      nameList: [
        '危房总数',
        '危房影响总人数'
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
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  mounted() {
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
      this.$emit('changeIndex', index)
      console.log(this.tabsList)

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
    .bg-image('./images/old-bg');
    position: relative;
    margin-top: 0.8rem;
    cursor: pointer;
  }
  .city_xf {
    color: white;
    font-size: 0.16rem;
    position: absolute;
    text-align: center;
    top: 0.4rem;
    width: 100%;
  }
  .city_sz {
    color: #ffc600;
    font-size: 0.18rem;
    position: absolute;
    text-align: center;
    top: 0.6rem;
    width: 100%;
    font-weight: bold;
  }
    .old_xf {
    color: white;
    font-size: 0.16rem;
    position: absolute;
    text-align: center;
    top: 1rem;
    width: 100%;
  }
  .old_sz {
    color: #ffc600;
    font-size: 0.18rem;
    position: absolute;
    text-align: center;
    top: 1.3rem;
    width: 100%;
    font-weight: bold;
  }
  .tabs{
  list-style: none;
  position: absolute;
  top: 0.5rem;
  right: 0rem;
  display: flex;
  z-index: 100;
  // flex-direction: column;
  li{
    cursor: pointer;
    margin-right: 0.1rem;
    border-radius: 0.1rem;
    font-size: 0.13rem;
    // margin-left: 0.1rem;
    color: #beccd4;
    padding: 0.03rem 0.1rem 0.05rem 0.25rem;
    margin-bottom: 0.08rem;
    background: url('./images/four01.png') no-repeat;
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
    background-image: url('./images/three.png');
  }
  li:nth-child(2).active{
    background-image: url('./images/four01.png');
  }
}
</style>
