<template>
  <div class="wrapper" v-show="isShow">
    <div class="year">
      <!-- <el-input placeholder="请输历史年份" v-model="year" @change="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input> -->
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="year"
        @change.native="search"
        :fetch-suggestions="querySearch"
        :popper-append-to-body='false'
        placeholder="请选择年份"
        @select="handleSelect">
        <i
          class="el-icon-search"
          slot="suffix"
          @click="search">
        </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
        </template>
      </el-autocomplete>
    </div>
    <div class="content flex flex-y">
      <h3 class="flex">
        <span style="width:0.5rem"></span>
        <span class="flex-1">编号</span>
        <span class="flex-1">中文名</span>
        <span class="flex-1">英文名</span></h3>
      <div class="box-wrapper flex-1">
        <div class="box relative" :id="myUuid" ref="wrapper">
          <ul ref="ul">
            <li class="flex" :key="index" v-for="(item,index) in data">
              <span style="width:0.5rem">
                <input class="checkbox" type="checkbox" @click="checkItem(item)">
              </span>
              <span class="flex-1">{{item.tfbh}}</span>
              <span class="flex-1">{{item.name}}</span>
              <span class="flex-1">{{item.ename}}</span>
            </li>
          </ul>
          <Kong v-show="isKong"></Kong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import mapboxgl from 'mapbox-gl';
