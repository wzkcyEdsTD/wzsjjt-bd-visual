<template>
  <div class="wrapper">
    <div :class="item.class" :key="index" v-for="(item,index) in dataArr">
      <div class="word1">
        <dl>
          <dd>{{item.name}}</dd>
          <dt>{{item.value}}</dt>
        </dl>
      </div>
      <div class="line">
        <img src="../images/line.png" alt/>
      </div>
      <div class="point">
        <img src="../images/light.png" alt/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StateMapPointWenZhou',
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
        { name: '司前畲族镇', value: 0, class: 'point100' },
        { name: '三魁镇', value: 0, class: 'point101' },
        { name: '包垟乡', value: 0, class: 'point102' },
        { name: '南浦溪镇', value: 0, class: 'point103' },
        { name: '彭溪镇', value: 0, class: 'point104' },
        { name: '雅阳镇', value: 0, class: 'point105' },
        { name: '凤垟乡', value: 0, class: 'point106' },
        { name: '百丈镇', value: 0, class: 'point107' },
        { name: '筱村镇', value: 0, class: 'point108' },
        { name: '泗溪镇', value: 0, class: 'point109' },
        { name: '罗阳镇', value: 0, class: 'point110' },
        { name: '柳峰乡', value: 0, class: 'point111' },
        { name: '西旸镇', value: 0, class: 'point112' },
        { name: '龟湖镇', value: 0, class: 'point113' },
        { name: '仕阳镇', value: 0, class: 'point114' },
        { name: '大安乡', value: 0, class: 'point115' },
        { name: '雪溪乡', value: 0, class: 'point116' },
        { name: '东溪乡', value: 0, class: 'point117' },
        { name: '竹里畲族乡', value: 0, class: 'point118' }
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
    margin-left: -0.28rem;
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
  .point115,
  .point116,
  .point117,
  .point118 {
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 16%;
    top: 6%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 41%;
    top: 54%;
  }
  .point102 {
    left: 52%;
    top: 16%;
  }
  .point103 {
    left: 54%;
    top: 28.5%;
  }
  .point104 {
    left: 76%;
    top: 63%;
  }
  .point105 {
    left: 65%;
    top: 68%;
  }
  .point106 {
    left: 51%;
    top: 45%;
  }
  .point107 {
    left: 37%;
    top: 24%;
  }
  .point108 {
    left: 40%;
    top: 35%;
  }
  .point109 {
    left: 60%;
    top: 53%;
  }
  .point110 {
    left: 17%;
    top: 35%;
  }
  .point111 {
    left: 55%;
    top: 68%;
  }
  .point112 {
    left: 22%;
    top: 60%;
  }
  .point113 {
    left: 20%;
    top: 75%;
  }
  .point114 {
    left: 32%;
    top: 74%;
  }
  .point115 {
    left: 33%;
    top: 49%;
  }
  .point116 {
    left: 43%;
    top: 72%;
  }
  .point117 {
    left: 47%;
    top: 59%;
  }
  .point118 {
    left: 28%;
    top: 3%;
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
