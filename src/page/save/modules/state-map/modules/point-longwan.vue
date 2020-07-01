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
  name: 'SaveMapPointLongWan',
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
        { name: '蒲州街道', value: 0, class: 'point100' },
        { name: '状元街道', value: 0, class: 'point101' },
        { name: '瑶溪街道', value: 0, class: 'point102' },
        { name: '海滨街道', value: 0, class: 'point105' },
        { name: '永中街道', value: 0, class: 'point107' },
        { name: '永兴街道', value: 0, class: 'point108' }
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
  .point105,
  .point106,
  .point107,
  .point108,
  .point109,
  .point110,
  .point111,
  .point112{
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 22%;
    top: 24%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 30%;
    top: 30%;
  }
  .point102 {
    left: 54%;
    top: 28%;
  }
  .point103 {
    left: 65%;
    top: 42%;
  }
  .point105 {
    left: 76%;
    top: 45%;
  }
  .point106 {
    left: 47%;
    top: 41%;
  }
  .point107 {
    left: 48%;
    top: 50%;
  }
  .point108 {
    left: 68%;
    top: 65%;
  }
  .point109 {
    left: 58%;
    top: 54%;
  }
  .point110 {
    left: 32%;
    top: 48%;
  }
  .point111 {
    left: 55%;
    top: 66%;
  }
  .point112 {
    left: 35%;
    top: 65%;
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