import { getTyphoon, getTyphoonDetail, getTyphoonForYear } from 'api/warning/warning'
import { mapActions } from 'vuex'
import { uuid } from 'common/js/util'
import Kong from 'components/noData/noData'
import $ from 'jquery'
import proj4 from 'proj4'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Kong
  },
  data() {
    return {
      data: [],
      checkedIndex: [],
      addedItem: [],
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      monitor: null,
      isKong: false,
      monitorTime: 1000 * 60,
      mapTyphoon: [],
      mapTyphoonNum: 0,
      currentItem: null,
      currentIndex: 0,
      year: '',
      isChecked: false,
      yearList: [{
        value: '2020'
      }, {
        value: '2019'
      }, {
        value: '2018'
      }, {
        value: '2017'
      }],
      lineColorAry: ['rgb(255, 0, 0)', 'rgb(255, 125, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(75, 0, 130)', 'rgb(128, 0, 128)'],
      lineColorLegendAry: ['./static/gitimage/add/ybt_red.png', './static/gitimage/add/ybt_orange.png', 
        './static/gitimage/add/ybt_yellow.png', './static/gitimage/add/ybt_green.png', 
        './static/gitimage/add/ybt_blue.png', './static/gitimage/add/ybt_indigo.png', 
        './static/gitimage/add/ybt_purple.png'],
      timer: null,
      needDeleteTyphoon: false,
      needDeleteTyphoonItem: {},
      isCurrentTyphoonLoaded: false,
      typhoonForecastLineAry: []
    }
  },
  mounted() {
    $('#' + this.myUuid).on({
      mouseover: () => {
        this.scrollDestroyHandler()
      },
      mouseout: () => {
        this.scrollStartHandler()
      },
      scroll: () => {
        if ($('#' + this.myUuid)[0]) {
          this.scrollTop = $('#' + this.myUuid)[0].scrollTop
        }
      }
    })
    this.initData()
    this.$bus.on('changeAddQixiangyuntuVideo', val => {
      // console.log('val: ' + JSON.stringify(val));
      // var imageUrl = val[0];
      if (typeof val === 'string') {
        this.addQixiangyuntuVideo(val);
      } else {
        if (val.type === '卫星云图') {
          // val.img;
          this.addWeixingyuntuVideo(val.img);
        } else if (val.type === '气象雷达') {
          this.addQixiangleidaVideo(val.img, val.bounds);
        }
      }
    })
  },
  updated() {
    if (this.isShow && this.data.length) {
      this.initScroll()
    } else {
      this.scrollDestroyHandler()
    }
    const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
    const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
    if (ul <= wrapper) {
      this.monitor = setTimeout(() => {
        this.scrollTop = 0
        this.$emit('refresh')
      }, this.monitorTime)
    }
  },
  created() {
    var __this = this;
    this.$bus.on('clearTyphoon', _ => {
      console.log(document.getElementsByClassName('checkbox'))
      document.getElementsByClassName('checkbox').forEach(val => {
        val.removeAttribute('checked')
        val.checked = false
      })
      // this.$emit('changeCollapse', true)
      if (__this.addedItem.length > 0) {
        // __this.checkItem(__this.currentItem)
        //关闭video
        __this.$parent.$parent.$parent.$refs.typhoonVideo.remove()
        var map = __this.$parent.$parent.$parent.$refs.map.map
        var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button')
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click()
        }
        
        // __this.SetTyphoonInfo({})
        // if (map.getLayer('circle-layer')) {
        //   map.removeLayer('circle-layer')
        // }
        // if (map.getSource('circle-source')) {
        //   map.removeSource('circle-source')
        // }
        // __this.addedItem = []
        clearInterval(__this.timer)
        __this.timer = null
        __this.SetTyphoonInfo({})
        // 移除图例
        __this.$bus.$emit('clearTyphoonLegend')
        // 删除选中的台风路径
        for (var i = 0; i < __this.addedItem.length; i++) {
          __this.deleteTyphoon(__this.addedItem[i]) // 删除选中的台风路径
        }
        if (map.getLayer('circle-layer')) {
          map.removeLayer('circle-layer')
        }
        if (map.getSource('circle-source')) {
          map.removeSource('circle-source')
        }
        // 集合中删除
        __this.addedItem = []
        __this.needDeleteTyphoon = false
      }
    })
    this.$bus.on('clearYunTu', _ => {
      __this.clearYuntuLayer()
    })
  },
  methods: {
    querySearch(queryString, cb) {
      var yearList = this.yearList
      // 调用 callback 返回建议列表的数据
      cb(yearList);
    },
    handleSelect(item) {
      this.year = item.value
      this.search()
    },
    // 按实际搜索
    search() {
      console.log('search')
      document.getElementsByClassName('my-autocomplete')[0].style.display = 'none'
      getTyphoonForYear(this.year).then(res => {
        this.data = res
        if (res && res.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
      })
    },
    initData() {
      // if (this.year) {
      getTyphoonForYear(this.year).then(res => {
        this.data = res
        if (res && res.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
      })
      // } else {
      //   getTyphoon().then((data) => {
      //     if (data === null) {
      //       data = []
      //     }
      //     if (data && data.length) {
      //       this.isKong = false
      //     } else {
      //       this.isKong = true
      //     }
      //     this.data = data
      //   })
      // }
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            this.scrollTop = 0
            this.scrollDestroyHandler()
            this.initData()
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    },
    initScroll() {
      this.$nextTick(() => {
        const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
        if (ul) {
          clearInterval(this.t)
          const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
          if (ul > wrapper) {
            this.scrollStartHandler()
          } else {
            this.scrollDestroyHandler()
          }
        }
      })
    },
    // 删除指定台风路径
    deleteTyphoon(data) {
      // console.log('data: ' + JSON.stringify(data))
      var aaa = this.mapTyphoon.findIndex(item => item.typhoonId === data.tfbh)
      if (aaa > -1) {
        // this.mapTyphoon[i].layers.map((item) => {
        //   console.log('item: ' + JSON.stringify(item))
        //   this.removeLayer(item)
        // })
        for (var index = 0; index < this.mapTyphoon[aaa].pointNum; index++) {
          this.removeLayer(this.mapTyphoon[aaa].typhoonId + index + '_points' + '_layer')
          if (index > 0) {
            this.removeLayer(this.mapTyphoon[aaa].typhoonId + index + '_lines' + '_layer')
          }

          for (var index2=0;index2<this.mapTyphoon[aaa].forecastPoint.length;index2++) {
            if (this.mapTyphoon[aaa].forecastPoint[index2].forecastIndex === index) {
              // forecastEachlinePointsNum
              for (var i=0;i<this.mapTyphoon[aaa].forecastPoint[index2].forecastLineNum;i++) {
                for (var j=0;j<this.mapTyphoon[aaa].forecastPoint[index2].forecastEachlinePointsNum[i];j++) {
                  this.removeLayer(this.mapTyphoon[aaa].typhoonId + index + '_' + i + '_' + j + '_points' + '_layer')
                  this.removeLayer(this.mapTyphoon[aaa].typhoonId + index + '_' + i + '_' + j + '_lines' + '_layer')
                }
              }
            }
          }
        }
        this.mapTyphoon.splice(aaa, 1)
        this.mapTyphoonNum--
      }
      var map = this.$parent.$parent.$parent.$refs.map.map
      if (map.getLayer('warn1_line_layer')) {
          map.removeLayer('warn1_line_layer')
      }
      if (map.getLayer('warn2_line_layer')) {
          map.removeLayer('warn2_line_layer')
      }
    },
    // 添加指定台风路径
    addTyphoon(data) {
      data.isLoadedOK = false
      const me = this
      var map = this.$parent.$parent.$parent.$refs.map.map
      // 添加警戒线
      let line1GeoJson = {
        "type": "geojson",
        "data": {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [105, 0],
              [113, 4.5],
              [119, 11],
              [119, 18],
              [127, 22],
              [127, 34]
            ]
          }
        }
      }
      let line2GeoJson = {
        "type": "geojson",
        "data": {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [105, 0],
              [120, 0],
              [132, 15],
              [132, 34]
            ]
          }
        }
      }
      if (map.getLayer('warn1_line_layer')) {
        map.removeLayer('warn1_line_layer')
      }
      if (map.getSource('warn1_line_source')) {
        map.removeSource('warn1_line_source')
      }
      map.addSource('warn1_line_source', line1GeoJson)
      map.addLayer({
        'id': 'warn1_line_layer',
        'source': 'warn1_line_source',
        'type': 'line',
        'paint': {
          'line-color': 'blue',
          'line-width': 5,
          'line-opacity': 0.8
        }
      })
      if (map.getLayer('warn2_line_layer')) {
          map.removeLayer('warn2_line_layer')
      }
      if (map.getSource('warn2_line_source')) {
        map.removeSource('warn2_line_source')
      }
      map.addSource('warn2_line_source', line2GeoJson)
      map.addLayer({
        'id': 'warn2_line_layer',
        'source': 'warn2_line_source',
        'type': 'line',
        'paint': {
          'line-color': 'green',
          'line-width': 5,
          'line-opacity': 0.8,
          'line-dasharray': [5, 10]
        }
      })

      var typhoonId = data.tfbh
      getTyphoonDetail(data.tfbh).then((result) => {
        const points = result[0].points || []
        if (points.length <= 0) return

        var count = points.length
        var totalLongitude = 0
        var totalLatitude = 0
        points.map((item, index) => {
          totalLongitude += item.lng
          totalLatitude += item.lat
        });
        // 移动地图
        map.flyTo({
          center: [totalLongitude / count, totalLatitude / count],
          zoom: 4
        })

        setTimeout(() => {
          // 添加图例
          me.$bus.$emit('addTyphoonLegend')
          // 添加台风路径
          me.loadTyphoonPath(data, typhoonId, result[0].name, points)
        }, 1500)
        // console.log('points: ' + JSON.stringify(points))
        // var pointsId = typhoonId + '_points'
        // var lineId = typhoonId + '_lines'
        // map.on('click', pointsId + '_layer', (e) => {
        //   var coordinates = e.features[0].geometry.coordinates.slice()
        //   var description = e.features[0].properties.description
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        //   }
        //   // 删除别的提示框
        //   var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button')
        //   for (var i = 0; i < tipElArr.length; i++) {
        //     tipElArr[i].click()
        //   }
        //   new mapboxgl.Popup({ closeOnClick: false })
        //     .setLngLat(coordinates)
        //     .setHTML(description)
        //     .addTo(map)
        //   this.addTyphoonCircle(JSON.parse(e.features[0].properties.typhoonCircleData))
        //   $(".mapboxgl-popup-close-button").off('click')
        //   $(".mapboxgl-popup-close-button").on('click', function() {
        //     if (this.nextElementSibling && this.nextElementSibling.className == 'typhoon-point-dialog-title') {
        //       // alert(2)
        //       // me.removeLayer(pointsId + '_layer')
        //       if (map.getLayer('circle-layer')) {
        //         map.removeLayer('circle-layer')
        //       }
        //     }
        //   })
        // })
      })
    },
    loadTyphoonPath(typhoonData, typhoonId, name, points) {
      // console.log('points: ' + JSON.stringify(points))
      var map = this.$parent.$parent.$parent.$refs.map.map
      var typhoonObj = {
        typhoonId: typhoonId,
        pointNum: points.length,
        forecastPoint: []
      }
      this.mapTyphoon.push(typhoonObj)
      this.mapTyphoonNum++

      var pointsId = ''
      var eachPointsIdGeoJson = {}
      var lineId = ''
      var eachLineIdGeoJson = {}

      var index = 0
      var forecastLineCount = 0
      this.typhoonForecastLineAry = []
      var __this = this
      this.timer = setInterval(() => {
        // 台风点颜色
        let color = 'red'
        switch (points[index].power) {
          case 7:
            color = '#30fc31'
            break
          case 8:
            color = '#307efa'
            break
          case 9:
            color = '#307efa'
            break
          case 10:
            color = '#fffc00'
            break
          case 11:
            color = '#fffc00'
            break
          case 12:
            color = '#ff9c00'
            break
          case 13:
            color = '#ff9c00'
            break
          case 14:
            color = '#fb7cff'
            break
          case 15:
            color = '#fb7cff'
            break
          case 16:
            color = '#ff0000'
            break
          case 17:
            color = '#ff0000'
            break
          default:
            color = '#fff'
            break
        }
        const position = [points[index].lng, points[index].lat]
        // pointsIdGeoJson.data.features.push({
        //   'type': 'Feature',
        //   'geometry': {
        //     'type': 'Point',
        //     'coordinates': position
        //   },
        //   'properties': {
        //     'description': this.createTyphoonPopup(points[index], name, typhoonId),
        //     'typhoonCircleData': points[index],
        //     "color": color
        //   }
        // });
        // lineIdGeoJson.data.geometry.coordinates.push(position);

        pointsId = typhoonId + index + '_points'
        eachPointsIdGeoJson = {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': position
                },
                'properties': {
                  'description': __this.createTyphoonPopup(points[index], name, typhoonId),
                  'typhoonCircleData': points[index],
                  "color": color
                }
            }]
          }
        }

        // 添加线图层
        if (index > 0) {
          lineId = typhoonId + index + '_lines'
          eachLineIdGeoJson = {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': []
              }
            }
          }
          const positionPrevious = [points[index-1].lng, points[index-1].lat]
          eachLineIdGeoJson.data.geometry.coordinates.push(positionPrevious)
          eachLineIdGeoJson.data.geometry.coordinates.push(position)
          // 添加线图层
          if (map.getLayer(lineId + '_layer')) {
            map.removeLayer(lineId + '_layer')
          }
          // 添加数据源
          if (map.getSource(lineId)) {
            map.removeSource(lineId)
          }
          map.addSource(lineId, eachLineIdGeoJson)
          var pointIndex = index - 1
          map.addLayer({
            'id': lineId + '_layer',
            'source': lineId,
            'type': 'line',
            'paint': {
              'line-color': '#666666',
              'line-width': 3,
              'line-opacity': 0.8
            }
          }, typhoonId + pointIndex + '_points_layer')
        }
        // 添加点图层
        if (map.getLayer(pointsId + '_layer')) {
          map.removeLayer(pointsId + '_layer')
        }
        if (map.getSource(pointsId)) {
          map.removeSource(pointsId)
        }
        map.addSource(pointsId, eachPointsIdGeoJson)
        map.addLayer({
          'id': pointsId + '_layer',
          'source': pointsId,
          'type': 'circle',
          'paint': {
            'circle-stroke-width': 1,
            'circle-stroke-color': '#666402',
            'circle-radius': 4,
            'circle-color': ["get", 'color']
          }
        })
        // 添加预测图层
        if (points[index].forecast !== null && points[index].forecast.length > 0) {
          // console.log('index: ' + index)
          // console.log('points[index].forecast: ' + JSON.stringify(points[index].forecast))
          var forecastEachlinePointsNum = []
          for (var i=0;i<points[index].forecast.length;i++) {
            var pointsId2 = ''
            var eachPointsIdGeoJson2 = {}
            var lineId2 = ''
            var eachLineIdGeoJson2 = {}
            var index2 = 0
            forecastEachlinePointsNum.push(points[index].forecast[i].points.length)
            for (var j=0;j<points[index].forecast[i].points.length;j++) {
              let color2 = 'red'
              switch (points[index].forecast[i].points[j].power) {
                case 7:
                  color2 = '#30fc31'
                  break
                case 8:
                  color2 = '#307efa'
                  break
                case 9:
                  color2 = '#307efa'
                  break
                case 10:
                  color2 = '#fffc00'
                  break
                case 11:
                  color2 = '#fffc00'
                  break
                case 12:
                  color2 = '#ff9c00'
                  break
                case 13:
                  color2 = '#ff9c00'
                  break
                case 14:
                  color2 = '#fb7cff'
                  break
                case 15:
                  color2 = '#fb7cff'
                  break
                case 16:
                  color2 = '#ff0000'
                  break
                case 17:
                  color2 = '#ff0000'
                  break
                default:
                  color2 = '#fff'
                  break
              }

              pointsId2 = typhoonId + index + '_' + i + '_' + j + '_points'
              eachPointsIdGeoJson2 = {
                'type': 'geojson',
                'data': {
                  'type': 'FeatureCollection',
                  'features': [{
                      'type': 'Feature',
                      'geometry': {
                        'type': 'Point',
                        'coordinates': [points[index].forecast[i].points[j].lng, points[index].forecast[i].points[j].lat]
                      },
                      'properties': {
                        'description': this.createTyphoonPopup(points[index].forecast[i].points[j], name, typhoonId),
                        'typhoonCircleData': points[index].forecast[i].points[j],
                        "color": color2
                      }
                  }]
                }
              }
              lineId2 = typhoonId + index + '_' + i + '_' + j + '_lines'
              eachLineIdGeoJson2 = {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                  }
                }
              }
              if (j === 0) {
                const positionPrevious = [points[index].lng, points[index].lat]
                eachLineIdGeoJson2.data.geometry.coordinates.push(positionPrevious)
                const position2 = [points[index].forecast[i].points[j].lng, points[index].forecast[i].points[j].lat]
                eachLineIdGeoJson2.data.geometry.coordinates.push(position2)
                // 添加线图层
                if (map.getLayer(lineId2 + '_layer')) {
                  map.removeLayer(lineId2 + '_layer')
                }
                if (map.getSource(lineId2)) {
                  map.removeSource(lineId2)
                }
                map.addSource(lineId2, eachLineIdGeoJson2)
                var lineColor = this.lineColorAry[forecastLineCount % 7]
                map.addLayer({
                  'id': lineId2 + '_layer',
                  'source': lineId2,
                  'type': 'line',
                  'paint': {
                    'line-color': lineColor,
                    'line-width': 3,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 2]
                  }
                }, pointsId + '_layer')
              } else if (j > 0) {
                const positionPrevious = [points[index].forecast[i].points[j-1].lng, points[index].forecast[i].points[j-1].lat]
                eachLineIdGeoJson2.data.geometry.coordinates.push(positionPrevious)
                const position2 = [points[index].forecast[i].points[j].lng, points[index].forecast[i].points[j].lat]
                eachLineIdGeoJson2.data.geometry.coordinates.push(position2)
                // 添加线图层
                if (map.getLayer(lineId2 + '_layer')) {
                  map.removeLayer(lineId2 + '_layer')
                }
                if (map.getSource(lineId2)) {
                  map.removeSource(lineId2)
                }
                map.addSource(lineId2, eachLineIdGeoJson2)
                var lineColor = this.lineColorAry[forecastLineCount % 7]
                map.addLayer({
                  'id': lineId2 + '_layer',
                  'source': lineId2,
                  'type': 'line',
                  'paint': {
                    'line-color': lineColor,
                    'line-width': 3,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 2]
                  }
                }, typhoonId + index + '_' + i + '_' + (j-1) + '_points_layer')
              }
              
              // 添加点图层
              if (map.getLayer(pointsId2 + '_layer')) {
                map.removeLayer(pointsId2 + '_layer')
              }
              if (map.getSource(pointsId2)) {
                map.removeSource(pointsId2)
              }
              // console.log('eachPointsIdGeoJson2: ' + JSON.stringify(eachPointsIdGeoJson2));
              map.addSource(pointsId2, eachPointsIdGeoJson2)
              map.addLayer({
                'id': pointsId2 + '_layer',
                'source': pointsId2,
                'type': 'circle',
                'paint': {
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#666402',
                  'circle-radius': 4,
                  'circle-color': ["get", 'color']
                }
              })
              // 添加图层点击事件
              map.on('click', pointsId2 + '_layer', (e) => {
                var coordinates = e.features[0].geometry.coordinates.slice()
                var description = e.features[0].properties.description
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }
                // 删除别的提示框
                var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button')
                for (var i = 0; i < tipElArr.length; i++) {
                  tipElArr[i].click()
                }
                new mapboxgl.Popup({ closeOnClick: false })
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(map)
                this.addTyphoonCircle(JSON.parse(e.features[0].properties.typhoonCircleData))
                $(".mapboxgl-popup-close-button").off('click')
                $(".mapboxgl-popup-close-button").on('click', function() {
                  if (this.nextElementSibling && this.nextElementSibling.className == 'typhoon-point-dialog-title') {
                    // alert(2)
                    // me.removeLayer(pointsId + '_layer')
                    if (map.getLayer('circle-layer')) {
                      map.removeLayer('circle-layer')
                    }
                  }
                })
              })
            }

            // points[index].forecast[i].sets，forecastLineCount
            __this.typhoonForecastLineAry.push({'district':points[index].forecast[i].sets, 'icon':__this.lineColorLegendAry[forecastLineCount % 7]})
            forecastLineCount++
          }
          __this.mapTyphoon[__this.mapTyphoonNum-1].forecastPoint.push({'forecastIndex':index, 'forecastLineNum':points[index].forecast.length, 'forecastEachlinePointsNum':forecastEachlinePointsNum})
        }

        if (index === points.length-1) {
          clearInterval(__this.timer)
          __this.timer = null
          
          let features = eachPointsIdGeoJson.data.features
          // console.log('features: ' + JSON.stringify(features));
          // console.log('points[index-1]: ' + JSON.stringify(points[index-1]))
          // console.log('points[index]: ' + JSON.stringify(points[index]))
          if (features[features.length - 1].properties.typhoonCircleData.radius7 > 0 || features[features.length - 1].properties.typhoonCircleData.radius10 > 0 || features[features.length - 1].properties.typhoonCircleData.radius12 > 0) {
            // console.log(556);
            // let coordinates = features[features.length - 1].geometry.coordinates.slice();
            // let description = features[features.length - 1].properties.description;
            // this.addTyphoonCircle(features[features.length - 1].properties.typhoonCircleData);
            __this.addTyphoonCircle(points[index])
          } else {
            // let coordinates = features[features.length - 2].geometry.coordinates.slice();
            // let description = features[features.length - 2].properties.description;
            // this.addTyphoonCircle(features[features.length - 2].properties.typhoonCircleData);
            __this.addTyphoonCircle(points[index-1])
          }
          typhoonData.isLoadedOK = true
          if (__this.typhoonForecastLineAry.length > 0) {
            __this.$bus.$emit('addTyphoonLegend', __this.typhoonForecastLineAry)
          }
        }
        // 添加图层点击事件
        map.on('click', pointsId + '_layer', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice()
          var description = e.features[0].properties.description
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }
          // 删除别的提示框
          var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button')
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click()
          }
          new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map)
          __this.addTyphoonCircle(JSON.parse(e.features[0].properties.typhoonCircleData))
          $(".mapboxgl-popup-close-button").off('click')
          $(".mapboxgl-popup-close-button").on('click', function() {
            if (__this.nextElementSibling && __this.nextElementSibling.className == 'typhoon-point-dialog-title') {
              // alert(2)
              // me.removeLayer(pointsId + '_layer')
              if (map.getLayer('circle-layer')) {
                map.removeLayer('circle-layer')
              }
            }
          })
        })
        index++

        if (__this.needDeleteTyphoon) {
          clearInterval(__this.timer)
          __this.timer = null
          __this.SetTyphoonInfo({})
          // 移除图例
          __this.$bus.$emit('clearTyphoonLegend')
          // 删除选中的台风路径
          __this.deleteTyphoon(__this.needDeleteTyphoonItem)
          if (map.getLayer('circle-layer')) {
            map.removeLayer('circle-layer')
          }
          if (map.getSource('circle-source')) {
            map.removeSource('circle-source')
          }
          // 集合中删除
          __this.addedItem.map((eachItem, index) => {
            if (__this.needDeleteTyphoonItem.tfbh === eachItem.tfbh) {
              __this.addedItem.splice(index, 1);
            }
          })
          __this.needDeleteTyphoon = false
        }
      }, 50)
    },
    // 添加气象云图
    addQixiangyuntu() {
      var map = this.$parent.$parent.$parent.$refs.map.map;
      var __this = this;
      $.ajax({
        url: 'https://api.caiyunapp.com/v1/radar/fine_images?lon=120.690905&lat=28.004836&level=1&token=Y2FpeXVuIGFuZHJpb2QgYXBp',
        type: 'GET',
        dataType: 'JSONP',
        success: function(data) {
          if (data && data.images && data.images.length > 0) {
            //显示video
            __this.$parent.$parent.$parent.$refs.typhoonVideo.show(data.images);
            for (var i = 0; i < data.images.length; i++) {
              // console.log('data.images[i]: ' + data.images[i][0]);
              if (map.getLayer('qixiangyuntu' + "_layer")) {
                map.removeLayer('qixiangyuntu' + "_layer");
              }
              if (map.getSource('qixiangyuntu' + "_source")) {
                map.removeSource('qixiangyuntu' + "_source");
              }
              map.addSource('qixiangyuntu' + "_source", {
                "type": "image",
                "url": data.images[0][0],
                "coordinates": [
                  [118.407782322800003, 29.9616787137],
                  [123.083323077200006, 29.9616787137],
                  [123.083323077200006, 25.8294266863],
                  [118.407782322800003, 25.8294266863]
                ]
              });
              map.addLayer({
                "id": 'qixiangyuntu' + "_layer",
                "type": "raster",
                "source": 'qixiangyuntu' + "_source"
              });
              break;
            }
          }
        }
      })
    },
    addQixiangyuntuVideo(imageUrl) {
      // console.log('imageUrl: ' + imageUrl)
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (map.getLayer('qixiangyuntu' + "_layer")) {
        map.removeLayer('qixiangyuntu' + "_layer");
      }
      if (map.getSource('qixiangyuntu' + "_source")) {
        map.removeSource('qixiangyuntu' + "_source");
      }
      map.addSource('qixiangyuntu' + "_source", {
        "type": "image",
        "url": imageUrl,
        "coordinates": [
          [118.407782322800003, 29.9616787137],
          [123.083323077200006, 29.9616787137],
          [123.083323077200006, 25.8294266863],
          [118.407782322800003, 25.8294266863]
        ]
      });
      map.addLayer({
        "id": 'qixiangyuntu' + "_layer",
        "type": "raster",
        "source": 'qixiangyuntu' + "_source"
      });
    },
    addWeixingyuntuVideo(imageUrl) {
      // console.log('imageUrl: ' + imageUrl)
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (map.getLayer('weixingyuntu' + "_layer")) {
        map.removeLayer('weixingyuntu' + "_layer");
      }
      if (map.getSource('weixingyuntu' + "_source")) {
        map.removeSource('weixingyuntu' + "_source");
      }
      map.addSource('weixingyuntu' + "_source", {
        "type": "image",
        "url": imageUrl,
        // "coordinates": [
        //   [118.407782322800003, 29.9616787137],
        //   [123.083323077200006, 29.9616787137],
        //   [123.083323077200006, 25.8294266863],
        //   [118.407782322800003, 25.8294266863]
        // ]
        // "coordinates": [
        //   [68.764, 61.59],
        //   [155.852, 61.59],
        //   [155.852, -7.652],
        //   [68.764, -7.652]
        // ]
        "coordinates": [
          [62.88, 56.3858],
          [161.69675, 56.3858],
          [161.69675, -10.7873],
          [62.88, -10.7873]
        ]
        // "coordinates": [
        //   [62.87392546, 56.37939239],
        //   [161.69077140, 56.37939239],
        //   [161.69077140, -10.79333964],
        //   [62.87392546, -10.79333964]
        // ]
      });
      map.addLayer({
        "id": 'weixingyuntu' + "_layer",
        "type": "raster",
        "source": 'weixingyuntu' + "_source"
      });
    },
    addQixiangleidaVideo(imageUrl, bounds) {
      // console.log('imageUrl: ' + imageUrl)
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (!map.getLayer('qixiangleida' + "_layer")) {
        if (map.getLayer('qixiangleida' + "_layer")) {
          map.removeLayer('qixiangleida' + "_layer");
        }
        if (map.getSource('qixiangleida' + "_source")) {
          map.removeSource('qixiangleida' + "_source");
        }
        map.addSource('qixiangleida' + "_source", {
          "type": "image",
          "url": imageUrl,
          "coordinates": [
            [bounds[1], bounds[2]],
            [bounds[3], bounds[2]],
            [bounds[3], bounds[0]],
            [bounds[1], bounds[0]]
          ]
        });
        map.addLayer({
          "id": 'qixiangleida' + "_layer",
          "type": "raster",
          "source": 'qixiangleida' + "_source"
        });
      } else {
        map.getSource('qixiangleida' + "_source").updateImage({
          "url": imageUrl,
          "coordinates": [
            [bounds[1], bounds[2]],
            [bounds[3], bounds[2]],
            [bounds[3], bounds[0]],
            [bounds[1], bounds[0]]
          ]
        });
      }
    },
    clearYuntuLayer() {
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (map.getLayer('qixiangyuntu' + "_layer")) {
        map.removeLayer('qixiangyuntu' + "_layer");
      }
      if (map.getLayer('weixingyuntu' + "_layer")) {
        map.removeLayer('weixingyuntu' + "_layer");
      }
      if (map.getLayer('qixiangleida' + "_layer")) {
        map.removeLayer('qixiangleida' + "_layer");
      }
    },
    // 创建台风点的popup点击框
    createTyphoonPopup(typhoonData, title, number) {
      const data = typhoonData;
      const time = this.translateTime(new Date(data.time));
      const middlePosition = data.lng + '°E , ' + data.lat + '°N';
      const windPower = (data.power !== null ? data.power : '-') + '级';
      const windSpeed = (data.speed !== null ? data.speed : '-') + '米/秒';
      const middlerQiya = (data.pressure !== null ? data.pressure : '-') + '百帕';
      const moveWindSpeed = (data.move_speed !== null ? data.move_speed : '-') + '公里/小时';
      const moveWindDirection = (data.move_dir !== null ? data.move_dir : '-');
      let radius7 = '';
      if (data.radius7 > 0 && data.radius7_quad) {
        const radius7Quad = data.radius7_quad;
        let min = radius7Quad['ne'];
        for (let key in radius7Quad) {
          if (radius7Quad.hasOwnProperty(key)) {
            min = radius7Quad[key] < min ? radius7Quad[key] : min;
          }
        }
        if (min === data.radius7) {
          radius7 = `${min}公里`;
        } else {
          radius7 = `${min}-${data.radius7}公里`;
        }
      }
      let radius10 = '';
      if (data.radius10 > 0 && data.radius10_quad) {
        const radius10Quad = data.radius10_quad;
        let min = radius10Quad['ne'];
        for (let key in radius10Quad) {
          if (radius10Quad.hasOwnProperty(key)) {
            min = radius10Quad[key] < min ? radius10Quad[key] : min;
          }
        }
        if (min === data.radius10) {
          radius10 = `${min}公里`;
        } else {
          radius10 = `${min}-${data.radius10}公里`;
        }
      }
      let radius12 = '';
      if (data.radius12 > 0 && data.radius12_quad) {
        const radius12Quad = data.radius12_quad;
        let min = radius12Quad['ne'];
        for (let key in radius12Quad) {
          if (radius12Quad.hasOwnProperty(key)) {
            min = radius12Quad[key] < min ? radius12Quad[key] : min;
          }
        }
        if (min === data.radius12) {
          radius12 = `${min}公里`;
        } else {
          radius12 = `${min}-${data.radius12}公里`;
        }
      }
      return `
        <div class="typhoon-point-dialog-title">
          ${number}   ${title}
        </div>
        <div class="typhoon-point-dialog-content">
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">过去时间：</div>
            <div class="typhoon-point-dialog-item-right">${time}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">中心位置：</div>
            <div class="typhoon-point-dialog-item-right">${middlePosition}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">最大风力：</div>
            <div class="typhoon-point-dialog-item-right">${windPower}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">最大风速：</div>
            <div class="typhoon-point-dialog-item-right">${windSpeed}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">中心气压：</div>
            <div class="typhoon-point-dialog-item-right">${middlerQiya}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">移动速度：</div>
            <div class="typhoon-point-dialog-item-right">${moveWindSpeed}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">移动方向：</div>
            <div class="typhoon-point-dialog-item-right">${moveWindDirection}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">七级风圈半径：</div>
            <div class="typhoon-point-dialog-item-right">${radius7}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">十级风圈半径：</div>
            <div class="typhoon-point-dialog-item-right">${radius10}</div>
          </div>
          <div class="typhoon-point-dialog-item">
            <div class="typhoon-point-dialog-item-left">十二级风圈半径：</div>
            <div class="typhoon-point-dialog-item-right">${radius12}</div>
          </div>
        </div>`;
    },
    // 添加风圈
    addTyphoonCircle(data) {
      console.log(data)
      var map = this.$parent.$parent.$parent.$refs.map.map
      // this.removeLayer('circle-layer');
      // this.removeSource('circle-source');
      var geojson = {
        'type': 'FeatureCollection',
        'features': []
      };
      var center = [data.lng, data.lat];
      // 7级风圈
      if (data.radius7 > 0) {
        var coords = this.getCircleCoords(center, data.radius7_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            radius: '7'
          }
        });
      }
      // 10级风圈
      if (data.radius10 > 0) {
        var coords = this.getCircleCoords(center, data.radius10_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            radius: '10'
          }
        });
      }
      // 12级风圈
      if (data.radius12 > 0) {
        var coords = this.getCircleCoords(center, data.radius12_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            radius: '12'
          }
        });
      }

      if (map.getLayer('circle-layer')) {
        map.removeLayer('circle-layer')
      }
      if (map.getSource('circle-source')) {
        map.removeSource('circle-source')
      }
      map.addSource('circle-source', {
        type: 'geojson',
        data: geojson
      });
      map.addLayer({
        id: 'circle-layer',
        type: 'fill',
        source: 'circle-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'radius'],
            '7',
            '#00bab2',
            '10',
            '#ffff00',
            '#da7341'
          ],
          'fill-opacity': 0.2,
          'fill-outline-color': [
            'match',
            ['get', 'radius'],
            '7',
            '#00bab2',
            '10',
            '#ffff00',
            '#da7341'
          ]
        }
      });
    },
    // 生成风圈
    getCircleCoords(center, radiusData) {
      center = proj4(proj4('EPSG:4326'), proj4('EPSG:3857'), center);
      let _coords = [];
      let _angInterval = 6;
      let _pointNums = 360 / (_angInterval * 4);
      let quadrant = {
        // 逆时针算角度
        '0': 'ne',
        '1': 'nw',
        '2': 'sw',
        '3': 'se'
      };
      for (let i = 0; i < 4; i++) {
        let _r = parseFloat(radiusData[quadrant[i]]) * 1000; // 单位是km
        if (!_r) _r = 0;
        for (let j = i * _pointNums; j <= (i + 1) * _pointNums; j++) {
          let _ang = _angInterval * j;
          let x = center[0] + _r * Math.cos((_ang * Math.PI) / 180);
          let y = center[1] + _r * Math.sin((_ang * Math.PI) / 180);
          var coord = proj4(proj4('EPSG:3857'), proj4('EPSG:4326'), [x, y]);
          _coords.push(coord);
        }
      }

      return [_coords];
    },
    // 时间格式转化
    translateTime(time) {
      const year = time.getFullYear(),
        month = time.getMonth() + 1,
        day = time.getDate(),
        hour = time.getHours();
      return `${year}年${month}月${day}日${hour}时`;
    },
    removeLayer(name) {
      // var map = this.$parent.$parent.$refs.map.map;
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (map.getLayer(name)) map.removeLayer(name);
      this.$parent.$parent.$parent.$refs.map.mapInit();
    },
    removeSource(name) {
      var map = this.$parent.$parent.$parent.$refs.map.map;
      if (map.getSource(name)) map.removeSource(name);
    },
    checkItem(item) {
      //关闭video
      this.$parent.$parent.$parent.$refs.typhoonVideo.remove()
      var map = this.$parent.$parent.$parent.$refs.map.map
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button')
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click()
      }
      if (!event.target.checked) {
        this.needDeleteTyphoonItem = item
        this.needDeleteTyphoon = true
        if (item.isLoadedOK) {
          this.SetTyphoonInfo({})
          // 移除图例
          this.$bus.$emit('clearTyphoonLegend')
          // 删除选中的台风路径
          this.deleteTyphoon(item)
          if (map.getLayer('circle-layer')) {
            map.removeLayer('circle-layer')
          }
          if (map.getSource('circle-source')) {
            map.removeSource('circle-source')
          }
          // 集合中删除
          var __this = this
          this.addedItem.map((eachItem, index) => {
            if (item.tfbh === eachItem.tfbh) {
              __this.addedItem.splice(index, 1);
            }
          })
        }
        // console.log('this.addedItem: ' + JSON.stringify(this.addedItem))
      } else {
        this.needDeleteTyphoon = false
        // this.$parent.clearAll()
        // this.clearYuntuLayer()
        if (map.getLayer('circle-layer')) {
          map.removeLayer('circle-layer')
        }
        if (map.getSource('circle-source')) {
          map.removeSource('circle-source')
        }
        this.SetTyphoonInfo(item)
        // 添加台风路径
        this.addTyphoon(item)
        this.addedItem.push(item)
        // console.log('this.addedItem: ' + JSON.stringify(this.addedItem))
      }
    },
    // checkItem(item, index) {
    //   this.currentItem = item
    //   this.currentIndex = index
    //   //关闭video
    //   this.$parent.$parent.$parent.$refs.typhoonVideo.remove()
    //   var map = this.$parent.$parent.$parent.$refs.map.map
    //   var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
    //   for (var i = 0; i < tipElArr.length; i++) {
    //     tipElArr[i].click();
    //   }
    //   if (this.checkedIndex === index) {
    //     this.checkedIndex = -1
    //     this.SetTyphoonInfo({})
    //     this.deleteTyphoon(item, index) // 删除选中的台风路径
    //     if (map.getLayer('circle-layer')) {
    //       map.removeLayer('circle-layer')
    //     }
    //     if (map.getSource('circle-source')) {
    //       map.removeSource('circle-source')
    //     }
    //     // // 移除气象云图
    //     // if (map.getLayer('qixiangyuntu_layer')) {
    //     //   map.removeLayer('qixiangyuntu_layer');
    //     // }
    //   } else {
    //     this.$parent.clearAll()
    //     this.clearYuntuLayer()
    //     if (map.getLayer('circle-layer')) {
    //       map.removeLayer('circle-layer')
    //     }
    //     if (map.getSource('circle-source')) {
    //       map.removeSource('circle-source')
    //     }
    //     if (this.checkedIndex !== -1 && this.data[this.checkedIndex]) {
    //       this.deleteTyphoon(this.data[this.checkedIndex], this.checkedIndex); // 删除之前选中的台风路径
    //     }
    //     this.checkedIndex = index
    //     this.SetTyphoonInfo(item)
    //     // 添加台风路径
    //     this.addTyphoon(item, index)
    //     // // 添加气象云图
    //     // this.addQixiangyuntu()
    //   }
    // },
    ...mapActions('warning', [
      'SetTyphoonInfo'
    ])
  },
  beforeDestroy() {
    clearTimeout(this.monitor)
    this.scrollDestroyHandler()
  }
}
/* eslint-disable */
</script>
<style type="text/css">
  .typhoon-point-dialog-title {
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 231, 64, 1);
    margin-bottom: 8px;
    padding-top: 15px;
  }
  .typhoon-point-dialog-item {
    width: 100%;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    margin: 3px 0;
  }
  .typhoon-point-dialog-item .typhoon-point-dialog-item-left {
    color: #57A7AD;
    text-align: left;
  }
  .typhoon-point-dialog-item .typhoon-point-dialog-item-right {
    min-width: 0;
    flex-grow: 1;
    color: #53CBF2;
  }
