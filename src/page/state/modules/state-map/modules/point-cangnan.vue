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
  name: 'StateMapPointYongJia',
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
        { name: '南宋镇', value: 0, class: 'point100' },
        { name: '马站镇', value: 0, class: 'point101' },
        { name: '桥墩镇', value: 0, class: 'point102' },
        { name: '灵溪镇', value: 0, class: 'point103' },
        { name: '宜山镇', value: 0, class: 'point104' },
        { name: '炎亭镇', value: 0, class: 'point105' },
        { name: '藻溪镇', value: 0, class: 'point106' },
        { name: '莒溪镇', value: 0, class: 'point107' },
        { name: '金乡镇', value: 0, class: 'point108' },
        { name: '大渔镇', value: 0, class: 'point109' },
        { name: '钱库镇', value: 0, class: 'point110' },
        { name: '矾山镇', value: 0, class: 'point112' },
        { name: '望里镇', value: 0, class: 'point113' },
        { name: '霞关镇', value: 0, class: 'point114' },
        { name: '赤溪镇', value: 0, class: 'point115' },
        { name: '沿浦镇', value: 0, class: 'point116' },
        { name: '岱岭畲族乡', value: 0, class: 'point117' },
        { name: '凤阳畲族乡', value: 0, class: 'point118' }
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
  .point114,
  .point115,
  .point116,
  .point117,
  .point118{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 51.5%;
    top: 39%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point100{
    .point{
    margin-top: 0.2rem;}
  }
  .point101 {
    left: 67.5%;
    top: 62%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point102 {
    left: 32%;
    top: 22%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point103 {
    left: 48.7%;
    top: 18%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point104 {
    left: 74%;
    top: 8%;
    .point{
      margin-top: 0.75rem;
    }
  }
  .point105 {
    left: 95%;
    top: 17%;
    .point{
      margin-top: 0.65rem;
    }
  }
  .point106 {
    left: 57.5%;
    top: 29%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point107 {
    left: 17%;
    top: 17%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point108 {
    left: 87%;
    top: 26%;
    .point{
      margin-top: 0.4rem;
    }
  }
  .point109 {
    left: 83.7%;
    top: 37%;
    .point{
      margin-top: 0.25rem;
    }
  }
  .point110 {
    left: 79.3%;
    top: 17%;
  }
  .point111 {
    left: 61%;
    top: 36%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point112 {
    left: 51.5%;
    top: 48%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point113 {
    left: 70.5%;
    top: 26%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point114 {
    left: 68.3%;
    top: 71%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point115 {
    left: 71.5%;
    top: 41%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point116 {
    left: 55.5%;
    top: 69%;
    .point{
      margin-top: 0.25rem;
    }
  }
  .point117 {
    left: 58.5%;
    top: 57%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point118 {
    left: 64.5%;
    top: 49%;
    .point{
      margin-top: 0.25rem;
    }
  }
  /* eslint-disable */
</style>
