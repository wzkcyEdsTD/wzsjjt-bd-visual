<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="实时潮位监测" :num="total">
    </ItemTitle>
    <!-- <div class="title-btn-group">
      <span class="dot-white" @click="changeDot">
        <img v-if="dotIndex===0" src="../item-title/images/dot_white.png"/>
        <img v-else src="../item-title/images/dot_blue.png"/>
      </span>
    </div> -->
    <div class="wrp">
    <div class="module" v-for="(item, index) in list" :key='index' @click="clickItem(item)">
      <h3>{{item.name}}</h3>
      <div class="content">
        <div class="shishi"><dl><dt>实时潮位</dt><dd>{{item.timeLevel[item.timeLevel.length - 1].value}}m</dd></dl></div>
        <div class="jingjie"><dl><dt>警戒潮位</dt><dd>{{item.jjcw}}</dd></dl></div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import { tideHighOJK } from 'api/warning/warning'
import { monitorTypeMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'

export default {
  name: 'PeopleMonitor',
  mixins: [monitorTypeMixin],
  data() {
    return {
      total: '',
      list: []
    }
  },
  mounted() {
  },
  created() {
    tideHighOJK().then(res => {
      console.log(res)
      this.list = res
    })
  },
  methods: {
    ...mapActions('warning', [
      'SetSpecalPoint'
    ]),
    clickItem(item) {
      item.alias = 'shishishuichao'
      this.SetSpecalPoint(item)
    }
  },
  components: {
    ItemTitle
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    position: relative;
    .wrp{
      width:100%;
      height: calc(100% - 0.35rem);
      color:#ffffff;
      .module{
        cursor: pointer;
        width:45.5%;
        background-image: url(img/frame.png);
        height: 40%;
        background-size: 100% 100%;
        margin-left: 3%;
        margin-top:3%;
        float: left;
        .content{
          width:100%;
          .shishi{
            color:#27e1f0
          }
          .jingjie{
            color:#ffb63d
          }
        }
        .content div{
          width:50%;
          float: left;
          text-align: center;
          dt{
          line-height: 0.35rem;
          }
          dd{
          line-height: 0.3rem;
          }
        }
        h3{
          height: 0.3rem;
          line-height: 0.3rem;
          width: 95%;
          margin: auto;
        }
      }
    }
  }
  .title-btn-group{
    position: absolute;
    top: 0;
    right: 0;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.14rem;
    margin-right: 0.05rem;
    cursor: pointer;
    .dot-white{
      cursor: pointer;
      width: 0.32rem;
      height: 0.35rem;
      float: right;
    }
  }
  @media screen and (min-height: 1000px) {
    .wrapper .wrp .module{
      height:37%;}
    .wrapper .wrp .module .content{
      line-height: 0.4rem;
    }
    .wrapper .wrp .module{
      margin-top: 4%;
    }
  }
</style>
