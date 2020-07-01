<template>
  <div class="wrapper">
    <div :class="item.class" :key="index" v-for="(item,index) in dataArr">
      <div class="word1">
        <dl>
          <dd>{{item.name}}</dd>
          <dt>{{item.value}}</dt>
        </dl>
      </div>
<!--      <div class="line">-->
<!--        <img src="../images/line.png" alt/>-->
<!--      </div>-->
      <div class="point">
        <img src="../images/light.png" alt/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SaveMapPointPingYang',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    dataArr() {
      const arr = [
        { name: '怀溪镇', value: 0, class: 'point100' },
        { name: '万全镇', value: 0, class: 'point101' },
        { name: '闹村乡', value: 0, class: 'point102' },
        { name: '鳌江镇', value: 0, class: 'point103' },
        { name: '海西镇', value: 0, class: 'point104' },
        { name: '昆阳镇', value: 0, class: 'point105' },
        { name: '麻布镇', value: 0, class: 'point106' },
        { name: '南雁镇', value: 0, class: 'point107' },
        { name: '山门镇', value: 0, class: 'point108' },
        { name: '凤卧镇', value: 0, class: 'point109' },
        { name: '顺溪镇', value: 0, class: 'point110' },
        { name: '萧江镇', value: 0, class: 'point111' },
        { name: '腾蛟镇', value: 0, class: 'point112' },
        { name: '水头镇', value: 0, class: 'point113' },
        { name: '青街畲族乡', value: 0, class: 'point114' },
        { name: '南麂镇', value: 0, class: 'point115' }
      ]
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].name === this.data[i].name) {
            arr[j].value = this.data[i].value
            j = arr.length
          }
        }
      }
      return arr
    }
  }
}
</script>
<style scoped lang="less">
  .point {
    left: 1.039rem;
    top: 3.13rem;
    float: left;
    margin-top: 0.6rem;
    margin-left: -0.2rem;
  }
  .point img {
    animation: mymove 1s infinite;
  }
  .p1 {
    display: block;
  }
  .point_1 {
    width: 0.12rem;
    height: 0.12rem;
    border-radius: 0.14rem;
    margin-left: calc(50% - 0.07rem);
    margin-top: calc(50% - 0.07rem);
    background: #39e7e0;
    animation: mymove 2s infinite;
  }
  @keyframes mymove {
    0% {
      opacity: 0.5
    }
    100% {
      opacity: 1
    }
  }
  img {
    display: block;
  }
  .line {
    /* position: absolute;
    left: 9.93rem;
    top: 2.69rem; */
    /* background: #f00; */
    float: left;
    margin-top: 0.12rem;
  }
  .word1 {
    height: 0.33rem;
    color: white;
    position: absolute;
    font-size: 0.18rem;
    /* left: 830px;
    top: 195px; */
    margin: 0;
    padding: 0;
    /* background: #00f; */
    text-align: left;
    float: left;
    left: 0.2rem
  }
  .point100,
  .point101,
  .point102,
  .point103,
  .point104,
  .point105,
  .point106,
  .point107,
  .point108,
  .point109,
  .point110,
  .point111,
  .point112,
  .point113,
  .point114,
  .point115{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 14%;
    top: 28%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 80.5%;
    top: 15%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point102 {
    left: 34.5%;
    top: 48%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point103 {
    left: 66.1%;
    top: 36%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point104 {
    left: 93.5%;
    top: 26%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point105 {
    left: 74.5%;
    top: 25%;
    .point{
      margin-top: 0.23rem;
    }
  }
  .point106 {
    left: 51.5%;
    top: 39.5%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point107 {
    left: 25.7%;
    top: 42%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point108 {
    left: 25%;
    top: 23%;
  }
  .point109 {
    left: 32%;
    top: 30%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point110 {
    left: 11%;
    top: 42%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point111 {
    left: 61.3%;
    top: 46%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point112 {
    left: 39.5%;
    top: 19.5%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point113 {
    left: 40%;
    top: 35%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point114 {
    left: 21.3%;
    top: 54%;
    .point{
      margin-top: 0rem;
    }
  }
  .point115 {
    left: 79.5%;
    top: 69%;
    .point{
      margin-top: 0.3rem;
    }
  }
  /*.point100 dl{*/
  /*  color:#ffd13d;*/
  /*}*/
  /*.point110 dl{*/
  /*  color:#ffd13d;*/
  /*}*/
  /*.point106 dl{*/
  /*  color:#ffd13d;*/
  /*}*/
  /* eslint-disable */
</style>
