<template>
  <div class="wrapper flex flex-y">
    <ItemTitle :isPointer='true' title="应急避难场所"></ItemTitle>
    <el-carousel :interval="interval2" arrow="never">
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart9l :data="dataL" :num="dataLNum" :name='dataName'></echart9l>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="echart-box flex-1">
          <echart9r :data="dataR" :num="dataRNum" :name='dataName'></echart9r>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import ItemTitle from '../item-title/item-title'
import echart9r from './echart09_right'
import echart9l from './echart09_left'
import { getShelterAddressMainByUser } from 'api/save/save'

export default {
  components: {
    ItemTitle,
    echart9l,
    echart9r
  },
  data() {
    return {
      echart: null,
      interval2: 1000 * 5,
      dataL: [], // 左边的数据
      dataLNum: 0, // 左边的数字
      dataR: [], // 右边的数据
      dataRNum: 0, // 右边的数字
      dataName: '' // 名称
    }
  },
  mounted() {
    getShelterAddressMainByUser().then((data) => {
      console.log(data.name)
      this.dataL = data.shelter.categoryViews
      this.dataLNum = data.shelter.totalCount
      this.dataName = data.name
      this.dataR = data.population.categoryViews
      this.dataRNum = data.population.totalCount
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
</style>
