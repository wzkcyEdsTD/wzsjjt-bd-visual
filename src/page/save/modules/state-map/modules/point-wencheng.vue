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
  name: 'SaveMapPointWenCheng',
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
        { name: '西坑畲族镇', value: 0, class: 'point100' },
        { name: '双桂乡', value: 0, class: 'point101' },
        { name: '南田镇', value: 0, class: 'point102' },
        { name: '二源镇', value: 0, class: 'point103' },
        { name: '玉壶镇', value: 0, class: 'point104' },
        { name: '公阳乡', value: 0, class: 'point105' },
        { name: '百丈漈镇', value: 0, class: 'point106' },
        { name: '铜铃山镇', value: 0, class: 'point107' },
        { name: '周山畲族乡', value: 0, class: 'point108' },
        { name: '峃口镇', value: 0, class: 'point109' },
        { name: '黄坦镇', value: 0, class: 'point110' },
        { name: '大峃镇', value: 0, class: 'point111' },
        { name: '桂山乡', value: 0, class: 'point112' },
        { name: '周壤镇', value: 0, class: 'point113' },
        // { name: '桂山乡', value: 0, class: 'point114' },
        { name: '平和乡', value: 0, class: 'point114' },
        { name: '珊溪镇', value: 0, class: 'point115' },
        { name: '巨屿镇', value: 0, class: 'point116' }
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
    left: 10.39rem;
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
    font-size: 0.2rem;
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
  /*.point114,*/
  .point114,
  .point115,
  .point116{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 32%;
    top: 32%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 72.7%;
    top: 66%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point102 {
    left: 32%;
    top: 14%;
  }
  .point103 {
    left: 53.5%;
    top: 23%;
  }
  .point104 {
    left: 72%;
    top: 16%;
  }
  .point105 {
    left: 84.5%;
    top: 61%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point106 {
    left: 43%;
    top: 35.5%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point107 {
    left: 14.5%;
    top: 28%;
  }
  .point108 {
    left: 72.7%;
    top: 58%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point109 {
    left: 77.2%;
    top: 46%;
  }
  .point110 {
    left: 34.5%;
    top: 50%;
  }
  .point111 {
    left: 59.5%;
    top: 43%;
  }
  .point112 {
    left: 55.6%;
    top: 88.5%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point113 {
    left: 70.5%;
    top: 30%;
  }
  /*.point114 {*/
  /*  left: 62.5%;*/
  /*  top: 79%;*/
  /*  .point{*/
  /*    margin-top: 0.4rem;*/
  /*  }*/
  /*}*/
  .point114 {
    left: 85%;
    top: 51.5%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point115 {
    left: 52.45%;
    top: 70%;
  }
  .point116 {
    left: 58.2%;
    top: 62%;
    .point{
      margin-top: 0.3rem;
    }
  }
  /* eslint-disable */
</style>
