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
        { name: '白沙片区', value: 0, class: 'point100' },
        { name: '湖前片区', value: 0, class: 'point101' },
        { name: '龙江片区', value: 0, class: 'point102' },
        { name: '新城开发建设中心', value: 0, class: 'point105' },
        { name: '平等片区', value: 0, class: 'point107' },
        { name: '芦浦片区', value: 0, class: 'point108' },
        { name: '沿江片区', value: 0, class: 'point109' },
        { name: '云岩片区', value: 0, class: 'point110' },
        { name: '江山片区', value: 0, class: 'point111' },
        { name: '舥艚片区', value: 0, class: 'point112' }
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
    left: 58%;
    top: 25%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
    .point101 {
    left: 21%;
    top: 21%;
  }
  .point102 {
    left: 48%;
    top: 15%;
  }
  .point103 {
    left: 65%;
    top: 42%;
  }
  .point105 {
    left: 75%;
    top: 35%;
  }
  .point106 {
    left: 47%;
    top: 41%;
  }
  .point107 {
    left: 42%;
    top: 30%;
  }
  .point108 {
    left: 64%;
    top: 48%;
  }
  .point109 {
    left: 35%;
    top: 10%;
  }
  .point110 {
    left: 12%;
    top: 48%;
  }
  .point111 {
    left: 27%;
    top: 30%;
  }
  .point112 {
    left: 70%;
    top: 60%;
  }
</style>
