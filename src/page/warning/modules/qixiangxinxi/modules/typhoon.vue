<template>
  <div class="wrapper" v-show="isShow">
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
                <input :checked="checkedIndex===index" type="checkbox" @click="checkItem(item,index)">
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
import { getTyphoon, getTyphoonDetail } from 'api/warning/warning'
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
      checkedIndex: -1,
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid(),
      monitor: null,
      isKong: false,
      monitorTime: 1000 * 60,
      mapTyphoon: []
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
  methods: {
    initData() {
      getTyphoon().then((data) => {
        if (data && data.length) {
          this.isKong = false
        } else {
          this.isKong = true
        }
        this.data = data
      })
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
    deleteTyphoon(data, index) {
      var i = this.mapTyphoon.findIndex(item => item.typhoonId === data.tfbh)
      if (i > -1) {
        this.mapTyphoon[i].layers.map((item) => {
          this.removeLayer(item)
        })
        this.mapTyphoon.splice(i, 1)
      }
    },
    // 添加指定台风路径
    addTyphoon(data, index) {
      const me = this
      var map = this.$parent.$parent.$parent.$refs.map.map
      if (this.mapTyphoon.findIndex(item => item === data.tfbh) > -1) return
      getTyphoonDetail(data.tfbh).then((result) => {
        const points = result[0].points || []
        if (points.length <= 0) return
        var typhoonId = data.tfbh
        var typhoonObj = {
          typhoonId: typhoonId,
          layers: []
        }
        var pointsId = typhoonId + '_points' // 点soure的ID
        var pointsIdGeoJson = {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': []
          }
        }
        var lineId = typhoonId + '_lines' // 线soure的ID
        var lineIdGeoJson = {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': []
            }
          }
        }

        var count = points.length;
        var totalLongitude = 0;
        var totalLatitude = 0;
        points.map((item, index) => {
          totalLongitude += item.longitude
          totalLatitude += item.latitude
          // if (index === points.length - 1 && (item.radius7 > 0 || item.radius10 > 0 || item.radius12 > 0)) {
          //   map.flyTo({
          //     center: [item.longitude, item.latitude],
          //     zoom: 6,
          //     speed: 1.6
          //   })
          // } else {
          //   map.flyTo({
          //     center: [points[points.length - 2].longitude, points[points.length - 2].latitude],
          //     zoom: 6,
          //     speed: 1.6
          //   })
          // }
          // 台风点颜色
          let color = 'red'
          switch (item.power){
            case 7:
              color = '#dcfffa'
              break
            case 8:
              color = '#4fbff3'
              break
            case 9:
              color = '#0090ff'
              break
            case 10:
              color = '#e0f190'
              break
            case 11:
              color = '#e2ef4e'
              break
            case 12:
              color = '#ffea00'
              break
            case 13:
              color = '#ffc600'
              break
            case 14:
              color = '#ffb400'
              break
            case 15:
              color = '#ed9956'
              break
            case 16:
              color = '#ff5400'
              break
            case 17:
              color = '#ff0000'
              break
          }
          const position = [item.longitude, item.latitude]
          pointsIdGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': position
            },
            'properties': {
              'description': this.createTyphoonPopup(item, result[0].name, typhoonId),
              'typhoonCircleData': item,
              "color": color
            }
          })
          lineIdGeoJson.data.geometry.coordinates.push(position)
        })

        map.flyTo({
              center: [totalLongitude / count, totalLatitude / count],
              zoom: 4,
              speed: 1.6
        });
        // 删除图层
        if (map.getLayer(lineId + '_layer')) {
          map.removeLayer(lineId + '_layer');
        }
        // 添加数据源
        if (map.getSource(pointsId)) {
          map.removeSource(pointsId)
        }
        map.addSource(pointsId, pointsIdGeoJson)
        if (map.getSource(lineId)) {
          map.removeSource(lineId)
        }
        map.addSource(lineId, lineIdGeoJson)
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
        if (!map.getSource('warn1_line_layer')) {
          map.addSource('warn1_line_layer', line1GeoJson)
          map.addSource('warn2_line_layer', line2GeoJson)
          map.addLayer({
          'id': 'warn1_line_layer',
          'source': 'warn1_line_layer',
          'type': 'line',
          'paint': {
            'line-color': 'blue',
            'line-width': 5,
            'line-opacity': 0.8
            }
          })
          map.addLayer({
          'id': 'warn2_line_layer',
          'source': 'warn2_line_layer',
          'type': 'line',
          'paint': {
            'line-color': 'green',
            'line-width': 5,
            'line-opacity': 0.8,
            'line-dasharray': [5, 10]
            }
          })
          console.log(map.getSource('warn1_line_layer'))
        }
        // 添加线图层
        map.addLayer({
          'id': lineId + '_layer',
          'source': lineId,
          'type': 'line',
          'paint': {
            'line-color': 'rgb(48, 145, 230)',
            'line-width': 5,
            'line-opacity': 0.8
          }
        })
        console.log(map.getSource(lineId))
        // 添加点图层
        if (map.getLayer(pointsId + '_layer')) {
          map.removeLayer(pointsId + '_layer');
        }
        map.addLayer({
          'id': pointsId + '_layer',
          'source': pointsId,
          'type': 'circle',
          'paint': {
            'circle-stroke-width': 4,
            'circle-stroke-color': 'rgb(168, 171, 170)',
            'circle-radius': 6,
            'circle-color': ["get",'color']
          }
        })
        let features = pointsIdGeoJson.data.features
        // new mapboxgl.Popup({ closeOnClick: false })
        //     .setLngLat(coordinates)
        //     .setHTML(description)
        //     .addTo(map);
        console.log(features[features.length - 1].properties.typhoonCircleData)
        if (features[features.length - 1].properties.typhoonCircleData.radius7 > 0 || features[features.length - 1].properties.typhoonCircleData.radius10 > 0 || features[features.length - 1].properties.typhoonCircleData.radius12 > 0) {
          console.log(556)
          let coordinates = features[features.length - 1].geometry.coordinates.slice()
          let description = features[features.length - 1].properties.description
          this.addTyphoonCircle(features[features.length - 1].properties.typhoonCircleData)
        } else {
          let coordinates = features[features.length - 2].geometry.coordinates.slice()
          let description = features[features.length - 2].properties.description
          this.addTyphoonCircle(features[features.length - 2].properties.typhoonCircleData)
        }
        console.log(pointsIdGeoJson)
        // 添加图层点击事情，触发popup
        map.on('click', pointsId + '_layer', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          // 删除别的提示框
          var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
          this.addTyphoonCircle(JSON.parse(e.features[0].properties.typhoonCircleData));
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
        });
        typhoonObj.layers.push(pointsId + '_layer')
        typhoonObj.layers.push(lineId + '_layer')
        this.mapTyphoon.push(typhoonObj)
      })
    },
    // 添加气象云图
    addQixiangyuntu() {
      var map = this.$parent.$parent.$parent.$refs.map.map;
      var __this = this;
      $.ajax({
        url: 'https://api.caiyunapp.com/v1/radar/fine_images?lon=120.690905&lat=28.004836&level=1&token=Y2FpeXVuIGFuZHJpb2QgYXBp',
        type: 'GET',
        dataType: 'JSONP',
        success: function (data) {
          if (data && data.images && data.images.length>0) {
            for (var i=0;i<data.images.length;i++) {
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
                  [118.407782322800003,29.9616787137],
                  [123.083323077200006,29.9616787137],
                  [123.083323077200006,25.8294266863],
                  [118.407782322800003,25.8294266863]
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
    // 创建台风点的popup点击框
    createTyphoonPopup(typhoonData, title, number) {
      const data = typhoonData;
      const time = this.translateTime(new Date(data.time));
      const middlePosition = data.longitude + '°E , ' + data.latitude + '°N';
      const windPower = (data.power !== null ? data.power : '-') + '级';
      const windSpeed = (data.speed !== null ? data.speed : '-') + '米/秒';
      const middlerQiya = (data.pressure !== null ? data.pressure : '-') + '百帕';
      const moveWindSpeed = (data.move_speed !== null ? data.move_speed : '-') + '公里/小时';
      const moveWindDirection = (data.move_dir !== null ? data.move_dir : '-');
      let radius7 = '';
      if (data.radius7 > 0) {
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
      if (data.radius10 > 0) {
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
      if (data.radius12 > 0) {
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
      var map = this.$parent.$parent.$parent.$refs.map.map
      // this.removeLayer('circle-layer');
      // this.removeSource('circle-source');
      var geojson = {
        'type': 'FeatureCollection',
        'features': []
      };
      var center = [data.longitude, data.latitude];
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
    checkItem(item, index) {
      var map = this.$parent.$parent.$parent.$refs.map.map
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      if (this.checkedIndex === index) {
        this.checkedIndex = -1
        this.SetTyphoonInfo({})
        this.deleteTyphoon(item, index) // 删除选中的台风路径
        if (map.getLayer('circle-layer')) {
          map.removeLayer('circle-layer')
        }
        if (map.getSource('circle-source')) {
          map.removeSource('circle-source')
        }
        // 移除气象云图
        if (map.getLayer('qixiangyuntu_layer')) {
            map.removeLayer('qixiangyuntu_layer');
        }
      } else {
        if (map.getLayer('circle-layer')) {
          map.removeLayer('circle-layer')
        }
        if (map.getSource('circle-source')) {
          map.removeSource('circle-source')
        }
        if (this.checkedIndex !== -1 && this.data[this.checkedIndex]) {
          this.deleteTyphoon(this.data[this.checkedIndex], this.checkedIndex); // 删除之前选中的台风路径
        }
        this.checkedIndex = index
        this.SetTyphoonInfo(item)
        // 添加台风路径
        this.addTyphoon(item, index)
        // 添加气象云图
        this.addQixiangyuntu()
      }
    },
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
      height: 100%;
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
</style>
