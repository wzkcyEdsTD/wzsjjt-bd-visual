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
  name: 'SaveMapPointRuiAn',
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
        { name: '湖岭镇', value: 0, class: 'point100' },
        { name: '塘下镇', value: 0, class: 'point101' },
        { name: '仙降街道', value: 0, class: 'point102' },
        { name: '曹村镇', value: 0, class: 'point103' },
        { name: '汀田街道', value: 0, class: 'point104' },
        { name: '飞云街道', value: 0, class: 'point105' },
        { name: '马屿镇', value: 0, class: 'point106' },
        { name: '高楼镇', value: 0, class: 'point107' },
        { name: '平阳坑镇', value: 0, class: 'point108' },
        { name: '林川镇', value: 0, class: 'point109' },
        { name: '芳庄乡', value: 0, class: 'point110' },
        { name: '陶山镇', value: 0, class: 'point111' },
        { name: '安阳街道', value: 0, class: 'point112' },
        { name: '上望街道', value: 0, class: 'point113' },
        { name: '云周街道', value: 0, class: 'point114' },
        { name: '锦湖街道', value: 0, class: 'point115' },
        { name: '桐浦镇', value: 0, class: 'point116' },
        { name: '潘岱街道', value: 0, class: 'point117' },
        { name: '莘塍街道', value: 0, class: 'point118' },
        { name: '南滨街道', value: 0, class: 'point119' },
        { name: '东山街道', value: 0, class: 'point120' },
        { name: '北麂乡', value: 0, class: 'point121' },
        { name: '玉海街道', value: 0, class: 'point122' }
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
    margin-top: 0.5rem;
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
    font-size: 0.16rem;
    /* left: 830px;
    top: 195px; */
    margin: 0;
    padding: 0;
    /* background: #00f; */
    text-align: left;
    float: left;
    left: 0.15rem;
    top:0.05rem;
  }
  .word1 dl{
    line-height: 0.2rem;
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
  .point122{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 35.6%;
    top: 10.5%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 88.8%;
    top: 11%;
  }
  .point102 {
    left: 58.6%;
    top: 35%;
    .point{
      margin-top:0.1rem;
    }
  }
  .point103 {
    left: 51%;
    top: 42%;
  }
  .point104 {
    left: 91%;
    top: 23%;
  }
  .point105 {
    left: 73.2%;
    top: 40%;
    .point{
      margin-top:0.1rem;
    }
    .word1{
      left:0.02rem;
    }
  }
  .point106 {
    left: 43%;
    top: 30%;
  }
  .point107 {
    left: 15.5%;
    top: 24%;
  }
  .point108 {
    left: 30.5%;
    top: 32%;
  }
  .point109 {
    left: 47.5%;
    top: 0.5%;
  }
  .point110 {
    left: 35%;
    top: -2%;
  }
  .point111 {
    left: 52.8%;
    top: 15%;
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
  .point112 {
    left: 82%;
    top: 26%;
    .word1{
      left:0.05rem;
    }
    .point{
      margin-top:0.2rem;
    }
  }
  .point113 {
    left: 90%;
    top: 40.5%;
    .point{
      margin-top:0.15rem;
    }
  }
  .point114 {
   left: 67%;
    top: 30%;
    .point{
      margin-top:0.1rem;
    }
    .word1{
      left:0.05rem;
    }
  }
  .point115 {
    left: 77%;
    top: 19%;
    .word1{
      left:0.05rem;
    }
  }
  .point116 {
    left: 62.5%;
    top: 9%;
  }
  .point117 {
    left: 69%;
    top: 14%;
   .point{
      margin-top:0.4rem;
    }
  }
  .point118 {
    left: 94%;
    top: 29%;
  }
  .point119 {
    left: 83%;
    top: 46.5%;
    .point{
      margin-top:0.1rem;
    }
  }
  .point120 {
    left: 82.5%;
    top: 37%;
    .point{
      margin-top:0.1rem;
    }
    .word1{
      left:0.05rem;
    }
  }
  .point121 {
    left: 72%;
    top: 73%;
  }
  .point122 {
    left: 77%;
    top: 32.1%;
    .point{
      margin-top:0.2rem;
    }
    .word1{
      left:0.05rem;
    }
  }
  /* eslint-disable */
</style>
