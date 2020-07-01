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
  name: 'SaveMapPointYongJia',
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
        { name: '岩坦镇', value: 0, class: 'point100' },
        { name: '云岭乡', value: 0, class: 'point101' },
        { name: '碧莲镇', value: 0, class: 'point102' },
        { name: '岩头镇', value: 0, class: 'point103' },
        { name: '枫林镇', value: 0, class: 'point104' },
        { name: '鹤盛镇', value: 0, class: 'point105' },
        { name: '大若岩镇', value: 0, class: 'point106' },
        { name: '界坑乡', value: 0, class: 'point107' },
        { name: '桥下镇', value: 0, class: 'point108' },
        { name: '东城街道', value: 0, class: 'point109' },
        { name: '桥头镇', value: 0, class: 'point110' },
        { name: '北城街道', value: 0, class: 'point111' },
        { name: '瓯北街道', value: 0, class: 'point112' },
        { name: '沙头镇', value: 0, class: 'point113' },
        { name: '三江街道', value: 0, class: 'point114' },
        { name: '乌牛街道', value: 0, class: 'point115' },
        { name: '黄田街道', value: 0, class: 'point116' },
        { name: '南城街道', value: 0, class: 'point117' },
        { name: '溪下乡', value: 0, class: 'point118' },
        { name: '巽宅镇', value: 0, class: 'point119' },
        { name: '金溪镇', value: 0, class: 'point120' },
        { name: '茗岙乡', value: 0, class: 'point121' }
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
  .point118,
  .point119,
  .point120,
  .point121 {
    width: 2.23rem;
    height: 1rem;
    position: absolute;
    left: 55%;
    top: -2%;
    /* background: #39e7e0; */
    margin: 0;
    padding: 0;
    line-height: 0.3rem;
  }
  .point101 {
    left: 88%;
    top: 5%;
  }
  .point102 {
    left: 33%;
    top: 14%;
  }
  .point103 {
    left: 54%;
    top: 18%;
  }
  .point104 {
    left: 68%;
    top: 21%;
  }
  .point105 {
    left: 75%;
    top: 12%;
  }
  .point106 {
    left: 50%;
    top: 30%;
  }
  .point107 {
    left: 16%;
    top: 12%;
  }
  .point108 {
    left: 38%;
    top: 52%;
  }
  .point109 {
    left: 80%;
    top: 42%;
  }
  .point110 {
    left: 16%;
    top: 55%;
  }
  .point111 {
    left: 54%;
    top: 48%;
  }
  .point112 {
    left: 48%;
    top: 75%;
  }
  .point113 {
    left: 72%;
    top: 32%;
  }
  .point114 {
    left: 66%;
    top: 74%;
  }
  .point115 {
    left: 79%;
    top: 60%;
  }
  .point116 {
    left: 55%;
    top: 65%;
  }
  .point117 {
    left: 60%;
    top: 56%;
  }
  .point118 {
    left: 25%;
    top: -1.5%;
  }
  .point119 {
    left: 14%;
    top: 26%;
  }
  .point120 {
    left: 20%;
    top: 38%;
  }
  .point121 {
    left: 30%;
    top: 30%;
  }
  /* eslint-disable */
</style>