</style>
<style lang="less" scoped>
  .wrapper {
    height: 100%;
    font-size: 0;
    padding: 0.15rem 0;
    .content {
      border: 0.01rem solid #28446a;
      width: 85%;
      margin: auto;
      line-height: 0.3rem;
      color: #FFF;
      height: calc(100% - 0.3rem);
      & > .year {
        font-size: 0.14rem;
        // width: 100%;
        // height: 0.3rem;
        color: white
      }
      h3 {
        background-color: #28446a;
        font-size: 0.14rem;
        width: 100%;
        height: 0.3rem;
        color: white
      }
      .box-wrapper {
        position: relative;
        .box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
        }
      }
      span {
        display: block;
        float: left;
        text-align: center;
        > input {
          cursor: pointer;
        }
      }
      ul::-webkit-scrollbar {
        display: none
      }
      ul {
        overflow-y: scroll;
        li {
          width: 100%;
          height: 0.3rem;
          font-size: 0.14rem
        }
      }
    }
  }
  /deep/ .input-with-select.el-input.el-input-group.el-input-group--append .el-input__inner {
    background: transparent;
    border-color: #43bafe;
    color: #fff;
    height: 0.24rem;
  }
  /deep/ .input-with-select.el-input.el-input-group.el-input-group--append button {
    background: transparent;
    color: #43bafe;
  }
  /deep/ .input-with-select.el-input.el-input-group.el-input-group--append /deep/ .el-input-group__append {
    padding-left: 0.01rem;
    padding-right: 0.01rem;
    background: transparent;
    border-color: #43bafe;
  }
  /deep/ .el-autocomplete {
    width: 100%;
  }
  /deep/ .el-input--suffix .el-input__inner {
    background: transparent;
    border-color: #43bafe;
    color: #fff;
  }
  /deep/ .el-input__suffix {
    background: transparent;
    color: #43bafe;
    padding-left: 0.05rem;
    height: 0.38rem;
    line-height: 0.38rem;
    border-left: 1px solid #43bafe;
  }
  /deep/ .el-icon-search {
    cursor: pointer;
  }
  /deep/ .my-autocomplete {
    background: #5d8ebc;
    color: #fff;
    /deep/ .el-autocomplete-suggestion__list li {
      color: #fff;
      &:hover {
        background-color: #bed9f3;
        color: #409EFF;
        font-weight: 600;
      }
    }
  }
  /deep/ .el-input {
    width: 43%;
    margin-right: 7%;
    margin-left: 50%;
  }
  /deep/ .el-input__inner {
    height: 0.25rem;
    line-height: 0.25rem;
  }
  /deep/ .el-input__suffix {
    height: 0.25rem;
    line-height: 0.25rem;
    // margin-top: 0.03rem;
  }
  .year {
    margin-bottom: 0.1rem;
  }
</style>
