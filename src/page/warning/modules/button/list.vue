<template>
  <div class="list_hid">
    <div class="list_content">
      <p v-for="(item,index) in list" :key="index">
        {{index+1}}.{{item.name}}当前水位
        <span>{{item.num}}</span>,已经超过汛限水位
        <b>{{item.standnum}}</b>
      </p>
    </div>
    <!--    <div class="list_bt" @click="close">-->
    <!--      <input name type="button" value="关 闭"/>-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: '泽雅水库', num: '100m', standnum: '108.57m' },
        { name: '泽雅水库', num: '100m', standnum: '108.57m' },
        { name: '泽雅水库', num: '100m', standnum: '108.57m' },
        { name: '泽雅水库', num: '100m', standnum: '108.57m' },
        { name: '泽雅水库', num: '100m', standnum: '108.57m' },
        { name: '泽雅水库', num: '100m', standnum: '108.57m' }
      ]
    }
  },
  methods: {
    close() {
      this.$emit('close', -1)
    }
  }
}
</script>

<style lang="less" scoped>
  .list_hid {
    width: 4.5rem;
    height: 2rem;
    background-color: rgba(8, 26, 69, 0.8);
    border: 0.01rem solid #38cbda;
    margin-right: 0.3rem;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.2rem 0;
  }
  .list_content {
    height: 100%;
    width: 80%;
    margin: auto;
    overflow-y: scroll;
  }
  .list_content::-webkit-scrollbar {
    display: none
  }
  .list_content p {
    font-size: 0.14rem;
    height: 0.4rem;
    line-height: 0.4rem;
    color: #FFF
  }
  .list_content p span {
    color: #159bfd;
  }
  .list_content p b {
    color: #f52525;
    font-weight: 400
  }
  .list_bt {
    width: 90%;
    margin: auto;
    margin-top: 0.15rem;
  }
  .list_bt input {
    height: 0.22rem;
    padding: 0rem 0.2rem;
    background-color: #159bfd;
    float: right;
    border-radius: 0.04rem;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 0.12rem;
    color: #FFF
  }
  .list_bt input:hover {
    background-color: #1384d7
  }
</style>
