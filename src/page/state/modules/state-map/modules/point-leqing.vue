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
        { name: '智仁乡', value: 0, class: 'point100' },
        { name: '湖雾镇', value: 0, class: 'point101' },
        { name: '龙西乡', value: 0, class: 'point102' },
        { name: '蒲岐镇', value: 0, class: 'point103' },
        // { name: '洞头区', value: 0, class: 'point104' },
        { name: '清江镇', value: 0, class: 'point105' },
        { name: '芙蓉镇', value: 0, class: 'point106' },
        { name: '岭底乡', value: 0, class: 'point107' },
        { name: '虹桥镇', value: 0, class: 'point108' },
        { name: '南岳镇', value: 0, class: 'point109' },
        { name: '淡溪镇', value: 0, class: 'point110' },
        { name: '南塘镇', value: 0, class: 'point111' },
        { name: '仙溪镇', value: 0, class: 'point112' },
        { name: '大荆镇', value: 0, class: 'point113' },
        { name: '石帆街道', value: 0, class: 'point114' },
        { name: '乐成街道', value: 0, class: 'point115' },
        { name: '雁荡镇', value: 0, class: 'point116' },
        { name: '白石街道', value: 0, class: 'point117' },
        { name: '城东街道', value: 0, class: 'point118' },
        { name: '柳市镇', value: 0, class: 'point119' },
        { name: '天成街道', value: 0, class: 'point120' },
        { name: '翁垟街道', value: 0, class: 'point121' },
        { name: '北白象镇', value: 0, class: 'point122' },
        { name: '盐盆街道', value: 0, class: 'point123' },
        { name: '磐石镇', value: 0, class: 'point124' },
        { name: '城南街道', value: 0, class: 'point125' }
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
    margin-left: -0.22rem;
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
  .point118,
  .point119,
  .point120,
  .point121,
  .point122,
  .point123,
  .point124,
  .point125{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 65.9%;
    top: 3%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point100{
    .point{
      margin-top: 0.1rem;
    }
  }
  .point101 {
    left: 84%;
    top: 16%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point102 {
    left: 48.3%;
    top: 21.5%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point103 {
    left: 56.5%;
    top: 62%;
    .point{
      margin-top: 0.15rem;
    }
  }
  .point104 {
    left: 79.3%;
    top: 28%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point105 {
    left: 65%;
    top: 36%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point106 {
    left: 49%;
    top: 32%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point107 {
    left: 36%;
    top: 36%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point108 {
    left: 53.7%;
    top: 47%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point109 {
    left: 63%;
    top: 52%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point110 {
    left: 35%;
    top: 48%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point111 {
    left: 67%;
    top: 45%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point112{
    left: 48.3%;
    top: 6%;
  }
  .point113 {
    left: 68.7%;
    top: 11%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point114 {
    left: 45%;
    top: 53%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point115 {
    left: 33%;
    top: 60%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point116 {
    left: 65.5%;
    top: 26%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point117 {
    left: 23%;
    top: 67%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point118 {
    left: 45.7%;
    top: 64%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point119 {
    left: 30.5%;
    top: 78%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point120 {
    left: 52.3%;
    top: 56%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point121 {
    left: 43%;
    top: 82%;
    .point{
      margin-top: 0.2rem;
    }
  }
  .point122 {
    left: 18%;
    top: 78%;
    .point{
      margin-top: 0.3rem;
    }
  }
  .point123 {
    left: 47%;
    top: 76%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point124 {
    left: 15%;
    top: 88%;
    .point{
      margin-top: 0.1rem;
    }
  }
  .point125 {
    left: 40.5%;
    top: 71.5%;
    .point{
      margin-top: 0.1rem;
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
