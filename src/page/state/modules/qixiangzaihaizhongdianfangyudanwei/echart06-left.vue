/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <div class="city" @click="clickme('气象灾害防御重点单位')">
      <img src="./images/bg.png" alt="">
      <div class="city_xf">重点防御单位
        <span class="bold">{{this.total}}</span>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { getCityFire } from 'api/state/CityFire'
import { mapActions } from 'vuex'

export default {
  name: "qixiangzaihai-left",
  props: {
    total: {
      default: 0
    }
  },
  components: {},
  methods: {
    ...mapActions('map', ['SetSpecalTreeName', 'clickme'])
  }
};
</script>

<style scoped lang="less">
  .city {
    width: 1.75rem;
    height: 1.73rem;
    position: absolute;
    left: 50%;
    top: 58%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    img{
      display: block;
      margin: 0 auto 0.2rem;
    }
  }
  .city_xf {
    color: white;
    font-size: 0.16rem;
    text-align: center;
    .bold{
    font-weight: bold;
    color: #0dd5f4;
    }
  }
  .city_sz {
    color: #ffc600;
    font-size: 0.18rem;
    position: absolute;
    left: 0.69rem;
    top: 0.7rem;
    font-weight: bold
  }
</style>
