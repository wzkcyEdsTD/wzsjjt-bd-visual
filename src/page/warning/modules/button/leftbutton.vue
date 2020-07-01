<template>
  <div class="wrapper">
    <div class="btn-wrapper">
      <div class="bt spec" @click="zoomIn()">
        <img src="./images/bigger.png"/>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="bt spec" @click="zoomOut()">
        <img src="./images/smaller.png"/>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="bt btClick" @click="mapInit()" :class="{active : currentIndex === 0}">
        <img src="./images/earth.png" class="button1"/>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="bt btClick" @click="clearAllLayers()" :class="{active : currentIndex === 0}">
        <img src="./images/delete.png" class="button1"/>
      </div>
    </div>
    <div class="toCenter" :class="{collapse: collapse1, active: centerShow}" title="">
      <i style="width: 100%;height: 0.42rem;" @click="showTool"></i>
      <div
        class="center-item"
        :class="{isChoose: item.isShow}"
        :key="index"
        :title="item.name"
        v-for="(item, index) in mapNew"
        @click="changeMapTollBarTop(item, index)">{{item.abbrev}}
      </div>
    </div>
    <div class="btn-wrapper" v-show="false">
      <div class="bt btClick" :class="{active : currentIndex === 1}" @click="changeCurrentIndex(1)">
        <img src="./images/book.png" class="button2"/>
        <book ref="book" v-show="currentIndex === 1" @close="changeCurrentIndex"></book>
      </div>
    </div>
    <!-- <div class="btn-wrapper">
      <div class="bt btClick" :class="{active : currentIndex === 2}" @click="changeCurrentIndex(2)">
        <img src="./images/camera.png" class="button3"/>
      </div>
      <camera v-show="currentIndex === 2" @close="changeCurrentIndex" @treeCheckedCamera="treeCheckedCamera" @treeCheckedItems="treeCheckedItems"></camera>
     </div> -->
  </div>
</template>

<script>
import Book from './book'
import Camera from './camera'
import { mapActions, mapGetters } from 'vuex'
import { uuid } from 'common/js/util'

export default {
  components: {
    Book,
    Camera
  },
  data() {
    return {
      currentIndex: -1,
      centerShow: false,
      mapNew: [
        {
          name: '标准',
          abbrev: '标准',
          value: 'changeMap',
          top: '2.05rem',
          isShow: true,
          children: [
            { name: '栅格底图', value: 'standard-raster', inputName: 'dituType' },
            { name: '大数据底图', value: 'bigdata-raster', inputName: 'dituType' }
          ]
        },
        {
          name: '影像',
          abbrev: '影像',
          value: 'changeMap',
          top: '2.5rem',
          isShow: false,
          children: [
            { name: '2012影像', value: '2012YX', inputName: 'dituType' },
            { name: '2014影像', value: '2014YX', inputName: 'dituType' },
            { name: '2017影像', value: '2017YX', inputName: 'dituType' },
            { name: '2018影像', value: '2018YX', inputName: 'dituType' },
            { name: '2019影像', value: '2019YX', inputName: 'dituType' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse1'
    ])
  },
  mounted() {
  },
  methods: {
    showTool() {
      this.centerShow = !this.centerShow
    },
    changeCurrentIndex(num) {
      if (this.currentIndex === num) {
        this.currentIndex = -1
      } else {
        this.currentIndex = num
      }
      if (this.currentIndex === 2) {
        this.SetCollapse(true)
      } else {
        this.SetCollapse(false)
      }
    },
    changeMapTollBarTop(item, index) {
      this.mapNew = this.mapNew.map(val => {
        val.isShow = false
        return val
      })
      this.mapNew[index].isShow = true
      this.$emit('baseMapChange', item.name)
    },
    zoomIn() {
      this.$emit('zoomChange', 'zoomIn')
    },
    zoomOut() {
      this.$emit('zoomChange', 'zoomOut')
    },
    mapInit() {
      this.$emit('mapInit', 'mapInit')
    },
    clearAllLayers() {
      // this.$emit('clearAllLayers', 'clearAllLayers')
      this.$parent.$refs.map.clearAllLayers()
      this.SetClearAllLayers({
        value: true,
        t: uuid()
      })
    },
    chooseMenu(data) {
      this.$refs.book.chooseMenu(data)
    },
    treeCheckedItems(obj) {
      this.$emit('treeCheckedItems', obj)
    },
    treeCheckedCamera(obj) {
      this.$emit('treeCheckedCamera', obj)
    },
    ...mapActions('warning', [
      'SetCollapse',
      'SetClearAllLayers'
    ])
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    .btn-wrapper {
      position: relative;
      .bt {
        width: 0.4rem;
        height: 0.4rem;
        cursor: pointer;
        background-color: rgba(56, 203, 218, 0.4);
        border: 0.01rem solid #38cbda;
        border-radius: 0.04rem;
        margin-top: 0.1rem;
        font-size: 0;
        &.spec {
          margin-top: 0;
          > img {
            margin: 0.12rem;
            width: 0.13rem;
            height: 0.13rem;
          }
        }
        &:hover, &.active {
          background-color: rgba(56, 203, 218, 0.2);
        }
      }
      .button1 {
        width: 0.24rem;
        height: 0.24rem;
        margin: 0.06rem;
      }
      .button2 {
        width: 0.15rem;
        height: 0.20rem;
        margin: 0.03rem 0.05rem;
      }
      .button3 {
        width: 0.22rem;
        height: 0.25rem;
      }
    }
  }
  .toCenter {
    width: 0.4rem;
    height: 0.4rem;
    display: block;
    background: rgba(56, 203, 218, 0.2) !important;
    position: absolute;
    transition: all 0.3s linear;
    top: 2rem;
    border-radius: 6px;
    left: 0rem;
    /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
    border: 1px #38cbda solid !important;
    cursor: pointer;
    overflow: hidden;
    &.active {
      height: 1.4rem;
      > i {
        // .bg-image('images/draw_type-act');
        background-size: 0.34rem;
        color: #0d6aad;
        // background-color: rgba(56, 203, 218, 0.4) !important;
      }
    }
    .center-item {
      width: 0.32rem;
      height: 0.46rem;
      margin-left: 3px;
      text-align: center;
      line-height: 0.46rem;
      color: #fff;
    }
    .center-item:hover, .isChoose {
      color: #00baff
    }
    .center-item.active {
      color: #00baff
    }
    > i {
      width: 0.16rem;
      height: 0.16rem;
      display: block;
      .bg-image('images/draw_type');
      background-size: 0.34rem;
      position: relative;
      left: 50%;
      transform: translate(-50%, 0);
    }
    > i:hover {
      // .bg-image('images/draw_type-act');
      background-size: 0.34rem;
      color: #0d6aad;
      // background: rgba(56, 203, 218, 0) !important
    }
    &.collapse {
      left: 0.16rem;
    }
  }
</style>
