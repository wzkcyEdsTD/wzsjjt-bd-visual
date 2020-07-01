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
  name: 'StateMapPointOuHai',
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
        { name: '郭溪街道', value: 0, class: 'point100' },
        { name: '泽雅镇', value: 0, class: 'point101' },
        { name: '梧田街道', value: 0, class: 'point102' },
        { name: '丽岙街道', value: 0, class: 'point103' },
        { name: '茶山街道', value: 0, class: 'point104' },
        { name: '三垟街道', value: 0, class: 'point105' },
        { name: '娄桥街道', value: 0, class: 'point106' },
        { name: '翟溪街道', value: 0, class: 'point107' },
        { name: '潘桥街道', value: 0, class: 'point108' },
        { name: '南白象街道', value: 0, class: 'point109' },
        { name: '景山街道', value: 0, class: 'point110' },
        { name: '仙岩街道', value: 0, class: 'point111' },
        { name: '新桥街道', value: 0, class: 'point112' }
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
  .point112
  {
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 48.5%;
    top: 25%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 14%;
    top: 23%;
    .point{
      margin-top: 0.6rem;
    }
  }
  .point102 {
    left: 76%;
    top: 41%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point103 {
    left: 67.7%;
    top: 59%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point104 {
    left: 83.7%;
    top: 55%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point105 {
    left: 85%;
    top: 31%;
    .point{
      margin-top: 1rem;
    }
  }
  .point106 {
    left: 62%;
    top: 46%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point107 {
    left: 39%;
    top: 39%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point108 {
    left: 49%;
    top: 51%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point109 {
    left: 77%;
    top: 49%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point110 {
    left: 67.8%;
    top: 27%;
       .point{
         /*margin-top: 1rem;*/
       }
     }
  .point111 {
    left: 77.2%;
    top: 66%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point112 {
    left: 65.5%;
    top: 36%;
    .point{
      margin-top: 0.4rem;
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
