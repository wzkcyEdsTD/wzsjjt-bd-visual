<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="物资储备企业"></ItemTitle>
    <el-carousel :autoplay='true' :interval='10000'>
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart4_1 :data="data"></echart4_1>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart4_2 :data="data"></echart4_2>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart4_3 :data="data"></echart4_3>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart4_4 :data="data"></echart4_4>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import echart4_2 from './echart04_2'
import echart4_1 from './echart04_1'
import echart4_3 from './echart04_3'
import echart4_4 from './echart04_4'
import { getStoreEnterpriseMainByUser } from 'api/save/save'

export default {
  components: {
    ItemTitle,
    echart4_2,
    echart4_1,
    echart4_3,
    echart4_4
  },
  data() {
    return {
      echart: null,
      interval2: 1000 * 5,
      data: {}
    }
  },
  mounted() {
    getStoreEnterpriseMainByUser().then((data) => {
      this.data = data
    })
  },
  methods: {
    initData() {
    }
  }
}
</script>

<style scoped lang='less'>
  .wrapper {
    .echart-box {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }
    /deep/ .el-carousel__arrow--right {
      display: none;
    }
    /deep/ .el-carousel__arrow--left {
      display: none;
    }
    /deep/ .el-carousel__button {
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 0.1rem;
      background: #3ecbe0;
    }
  }
  /deep/ .el-carousel__item, .el-carousel__mask {
    height: 100%;
    // top: -0.35rem;
  }
  /deep/ .el-carousel__indicator.is-active button{
    width: 0.3rem;
  }
</style>
