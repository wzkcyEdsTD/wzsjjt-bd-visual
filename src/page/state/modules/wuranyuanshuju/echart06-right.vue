/* eslint-disable */
<template>
  <div class="wrapper flex flex-y">
    <div class="city" @click="clickme('消防安全重点单位')">
      <div class="city_xf">污染源&nbsp;<span>{{total}}</span></div>
      <div class="city_sz"></div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'

export default {
  name: "Echart6",
  data() {
    return {
    };
  },
  props: {
    total: {
      default: 0,
      type: Number
    }
  },
  components: {},
  mounted() {
  },
  methods: {
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
    height: 1.53rem;
    .bg-image('./images/city');
    background-size: 82% 89%;
    position: relative;
    margin-top: 0.7rem;
    cursor: pointer;
  }
  .city_xf {
    color: white;
    font-size: 0.16rem;
    position: absolute;
    // left: 0.64rem;
    top: 1.6rem;
    width:100%;
    text-align: center;
  }
  .city_xf span{
    color: #ffc600;
    font-weight: bold;   
  }
  .city_sz {
    color: #ffc600;
    font-size: 0.18rem;
    position: absolute;
    // left: 0.69rem;
    top: 1.7rem;
    font-weight: bold;
    width:100%;
    text-align: center;
  }
</style>
