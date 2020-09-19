<!--
 * Mapbox GL展示天地图数据
 * @Author: jiangbotao
 * @Date: 2019-12-09 23:17:48
 * @LastEditors: jiangbotao
 * @LastEditTime: 2019-12-18 00:17:04
 * @FilePath: \mymapbox\src\components\Map3857.vue
 -->
<template>
  <div>
    <div id="map"></div>
    <div class="legend-box" :class="{'collapse':collapse2}">
      <Legend3 ref="legend3" :legendMsg3="legendMsg3"></Legend3>
      <Legend2 ref="legend2" :legendMsg2="legendMsg2"></Legend2>
      <Legend ref="legend" :legendMsg="legendMsg"></Legend>
    </div>
    <div class="modal" v-show="dialogVisible">
      <header>
        <div class="title">{{title}}</div>
        <div class="type">{{type}}</div>
        <i @click="dialogVisible=false,selectImgMarker.remove()" class="el-dialog__close el-icon el-icon-close"></i>
      </header>
      <nav>
        <div class="chargeName">联系人：{{chargeName}}</div>
        <div class="chargePhone">联系方式：{{chargePhone}}</div>
      </nav>
      <footer class="dialog-footer">
        <el-button @click="dial">{{dialInner}}</el-button>
        <el-button type="primary" @click="hangUp">挂断</el-button>
      </footer>
      <section>
        <iframe
          width="100%"
          height="100%"
          allowfullscreen="true"
          :src="`http://10.36.226.3:8089/video/index.html?url=${videoUrl}`"></iframe>
      </section>
    </div>
    <div class="shipinjiankongModal" v-show="shipianjiankongPopup">
      <button
        class="mapboxgl-popup-close-button"
        type="button"
        @click="shipianjiankongPopup=false"
        aria-label="Close popup">×
      </button>
      <div class="pop-tip-jianceyujing">
        <h3>{{cameraName}}</h3>
        <div class="iframe-box">
          <button onclick="showFullVideo(`${videoUrl}`)">全屏</button>
          <iframe class="iframe" :src="`${videoUrl}`"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import {
  Logo,
  QueryByBoundsParameters,
  QueryService,
  FeatureService,
  MeasureService
} from '@supermap/iclient-mapboxgl';
import CircularJSON from 'circular-json';
import $ from 'jquery';
import { mapGetters, mapActions } from 'vuex';
import { getCategoryByPid } from 'api/map/map';
import Legend from './legend';
import Legend2 from './legend2';
import Legend3 from './legend3';

import URL_CONFIG from './urlconfig';
import echartJoinus1 from "./joinus_1";
import echartJoinus2 from "./joinus_2";
import { distance, point, circle, polygon, pointsWithinPolygon } from '@turf/turf';
import {
  getFishBoatDetailSmid,
  getIndividualData,
  getSatellitePhone,
  getWaterGateDetailBySmid,
  getServiceUrl,
  getDTReservoirMonitorDetailBySmid,
  getDTWaterGateDetailBySmid,
  getLiangkeyiweiList,
  getYuchuanjianceList,
  getWcxRainMonitorPoint,
  getRainMonitorPoint,
  getQXWindDetail,
  getVideoTree
} from 'api/warning/warning'
import {
  getRainMonitorDetailBySmid,
  getRiverMonitorDetailBySmid,
  getReservoirMonitorDetailBySmid,
  getPondingDetailBySmid,
  getPondingDetailBySmidNew,
  getEnterpriseDetailSmid,
  getScenicDetailBySmid,
  getVideoPictureInfo
} from 'api/save/save';
import getDistrictData from './wenzhou_district.json';

export default {
  name: "state",
  components: {
    echartJoinus1,
    echartJoinus2,
    Legend,
    Legend2,
    Legend3
  },
  props: {
    data: {
      type: Object,
      defaule() {
        return {}
      }
    },
    camera: {
      type: Object,
      defaule() {
        return {}
      }
    },
    collapse2: {
      type: Boolean,
      defaule() {
        return false
      }
    },
    // cameraOne: {
    //   type: Object,
    //   defaule() {
    //     return {}
    //   }
    // }
  },
  computed: {
    ...mapGetters('warning', [
      'currentMonitorType',
      'currentMonitorTypeArr',
      'specalPoint',
      'qixiangWarning',
      'yuqingTime',
      'videoFirstMenuID'
    ]),
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    // 视频监控一级目录id
    videoFirstMenuID(val) {
      // console.log('videoFirstMenuIDval: ' + CircularJSON.stringify(val))

      // var id = val.id;
      // var icon = val.icon;
      // var alias = "shipin_" + id;
      // if (val.checked) {
      //   this.videoAliasAry.push(alias);
      //   var __this = this;
      //   getVideoPictureInfo(id).then(res => {
      //     // console.log('res: ' + CircularJSON.stringify(res))
      //     if (res.success == false) {
      //       return;
      //     }

      //     var features = res.features;
      //     if (!__this.map.getSource(alias + "_source")) {
      //       __this.map.addSource(alias + "_source", {
      //         "type": "geojson",
      //         "data": features
      //       });
      //     } else {
      //       __this.map.getSource(alias + "_source").setData(features);
      //     }

      //     if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
      //       if (__this.map.getLayer(alias + "_layer")) {
      //         __this.map.removeLayer(alias + "_layer");
      //       }
      //       __this.map.addLayer({
      //         "id": alias + "_layer",
      //         "type": "symbol",
      //         "source": alias + "_source",
      //         "layout": {
      //           'icon-image': alias + "_Point",
      //           'icon-size': 0.6,
      //           'icon-allow-overlap': true
      //         }
      //       });
      //     } else {
      //       __this.loadedLayer.push(alias + "_layer");

      //       __this.map.loadImage(icon, function(error, image) {
      //         if (error) {
      //           console.log("error: " + error);
      //         }
      //         if (!__this.map.hasImage(alias + "_Point")) {
      //           __this.map.addImage(alias + "_Point", image);
      //         }
      //         if (__this.map.getLayer(alias + "_layer")) {
      //           __this.map.removeLayer(alias + "_layer");
      //         }
      //         __this.map.addLayer({
      //           "id": alias + "_layer",
      //           "type": "symbol",
      //           "source": alias + "_source",
      //           "layout": {
      //             'icon-image': alias + "_Point",
      //             'icon-size': 0.6,
      //             'icon-allow-overlap': true
      //           }
      //         });
      //       });

      //       __this.map.on("click", alias + "_layer", function(e) {
      //           var feature = e.features[0];
      //           // console.log("feature: " + CircularJSON.stringify(feature));

      //           var longitude = e.features[0].geometry.coordinates[0];
      //           var latitude = e.features[0].geometry.coordinates[1];
      //           var videoUrl = feature.properties.VIDEO_URL;
      //           __this.queryCameraBySmid(videoUrl, longitude, latitude, e.features[0].properties);
      //       });
      //     }
      //   });
      // } else {
      //   if (this.map.getLayer(alias + "_layer")) {
      //     this.map.removeLayer(alias + "_layer");
      //   }
      //   for (var i = 0; i < this.videoAliasAry.length; i++) {
      //     if (this.videoAliasAry[i] === alias) {
      //       this.videoAliasAry.splice(i, 1);
      //       i--;
      //     }
      //   }
      // }
      this.addorremoveShipinjiankongLayer(val);
    },
    // 雨情监测时间
    yuqingTime(data) {
      // yuqingTimedata: ["2020-08-24 00:00:00","2020-08-25 08:00:00"]
      // console.log('yuqingTimedata: ' + CircularJSON.stringify(data))
      if(this.userDistrict !== '330328') {
        return;
      }
      if (this.currentLayersAlias.indexOf('shuiliyuqingjiance') >= 0) {
        var __this = this;
        if (this.userDistrict == '330328') {
          getWcxRainMonitorPoint(data[0], data[1], 0).then(res => {
            // console.log('res: ' + CircularJSON.stringify(res))
            var features = res.features;
            for(var i=0;i<features.features.length;i++) {
              features.features[i].properties.stationYl = features.features[i].properties.station + ':' + features.features[i].properties.yl
            }

            // 设置数据源
            if (!__this.map.getSource("shuiliyuqingjiance"  + "_source")) {
              __this.map.addSource("shuiliyuqingjiance" + "_source", {
                "type": "geojson",
                "data": features
              });
            } else {
              __this.map.getSource("shuiliyuqingjiance" + "_source").setData(features);
            }
            // 设置图层
            if (__this.map.getLayer("shuiliyuqingjiance" + "_layer")) {
              __this.map.removeLayer("shuiliyuqingjiance" + "_layer");
            }
            __this.map.addLayer({
              "id": "shuiliyuqingjiance" + "_layer",
              "type": "symbol",
              "source": "shuiliyuqingjiance" + "_source",
              "layout": {
                'icon-image': "shuiliyuqingjiance" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
            if (__this.map.getLayer("shuiliyuqingjiance" + "_notelayer")) {
              __this.map.removeLayer("shuiliyuqingjiance" + "_notelayer");
            }
            __this.map.addLayer({
              "id": "shuiliyuqingjiance" + "_notelayer",
              "type": "symbol",
              "source": "shuiliyuqingjiance" + "_source",
              "layout": {
                "text-field": "{stationYl}",
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                "text-offset": [0, 2],
                "text-size": 12,
                "text-max-width": 20
              },
              "paint": {
                "text-color": "#00d8ff",
                "text-halo-width": 1,
                "text-halo-color": "rgba(0, 0, 0, 1)"
              }
            });
          });
        }
      }
      if (this.currentLayersAlias.indexOf('qixiangyuqingjiance') >= 0) {
        var __this = this;

        if (this.userDistrict == '330328') {
          getWcxRainMonitorPoint(data[0], data[1], 1).then(res => {
            // console.log('res: ' + CircularJSON.stringify(res))
            var features = res.features;
            for(var i=0;i<features.features.length;i++) {
              features.features[i].properties.stationYl = features.features[i].properties.station + ':' + features.features[i].properties.yl
            }

            // 设置数据源
            if (!__this.map.getSource("qixiangyuqingjiance"  + "_source")) {
              __this.map.addSource("qixiangyuqingjiance" + "_source", {
                "type": "geojson",
                "data": features
              });
            } else {
              __this.map.getSource("qixiangyuqingjiance" + "_source").setData(features);
            }
            // 设置图层
            if (__this.map.getLayer("qixiangyuqingjiance" + "_layer")) {
              __this.map.removeLayer("qixiangyuqingjiance" + "_layer");
            }
            __this.map.addLayer({
              "id": "qixiangyuqingjiance" + "_layer",
              "type": "symbol",
              "source": "qixiangyuqingjiance" + "_source",
              "layout": {
                'icon-image': "qixiangyuqingjiance" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
            if (__this.map.getLayer("qixiangyuqingjiance" + "_notelayer")) {
              __this.map.removeLayer("qixiangyuqingjiance" + "_notelayer");
            }
            __this.map.addLayer({
              "id": "qixiangyuqingjiance" + "_notelayer",
              "type": "symbol",
              "source": "qixiangyuqingjiance" + "_source",
              "layout": {
                "text-field": "{stationYl}",
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                "text-offset": [0, 2],
                "text-size": 12,
                "text-max-width": 20
              },
              "paint": {
                "text-color": "#00d8ff",
                "text-halo-width": 1,
                "text-halo-color": "rgba(0, 0, 0, 1)"
              }
            });
          });
        }
      }
    },
    // 气象信息预警
    qixiangWarning(data) {
      // console.log('qixiangWarningdata: ' + CircularJSON.stringify(data))
      if (!data || data.length == 0) {
        if (this.map.getLayer('gaowen_layer')) {
          this.map.removeLayer('gaowen_layer');
        }
        if (this.map.getLayer('dafeng_layer')) {
          this.map.removeLayer('dafeng_layer');
        }
        if (this.map.getLayer('leidian_layer')) {
          this.map.removeLayer('leidian_layer');
        }
        if (this.map.getLayer('baoyu_layer')) {
          this.map.removeLayer('baoyu_layer');
        }
        if (this.map.getLayer('taifeng_layer')) {
          this.map.removeLayer('taifeng_layer');
        }

        if (this.map.getLayer('qixiangyuntu_layer')) {
          this.map.removeLayer('qixiangyuntu_layer');
        }
        return;
      }
      //添加数据源
      var gaowenWarnGeoJson = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      };
      var dafengWarnGeoJson = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      };
      var leidianWarnGeoJson = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      };
      var baoyuWarnGeoJson = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      };
      var taifengWarnGeoJson = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      };
      for (var i = 0; i < data.length; i++) {
        if (data[i].WARN_TYPE === '高温') {
          var districtCode = data[i].AREA_CODE;
          if (districtCode === '330322') {
            districtCode = '330305';
          }
          var districtCenter = this.getCenterByDistrictCode(districtCode);
          gaowenWarnGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': districtCenter
            },
            'properties': {
              'description': this.createWarnPopup(data[i]),
              'gaowenWarnData': data[i]
            }
          });
        }
        if (data[i].WARN_TYPE === '大风') {
          var districtCode = data[i].AREA_CODE;
          if (districtCode === '330322') {
            districtCode = '330305';
          }
          var districtCenter = this.getCenterByDistrictCode(districtCode);
          dafengWarnGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': districtCenter
            },
            'properties': {
              'description': this.createWarnPopup(data[i]),
              'gaowenWarnData': data[i]
            }
          });
        }
        if (data[i].WARN_TYPE === '雷电') {
          var districtCode = data[i].AREA_CODE;
          if (districtCode === '330322') {
            districtCode = '330305';
          }
          var districtCenter = this.getCenterByDistrictCode(districtCode);
          leidianWarnGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': districtCenter
            },
            'properties': {
              'description': this.createWarnPopup(data[i]),
              'gaowenWarnData': data[i]
            }
          });
        }
        if (data[i].WARN_TYPE === '暴雨') {
          var districtCode = data[i].AREA_CODE;
          if (districtCode === '330322') {
            districtCode = '330305';
          }
          var districtCenter = this.getCenterByDistrictCode(districtCode);
          baoyuWarnGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': districtCenter
            },
            'properties': {
              'description': this.createWarnPopup(data[i]),
              'gaowenWarnData': data[i]
            }
          });
        }
        if (data[i].WARN_TYPE === '台风') {
          var districtCode = data[i].AREA_CODE;
          if (districtCode === '330322') {
            districtCode = '330305';
          }
          var districtCenter = this.getCenterByDistrictCode(districtCode);
          taifengWarnGeoJson.data.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': districtCenter
            },
            'properties': {
              'description': this.createWarnPopup(data[i]),
              'gaowenWarnData': data[i]
            }
          });
        }
      }
      if (this.map.getSource('gaowen')) {
        this.map.removeSource('gaowen');
      }
      this.map.addSource('gaowen', gaowenWarnGeoJson);
      if (this.map.getSource('dafeng')) {
        this.map.removeSource('dafeng');
      }
      this.map.addSource('dafeng', dafengWarnGeoJson);
      if (this.map.getSource('leidian')) {
        this.map.removeSource('leidian');
      }
      this.map.addSource('leidian', leidianWarnGeoJson);
      if (this.map.getSource('baoyu')) {
        this.map.removeSource('baoyu');
      }
      this.map.addSource('baoyu', baoyuWarnGeoJson);
      if (this.map.getSource('taifeng')) {
        this.map.removeSource('taifeng');
      }
      this.map.addSource('taifeng', taifengWarnGeoJson);
      //添加图层
      if (this.map.getLayer('gaowen_layer')) {
        this.map.removeLayer('gaowen_layer');
      }
      this.map.addLayer({
        'id': 'gaowen_layer',
        'source': 'gaowen',
        "type": "symbol",
        "layout": {
          'icon-image': "gaowen_Point",
          'icon-size': 0.9,
          'icon-allow-overlap': true
        }
      });
      if (this.map.getLayer('dafeng_layer')) {
        this.map.removeLayer('dafeng_layer');
      }
      this.map.addLayer({
        'id': 'dafeng_layer',
        'source': 'dafeng',
        "type": "symbol",
        "layout": {
          'icon-image': "dafeng_Point",
          'icon-size': 0.9,
          'icon-allow-overlap': true
        }
      });
      if (this.map.getLayer('leidian_layer')) {
        this.map.removeLayer('leidian_layer');
      }
      this.map.addLayer({
        'id': 'leidian_layer',
        'source': 'leidian',
        "type": "symbol",
        "layout": {
          'icon-image': "leidian_Point",
          'icon-size': 0.9,
          'icon-allow-overlap': true
        }
      });
      if (this.map.getLayer('baoyu_layer')) {
        this.map.removeLayer('baoyu_layer');
      }
      this.map.addLayer({
        'id': 'baoyu_layer',
        'source': 'baoyu',
        "type": "symbol",
        "layout": {
          'icon-image': "baoyu_Point",
          'icon-size': 0.9,
          'icon-allow-overlap': true
        }
      });
      if (this.map.getLayer('taifeng_layer')) {
        this.map.removeLayer('taifeng_layer');
      }
      this.map.addLayer({
        'id': 'taifeng_layer',
        'source': 'taifeng',
        "type": "symbol",
        "layout": {
          'icon-image': "taifeng_Point",
          'icon-size': 0.9,
          'icon-allow-overlap': true
        }
      });

      if (this.loadedLayer.indexOf("gaowen_layer") < 0) {
        this.loadedLayer.push("gaowen_layer");
        var __this = this;
        this.map.on('click', 'gaowen_layer', (e) => {
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
          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(__this.map);
        });
      }
      if (this.loadedLayer.indexOf("dafeng_layer") < 0) {
        this.loadedLayer.push("dafeng_layer");
        var __this = this;
        this.map.on('click', 'dafeng_layer', (e) => {
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
          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(__this.map);
        });
      }
      if (this.loadedLayer.indexOf("leidian_layer") < 0) {
        this.loadedLayer.push("leidian_layer");
        var __this = this;
        this.map.on('click', 'leidian_layer', (e) => {
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
          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(__this.map);
        });
      }
      if (this.loadedLayer.indexOf("baoyu_layer") < 0) {
        this.loadedLayer.push("baoyu_layer");
        var __this = this;
        this.map.on('click', 'baoyu_layer', (e) => {
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
          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(__this.map);
        });
      }
      if (this.loadedLayer.indexOf("taifeng_layer") < 0) {
        this.loadedLayer.push("taifeng_layer");
        var __this = this;
        this.map.on('click', 'taifeng_layer', (e) => {
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
          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(__this.map);
        });
      }

    },
    currentMonitorTypeArr(data) {
      // console.log('currentMonitorTypeArr: ' + CircularJSON.stringify(data));
      if (!data || data.length == 0) {
        return;
      }
      if (this.isMapLoaded) {
        if (!data.allData) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].alias === 'shipingjiankon') {
              this.addorremoveShipinjiankongLayer(data[i]);
            }
          }
        } else {
          this.allData = data.allData;
          for (var i = 0; i < data.length; i++) {
            // 勾选
            if (data[i].checked === true) {
              this.currentLayersAlias.push(data[i].alias);
              if (data[i].alias === 'liangkeyiweijiance_hc' || data[i].alias === 'liangkeyiweijiance_kc') {
                var tablename = data[i].datasetname.substring(data[i].datasetname.indexOf(":") + 1);
                this.getLiangkeyiweijianceData(data[i].sql, tablename, data[i].alias, data[i].name, data[i].icon, data[i].currentType);
              } else {
                // 添加散点图
                this.addScatterLayerFromServer(data[i].url, data[i].alias, data[i].icon, data[i].datasetname, data[i].sql, data[i].name, data[i].typeName);
              }
            }
            // 取消
            else {
              for (var j = 0; j < this.currentLayersAlias.length; j++) {
                // console.log('this.fourColorLevel1: ' + CircularJSON.stringify(this.fourColorLevel1));
                if (this.currentLayersAlias[j] === data[i].alias) {
                  this.currentLayersAlias.splice(j, 1);
                  j--;
                }
              }
              this.removeLayer(data[i].alias + "_layer");
              if (data[i].alias === 'shuikushuiqingjiance' || data[i].alias === 'hedaoshuiqingjiance'
                || data[i].alias === 'dongtoushuikushuiqingjiance' || data[i].alias === 'dongtouhedaoshuiqingjiance'
                // || data[i].alias === 'yongjiashuikushuiqingjiance' || data[i].alias === 'yongjiahedaoshuiqingjiance'
                || data[i].alias === 'liangkeyiweijiance_hc' || data[i].alias === 'liangkeyiweijiance_kc') {
                this.removeLayer(data[i].alias + "_warn_layer");
              }
              // 移除高亮图层
              this.removeLayer("highlight_layer");
              // 移除图例
              for (var j = 0; j < this.legendAry.length; j++) {
                if (this.legendAry[j].des === data[i].name) {
                  this.legendAry.splice(j, 1);
                  j--;
                }
              }
              this.legendMsg = { "legendAry": this.legendAry };

              // 关闭tip框
              const el = document.querySelector('.mapboxgl-popup-close-button')
              if (el) {
                el.click()
              }
            }
          }
        }
      } else {
        var __this = this;
        var timer = setInterval(() => {
          if (__this.isMapLoaded) {
            clearInterval(timer);

            if (!data.allData) {
              for (var i = 0; i < data.length; i++) {
                if (data[i].alias === 'shipingjiankon') {
                  __this.addorremoveShipinjiankongLayer(data[i]);
                }
              }
            } else {
              __this.allData = data.allData;
              for (var i = 0; i < data.length; i++) {
                // 勾选
                if (data[i].checked === true) {
                  __this.currentLayersAlias.push(data[i].alias);
                  if (data[i].alias === 'liangkeyiweijiance_hc' || data[i].alias === 'liangkeyiweijiance_kc') {
                    var tablename = data[i].datasetname.substring(data[i].datasetname.indexOf(":") + 1);
                    __this.getLiangkeyiweijianceData(data[i].sql, tablename, data[i].alias, data[i].name, data[i].icon, data[i].currentType);
                  } else {
                    // 添加散点图
                    __this.addScatterLayerFromServer(data[i].url, data[i].alias, data[i].icon, data[i].datasetname, data[i].sql, data[i].name, data[i].typeName);
                  }
                }
                // 取消
                else {
                  for (var j = 0; j < __this.currentLayersAlias.length; j++) {
                    if (__this.currentLayersAlias[j] === data[i].alias) {
                      __this.currentLayersAlias.splice(j, 1);
                      j--;
                    }
                  }
                  __this.removeLayer(data[i].alias + "_layer");
                  if (data[i].alias === 'shuikushuiqingjiance' || data[i].alias === 'hedaoshuiqingjiance'
                    || data[i].alias === 'dongtoushuikushuiqingjiance' || data[i].alias === 'dongtouhedaoshuiqingjiance'
                    // || data[i].alias === 'yongjiashuikushuiqingjiance' || data[i].alias === 'yongjiahedaoshuiqingjiance'
                    || data[i].alias === 'liangkeyiweijiance_hc' || data[i].alias === 'liangkeyiweijiance_kc') {
                    __this.removeLayer(data[i].alias + "_warn_layer");
                  }
                  // 移除高亮图层
                  __this.removeLayer("highlight_layer");
                  // 移除图例
                  for (var j = 0; j < __this.legendAry.length; j++) {
                    if (__this.legendAry[j].des === data[i].name) {
                      __this.legendAry.splice(j, 1);
                      j--;
                    }
                  }
                  __this.legendMsg = { "legendAry": __this.legendAry };

                  // 关闭tip框
                  const el = document.querySelector('.mapboxgl-popup-close-button')
                  if (el) {
                    el.click()
                  }
                }
              }
            }
          }
        }, 200);
      }
    },
    currentMonitorType(data) {
      // console.log('currentMonitorTypedata: ' + CircularJSON.stringify(data))
      // console.log(this.weixins)
      if (this.isMapLoaded) {
        if (data.name === '地灾监测') {
          if (data.checked === true) {
            // 添加散点图
            this.addScatterLayerFromServer2(data);
          }
          // 取消
          else {
            for (var i = 0; i < URL_CONFIG.dizhizaihaijianceAry.length; i++) {
              var alias = URL_CONFIG.dizhizaihaijianceAry[i].alias;
              var name = URL_CONFIG.dizhizaihaijianceAry[i].name;
              //移除图层
              for (var j = 0; j < this.currentLayersAlias.length; j++) {
                if (this.currentLayersAlias[j] === alias) {
                  this.currentLayersAlias.splice(j, 1);
                  j--;
                }
              }
              this.removeLayer(alias + "_layer");
              // 移除高亮图层
              this.removeLayer("highlight_layer");
              // 移除图例
              for (var j = 0; j < this.legendAry.length; j++) {
                if (this.legendAry[j].des === name) {
                  this.legendAry.splice(j, 1);
                  j--;
                }
              }
              this.legendMsg = { "legendAry": this.legendAry };
            }
          }
        } else {
          this.allData = data.allData;
          // console.log("currentMonitorTypedata: " + CircularJSON.stringify(data));
          // 勾选
          // console.log(data)
          if (data.checked === true) {
            this.currentLayersAlias.push(data.alias);
            if (data.alias === 'yuchuanjiance') {
              var tablename = data.datasetname.substring(data.datasetname.indexOf(":") + 1);
              this.getYuchuanjianceData(data.sql, tablename, data.alias, data.name, data.icon);
            } else if ((data.alias === 'shuiliyuqingjiance' || data.alias === 'qixiangyuqingjiance') && this.userDistrict == '330328') {
              var type = 0;
              if (data.alias === 'shuiliyuqingjiance') {
                type = 0;
              } else if (data.alias === 'qixiangyuqingjiance') {
                type = 1;
              }
              this.getWcxYuqingjiancejianceData('', '', type, data.alias, data.name, data.icon);
            } else if (data.alias === 'shuiliyuqingjiance') {
              this.getShuiliYuqingjiancejianceData(data.alias, data.name, data.icon);
            } else {
              // 添加散点图
              this.addScatterLayerFromServer(data.url, data.alias, data.icon, data.datasetname, data.sql, data.name, data.typeName);
            }
          }
          // 取消
          else {
            for (var j = 0; j < this.currentLayersAlias.length; j++) {
              if (this.currentLayersAlias[j] === data.alias) {
                this.currentLayersAlias.splice(j, 1);
                j--;
              }
            }
            this.removeLayer(data.alias + "_layer");
            if (data.alias === 'shuikushuiqingjiance' || data.alias === 'hedaoshuiqingjiance'
                || data.alias === 'dongtoushuikushuiqingjiance' || data.alias === 'dongtouhedaoshuiqingjiance'
                // || data.alias === 'yongjiashuikushuiqingjiance' || data.alias === 'yongjiahedaoshuiqingjiance'
                || data.alias === 'liangkeyiweijiance_hc' || data.alias === 'liangkeyiweijiance_kc') {
              this.removeLayer(data.alias + "_warn_layer");
              if ((data.alias === 'shuikushuiqingjiance' || data.alias === 'hedaoshuiqingjiance') && this.userDistrict == '330328') {
                this.removeLayer(data.alias + "_notelayer");
              }
            }
            if ((data.alias === 'shuiliyuqingjiance' || data.alias === 'qixiangyuqingjiance') && this.userDistrict == '330328') {
              this.removeLayer(data.alias + "_notelayer");
            }
            if (data.alias === 'yuchuanjiance') {
              this.removeLayer(data.alias + "_1" + "_layer");
              this.removeLayer(data.alias + "_2" + "_layer");
              this.removeLayer(data.alias + "_3" + "_layer");
              this.removeLayer(data.alias + "_4" + "_layer");
              this.removeLayer(data.alias + "_5" + "_layer");
              this.removeLayer(data.alias + "_6" + "_layer");
              this.removeLayer(data.alias + "_7" + "_layer");
              this.removeLayer(data.alias + "_8" + "_layer");
            }
            // 移除高亮图层
            this.removeLayer("highlight_layer");
            // 移除图例
            for (var j = 0; j < this.legendAry.length; j++) {
              if (this.legendAry[j].des === data.name) {
                this.legendAry.splice(j, 1);
                j--;
              }
            }
            this.legendMsg = { "legendAry": this.legendAry };
            // 关闭tip框
            const el = document.querySelector('.mapboxgl-popup-close-button')
            if (el) {
              el.click()
            }
          }
        }
      } else {
        var __this = this;
        this.t = setInterval(() => {
          if (__this.isMapLoaded) {
            clearInterval(__this.t);
            __this.t = null;
            __this.allData = data.allData;
            // console.log("currentMonitorTypedata: " + CircularJSON.stringify(data));
            // 勾选
            // console.log(data)
            if (data.checked === true) {
              this.currentLayersAlias.push(data.alias);
              if (data.alias === 'yuchuanjiance') {
                var tablename = data.datasetname.substring(data.datasetname.indexOf(":") + 1);
                __this.getYuchuanjianceData(data.sql, tablename, data.alias, data.name, data.icon);
              } else if ((data.alias === 'shuiliyuqingjiance' || data.alias === 'qixiangyuqingjiance') && this.userDistrict == '330328') {
                var type = 0;
                if (data.alias === 'shuiliyuqingjiance') {
                  type = 0;
                } else if (data.alias === 'qixiangyuqingjiance') {
                  type = 1;
                }
                __this.getWcxYuqingjiancejianceData('', '', type, data.alias, data.name, data.icon);
              } else if (data.alias === 'shuiliyuqingjiance') {
                __this.getShuiliYuqingjiancejianceData(data.alias, data.name, data.icon);
              } else {
                // 添加散点图
                __this.addScatterLayerFromServer(data.url, data.alias, data.icon, data.datasetname, data.sql, data.name, data.typeName);
              }
            }
            // 取消
            else {
              for (var j = 0; j < __this.currentLayersAlias.length; j++) {
                if (__this.currentLayersAlias[j] === data.alias) {
                  __this.currentLayersAlias.splice(j, 1);
                  j--;
                }
              }
              __this.removeLayer(data.alias + "_layer");
              if (data.alias === 'shuikushuiqingjiance' || data.alias === 'hedaoshuiqingjiance'
                  || data.alias === 'dongtoushuikushuiqingjiance' || data.alias === 'dongtouhedaoshuiqingjiance'
                  // || data.alias === 'yongjiashuikushuiqingjiance' || data.alias === 'yongjiahedaoshuiqingjiance'
                  || data.alias === 'liangkeyiweijiance_hc' || data.alias === 'liangkeyiweijiance_kc') {
                __this.removeLayer(data.alias + "_warn_layer");
                if ((data.alias === 'shuikushuiqingjiance' || data.alias === 'hedaoshuiqingjiance') && __this.userDistrict == '330328') {
                  __this.removeLayer(data.alias + "_notelayer");
                }
              }
              if ((data.alias === 'shuiliyuqingjiance' || data.alias === 'qixiangyuqingjiance') && __this.userDistrict == '330328') {
                __this.removeLayer(data.alias + "_notelayer");
              }
              if (data.alias === 'yuchuanjiance') {
                __this.removeLayer(data.alias + "_1" + "_layer");
                __this.removeLayer(data.alias + "_2" + "_layer");
                __this.removeLayer(data.alias + "_3" + "_layer");
                __this.removeLayer(data.alias + "_4" + "_layer");
                __this.removeLayer(data.alias + "_5" + "_layer");
                __this.removeLayer(data.alias + "_6" + "_layer");
                __this.removeLayer(data.alias + "_7" + "_layer");
                __this.removeLayer(data.alias + "_8" + "_layer");
              }
              // 移除高亮图层
              __this.removeLayer("highlight_layer");
              // 移除图例
              for (var j = 0; j < __this.legendAry.length; j++) {
                if (__this.legendAry[j].des === data.name) {
                  __this.legendAry.splice(j, 1);
                  j--;
                }
              }
              __this.legendMsg = { "legendAry": __this.legendAry };

              // 关闭tip框
              const el = document.querySelector('.mapboxgl-popup-close-button')
              if (el) {
                el.click()
              }
            }
          }
        });
      }
    },
    specalPoint(data) {
      // console.log(data)
      // console.log("specalPointdata: " + JSON.stringify(data));
      var alias = data.alias;
      //预警信息
      if (data.alias == 'yujingxinxi') {
        var coordinates = [Number(data.LON), Number(data.LAT)];
        var description = this.createWarnPopup(data);
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
        return;
      }
      //实时潮位
      if (data.alias == 'shishishuichao') {
        var coordinates = [Number(data.longitude), Number(data.latitude)];
        var description = this.createChaoWeiPopup(data);
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
        this.loadEchartDataChaowei(data)
        return;
      }

      //其余情况
      var smid = data.smid;
      var location = data.location;
      if (alias === "" || !alias || smid === "" || !smid || location === "" || !location) {
        return;
      }
      var locationAry = location.split(",");
      if (locationAry[0].trim() === '' || locationAry[1].trim() === '') {
        return;
      }

      //加载图层
      this.$emit('chooseMenu', data);
      //缩放移动
      this.map.setZoom(14);
      var centerAry = [];
      centerAry[0] = Number(locationAry[0]);
      centerAry[1] = Number(locationAry[1]) + 0.01;
      this.map.flyTo({
        center: centerAry
      });
      //弹框
      if (data.time) {
        this.queryMonitorBySmid(alias, smid, locationAry[0], locationAry[1], data.timeType, data.time);
      } else {
        this.queryMonitorBySmid(alias, smid, locationAry[0], locationAry[1], data);
      }
    },
    specalPointGuanJianSheBei(data) {
      // console.log('specalPointGuanJianSheBeidata: ' + CircularJSON.stringify(data));
      //缩放移动
      this.map.setZoom(14);
      var centerAry = [];
      if (this.specalPointGuanJianSheBei.lon || this.specalPointGuanJianSheBei.longitude) {
        if (data.daxingguanjianshebeiType !== '卫星电话') {
          centerAry[0] = this.specalPointGuanJianSheBei.lon;
          centerAry[1] = this.specalPointGuanJianSheBei.lat;
        } else {
          centerAry[0] = this.specalPointGuanJianSheBei.longitude;
          centerAry[1] = this.specalPointGuanJianSheBei.latitude;
        }
        this.map.flyTo({
          center: centerAry
        });
        //高亮
        if (this.selectImgMarker !== '') {
          this.selectImgMarker.remove();
        }
        if (data.daxingguanjianshebeiType === '单兵设备') {
          const selectEl = document.createElement('div');
          selectEl.className = 'marker';
          var selectUrl = require('./images/she-select.png');
          selectEl.innerHTML = `<img src = ${selectUrl} width="30px" height="30px">`;
          this.selectImgMarker = new mapboxgl.Marker(selectEl).setLngLat(centerAry).addTo(this.map);
        }
      }
      // console.log(this.specalPointGuanJianSheBei)

      //弹框
      if (data.daxingguanjianshebeiType !== '卫星电话' && data.online &&  data.online.slice(0,1)==='是') {
        this.addVideoHtmlPopup(data, data.daxingguanjianshebeiType);
      } else if (data.daxingguanjianshebeiType === '卫星电话') {
        this.addWXHtmlPopup(data);
      }
    },
    // 视频监控点击详情
    // cameraOne(data) {
    //   // console.log('cameraOnedata:' + CircularJSON.stringify(data));
    //   //缩放移动
    //   this.map.setZoom(14);
    //   if (data.longitude === null || data.longitude === '' || data.latitude === null || data.latitude === '') {
    //     // this.queryCameraBySmid2(data.video_url, data);
    //     this.videoUrl = data.video_url;
    //     this.cameraName = data.name;
    //     this.shipianjiankongPopup = true;
    //     return;
    //   }
    //   var centerAry = [];
    //   centerAry[0] = Number(data.longitude);
    //   centerAry[1] = Number(data.latitude) + 0.01;
    //   this.map.flyTo({
    //     center: centerAry
    //   });
    //   //弹框
    //   this.queryCameraBySmid(data.video_url, data.longitude, data.latitude, data);
    // }
  },
  data() {
    return {
      map: null,
      collapse1: false,
      userDistrict: '',
      districtName: '',
      popName: '',
      t: null,
      measureMsg: '',
      legendMsg: {},
      legendAry: [],
      legendMsg2: {},
      legendMsg3: {},
      legendAry2: [],
      legendAry3: [],
      juheLayer: {},
      fourColorLayer: {},
      isSpatialQuery: false,
      videoLevel1Id: '',
      spatialQueryDataset: '',
      spatialQueryUrl: '',
      spatialQueryAlias: '',
      spatialQuerySql: '',
      dataUrl: '',
      // getBlurNames: {
      //   data: [],
      //   t: '监测预警'
      // },
      districtData: {},
      streetData: {},
      showAroundRequestParam: {},
      previousDrawEvents: {},
      currentScatterLayers: [],
      selectedDistrict: '',
      selectedStreet: '',
      showSwicthMenu: false,
      basemapTiles: '',
      isMapLoaded: false,
      streetJson: {},
      aroundAliasAry: [],
      lastMapType: '',
      allData: {},
      loadedLayer: [],
      weatherIndex: -1, // 天气预测的下标
      markerArray: [],
      path: 'ws://112.74.167.167:1337/loc',
      // dbPath: 'ws://192.168.1.52:9000/imserver/',
      // dbPath: 'ws://'+window.location.host+'/imserver/',
      dbPath: 'ws://192.168.1.45:9000/imserver/',
      // dbPath: 'ws://10.10.0.6:9000/imserver/',
      // dbPath: 'ws://192.168.3.11:9000/imserver/',
      socket: {},
      socket1: {},
      socket2: null,
      type: '',
      danbing: [],
      bukong: [],
      wurenji: [],
      weixins: [],
      wxArray: [],
      danbingArray: {
        '卫星电话': [],
        '单兵设备': [],
        '布控球': [],
        '无人机': []
      },
      danbingList: {
        '卫星电话': [],
        '单兵设备': [],
        '布控球': [],
        '无人机': []
      },
      control: {
        单兵设备: false,
        卫星电话: false,
        布控球: false,
        无人机: false
      },
      timer: null,
      danbingLength: 0,
      weixinLength: 0,
      bukongLength: 0,
      wurenLength: 0,
      danbing_point1: {
        name: '单兵设备(2403)',
        lon: 120.68438067,
        lat: 28.0084796,
        url: 'rtmp://10.37.253.38:1935/domain=31000000002000000000&resource=31000000001320000012-0&quality=2&src=0'
      },
      danbing_point2: {
        name: '单兵设备(2400)',
        lon: 120.68417422,
        lat: 28.0083784,
        url: 'rtmp://10.37.253.38:1935/domain=31000000002000000000&resource=31000000001320000071-0&quality=2&src=0'
      },
      startFlag: false,
      currentLayersAlias: [],
      qixiangxinxiAry: [],
      specalPointGuanJianSheBei: {},
      currentDistrictBoundary: '',
      currentStreetBoundary: '',
      dialogVisible: false, // 视频框
      shipianjiankongPopup: false,
      dialInner: '拨号', // 拨号文本
      dialUrl: '', // 拨号地址
      videoUrl: '', // 播放地址
      title: '',
      type: '',
      chargeName: '',
      chargePhone: '',
      type: '',
      cameraName: '',
      selectImgMarker: '',
      selectWXDHMarker: '',
      timer2: null,
      dateTime1: null,
      dateTime2: null,
      videoAliasAry: []
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.timer2)
    this.timer2 = null
    if (this.socket2) {
      this.socket2.close()
      this.socket2 = null
    }
  },
  mounted() {
    // console.log(laydate)
    this.$bus.$on('spaceSearch', (data) => {
      // console.log('spaceSearchData: ' + CircularJSON.stringify(data))
      if (data.isChecked) {
        this.videoLevel1Id = data.id;
        this.isSpatialQuery = true;
        document.getElementsByClassName('mapbox-gl-draw_polygon')[0].click();
      } else {
        this.isSpatialQuery = false;
        this.removeLayer("drawPolygon_layer");
      }
    })
    // 监听全选图层
    this.$bus.$on('changeShow', (data) => {
      this.isShow = data
      if (!this.isMapLoaded) return
      if (data) {
        for (const n in this.danbingArray) {
          this.control[n] = true
          this.danbingArray[n].forEach(item => {
            item.remove()
          })
        }
        this.danbing.forEach(val => {
          this.addVideoHtml(val, '单兵设备')
          // this.addYingjiguanjianshebeiScatterLayer(val, '单兵设备');
        })
        for (var index in this.weixins) {
          if (this.weixins[index].Uid !== 0) {
            this.addWXHtml(this.weixins[index])
          }
        }
        this.bukongqiu.forEach(val => {
          this.addVideoHtml(val, '布控球')
          // this.addYingjiguanjianshebeiScatterLayer(val, '布控球');
        })
        this.wurenji.forEach(val => {
          this.addVideoHtml(val, '无人机')
          // this.addYingjiguanjianshebeiScatterLayer(val, '无人机');
        })
      } else {
        for (const n in this.danbingArray) {
          this.danbingArray[n].forEach(item => {
            item.remove()
          })
        }
      }
    })
    // 大型关键设备监听
    this.$bus.$on('infoOfDaxing', (data) => {
      // console.log('infoOfDaxingData: ' + CircularJSON.stringify(data))
      // this.socket1.send(JSON.stringify('单兵设备'))
      this.control = data
      // console.log(data)
      for (const n in data) {
        this.loadDanbing(n, data[n])
      }
    })
    var me = this;
    window.showFullVideo = function(url) {
      me.$emit('showFullVideo', url);
    }
    window.shuizhaSearch = (smid, name, longitude, latitude, startTime, endTime) => {
      // return false
      // let startTime = this.DateToString(this.dateTime1)
      // let endTime = this.DateToString(this.dateTime2)
      const res = {
        smid,
        name,
        startTime,
        endTime
      }
      console.log(startTime)
      getWaterGateDetailBySmid(smid, startTime, endTime).then(data => {
        this.addShuizhajianceTipHtml(data, longitude, latitude, res);
      })
    }
    window.shuizhaTab = (type) => {
      let num = Number(type)
      console.log(document.querySelectorAll('#map .pop-tip-jianceyujing .types div')[num])
      document.querySelectorAll('#map .pop-tip-jianceyujing .types div').forEach((val, index) => {
        // val.getAttribute("class").replace("type-item","")
        val.classList.remove("type-item")
        if (index === num) val.classList.add("type-item")
      })
      // document.querySelectorAll('#map .pop-tip-jianceyujing .types div')[num].add("type-item")
      this.loadEchartDataShuizha(this.shuizhaDetail, num)
    }
    window.dial = (data) => {
      if (this.socket2) {
        this.socket2.close()
        this.socket2 = null
      }
      document.getElementsByClassName('dial').forEach(el => {
        el.innerHTML = '通话中'
      })
      this.socket2 = new WebSocket(data)
      this.socket2.onmessage = this.getMessage2
    }
    window.hangUp = () => {
      document.getElementsByClassName('dial').forEach(el => {
        el.innerHTML = '拨号'
      })
      this.socket2.close()
      this.socket2 = null
    }
    window.toline = function(item) {
      me.type = '2'
      var timestamp = Math.round(new Date().getTime() / 1000)
      var pre_timestamp = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000)
      const rdata = {
        'Code': 20003,
        'Data': { 'Uid': Number(item), 'StartTime': pre_timestamp.toString(), 'EndTime': timestamp.toString() }
      }
      me.socket.send(JSON.stringify(rdata))
    }

    this.districtName = this.userInfo.districtName;
    // console.log('this.districtName: ' + this.districtName);
    for (var i = 0; i < URL_CONFIG.districtBoundary.length; i++) {
      if (this.districtName === URL_CONFIG.districtBoundary[i].name) {
        this.currentDistrictBoundary = URL_CONFIG.districtBoundary[i].tiles;
        break;
      }
    }
    for (var i = 0; i < URL_CONFIG.streetBoundary.length; i++) {
      if (this.districtName === URL_CONFIG.streetBoundary[i].name) {
        this.currentStreetBoundary = URL_CONFIG.streetBoundary[i].tiles;
        break;
      }
    }
    this.createBaseMap();
    this.userDistrict = this.userInfo.district;
    if (this.userDistrict != '3303') {
      // this.map.setZoom(10);
      if ('瑞安市' === this.districtName) {
        this.map.setZoom(10.2);
      } else if ('鹿城区' === this.districtName) {
        this.map.setZoom(10.8);
      } else if ('龙港市' === this.districtName) {
        this.map.setZoom(11);
      } else if ('龙湾区' === this.districtName) {
        this.map.setZoom(11.2);
      } else if ('经开区' === this.districtName) {
        this.map.setZoom(12);
      } else if ('瓯江口' === this.districtName) {
        this.map.setZoom(12.2);
      } else if ('永嘉县' === this.districtName) {
        this.map.setZoom(10.1);
      } else if ('瓯海区' === this.districtName || '洞头区' === this.districtName || '文成县' === this.districtName) {
        this.map.setZoom(10.5);
      } else {
        this.map.setZoom(10);
      }
      var districtCenter = [];
      for (var i = 0; i < getDistrictData.features.length; i++) {
        if (this.districtName === getDistrictData.features[i].properties.NAME) {
          districtCenter = getDistrictData.features[i].geometry.coordinates;
          break;
        }
      }
      if (districtCenter && districtCenter !== []) {
        // 地图移动到对应区县的中心点
        this.map.flyTo({
          center: districtCenter
        });
      }
    }
    this.$bus.on("close", (val) => {
      if (this.map.getLayer('weather1')) this.map.removeLayer('weather1');
      if (this.map.getLayer('weather3')) this.map.removeLayer('weather3');
      if (this.map.getLayer('weather6')) this.map.removeLayer('weather6');
      if (this.map.getSource('map_style1')) this.map.removeSource('map_style1');
      if (this.map.getSource('map_style3')) this.map.removeSource('map_style3');
      if (this.map.getSource('map_style6')) this.map.removeSource('map_style6');
    })
    this.$bus.on("valueDelete", (val) => {
      var mapSource, id;
      // console.log('val: ' + val);
      // console.log('this.iOne: ' + this.iOne);
      if (val === 1) {
        //勾选
        if (this.weatherIndex !== val) {
          this.weatherIndex = val
          if (this.map.getLayer('weather3')) this.map.removeLayer('weather3');
          if (this.map.getLayer('weather6')) this.map.removeLayer('weather6');
          if (this.map.getSource('map_style3')) this.map.removeSource('map_style3');
          if (this.map.getSource('map_style6')) this.map.removeSource('map_style6');
          if (this.map.getLayer('duanshilinjinyubao_layer')) this.map.removeLayer('duanshilinjinyubao_layer');
          this.map.addSource("map_style1", {
            "type": "raster",
            "tiles": [URL_CONFIG.METEOROLOGICAL_GRID_1HOUR],
            "tileSize": 256,
            "rasterSource": 'iserver'
          });
          this.map.addLayer({
            "id": "weather1",
            "type": "raster",
            "source": "map_style1"
          });
          //显示图例
          this.legendAry2 = [];
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/purple.png', "des": '≥ 50' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/pink.png', "des": '40 ~ 50' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/blue.png', "des": '30 ~ 40' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-blue.png', "des": '20 ~ 30' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/green.png', "des": '10 ~ 20' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-green.png', "des": '0.1 ~ 10' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/white.png', "des": '≤ 0.1' });
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
        //取消勾选
        else {
          this.weatherIndex = -1
          if (this.map.getLayer('weather1')) this.map.removeLayer('weather1');
          if (this.map.getSource('map_style1')) this.map.removeSource('map_style1');
          //隐藏图例
          this.legendAry2 = [];
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
      } else if (val === 3) {
        //勾选
        if (this.weatherIndex !== val) {
          this.weatherIndex = val;
          if (this.map.getLayer('weather1')) this.map.removeLayer('weather1');
          if (this.map.getLayer('weather6')) this.map.removeLayer('weather6');
          if (this.map.getSource('map_style1')) this.map.removeSource('map_style1');
          if (this.map.getSource('map_style6')) this.map.removeSource('map_style6');
          if (this.map.getLayer('duanshilinjinyubao_layer')) this.map.removeLayer('duanshilinjinyubao_layer');
          this.map.addSource("map_style3", {
            "type": "raster",
            "tiles": [URL_CONFIG.METEOROLOGICAL_GRID_3HOUR],
            "tileSize": 256,
            "rasterSource": 'iserver'
          });
          this.map.addLayer({
            "id": "weather3",
            "type": "raster",
            "source": "map_style3"
          });
          //显示图例
          this.legendAry2 = [];
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/purple.png', "des": '≥ 70' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/pink.png', "des": '50 ~ 70' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/blue.png', "des": '20 ~ 50' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-blue.png', "des": '10 ~ 20' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/green.png', "des": '3 ~ 10' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-green.png', "des": '0.1 ~ 3' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/white.png', "des": '≤ 0.1' });
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
        //取消勾选
        else {
          this.weatherIndex = -1
          if (this.map.getLayer('weather3')) this.map.removeLayer('weather3');
          if (this.map.getSource('map_style3')) this.map.removeSource('map_style3');
          //隐藏图例
          this.legendAry2 = [];
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
      } else if (val === 6) {
        //勾选
        if (this.weatherIndex !== val) {
          this.weatherIndex = val
          if (this.map.getLayer('weather3')) this.map.removeLayer('weather3');
          if (this.map.getLayer('weather1')) this.map.removeLayer('weather1');
          if (this.map.getSource('map_style3')) this.map.removeSource('map_style3');
          if (this.map.getSource('map_style1')) this.map.removeSource('map_style1');
          if (this.map.getLayer('duanshilinjinyubao_layer')) this.map.removeLayer('duanshilinjinyubao_layer');
          this.map.addSource("map_style6", {
            "type": "raster",
            "tiles": [URL_CONFIG.METEOROLOGICAL_GRID_6HOUR],
            "tileSize": 256,
            "rasterSource": 'iserver'
          });
          this.map.addLayer({
            "id": "weather6",
            "type": "raster",
            "source": "map_style6"
          });
          //显示图例
          this.legendAry2 = [];
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/purple.png', "des": '≥ 120' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/pink.png', "des": '60 ~ 120' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/blue.png', "des": '25 ~ 60' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-blue.png', "des": '13 ~ 25' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/green.png', "des": '4 ~ 13' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/light-green.png', "des": '0.1 ~ 4' });
          this.legendAry2.push({ "icon": './static/gitimage/jianceyujing/white.png', "des": '≤ 0.1' });
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
        //取消勾选
        else {
          this.weatherIndex = -1
          if (this.map.getLayer('weather6')) this.map.removeLayer('weather6');
          if (this.map.getSource('map_style6')) this.map.removeSource('map_style6');
          //隐藏图例
          this.legendAry2 = [];
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
      } else if (val === 0) {
        //勾选
        if (this.weatherIndex !== val) {
          this.weatherIndex = val;
          if (this.map.getLayer('weather1')) this.map.removeLayer('weather1');
          if (this.map.getLayer('weather3')) this.map.removeLayer('weather3');
          if (this.map.getLayer('weather6')) this.map.removeLayer('weather6');
          if (this.map.getSource('map_style1')) this.map.removeSource('map_style1');
          if (this.map.getSource('map_style3')) this.map.removeSource('map_style3');
          if (this.map.getSource('map_style6')) this.map.removeSource('map_style6');
          var __this = this;
          getServiceUrl().then(res => {
            // console.log('res: ' + CircularJSON.stringify(res));
            // var url = res.substring(0, res.indexOf("Weather_RainFall")+16);
            var url = res.substring(0, res.indexOf(".ijs#"));
            // var url = res;
            // console.log('url: ' + url);
            if (__this.map.getLayer("duanshilinjinyubao_layer")) {
              __this.map.removeLayer("duanshilinjinyubao_layer");
            }
            if (__this.map.getSource("duanshilinjinyubao_source")) {
              __this.map.removeSource("duanshilinjinyubao_source");
            }
            __this.map.addSource("duanshilinjinyubao_source", {
              "type": "raster",
              "tiles": [url],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "duanshilinjinyubao_layer",
              "type": "raster",
              "source": "duanshilinjinyubao_source"
            });
          });
          //隐藏图例
          this.legendAry2 = [];
          this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
        //取消勾选
        else {
          this.weatherIndex = -1
          if (this.map.getLayer("duanshilinjinyubao_layer")) {
            this.map.removeLayer("duanshilinjinyubao_layer");
          }
          // //隐藏图例
          // this.legendAry2 = [];
          // this.legendMsg2 = { "legendAry": this.legendAry2 };
        }
      }
    })
    this.$bus.on("valueDeleteRain", (val) => {
      // console.log(val)
      // console.log('val: ' + CircularJSON.stringify(val));
      if (val.checked) {
        if (this.map.getLayer("rainfallDistribution_layer")) {
          this.map.removeLayer("rainfallDistribution_layer");
        }
        if (this.map.getSource("rainfallDistribution_source")) {
          this.map.removeSource("rainfallDistribution_source");
        }
        this.map.addSource("rainfallDistribution_source", {
          "type": "image",
          "url": val.img,
          "coordinates": [
            [119.54, 28.78],
            [121.36, 28.78],
            [121.36, 26.89],
            [119.54, 26.89]
          ]
        });
        this.map.addLayer({
          "id": "rainfallDistribution_layer",
          "type": "raster",
          "source": "rainfallDistribution_source",
          "paint": {
            'raster-opacity': 0.4
          }
        });
        // 添加图例
        this.legendAry2 = [];
        this.legendAry2.push({ "icon": '', "des": '降雨毫米' });
        this.legendAry2.push({ "icon": './static/gitimage/add/purple.png', "des": '70' });
        this.legendAry2.push({ "icon": './static/gitimage/add/pink.png', "des": '50' });
        this.legendAry2.push({ "icon": './static/gitimage/add/blue.png', "des": '20' });
        this.legendAry2.push({ "icon": './static/gitimage/add/light-blue.png', "des": '10' });
        this.legendAry2.push({ "icon": './static/gitimage/add/green.png', "des": '3' });
        this.legendAry2.push({ "icon": './static/gitimage/add/light-green.png', "des": '1' });
        this.legendAry2.push({ "icon": './static/gitimage/add/white.png', "des": '0' });
        this.legendMsg2 = { "legendAry": this.legendAry2 };
      } else {
        // console.log(this.map.getLayer('rainfallDistribution_layer'))
        if (this.map.getLayer('rainfallDistribution_layer')) {
          this.map.removeLayer('rainfallDistribution_layer');
        }
        // 移除图例
        this.legendAry2 = [];
        this.legendMsg2 = { "legendAry": this.legendAry2 };
      }
    })
    this.$bus.on("weixingyuntu", (val) => {
      // console.log('val: ' + CircularJSON.stringify(val));
      // val[0].url;
      if (val.checked) {
        if (this.map.getLayer("weixingyuntu_layer")) {
          this.map.removeLayer("weixingyuntu_layer");
        }
        if (this.map.getSource("weixingyuntu_source")) {
          this.map.removeSource("weixingyuntu_source");
        }
        this.map.addSource("weixingyuntu_source", {
          "type": "image",
          "url": val.url,
          "coordinates": [
            [119.54, 28.78],
            [121.36, 28.78],
            [121.36, 26.89],
            [119.54, 26.89]
          ]
        });
        this.map.addLayer({
          "id": "weixingyuntu_layer",
          "type": "raster",
          "source": "weixingyuntu_source"
        });
      } else {
        if (this.map.getLayer('weixingyuntu_layer')) {
          this.map.removeLayer('weixingyuntu_layer');
        }
      }
    })
    this.$bus.on('addTyphoonLegend', (val) => {
      // console.log('val: ' + CircularJSON.stringify(val))
      if (!val) {
        this.legendAry3 = [];
        this.legendAry3.push({ "icon": '', "des": '等级' });
        this.legendAry3.push({ "icon": './static/gitimage/add/rddy.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/rdfb.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/qrdfb.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/tf.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/qtf.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/cqtf.png', "des": '' });
        this.legendAry3.push({ "icon": '', "des": '警戒线' });
        this.legendAry3.push({ "icon": './static/gitimage/add/24jjx.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/48jjx.png', "des": '' });
        this.legendAry3.push({ "icon": '', "des": '风圈' });
        this.legendAry3.push({ "icon": './static/gitimage/add/7jfq.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/10jfq.png', "des": '' });
        this.legendAry3.push({ "icon": './static/gitimage/add/12jfq.png', "des": '' });
        this.legendMsg3 = { "legendAry": this.legendAry3 };
      } else {
        this.legendAry3.push({ "icon": '', "des": '预报台' });
        for(var i=0;i<val.length;i++) {
          this.legendAry3.push({ "icon": val[i].icon, "des": val[i].district });
        }
        this.legendMsg3 = { "legendAry": this.legendAry3 };
      }
    })
    this.$bus.on('clearTyphoonLegend', (val) => {
      this.legendAry3 = [];
      this.legendMsg3 = { "legendAry": this.legendAry3 };
    })
    this.$bus.$on('cameraOne', (data) => {
      // console.log('cameraOnedata:' + CircularJSON.stringify(data));
      //缩放移动
      this.map.setZoom(14);
      if (data.longitude === null || data.longitude === '' || data.latitude === null || data.latitude === '') {
        // this.queryCameraBySmid2(data.video_url, data);
        this.videoUrl = data.videoUrl;
        this.cameraName = data.name;
        this.shipianjiankongPopup = true;
        return;
      }
      var centerAry = [];
      centerAry[0] = Number(data.longitude);
      centerAry[1] = Number(data.latitude) + 0.01;
      this.map.flyTo({
        center: centerAry
      });
      //弹框
      this.queryCameraBySmid(data.videoUrl, data.longitude, data.latitude, data);
    })
    this.getInfo()
    this.timer2 = setInterval(() => {
      this.getInfo()
    }, 30000)
  },
  methods: {
    ...mapActions('warning', [
      'SetMapLoaded',
      'SetDanbingList'
    ]),
    // 拨号
    dial() {
      if (this.socket2) {
        this.socket2.close()
        this.socket2 = null
      }
      // console.log(this.dialUrl)
      this.dialInner = '通话中'
      this.socket2 = new WebSocket(this.dialUrl)
      this.socket2.onmessage = this.getMessage2
    },
    // 挂断
    hangUp() {
      this.dialInner = '拨号'
      if (this.socket2) {
        this.socket2.close()
        this.socket2 = null
      }
    },
    //单类的勾选
    loadDanbing(name, status) {
      // console.log('name: ' + name  + ', status: ' + status)
      switch (name) {
        case '卫星电话':
          if (status) {
            this.danbingArray['卫星电话'].forEach(item => {
              item.remove()
            })
            for (var index in this.danbingList['卫星电话']) {
              if (this.danbingList['卫星电话'][index].latitude) {
                this.addWXHtml(this.danbingList['卫星电话'][index])
              }
            }
            console.log('添加')
            // 添加图例
            for (var j = 0; j < this.legendAry.length; j++) {
              if (this.legendAry[j].des === '卫星电话') {
                this.legendAry.splice(j, 1);
                j--;
              }
            }
            this.legendAry.push({ "icon": './static/gitimage/jianceyujing/wxdh-normal.png', "des": '卫星电话' });
            this.legendMsg = { "legendAry": this.legendAry };
          } else {
            this.danbingArray['卫星电话'].forEach(item => {
              item.remove()
            })
            if (this.selectWXDHMarker !== '') {
              this.selectWXDHMarker.remove()
            }
            // 移除图例
            for (var j = 0; j < this.legendAry.length; j++) {
              if (this.legendAry[j].des === '卫星电话') {
                this.legendAry.splice(j, 1);
                j--;
              }
            }
            this.legendMsg = { "legendAry": this.legendAry };
            // 关闭tip框
            const el = document.querySelector('.yingjiguanjianshebei')
            if (el) {
              console.log(el.parentNode.firstChild)
            }
            console.log(el)
            if (el) {
              el.parentNode.firstChild.click()
            }
          }
          break
        default:
          if (status) {
            this.danbingArray[name].forEach(item => {
              item.remove()
            })
            this.danbingList[name].forEach(val => {
              this.addVideoHtml(val, name);
              // this.addYingjiguanjianshebeiScatterLayer(val, name);
            })
            // 添加图例
            for (var j = 0; j < this.legendAry.length; j++) {
              if (this.legendAry[j].des === name) {
                this.legendAry.splice(j, 1);
                j--;
              }
            }
            if (name === '布控球') {
              this.legendAry.push({ "icon": './static/gitimage/jianceyujing/bkq-map.png', "des": name });
            } else if (name === '无人机') {
              this.legendAry.push({ "icon": './static/gitimage/jianceyujing/wrj-map.png', "des": name });
            } else {
              this.legendAry.push({ "icon": './static/gitimage/jianceyujing/she.png', "des": name });
            }
            this.legendMsg = { "legendAry": this.legendAry };
          } else {
            this.danbingArray[name].forEach(item => {
              item.remove()
            })
            if (name === '单兵设备' && this.selectImgMarker !== '') {
              this.selectImgMarker.remove()
            }
            // 移除图例
            for (var j = 0; j < this.legendAry.length; j++) {
              if (this.legendAry[j].des === name) {
                this.legendAry.splice(j, 1);
                j--;
              }
            }
            this.legendMsg = { "legendAry": this.legendAry };
            // 关闭tip框
            const el = document.querySelector('.yingjiguanjianshebei')
            if (el) {
              el.parentNode.firstChild.click()
            }
          }
      }
    },
    websoket() {
      if (typeof WebSocket === 'undefined') {
        console.log('您的浏览器不支持socket')
      } else {
        // 实例化socket
        // this.socket = new WebSocket(this.path)
        this.socket1 = new WebSocket(this.dbPath + '1')
        // this.socket2 = new WebSocket(this.dbPath + '101')
        this.socket1.onopen = this.open
        // this.socket2.onopen = this.open
        // 监听socket连接
        // this.socket.onopen = this.open
        this.socket1.onopen = this.open1
        // 监听socket错误信息
        // this.socket.onerror = this.error
        // 监听socket消息
        // this.socket.onmessage = this.getMessage
        this.socket1.onmessage = this.getMessage1
        // this.socket2.onmessage = this.getMessage2
      }
    },
    open() {
      console.log('socket连接成功')
      this.type = '0'
      const data = { 'Code': 20000, 'Data': { 'LoginName': 'wxzhouddy', 'Password': '123456' } }
      this.socket.send(JSON.stringify(data))
    },
    open1() {
      this.socket1.send(JSON.stringify('单兵设备'))
    },
    error() {
      console.log('socket连接错误')
    },
    // 单兵设备、布控、无人机
    getInfo() {
      getIndividualData().then(res => {
        // console.log(res)
        if (document.getElementsByClassName('pop-tip-title')[0]) {
          this.popName = document.getElementsByClassName('pop-tip-title')[0].innerHTML
          // console.log(document.getElementsByClassName('pop-tip-title')[0].innerHTML)
        }
        var obj = res
        let list1 = []
        let list2 = [] // 布控
        let list3 = [] // 无人机
        this.danbingLength = 0
        this.bukongLength = 0
        this.wurenLength = 0
        obj.forEach(val => {
          // if (val.info) {
          let isOnline = '否'
          if (val.url0 && val.latitude) {
            isOnline = '是'
          }
          if (val.url0 && !val.latitude) {
            isOnline = '是（无定位）'
          }
          if (!val.url0 && val.latitude) {
            isOnline = '否'
          }
          if (!val.url0 && !val.latitude) {
            isOnline = '-'
          }
          if (val.type === '1') {
            this.bukongLength += 1
            list2.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: isOnline,
              lat: val.latitude,
              lon: val.longitude,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID
              }
            })
          } else if (val.type === '2') {
            this.wurenLength += 1
            list3.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: isOnline,
              lat: val.latitude,
              lon: val.longitude,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID
              }
            })
          } else {
            this.danbingLength += 1
            list1.push({
              data: val,
              deviceGroupName: val.deviceGroupName,
              name: val.name,
              url: val.url0 ? val.url0.m_szUrl : '',
              online: isOnline,
              lat: val.latitude,
              lon: val.longitude,
              phoneInfo: {
                deviceID: val.deviceID,
                domainID: val.domainID
              }
            })
          }
          // }
        })
        this.$emit('length', {
          danbing: this.danbingLength,
          bukongqiu: this.bukongLength,
          wurenji: this.wurenLength,
        })
        this.danbing = list1
        this.bukongqiu = list2
        this.wurenji = list3
        this.danbingList = {
          '卫星电话': this.danbingList['卫星电话'],
          '单兵设备': list1,
          '布控球': list2,
          '无人机': list3
        }
        for (const i in this.danbingList) {
          this.danbingList[i] = this.danbingList[i].sort(
            function compareFunction(param1, param2) {
              if (param1.online && param2.online) {
                if (param1.lat && param2.lat) return 1
                if (param1.lat && !param2.lat) return -1
                if (!param1.lat && param2.lat) return 1
              } else if (param1.online && !param2.online) {
                return -1
              } else if (!param1.online && param2.online) {
                return 1
              } else {
                if (param1.lat && param2.lat) return 1
                if (param1.lat && !param2.lat) return -1
                if (!param1.lat && param2.lat) return 1
              }
            }
          )
        }
        this.SetDanbingList(JSON.parse(JSON.stringify(this.danbingList)))
        for (const n in this.control) {
          this.loadDanbing(n, this.control[n])
        }
        // this.danbing_point1.lon = obj.info.longitude
        // this.danbing_point1.lat = obj.info.latitude
        if (this.startFlag) {
          this.startFlag = false
        }
      })
      getSatellitePhone().then(res => {
        this.danbingList['卫星电话'] = res.map(val => {
          if (val.isOnline) {
            val.isOnline = '是'
          } else {
            val.isOnline = '否'
          }
          return val
        })
        // console.log(this.danbingList['卫星电话'])
        this.SetDanbingList(JSON.parse(JSON.stringify(this.danbingList)))
        this.$emit('length', { weixin: this.danbingList['卫星电话'].length })
      })
    },
    // 单兵设备、布控、无人机
    getMessage1(msg) {
      return
      // console.log('100***' + msg.data)
      if (msg.data !== '连接成功') {
        var obj = JSON.parse(msg.data)
        let list1 = []
        let list2 = [] // 布控
        let list3 = [] // 无人机
        this.danbingLength = 0
        this.bukongLength = 0
        this.wurenLength = 0
        obj.forEach(val => {
          if (val.info) {
            if (val.name.indexOf('布控') >= 0) {
              this.bukongLength += 1
              list2.push({
                data: val,
                deviceGroupName: val.deviceGroupName,
                name: val.name,
                url: val.url0 ? val.url0.m_szUrl : '',
                online: val.url0 ? true : false,
                lat: val.info.latitude,
                lon: val.info.longitude,
                phoneInfo: {
                  deviceID: val.deviceInfo ? val.deviceInfo.deviceID : '',
                  domainID: val.deviceInfo ? val.deviceInfo.domainID : '',
                  nChn: val.deviceInfo ? val.deviceInfo.nChn : 0,
                  nSrc: val.deviceInfo ? val.deviceInfo.nSrc : 0
                }
              })
            } else if (val.name.indexOf('无人') >= 0) {
              this.wurenLength += 1
              list3.push({
                data: val,
                deviceGroupName: val.deviceGroupName,
                name: val.name,
                url: val.url0 ? val.url0.m_szUrl : '',
                online: val.url0 ? true : false,
                lat: val.info.latitude,
                lon: val.info.longitude,
                phoneInfo: {
                  deviceID: val.deviceInfo ? val.deviceInfo.deviceID : '',
                  domainID: val.deviceInfo ? val.deviceInfo.domainID : '',
                  nChn: val.deviceInfo ? val.deviceInfo.nChn : 0,
                  nSrc: val.deviceInfo ? val.deviceInfo.nSrc : 0
                }
              })
            } else {
              this.danbingLength += 1
              list1.push({
                data: val,
                deviceGroupName: val.deviceGroupName,
                name: val.name,
                url: val.url0 ? val.url0.m_szUrl : '',
                online: val.url0 ? true : false,
                lat: val.info.latitude,
                lon: val.info.longitude,
                phoneInfo: {
                  deviceID: val.deviceInfo ? val.deviceInfo.deviceID : '',
                  domainID: val.deviceInfo ? val.deviceInfo.domainID : '',
                  nChn: val.deviceInfo ? val.deviceInfo.nChn : 0,
                  nSrc: val.deviceInfo ? val.deviceInfo.nSrc : 0
                }
              })
            }
          }
        })
        this.$emit('length', {
          danbing: this.danbingLength,
          bukongqiu: this.bukongLength,
          wurenji: this.wurenLength,
        })
        this.danbing = list1
        this.bukongqiu = list2
        this.wurenji = list3
        this.danbingList = {
          '卫星电话': this.danbingList['卫星电话'],
          '单兵设备': list1,
          '布控球': list2,
          '无人机': list3
        }
        this.$emit('videoList', this.danbingList)
        this.SetDanbingList(JSON.parse(JSON.stringify(this.danbingList)))
        // console.log(this.danbingList)
        for (const n in this.control) {
          this.loadDanbing(n, this.control[n])
        }
        // this.danbing_point1.lon = obj.info.longitude
        // this.danbing_point1.lat = obj.info.latitude
        if (this.startFlag) {
          this.startFlag = false
        }
      }
    },
    getMessage2(msg) {
      // console.log('101***' + msg.data)
      // console.log(msg)
      document.getElementsByClassName('dial').forEach(el => {
        el.innerHTML = '拨号成功'
      })
    },
    getMessage(msg) {
      // console.log(msg.data)
      if (this.type === '0') {
        this.type = '1'
        const data = { 'Code': 20002 }
        this.socket.send(JSON.stringify(data))
      } else if (this.type === '1') {
        var obj = JSON.parse(msg.data)
        if (obj.Data instanceof Array) {
          this.danbingList['卫星电话'] = obj.Data.filter(val => {
            return val.Uid !== 0
          })
          this.$emit('length', { weixin: this.danbingList['卫星电话'].length })
        }
      } else if (this.type === '2') {
        var obj = JSON.parse(msg.data)
        if (obj.Data) {
          if (obj.Data.Result === 2200) {
            var trak = obj.Data.Track
            var id = obj.Data.Uid
            var featureAry = [];
            var coords = []
            for (var i in trak) {
              coords.push([trak[i].Lng, trak[i].Lat])
            }
            var feature = {
              "type": "LineString",
              "coordinates": coords
            }
            var features = { "type": "Feature", "geometry": feature };

            if (!this.map.getSource(id + "_source")) {
              this.map.addSource(id + "_source", {
                "type": "geojson",
                "data": features
              });
            } else {
              this.map.getSource(id + "_source").setData(features);
            }
          }
        }
      }
    },
    addYingjiguanjianshebeiScatterLayer(data, name) {
      const el = document.createElement('div');
      el.className = 'marker';
      let url;
      if (name === '布控球') {
        url = require('./images/bkq-map.png');
        if (!data.online) url = require('./images/bkq-close.png');
      } else if (name === '无人机') {
        url = require('./images/wrj-map.png');
        if (!data.online) url = require('./images/wrj-close.png');
      } else {
        url = require('./images/she.png');
        if (!data.online) url = require('./images/she-close.png');
      }
      el.innerHTML = `<img src = ${url} width="30px" height="30px">`
      var imgMarker = new mapboxgl.Marker(el).setLngLat([data.lon, data.lat]).addTo(this.map);
      this.danbingArray[name].push(imgMarker);
    },
    addVideoHtmlPopup(data, type) {
      // console.log(type)
      this.type = type
      let url, name;
      // if (type === '布控球') {
      //   name = '布控球';
      //   url = require('./images/bkq-map.png');
      //   if (!data.online) url = require('./images/bkq-close.png');
      //   let wsUrl = `ws://127.0.0.1:9005/websocket/${Date.parse(new Date())}?domainId=${data.phoneInfo.domainID}&deviceId=${data.phoneInfo.deviceID}&nChn=0&nSrc=0`;
      //   const html = `<div class="pop-tip" style="height: 90%;">
      //           <p class="pop-tip-title">${data.name}</p>
      //           <p>
      //             <button class='dial' onClick='dial("${wsUrl}")' data-domainId='${data.domainId}'>拨号</button>
      //             <button class='hangUp' onClick='hangUp()'>挂断</button>
      //           </p>
      //           <table class="pop-tip-table">
      //             <iframe width="100%" height="100%" allowfullscreen="true" src="http://10.36.226.3:8089/video/index.html?url=${data.url}" style="height: 250px;"></iframe>
      //           </table>
      //         </div>`
      //   // <button class='dial' onClick='fullScreen("${data.url}")'>全屏</button>
      //   // 删除别的提示框
      //   var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      //   for (var i = 0; i < tipElArr.length; i++) {
      //     tipElArr[i].click();
      //   }
      //   // 弹出提示框
      //   var popup = new mapboxgl.Popup({
      //     closeOnClick: true
      //   }).setHTML(html)
      //   popup.setLngLat([data.lon, data.lat]).addTo(this.map);
      // } else {
      this.videoUrl = data.url
      this.title = data.name
      this.dialUrl = `ws://127.0.0.1:9005/websocket/${Date.parse(new Date())}?domainId=${data.phoneInfo.domainID}&deviceId=${data.phoneInfo.deviceID}&nChn=0&nSrc=0`
      this.chargeName = data.chargeName || '-'
      this.chargePhone = data.chargePhone || '-'
      if (this.videoUrl) this.dialogVisible = true
      return
      // }
    },
    addVideoHtml(data, type) {
      if (!data.lat) return
      this.type = type
      // return
      const el = document.createElement('div')
      el.className = 'marker'
      let url, name
      if (type === '布控球') {
        name = '布控球'
        url = require('./images/bkq-map.png')
        if (!data.online) url = require('./images/bkq-close.png')
      } else if (type === '无人机') {
        name = '无人机'
        url = require('./images/wrj-map.png')
        if (!data.online) url = require('./images/wrj-close.png')
      } else {
        name = '单兵设备'
        url = require('./images/she.png')
        if (data.online === '-' || data.online === '否') url = require('./images/she-close.png')
      }
      el.innerHTML = `<img src = ${url} width="30px" height="30px">`
      let wsUrl = `ws://127.0.0.1:9005/websocket/${Date.parse(new Date())}?domainId=${data.phoneInfo.domainID}&deviceId=${data.phoneInfo.deviceID}&nChn=0&nSrc=0`
      // ws://127.0.0.1:9005/websocket/shebeiid?domainId=65a59b6b62cb4ab2833b08d3512bf1d9&deviceId=011bf3c0e2a64631858e05725a86a7ca@kedacom&nChn=0&nSrc=0
      const html = `<div class="pop-tip" style="height: 90%;">
              <p class="pop-tip-title">${data.name}</p>
              <p>
                <button class='dial' onClick='dial("${wsUrl}")' data-domainId='${data.domainId}'>拨号</button>
                <button class='hangUp' onClick='hangUp()'>挂断</button>
              </p>
              <table class="pop-tip-table">
                <iframe width="100%" height="100%" allowfullscreen="true" src="http://10.36.226.3:8089/video/index.html?url=${data.url}" style="height: 250px;"></iframe>
              </table>
            </div>`
      // <button class='dial' onClick='fullScreen("${data.url}")'>全屏</button>
      const popup = new mapboxgl.Popup().setHTML(html)
      // popup._closeButton.onclick = function() {
      //   document.getElementsByClassName('dial').forEach(el => {
      //     el.innerHTML = '拨号'
      //   })
      //   if (this.socket2) {
      //     this.socket2.close()
      //     this.socket2 = null
      //   }
      // }
      var imgMarker = new mapboxgl.Marker(el)
        .setLngLat([data.lon, data.lat])
        // .setPopup(popup)
        .addTo(this.map)
      // this.map.flyTo({
      //   center: [data.lon, data.lat]
      // })
      // if (this.popName === data.name) {
      //   console.log('弹出')
      //   imgMarker.togglePopup()
      // }
      // console.log(data.chargeName)
      imgMarker.getElement().setAttribute('url', data.url)
      imgMarker.getElement().setAttribute('dialUrl', wsUrl)
      imgMarker.getElement().setAttribute('title', data.name)
      imgMarker.getElement().setAttribute('chargeName', data.chargeName || '-')
      imgMarker.getElement().setAttribute('chargePhone', data.chargePhone || '-')
      var __this = this
      imgMarker.getElement().onclick = (e) => {
        //缩放移动
        // var zoomLevel = __this.map.getZoom();
        // if (zoomLevel < 14) {
        //   __this.map.setZoom(14);
        // }
        __this.map.flyTo({
          center: [data.lon, data.lat]
        });

        __this.videoUrl = e.target.parentNode.getAttribute('url')
        // __this.videoUrl = "http://10.36.226.5:8090/demo2.html?url=http://113.214.24.194:7086/live/cameraid/1000002%242/substream/1.m3u8"
        __this.dialUrl = e.target.parentNode.getAttribute('dialUrl')
        __this.title = e.target.parentNode.getAttribute('title')
        __this.chargeName = e.target.parentNode.getAttribute('chargeName')
        __this.chargePhone = e.target.parentNode.getAttribute('chargePhone')
        if (__this.videoUrl) {
          __this.dialogVisible = true
        }

        if (__this.selectImgMarker !== '') {
          __this.selectImgMarker.remove()
        }
        if (name === '单兵设备') {
          const selectEl = document.createElement('div')
          selectEl.className = 'marker'
          var selectUrl = require('./images/she-select.png')
          selectEl.innerHTML = `<img src = ${selectUrl} width="30px" height="30px">`
          __this.selectImgMarker = new mapboxgl.Marker(selectEl).setLngLat([data.lon, data.lat]).addTo(__this.map)
        }
      }
      this.danbingArray[name].push(imgMarker);
    },
    addWXHtmlPopup(data) {
      // console.log(data)
      const el = document.createElement('div');
      el.className = 'marker';
      // const url = require('./images/wxdh-normal.png');
      var url = '';
      //在线
      if (data.isOnline) {
        url = require('./images/wxdh-normal.png')
      }
      //离线
      else {
        url = require('./images/wxdh-close.png')
      }
      const lx = require('./images/lx.png');
      el.innerHTML = `<img src = ${url} width="30px" height="30px">`;
      var html = '<div class="pop-tip-jianceyujing yingjiguanjianshebei" style="height: 90%;">'
        + '<h3>' + (data.isatphone_tel || '-') + '</h3>'
        + '<ul class="wx_ul">'
        + '<li><span>名称:</span><span>' + (data.deviceInfo.deviceName || '-') + '</span></li>'
        + '<li><span>联系人:</span><span>' + (data.deviceInfo.deviceUser || '-') + '</span></li>'
        + '<li><span>联系方式:</span><span>' + (data.deviceInfo.deviceUserPhone || '-') + '</span></li>'
        + '<li><span>经度:</span><span>' + Number(data.longitude).toFixed(4) + '</span></li>'
        + '<li><span>纬度:</span><span>' + Number(data.latitude).toFixed(4) + '</span></li>'
        + '<li><span>时间:</span><span>' + (data.deviceInfo.createTime || '-') + '</span></li>'
        + '</ul>'
        + `<img src = ${lx} width="30px" height="30px" style ="float: right;cursor: pointer;"` + 'onclick="toline(\'' + data.Uid + '\')">'
        // + `<img src = ${yy} width="30px" height="30px" style ="float: right;cursor: pointer;">`
        + '</div>';

      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // console.log(data)
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      }).setHTML(html);
      // console.log(data.deviceInfo)
      if (!data.deviceInfo) return
      popup.setLngLat([data.longitude, data.latitude]).addTo(this.map);
    },
    // 添加卫星电话图层
    addWXHtml(data) {
      // console.log('addWXHtmldata: ' + CircularJSON.stringify(data));
      const el = document.createElement('div');
      el.className = 'marker';

      var url = '';
      //在线
      if (data.isOnline === '是') {
        url = require('./images/wxdh-normal.png');
      }
      //离线
      else {
        url = require('./images/wxdh-close.png');
      }
      const lx = require('./images/lx.png');
      el.innerHTML = `<img src = ${url} width="30px" height="30px">`;
      // data.deviceInfo = {"deviceName":"设备名称", "deviceUser":"test", "deviceUserPhone":"13352738840"};

      if (!data.deviceInfo) {
        var imgMarker = new mapboxgl.Marker(el)
          .setLngLat([data.longitude, data.latitude])
          .addTo(this.map);
      } else {
        var html = '<div class="pop-tip-jianceyujing yingjiguanjianshebei" style="height: 90%;">'
          + '<h3>' + data.isatphone_tel + '</h3>'
          + '<ul class="wx_ul">'
          + '<li><span>名称:</span><span>' + (data.deviceInfo.deviceName ? data.deviceInfo.deviceName : '-') + '</span></li>'
          + '<li><span>联系人:</span><span>' + (data.deviceInfo.deviceUser ? data.deviceInfo.deviceUser : '-') + '</span></li>'
          + '<li><span>联系方式:</span><span>' + (data.deviceInfo.deviceUserPhone ? data.deviceInfo.deviceUserPhone : '-') + '</span></li>'
          + '<li><span>经度:</span><span>' + data.longitude + '</span></li>'
          + '<li><span>纬度:</span><span>' + data.latitude + '</span></li>'
          + '<li><span>时间:</span><span>' + (data.deviceInfo.createTime ? data.deviceInfo.createTime : '-') + '</span></li>'
          + '</ul>'
          + `<img src = ${lx} width="30px" height="30px" style ="float: right;cursor: pointer;"` + 'onclick="toline(\'' + data.Uid + '\')">'
          // + `<img src = ${yy} width="30px" height="30px" style ="float: right;cursor: pointer;">`
          + '</div>';
        const popup = new mapboxgl.Popup().setHTML(html);
        var imgMarker = new mapboxgl.Marker(el)
          .setLngLat([data.longitude, data.latitude])
          .setPopup(popup)
          .addTo(this.map);
      }

      const __this = this;
      imgMarker.getElement().onclick = (e) => {
        // 1.缩放移动
        __this.map.setZoom(15);
        var centerAry = [];
        // console.log(data)
        centerAry[0] = Number(data.longitude);
        centerAry[1] = Number(data.latitude);
        __this.map.flyTo({
          center: centerAry
        });
        // // 2.高亮
        // if (__this.selectWXDHMarker !== '') {
        //   __this.selectWXDHMarker.remove();
        // }
        // const selectEl = document.createElement('div');
        // selectEl.className = 'marker';
        // var selectUrl = require('./images/wxdh-select.png');
        // selectEl.innerHTML = `<img src = ${selectUrl} width="30px" height="30px">`;
        // __this.selectWXDHMarker = new mapboxgl.Marker(selectEl).setLngLat([data.longitude, data.latitude]).addTo(__this.map);
      };
      this.danbingArray['卫星电话'].push(imgMarker);
    },
    createBaseMap() {
      // 全球底图
      this.basemapTiles = 'bigdata-raster';
      const WWW_MAP = document.location.protocol + '//' + window.location.host
      if (WWW_MAP.indexOf('http://pshyz.f3322.net:9000') >= 0 || WWW_MAP.indexOf('http://localhost') === 0) {
        this.map = new mapboxgl.Map({
          container: "map",
          style: {
            "version": 8,
            "sources": {
              "baselayer-source": {
                "type": "raster",
                "tiles": [URL_CONFIG.BIGDATA_STYLE],
                "tileSize": 256,
                "rasterSource": 'iserver'
              }
            },
            "layers": [{
              "id": "base-layer",
              "type": "raster",
              "source": "baselayer-source",
              "minzoom": 3,
              "maxzoom": 20
            }]
          },
          crs: 'EPSG:4490',
          center: [120.462287, 27.90],
          zoom: 8.5,
          minZoom: 4,
          maxZoom: 19
        });
        this.isMapLoaded = true;
        this.SetMapLoaded(true)
      } else {
        var tiles = URL_CONFIG.GLOBE_MAP;
        this.map = new mapboxgl.Map({
          container: "map",
          style: {
            "version": 8,
            "sources": {
              "baselayer-source": {
                "type": "raster",
                "tiles": [tiles],
                "tileSize": 256,
                "rasterSource": 'iserver'
              }
            },
            "layers": [{
              "id": "base-layer",
              "type": "raster",
              "source": "baselayer-source",
              "minzoom": 3,
              "maxzoom": 19
            }]
          },
          crs: 'EPSG:4490',
          center: [120.462287, 27.90],
          zoom: 8.5,
          minZoom: 4,
          maxZoom: 18
        });

        var __this = this;
        this.map.on('load', function() {
          // if (__this.userDistrict !== '3303') {
            //区县账号，加当前区县、街道边界线
            __this.map.addSource("districtBoundary", {
              "type": "raster",
              "tiles": [__this.currentDistrictBoundary],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "districtBoundary",
              "type": "raster",
              "source": "districtBoundary"
            });
            __this.map.addSource("streetBoundary", {
              "type": "raster",
              "tiles": [__this.currentStreetBoundary],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "streetBoundary",
              "type": "raster",
              "source": "streetBoundary"
            }, "districtBoundary");

            // 添加标准图层，并隐藏
            __this.map.addSource("wenzhoubz_map", {
              "type": "raster",
              "tiles": [URL_CONFIG.STANDARD_STYLE],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "wenzhoubz_map",
              "type": "raster",
              "source": "wenzhoubz_map"
            }, "streetBoundary");
            __this.hideLayer("wenzhoubz_map");
            // 添加注记图层，并隐藏
            __this.map.addSource("wenzhouzj_map", {
              "type": "raster",
              "tiles": [URL_CONFIG.YXZJ_STYLE],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "wenzhouzj_map",
              "type": "raster",
              "source": "wenzhouzj_map"
            }, "wenzhoubz_map");
            __this.hideLayer("wenzhouzj_map");
            // 添加影像图层，并隐藏
            __this.map.addSource("wenzhouyx_map", {
              "type": "raster",
              "tiles": [URL_CONFIG.YX_STYLE],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "wenzhouyx_map",
              "type": "raster",
              "source": "wenzhouyx_map"
            }, "wenzhouzj_map");
            __this.hideLayer("wenzhouyx_map");
            // 添加大数据图层
            __this.map.addSource("wenzhou_map", {
              "type": "raster",
              "tiles": [URL_CONFIG.BIGDATA_STYLE],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "wenzhou_map",
              "type": "raster",
              "source": "wenzhou_map"
            }, "wenzhouyx_map");
            // 添加中国图层
            __this.map.addSource("China_map", {
              "type": "raster",
              "tiles": [URL_CONFIG.CHINA_MAP],
              "tileSize": 256,
              "rasterSource": 'iserver'
            });
            __this.map.addLayer({
              "id": "China_map",
              "type": "raster",
              "source": "China_map"
            }, "wenzhou_map");
          // } else {
          //   //市账号，加所有区县、街道边界线
          //   __this.map.addSource("districtBoundary", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.xzqhxs],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "districtBoundary",
          //     "type": "raster",
          //     "source": "districtBoundary"
          //   });
          //   __this.map.addSource("streetBoundary", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.xzqhxzjd],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "streetBoundary",
          //     "type": "raster",
          //     "source": "streetBoundary"
          //   }, "districtBoundary");

          //   // 添加标准图层，并隐藏
          //   __this.map.addSource("wenzhoubz_map", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.STANDARD_STYLE],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "wenzhoubz_map",
          //     "type": "raster",
          //     "source": "wenzhoubz_map"
          //   }, "streetBoundary");
          //   __this.hideLayer("wenzhoubz_map");
          //   // 添加注记图层，并隐藏
          //   __this.map.addSource("wenzhouzj_map", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.YXZJ_STYLE],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "wenzhouzj_map",
          //     "type": "raster",
          //     "source": "wenzhouzj_map"
          //   }, "wenzhoubz_map");
          //   __this.hideLayer("wenzhouzj_map");
          //   // 添加影像图层，并隐藏
          //   __this.map.addSource("wenzhouyx_map", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.YX_STYLE],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "wenzhouyx_map",
          //     "type": "raster",
          //     "source": "wenzhouyx_map"
          //   }, "wenzhouzj_map");
          //   __this.hideLayer("wenzhouyx_map");
          //   // 添加大数据图层
          //   __this.map.addSource("wenzhou_map", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.BIGDATA_STYLE],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "wenzhou_map",
          //     "type": "raster",
          //     "source": "wenzhou_map"
          //   }, "wenzhouyx_map");
          //   // 添加中国图层
          //   __this.map.addSource("China_map", {
          //     "type": "raster",
          //     "tiles": [URL_CONFIG.CHINA_MAP],
          //     "tileSize": 256,
          //     "rasterSource": 'iserver'
          //   });
          //   __this.map.addLayer({
          //     "id": "China_map",
          //     "type": "raster",
          //     "source": "China_map"
          //   }, "wenzhou_map");
          // }

          __this.isMapLoaded = true;
          __this.SetMapLoaded(true);
        });
      }
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      var Draw = new MapboxDraw({
        controls: {
          line_string: true,
          polygon: true,
          trash: true
        }
      });
      this.map.addControl(Draw, 'top-left');
      this.map.on('draw.create', this.measure);
      $('.mapboxgl-ctrl-group').hide();

      var __this = this;
      this.map.loadImage('./static/gitimage/shishishuju/gaowengaojing.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("gaowen_Point")) {
          __this.map.addImage("gaowen_Point", image);
        }
      });
      this.map.loadImage('./static/gitimage/shishishuju/dafenggaojing.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("dafeng_Point")) {
          __this.map.addImage("dafeng_Point", image);
        }
      });
      this.map.loadImage('./static/gitimage/shishishuju/leidiangaojing.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("leidian_Point")) {
          __this.map.addImage("leidian_Point", image);
        }
      });
      this.map.loadImage('./static/gitimage/shishishuju/baoyugaojing.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("baoyu_Point")) {
          __this.map.addImage("baoyu_Point", image);
        }
      });
      this.map.loadImage('./static/gitimage/shishishuju/taifenggaojing.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("taifeng_Point")) {
          __this.map.addImage("taifeng_Point", image);
        }
      });
      this.map.loadImage('./static/gitimage/ditusousuo/searchObj.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("searchObj_Point")) {
          __this.map.addImage("searchObj_Point", image);
        }
      });
    },
    hideLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.setLayoutProperty(layname, 'visibility', 'none');
      }
    },
    showLayer(layname) {
      this.map.setLayoutProperty(layname, 'visibility', 'visible');
    },
    checkValue(data) {
      if (this.basemapTiles === data) {
        return;
      }
      this.basemapTiles = data;
      var tiles = '';
      if (this.basemapTiles === 'bigdata-raster') {
        // 隐藏注记图层
        this.hideLayer("wenzhouzj_map");
        // 隐藏影像图层
        this.hideLayer("wenzhouyx_map");
        // 隐藏标准图层
        this.hideLayer("wenzhoubz_map");
        // 显示大数据图层
        this.showLayer("wenzhou_map");
      } else if (this.basemapTiles === 'YX-raster') {
        // 隐藏大数据图层
        this.hideLayer("wenzhou_map");
        // 隐藏标准图层
        this.hideLayer("wenzhoubz_map");
        // 显示注记图层
        this.showLayer("wenzhouzj_map");
        // 显示影像图层
        this.showLayer("wenzhouyx_map");
      } else if (this.basemapTiles === 'standard-raster') {
        // 隐藏注记图层
        this.hideLayer("wenzhouzj_map");
        // 隐藏影像图层
        this.hideLayer("wenzhouyx_map");
        // 隐藏大数据图层
        this.hideLayer("wenzhou_map");
        // 显示标准图层
        this.showLayer("wenzhoubz_map");
      }
    },
    clearAllLayers() {
      // this.$parent.$refs.typhoonVideo.remove();
      // if (this.$parent.$refs)
      this.dialogVisible = false;
      this.$bus.emit('clearQixiangyuce');
      this.$bus.emit('clearTyphoon');
      this.$bus.emit('clearYunTu');
      this.$bus.emit('clearVideoMonitor');
      this.$bus.emit('rainMap', [])
      this.$bus.emit('valueDeleteRain', {
        img: '',
        checked: false
      })
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      // console.log(tipElArr)
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }

      // 设置底图
      this.map.setStyle({
        "version": 8,
        "sources": {
          "baselayer-source": {
            "type": "raster",
            "tiles": [URL_CONFIG.GLOBE_MAP],
            "tileSize": 256,
            "rasterSource": 'iserver'
          }
        },
        "layers": [{
          "id": "base-layer",
          "type": "raster",
          "source": "baselayer-source",
          "minzoom": 3,
          "maxzoom": 19
        }]
      });

      //加边界线
      // if (this.userDistrict !== '3303') {
        this.map.addSource("districtBoundary", {
          "type": "raster",
          "tiles": [this.currentDistrictBoundary],
          "tileSize": 256,
          "rasterSource": 'iserver'
        });
        this.map.addLayer({
          "id": "districtBoundary",
          "type": "raster",
          "source": "districtBoundary"
        });
      // } else {
      //   this.map.addSource("districtBoundary", {
      //     "type": "raster",
      //     "tiles": [URL_CONFIG.xzqhxs],
      //     "tileSize": 256,
      //     "rasterSource": 'iserver'
      //   });
      //   this.map.addLayer({
      //     "id": "districtBoundary",
      //     "type": "raster",
      //     "source": "districtBoundary"
      //   });
      // }
      this.map.addSource("streetBoundary", {
        "type": "raster",
        "tiles": [this.currentStreetBoundary],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "streetBoundary",
        "type": "raster",
        "source": "streetBoundary"
      }, "districtBoundary");

      // 添加标准图层
      this.map.addSource("wenzhoubz_map", {
        "type": "raster",
        "tiles": [URL_CONFIG.STANDARD_STYLE],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "wenzhoubz_map",
        "type": "raster",
        "source": "wenzhoubz_map"
      }, "streetBoundary");
      // 添加注记图层
      if (this.map.getLayer('wenzhouzj_map')) {
        this.map.removeLayer('wenzhouzj_map')
      }
      if (this.map.getSource('wenzhouzj_map')) {
        this.map.removeSource('wenzhouzj_map')
      }
      this.map.addSource("wenzhouzj_map", {
        "type": "raster",
        "tiles": [URL_CONFIG.YXZJ_STYLE],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "wenzhouzj_map",
        "type": "raster",
        "source": "wenzhouzj_map"
      }, "wenzhoubz_map");
      if (this.map.getLayer('wenzhouyx_map')) {
        this.map.removeLayer('wenzhouyx_map')
      }
      if (this.map.getSource('wenzhouyx_map')) {
        this.map.removeSource('wenzhouyx_map')
      }
      this.map.addSource("wenzhouyx_map", {
        "type": "raster",
        "tiles": [URL_CONFIG.YX_STYLE],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "wenzhouyx_map",
        "type": "raster",
        "source": "wenzhouyx_map"
      }, "wenzhouzj_map");

      if (this.map.getLayer('wenzhou_map')) {
        this.map.removeLayer('wenzhou_map')
      }
      if (this.map.getSource('wenzhou_map')) {
        this.map.removeSource('wenzhou_map')
      }
      this.map.addSource("wenzhou_map", {
        "type": "raster",
        "tiles": [URL_CONFIG.BIGDATA_STYLE],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "wenzhou_map",
        "type": "raster",
        "source": "wenzhou_map"
      }, "wenzhouyx_map");
      if (this.map.getLayer('China_map')) {
        this.map.removeLayer('China_map')
      }
      if (this.map.getSource('China_map')) {
        this.map.removeSource('China_map')
      }
      this.map.addSource("China_map", {
        "type": "raster",
        "tiles": [URL_CONFIG.CHINA_MAP],
        "tileSize": 256,
        "rasterSource": 'iserver'
      });
      this.map.addLayer({
        "id": "China_map",
        "type": "raster",
        "source": "China_map"
      }, "wenzhou_map");

      // if (this.basemapTiles === 'bigdata-raster') {
      //   this.hideLayer("wenzhouzj_map");
      //   this.hideLayer("wenzhouyx_map");
      // } else if (this.basemapTiles === 'YX-raster') {
      //   this.hideLayer("wenzhou_map");
      // } else if (this.basemapTiles === 'standard-raster') {
      // }

      if (this.basemapTiles === 'bigdata-raster') {
        // 隐藏注记图层
        this.hideLayer("wenzhouzj_map");
        // 隐藏影像图层
        this.hideLayer("wenzhouyx_map");
        // 隐藏标准图层
        this.hideLayer("wenzhoubz_map");
        // 显示大数据图层
        this.showLayer("wenzhou_map");
      } else if (this.basemapTiles === 'YX-raster') {
        // 隐藏大数据图层
        this.hideLayer("wenzhou_map");
        // 隐藏标准图层
        this.hideLayer("wenzhoubz_map");
        // 显示注记图层
        this.showLayer("wenzhouzj_map");
        // 显示影像图层
        this.showLayer("wenzhouyx_map");
      } else if (this.basemapTiles === 'standard-raster') {
        // 隐藏注记图层
        this.hideLayer("wenzhouzj_map");
        // 隐藏影像图层
        this.hideLayer("wenzhouyx_map");
        // 隐藏大数据图层
        this.hideLayer("wenzhou_map");
        // 显示标准图层
        this.showLayer("wenzhoubz_map");
      }

      //清除图例
      this.legendAry = [];
      this.legendMsg = { "legendAry": this.legendAry };
    },
    // 添加一类点要素数据图层散点图
    addScatterLayerFromServer(url, alias, icon, datasetname, sql, name, typeName) {
      if ('' === icon || icon === undefined || '' === icon.trim() || icon === null) {
        return;
      }
      var __this = this;

      if (alias === 'shuikushuiqingjiance') {
        if (typeName === 'xiaoxing') {
          sql = sql + " AND TYPENAME LIKE'小%'";
        } else if (typeName === 'dazhongxing') {
          sql = sql + " AND (TYPENAME LIKE'大%' OR TYPENAME LIKE'中%')";
        }
      }
      if (alias === 'hedaoshuiqingjiance') {
        if (typeName === 'zhongyao') {
          sql = "sfzs= '2'";

        } else if (typeName === 'qita') {
          sql = "sfzs= '4'";
        }
      }

      var sqlParam = {};
      if (this.userDistrict === '3303' || alias === 'shuiliyuqingjiance-wenzhou' || alias === 'qixiangyuqingjiance-wenzhou') {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: sql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      } else {
        var attributeFilterSql = "";
        if ("" === sql) {
          attributeFilterSql = "DISTRICT_CODE='" + this.userDistrict + "'";
        } else {
          attributeFilterSql = "DISTRICT_CODE='" + this.userDistrict + "' AND (" + sql + ")";
        }
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: attributeFilterSql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      }

      var __this = this;
      new FeatureService(url).getFeaturesBySQL(sqlParam, function(serviceResult) {
        // console.log("serviceResult: " + CircularJSON.stringify(serviceResult));
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          // console.log("features: " + CircularJSON.stringify(features));
          if (alias === "JCSB_DBWY" || alias === "JCSB_GPS" || alias === "JCSB_SZQX" || alias === "JCSB_YL") {
            for (var i = 0; i < features.features.length; i++) {
              if (alias === "JCSB_DBWY") {
                features.features[i].properties.TYPE = 2;
              }
              if (alias === "JCSB_GPS") {
                features.features[i].properties.TYPE = 1;
              }
              if (alias === "JCSB_SZQX") {
                features.features[i].properties.TYPE = 0;
              }
              if (alias === "JCSB_YL") {
                features.features[i].properties.TYPE = 3;
              }
            }
          }

          if (alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance'
              || alias === 'dongtoushuikushuiqingjiance' || alias === 'dongtouhedaoshuiqingjiance'
              // || alias === 'yongjiashuikushuiqingjiance' || alias === 'yongjiahedaoshuiqingjiance'
          ) {
            var featureAry1 = [];
            var featureAry2 = [];
            //瑞安市，判断库上水位和校核洪水位
            if (__this.userDistrict == '330381') {
              for (var i = 0; i < features.features.length; i++) {
                if (features.features[i].properties.KSSW !== "" && features.features[i].properties.CKFLZ !== ""
                  && features.features[i].properties.KSSW !== null && features.features[i].properties.CKFLZ !== null
                  && Number(features.features[i].properties.KSSW) > Number(features.features[i].properties.CKFLZ)) {
                  featureAry2.push(features.features[i]);
                } else {
                  featureAry1.push(features.features[i]);
                }
              }
            } else {
              for (var i = 0; i < features.features.length; i++) {
                if (features.features[i].properties.KSSW !== "" && features.features[i].properties.XXSW !== ""
                  && features.features[i].properties.KSSW !== null && features.features[i].properties.XXSW !== null
                  && Number(features.features[i].properties.KSSW) > Number(features.features[i].properties.XXSW)) {
                  featureAry2.push(features.features[i]);
                } else {
                  featureAry1.push(features.features[i]);
                }
              }
            }

            var features1 = { "type": "FeatureCollection", "features": featureAry1 };
            var features2 = { "type": "FeatureCollection", "features": featureAry2 };

            if (!__this.map.getSource(alias + "_source")) {
              __this.map.addSource(alias + "_source", {
                "type": "geojson",
                "data": features1
              });
            } else {
              __this.map.getSource(alias + "_source").setData(features1);
            }
            if (!__this.map.getSource(alias + "_warn_source")) {
              __this.map.addSource(alias + "_warn_source", {
                "type": "geojson",
                "data": features2
              });
            } else {
              __this.map.getSource(alias + "_warn_source").setData(features2);
            }

            // if ((alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance') && __this.userDistrict == '330328') {
            //   for (var i = 0; i < features.features.length; i++) {
            //     features.features[i].properties.KSSWDES = '库上水位：' + features.features[i].properties.KSSW;
            //   }
            //   if (!__this.map.getSource(alias + "_notesource")) {
            //     __this.map.addSource(alias + "_notesource", {
            //       "type": "geojson",
            //       "data": features
            //     });
            //   } else {
            //     __this.map.getSource(alias + "_notesource").setData(features);
            //   }
            // }
          } else {
            if (!__this.map.getSource(alias + "_source")) {
              __this.map.addSource(alias + "_source", {
                "type": "geojson",
                "data": features
              });
            } else {
              __this.map.getSource(alias + "_source").setData(features);
            }
          }

          if (alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance'
              || alias === 'dongtoushuikushuiqingjiance' || alias === 'dongtouhedaoshuiqingjiance'
              // || alias === 'yongjiashuikushuiqingjiance' || alias === 'yongjiahedaoshuiqingjiance'
          ) {
            if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
              if (__this.map.getLayer(alias + "_layer")) {
                __this.map.removeLayer(alias + "_layer");
              }
              __this.map.addLayer({
                "id": alias + "_layer",
                "type": "symbol",
                "source": alias + "_source",
                "layout": {
                  'icon-image': alias + "_Point",
                  'icon-size': 0.6,
                  'icon-allow-overlap': true
                }
              });
              if (__this.map.getLayer(alias + "_warn_layer")) {
                __this.map.removeLayer(alias + "_warn_layer");
              }
              __this.map.addLayer({
                "id": alias + "_warn_layer",
                "type": "symbol",
                "source": alias + "_warn_source",
                "layout": {
                  'icon-image': alias + "_warn_Point",
                  'icon-size': 0.6,
                  'icon-allow-overlap': true
                }
              });

              //文成县增加注记图层
              if ((alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance') && __this.userDistrict == '330328') {
                if (__this.map.getLayer(alias + "_notelayer")) {
                  __this.map.removeLayer(alias + "_notelayer");
                }
                __this.map.addLayer({
                  "id": alias + "_notelayer",
                  "type": "symbol",
                  "source": alias + "_source",
                  "layout": {
                    "text-field": "{NAME}",
                    "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 2],
                    "text-size": 12,
                    "text-max-width": 15
                  },
                  "paint": {
                    "text-color": "#00d8ff",
                    "text-halo-width": 1,
                    "text-halo-color": "rgba(0, 0, 0, 1)"
                  }
                });
              }
            } else {
              __this.loadedLayer.push(alias + "_layer");

              var icon1 = icon.split(",")[0];
              var icon2 = icon.split(",")[1];
              __this.map.loadImage(icon1, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (!__this.map.hasImage(alias + "_Point")) {
                  __this.map.addImage(alias + "_Point", image);
                }
                if (__this.map.getLayer(alias + "_layer")) {
                  __this.map.removeLayer(alias + "_layer");
                }
                __this.map.addLayer({
                  "id": alias + "_layer",
                  "type": "symbol",
                  "source": alias + "_source",
                  "layout": {
                    'icon-image': alias + "_Point",
                    'icon-size': 0.6,
                    'icon-allow-overlap': true
                  }
                });
                //文成县增加注记图层
                if ((alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance') && __this.userDistrict == '330328') {
                  if (__this.map.getLayer(alias + "_notelayer")) {
                    __this.map.removeLayer(alias + "_notelayer");
                  }
                  __this.map.addLayer({
                    "id": alias + "_notelayer",
                    "type": "symbol",
                    "source": alias + "_source",
                    "layout": {
                      "text-field": "{NAME}",
                      "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                      "text-offset": [0, 2],
                      "text-size": 12,
                      "text-max-width": 15
                    },
                    "paint": {
                      "text-color": "#00d8ff",
                      "text-halo-width": 1,
                      "text-halo-color": "rgba(0, 0, 0, 1)"
                    }
                  });
                }
              });
              __this.map.loadImage(icon2, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (!__this.map.hasImage(alias + "_warn_Point")) {
                  __this.map.addImage(alias + "_warn_Point", image);
                }
                if (__this.map.getLayer(alias + "_warn_layer")) {
                  __this.map.removeLayer(alias + "_warn_layer");
                }
                __this.map.addLayer({
                  "id": alias + "_warn_layer",
                  "type": "symbol",
                  "source": alias + "_warn_source",
                  "layout": {
                    'icon-image': alias + "_warn_Point",
                    'icon-size': 0.6,
                    'icon-allow-overlap': true
                  }
                });
                //文成县增加注记图层
                if ((alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance') && __this.userDistrict == '330328') {
                  if (__this.map.getLayer(alias + "_notelayer")) {
                    __this.map.removeLayer(alias + "_notelayer");
                  }
                  __this.map.addLayer({
                    "id": alias + "_notelayer",
                    "type": "symbol",
                    "source": alias + "_source",
                    "layout": {
                      "text-field": "{NAME}",
                      "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                      "text-offset": [0, 2],
                      "text-size": 12,
                      "text-max-width": 15
                    },
                    "paint": {
                      "text-color": "#00d8ff",
                      "text-halo-width": 1,
                      "text-halo-color": "rgba(0, 0, 0, 1)"
                    }
                  });
                }
              });
              __this.map.on("click", alias + "_layer", function(e) {
                var feature = e.features[0];
                // 高亮
                var hignlightIcon = icon1.substring(0, 17) + "-light" + icon1.substring(17);
                __this.map.loadImage(hignlightIcon, function(error, image) {
                  if (error) {
                    console.log("error: " + error);
                  }
                  if (__this.map.hasImage("highlight_Point")) {
                    __this.map.removeImage("highlight_Point");
                  }
                  __this.map.addImage("highlight_Point", image);

                  var featuresAry = [];
                  feature.id = 1;
                  featuresAry.push(feature);
                  if (!__this.map.getSource("highlight_source")) {
                    __this.map.addSource("highlight_source", {
                      "type": "geojson",
                      "data": {
                        "type":"FeatureCollection",
                        "features":featuresAry
                      }
                    });
                  } else {
                    __this.map.getSource("highlight_source").setData({
                      "type":"FeatureCollection",
                      "features":featuresAry
                    });
                  }
                  if (__this.map.getLayer("highlight_layer")) {
                    __this.map.removeLayer("highlight_layer");
                  }
                  __this.map.addLayer({
                    "id": "highlight_layer",
                    "type": "symbol",
                    "source": "highlight_source",
                    "layout": {
                      'icon-image': "highlight_Point",
                      'icon-size': 0.8,
                      'icon-allow-overlap': true
                    }
                  });
                });

                // 高亮
                // console.log("feature: " + CircularJSON.stringify(feature));
                var longitude = e.features[0].geometry.coordinates[0];
                var latitude = e.features[0].geometry.coordinates[1];
                var smid = feature.properties.SMID;
                __this.queryMonitorBySmid(alias, smid, longitude, latitude);
              });
              __this.map.on("click", alias + "_warn_layer", function(e) {
                var feature = e.features[0];
                // 高亮
                var hignlightIcon = icon2.substring(0, 17) + "-light" + icon2.substring(17);
                __this.map.loadImage(hignlightIcon, function(error, image) {
                  if (error) {
                    console.log("error: " + error);
                  }
                  if (__this.map.hasImage("highlight_Point")) {
                    __this.map.removeImage("highlight_Point");
                  }
                  __this.map.addImage("highlight_Point", image);

                  var featuresAry = [];
                  feature.id = 1;
                  featuresAry.push(feature);
                  if (!__this.map.getSource("highlight_source")) {
                    __this.map.addSource("highlight_source", {
                      "type": "geojson",
                      "data": {
                        "type":"FeatureCollection",
                        "features":featuresAry
                      }
                    });
                  } else {
                    __this.map.getSource("highlight_source").setData({
                      "type":"FeatureCollection",
                      "features":featuresAry
                    });
                  }
                  if (__this.map.getLayer("highlight_layer")) {
                    __this.map.removeLayer("highlight_layer");
                  }
                  __this.map.addLayer({
                    "id": "highlight_layer",
                    "type": "symbol",
                    "source": "highlight_source",
                    "layout": {
                      'icon-image': "highlight_Point",
                      'icon-size': 0.8,
                      'icon-allow-overlap': true
                    }
                  });
                });
                // 弹框
                // console.log("feature: " + CircularJSON.stringify(feature));
                var longitude = e.features[0].geometry.coordinates[0];
                var latitude = e.features[0].geometry.coordinates[1];
                var smid = feature.properties.SMID;
                __this.queryMonitorBySmid(alias, smid, longitude, latitude);
              });
            }
          } else {
            if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
              if (__this.map.getLayer(alias + "_layer")) {
                __this.map.removeLayer(alias + "_layer");
              }
              __this.map.addLayer({
                "id": alias + "_layer",
                "type": "symbol",
                "source": alias + "_source",
                "layout": {
                  'icon-image': alias + "_Point",
                  'icon-size': 0.6,
                  'icon-allow-overlap': true
                }
              });
            } else {
              __this.loadedLayer.push(alias + "_layer");

              __this.map.loadImage(icon, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (!__this.map.hasImage(alias + "_Point")) {
                  __this.map.addImage(alias + "_Point", image);
                }
                if (__this.map.getLayer(alias + "_layer")) {
                  __this.map.removeLayer(alias + "_layer");
                }
                __this.map.addLayer({
                  "id": alias + "_layer",
                  "type": "symbol",
                  "source": alias + "_source",
                  "layout": {
                    'icon-image': alias + "_Point",
                    'icon-size': 0.6,
                    'icon-allow-overlap': true
                  }
                });
              });
              __this.map.on("click", alias + "_layer", function(e) {
                var feature = e.features[0];
                // console.log('feature: ' + CircularJSON.stringify(feature));

                var hignlightIcon = icon.substring(0, 17) + "-light" + icon.substring(17);
                __this.map.loadImage(hignlightIcon, function(error, image) {
                  if (error) {
                    console.log("error: " + error);
                  }
                  if (__this.map.hasImage("highlight_Point")) {
                    __this.map.removeImage("highlight_Point");
                  }
                  __this.map.addImage("highlight_Point", image);

                  var featuresAry = [];
                  feature.id = 1;
                  featuresAry.push(feature);
                  if (!__this.map.getSource("highlight_source")) {
                    __this.map.addSource("highlight_source", {
                      "type": "geojson",
                      "data": {
                        "type":"FeatureCollection",
                        "features":featuresAry
                      }
                    });
                  } else {
                    __this.map.getSource("highlight_source").setData({
                      "type":"FeatureCollection",
                      "features":featuresAry
                    });
                  }
                  if (__this.map.getLayer("highlight_layer")) {
                    __this.map.removeLayer("highlight_layer");
                  }
                  __this.map.addLayer({
                    "id": "highlight_layer",
                    "type": "symbol",
                    "source": "highlight_source",
                    "layout": {
                      'icon-image': "highlight_Point",
                      'icon-size': 0.8,
                      'icon-allow-overlap': true
                    }
                  });
                });

                // console.log("feature: " + CircularJSON.stringify(feature));
                var longitude = e.features[0].geometry.coordinates[0];
                var latitude = e.features[0].geometry.coordinates[1];
                if (alias === "shipinjiance") {
                  var videoUrl = feature.properties.VIDEO_URL;
                  __this.queryCameraBySmid(videoUrl, longitude, latitude, e.features[0].properties);
                } else if (alias === "JCSB_DBWY" || alias === "JCSB_SZQX" || alias === "JCSB_YL" || alias === "JCSB_GPS") {
                  __this.$emit('showDiZai', feature);
                } else if (alias === "shuizhajiance") {
                  var smid = feature.properties.SMID;
                  __this.queryMonitorBySmid(alias, smid, longitude, latitude, feature.properties);
                } else {
                  var smid = feature.properties.SMID;
                  __this.queryMonitorBySmid(alias, smid, longitude, latitude);
                }
              });
            }
          }

          //data[i].alias
          var isAddedLegend = false;
          for (var i = 0; i < __this.legendAry.length; i++) {
            if (__this.legendAry[i].des === name) {
              isAddedLegend = true;
              break;
            }
          }
          if (isAddedLegend === false) {
            if (alias === 'shuikushuiqingjiance' || alias === 'hedaoshuiqingjiance'
                || alias === 'dongtoushuikushuiqingjiance' || alias === 'dongtouhedaoshuiqingjiance'
                // || alias === 'yongjiashuikushuiqingjiance' || alias === 'yongjiahedaoshuiqingjiance'
            ) {
              var icon1 = icon.split(",")[0];
              __this.legendAry.push({ "icon": icon1, "des": name });
            } else {
              __this.legendAry.push({ "icon": icon, "des": name });
            }
            __this.legendMsg = { "legendAry": __this.legendAry };
          }
        }
      });
    },
    // 添加单个点要素数据图层散点图
    addScatterLayerFromServer2(data) {
      //添加数据源
      for (var i = 0; i < URL_CONFIG.dizhizaihaijianceAry.length; i++) {
        var name = URL_CONFIG.dizhizaihaijianceAry[i].name;
        var alias = URL_CONFIG.dizhizaihaijianceAry[i].alias;
        var eachDzzhjcGeoJson = {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': []
          }
        };
        for (const n in data.info) {
          if (data.info[n].type === name) {
            eachDzzhjcGeoJson.data.features.push({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
              },
              'properties': data.info[n]
            });
          }
        }
        if (this.map.getSource(alias)) {
          this.map.removeSource(alias);
        }
        if (eachDzzhjcGeoJson.data.features.length > 0) {
          this.map.addSource(alias, eachDzzhjcGeoJson);
        }
      }

      // var gpsDeviceGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var yuliangDeviceGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var weiyiDeviceGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var qingjiaoDeviceGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var shuiweiGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var shenbuweiyiGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // var turangshuifenDeviceGeoJson = {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      // };
      // for (const n in data.info) {
      //   // console.log('data.info[n]: ' + CircularJSON.stringify(data.info[n]));
      //   switch (data.info[n].type) {
      //     case "GPS设备":
      //       gpsDeviceGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "雨量设备":
      //       yuliangDeviceGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "位移设备":
      //       weiyiDeviceGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "倾角设备":
      //       qingjiaoDeviceGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "水位":
      //       shuiweiGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "深部位移":
      //       shenbuweiyiGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //     case "土壤水分传感器":
      //       turangshuifenDeviceGeoJson.data.features.push({
      //         'type': 'Feature',
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [Number(data.info[n].location.split(",")[0]), Number(data.info[n].location.split(",")[1])]
      //         },
      //         'properties': {
      //           'description': this.createDzzhjcPopup(data.info[n]),
      //           'gaowenWarnData': data.info[n]
      //         }
      //       });
      //       break;
      //   }
      // }
      // if (this.map.getSource('gpsDevice')) {
      //     this.map.removeSource('gpsDevice');
      // }
      // this.map.addSource('gpsDevice', gpsDeviceGeoJson);
      // if (this.map.getSource('yuliangDevice')) {
      //     this.map.removeSource('yuliangDevice');
      // }
      // this.map.addSource('yuliangDevice', yuliangDeviceGeoJson);
      // if (this.map.getSource('weiyiDevice')) {
      //     this.map.removeSource('weiyiDevice');
      // }
      // this.map.addSource('weiyiDevice', weiyiDeviceGeoJson);
      // if (this.map.getSource('qingjiaoDevice')) {
      //     this.map.removeSource('qingjiaoDevice');
      // }
      // this.map.addSource('qingjiaoDevice', qingjiaoDeviceGeoJson);
      // if (this.map.getSource('shuiwei')) {
      //     this.map.removeSource('shuiwei');
      // }
      // this.map.addSource('shuiwei', shuiweiGeoJson);
      // if (this.map.getSource('shenbuweiyi')) {
      //     this.map.removeSource('shenbuweiyi');
      // }
      // this.map.addSource('shenbuweiyi', shenbuweiyiGeoJson);
      // if (this.map.getSource('turangshuifenDevice')) {
      //     this.map.removeSource('turangshuifenDevice');
      // }
      // this.map.addSource('turangshuifenDevice', turangshuifenDeviceGeoJson);
      //添加图层
      // this.addDzzhjcLayer('gpsDevice', './static/gitimage/jianceshebei/GPS.png');
      // this.addDzzhjcLayer('yuliangDevice', './static/gitimage/jianceshebei/yuliang.png');
      // this.addDzzhjcLayer('weiyiDevice', './static/gitimage/jianceshebei/dibiaoweiyi.png');
      // this.addDzzhjcLayer('qingjiaoDevice', './static/gitimage/jianceshebei/shuangzhouqingxie.png');
      // this.addDzzhjcLayer('shuiwei', './static/gitimage/jianceshebei/shuiwei.png');
      // this.addDzzhjcLayer('shenbuweiyi', './static/gitimage/jianceshebei/shenbuweiyi.png');
      // this.addDzzhjcLayer('turangshuifenDevice', './static/gitimage/jianceshebei/turangshuifenchuanganqi.png');
      for (var i = 0; i < URL_CONFIG.dizhizaihaijianceAry.length; i++) {
        if (!this.map.getSource(URL_CONFIG.dizhizaihaijianceAry[i].alias)) {
          continue;
        }
        this.currentLayersAlias.push(URL_CONFIG.dizhizaihaijianceAry[i].alias);
        this.addDzzhjcLayer(URL_CONFIG.dizhizaihaijianceAry[i].name, URL_CONFIG.dizhizaihaijianceAry[i].alias, URL_CONFIG.dizhizaihaijianceAry[i].icon);
      }
    },
    // 添加地质灾害监测散点图
    addDzzhjcLayer(name, alias, icon) {
      if (this.loadedLayer.indexOf(alias + '_layer') >= 0) {
        if (this.map.getLayer(alias + '_layer')) {
          this.map.removeLayer(alias + '_layer');
        }
        this.map.addLayer({
          'id': alias + '_layer',
          'source': alias,
          "type": "symbol",
          "layout": {
            'icon-image': alias + '_Point',
            'icon-size': 0.6,
            'icon-allow-overlap': true
          }
        });
      } else {
        this.loadedLayer.push(alias + '_layer');
        var __this = this;
        this.map.loadImage(icon, function(error, image) {
          if (error) {
            console.log("error: " + error);
          }
          if (!__this.map.hasImage(alias + '_Point')) {
            __this.map.addImage(alias + '_Point', image);
          }
          if (__this.map.getLayer(alias + '_layer')) {
            __this.map.removeLayer(alias + '_layer');
          }
          __this.map.addLayer({
            'id': alias + '_layer',
            'source': alias,
            "type": "symbol",
            "layout": {
              'icon-image': alias + '_Point',
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          });
        });
        this.map.on('click', alias + '_layer', (e) => {
          var dzzhjcData = e.features[0].properties;
          // console.log('dzzhjcData: ' + CircularJSON.stringify(dzzhjcData));
          __this.$emit('showDiZai', dzzhjcData);
        });
      }

      var isAddedLegend = false;
      for (var i = 0; i < this.legendAry.length; i++) {
        if (this.legendAry[i].des === name) {
          isAddedLegend = true;
          break;
        }
      }
      if (isAddedLegend === false) {
        this.legendAry.push({ "icon": icon, "des": name });
        this.legendMsg = { "legendAry": this.legendAry };
      }
    },
    // 绘制弹框
    queryMonitorBySmid(alias, smid, longitude, latitude, data) {
      // console.log('longitude: ' + longitude);
      // console.log('latitude: ' + latitude);
      console.log(alias)
      var __this = this;
      // console.log(alias)
      switch (alias) {
        case "shuiliyuqingjiance":
        case "shuiliyuqingjiance-wenzhou":
          getRainMonitorDetailBySmid(smid, '0').then(
            data => {
              // console.log("data: " + JSON.stringify(data));
              __this.addEchartHtml2(data.name, data.time, data.station, longitude, latitude, 'shuili');
              __this.loadEchartData2(data.details, 'shuili');
            }
          );
          break;
        case "qixiangyuqingjiance":
        case "qixiangyuqingjiance-wenzhou":
          getRainMonitorDetailBySmid(smid, '1').then(
            data => {
              __this.addEchartHtml2(data.name, data.time, data.station, longitude, latitude, 'qixiang');
              __this.loadEchartData2(data.details, 'qixiang');
            }
          );
          break;
        case "dongtoushuikushuiqingjiance":
          getDTReservoirMonitorDetailBySmid(smid).then(
            data => {
              data.type = 'shuiku'
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, '', data);
              __this.loadEchartDataShuiku(data.details, true, data, data.xxsw, data.cklz, '校核洪水位');
            }
          );
          break;
        case "dongtoushuizhajiance":
          getDTWaterGateDetailBySmid(smid).then(
            data => {
              data.type = 'dongtoushuizha'
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, '', data);
              __this.loadEchartDataShuiku(data.details, true, data, data.xxsw, data.cklz, '水闸水位');
            }
          );
          break;
        case "qiwenjiance":
          getRainMonitorDetailBySmid(smid, '1').then(
            data => {
              __this.addEchartHtml2(data.name, data.time, data.station, longitude, latitude, 'qiwen');
              __this.loadEchartData2(data.details, 'qiwen');
            }
          );
          break;
        case "hedaoshuiqingjiance":
        // case "yongjiahedaoshuiqingjiance":
          getRiverMonitorDetailBySmid(smid).then(
            data => {
              // console.log('data:' + CircularJSON.stringify(data))
              data.type = 'hedao'
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, '', data);
              // console.log(data)
              const cklz = data.details[0] && data.details[0].value && data.details[0].value.grz
              __this.loadEchartDataShuiku(data.details, true, data, data.max, cklz, '保证水位');
            }
          );
          break;
        case "shuikushuiqingjiance":
        // case "yongjiashuikushuiqingjiance":
          getReservoirMonitorDetailBySmid(smid).then(
            data => {
              // data = {
              //   'name': '钟前',
              //   'station': '乐清市水利局        ',
              //   'time': '2020-08-04 11:26-08-05 11:26',
              //   'max': '123.96',
              //   'min': '0',
              //   'xxsw': '120.16',
              //   'cklz': '0',
              //   'zkr': '2134.0',
              //   'nkr': '1659.34',
              //   'details': [
              //     { 'name': '11:26', 'value': { 'position': 1, 'stm': '2020-08-04 11', 'kssw': '123.55' } },
              //     { 'name': '12:26', 'value': { 'position': 2, 'stm': '2020-08-04 12', 'kssw': '123.73' } },
              //     { 'name': '13:26', 'value': { 'position': 3, 'stm': '2020-08-04 13', 'kssw': '123.82' } },
              //     { 'name': '14:26', 'value': { 'position': 4, 'stm': '2020-08-04 14', 'kssw': '123.86' } },
              //     { 'name': '15:26', 'value': { 'position': 5, 'stm': '2020-08-04 15', 'kssw': '123.87' } },
              //     { 'name': '16:26', 'value': { 'position': 6, 'stm': '2020-08-04 16', 'kssw': '123.86' } },
              //     { 'name': '17:26', 'value': { 'position': 7, 'stm': '2020-08-04 17', 'kssw': '123.82' } },
              //     { 'name': '18:26', 'value': { 'position': 8, 'stm': '2020-08-04 18', 'kssw': '123.76' } },
              //     { 'name': '19:26', 'value': { 'position': 9, 'stm': '2020-08-04 19', 'kssw': '123.69' } },
              //     { 'name': '20:26', 'value': { 'position': 10, 'stm': '2020-08-04 20', 'kssw': '123.59' } },
              //     { 'name': '21:26', 'value': { 'position': 11, 'stm': '2020-08-04 21', 'kssw': '123.49' } },
              //     { 'name': '22:26', 'value': { 'position': 12, 'stm': '2020-08-04 22', 'kssw': '123.52' } },
              //     { 'name': '23:26', 'value': { 'position': 13, 'stm': '2020-08-04 23', 'kssw': '123.58' } },
              //     { 'name': '00:26', 'value': { 'position': 14, 'stm': '2020-08-05 00', 'kssw': '123.63' } },
              //     { 'name': '01:26', 'value': { 'position': 15, 'stm': '2020-08-05 01', 'kssw': '123.68' } },
              //     { 'name': '02:26', 'value': { 'position': 16, 'stm': '2020-08-05 02', 'kssw': '123.72' } },
              //     { 'name': '03:26', 'value': { 'position': 17, 'stm': '2020-08-05 03', 'kssw': '123.76' } },
              //     { 'name': '04:26', 'value': { 'position': 18, 'stm': '2020-08-05 04', 'kssw': '123.79' } },
              //     { 'name': '05:26', 'value': { 'position': 19, 'stm': '2020-08-05 05', 'kssw': '123.82' } },
              //     { 'name': '06:26', 'value': { 'position': 20, 'stm': '2020-08-05 06', 'kssw': '123.86' } },
              //     { 'name': '07:26', 'value': { 'position': 21, 'stm': '2020-08-05 07', 'kssw': '123.88' } },
              //     { 'name': '08:26', 'value': { 'position': 22, 'stm': '2020-08-05 08', 'kssw': '123.91' } },
              //     { 'name': '09:26', 'value': { 'position': 23, 'stm': '2020-08-05 09', 'kssw': '123.94' } },
              //     { 'name': '10:26', 'value': { 'position': 24, 'stm': '2020-08-05 10', 'kssw': '123.95' } },
              //     { 'name': '11:26', 'value': { 'position': 25, 'stm': '2020-08-05 11', 'kssw': '123.96' } }
              //   ]
              // }
              data.type = 'shuiku'
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, '', data);
              __this.loadEchartDataShuiku(data.details, true, data, data.xxsw, data.cklz, '校核洪水位');
            }
          );
          break;
        case "jishuidianjiance":
          getPondingDetailBySmidNew(smid, 0).then(
            data => {
              data.type = 0
              // console.log("data: " + JSON.stringify(data));
              // __this.addEchartHtml(data, data.time, data.station, longitude, latitude, 'jishuidianjiance');
              // __this.loadEchartData(data.details);
              // __this.loadEchartDataShuiku(data.details, true, data, data.max, cklz, '保证水位');
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, 'jishuidianjiance', data);
              __this.loadEchartDataJiShui(data.details, true, data, data.xxsw, data.cklz);
            }
          );
          break;
        case "jishuidianjiance_paishui":
          getPondingDetailBySmidNew(smid, 1).then(
            data => {
              // console.log("data: " + JSON.stringify(data));
              data.type = 1;
              __this.addEchartHtml(data.name, data.time, data.station, longitude, latitude, 'jishuidianjiance', data);
              __this.loadEchartDataJiShui(data.details, true, data, data.xxsw, data.cklz);
              // __this.loadEchartData(data.details);
            }
          );
          break;
        case "yuchuanjiance":
          getFishBoatDetailSmid(smid).then(
            data => {
              // data = {
              //   cgj: '东山街道',
              //   power: '110',
              //   shipmate: '钢质',
              //   shipname: '浙瑞渔01804',
              //   speed: '3.2',
              //   tonnage: '67',
              //   workmode: '对网',
              //   worktype: '围网',
              //   direction: '东南'
              // }
              // console.log("data: " + JSON.stringify(data));
              __this.addBoatTipHtml(data, longitude, latitude);
              // __this.loadEchartData(data.details);
            }
          );
          break;
        case "liangkeyiweijiance_hc":
          getEnterpriseDetailSmid(smid).then(
            data => {
              // console.log("data: " + JSON.stringify(data));
              __this.addEnterpriseTipHtml2(data, longitude, latitude);
            }
          );
          break;
        case "liangkeyiweijiance_kc":
          getEnterpriseDetailSmid(smid).then(
            data => {
              // console.log("data: " + JSON.stringify(data));
              __this.addEnterpriseTipHtml2(data, longitude, latitude);
            }
          );
          break;
        case "jingqukeliuliangjiance":
          getScenicDetailBySmid(smid).then(
            data => {
              __this.addScenicTipHtml(data, longitude, latitude);
            }
          );
          break;
        case "yuchuanjiance":
          getFishBoatDetailSmid(smid).then(data => {
            __this.addEnterpriseTipHtml(data, longitude, latitude);
          })
          break;
        case "shuizhajiance":
          let res = data
          var yesterday = new Date((new Date).getTime() - 48 * 60 * 60 * 1000);
          var startTime = __this.convertDateToString(yesterday);
          var endTime = __this.convertDateToString(new Date());
          // console.log('smid: ' + smid);
          // console.log('startTime: ' + startTime);
          // console.log('endTime: ' + endTime);
          res.startTime = startTime
          res.endTime = endTime
          if (!startTime) return
          getWaterGateDetailBySmid(smid, startTime, endTime).then(data => {
            __this.addShuizhajianceTipHtml(data, longitude, latitude, res);
          })
          break;
        case "fenglijiance":
          getQXWindDetail(smid).then(
            data => {
              // console.log('smid: ' +smid)
              // console.log('getQXWindDetaildata: ' + CircularJSON.stringify(data))
              __this.addEchartHtmlFengli(data.name, data.time, data.station, longitude, latitude, 'fengli');
              __this.loadEchartDataFengli(data.dataList, 'fengli');
            }
          );
          break;
        default:
          break;
      }
    },
    DateToString(date) {
      console.log(date.config)
      if (!date.config.dateTime) return ''
      const y = date.config.dateTime.year
      let m = date.config.dateTime.month + 1;
      let d = date.config.dateTime.date;
      let h = date.config.dateTime.hours;
      let mi = date.config.dateTime.minutes;
      let s = date.config.dateTime.seconds;
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
      h = h < 10 ? '0' + h : h;
      mi = mi < 10 ? '0' + mi : mi;
      s = s < 10 ? '0' + s : s;
      var res = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
      return res;
    },
    convertDateToString(date) {
      const y = date.getFullYear().toString();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let mi = date.getMinutes();
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
      h = h < 10 ? '0' + h : h;
      mi = mi < 10 ? '0' + mi : mi;
      var res = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':00';
      return res;
    },
    // 专门给水情用的
    loadEchartDataShuiku(details, bool, data, xxsw, cklz, legendName) {
      let name = '汛限水位'
      if (data.type === 'hedao') {
        name = '警戒水位'
      }
      var dataname = [];
      var datanum = [];
      var datawarn = [
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8'
      ];
      var dataCklz = [
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8'
      ]
      if (details || details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].name);
          if (bool) {
            datanum.push(details[i].value.kssw);
            datawarn[i] = xxsw
            dataCklz[i] = cklz > 0 ? cklz : '-'
          } else {
            datanum.push(details[i].value);
          }
        }
      }
      let series = [
        {
          name: '当前水位',
          data: datanum,
          type: 'line',
          symbol: 'circle',
          areaStyle: {
            normal: { color: 'rgba(255,0,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#0cdcf7', // 改变折线点的颜色
              lineStyle: {
                color: '#50bcff' // 改变折线颜色
              }
            }
          },
          smooth: true
        },
        {
          name: name,
          data: datawarn,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            normal: { color: 'rgba(255,165,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#FFA500', // 改变折线点的颜色
              lineStyle: {
                color: '#FFA500' // 改变折线颜色
              }
            }
          },
          smooth: true
        }
      ]
      if (data.type === 'dongtoushuizha') {
        series = [{
          name: '闸下水位',
          data: datanum,
          type: 'line',
          symbol: 'circle',
          areaStyle: {
            normal: { color: 'rgba(255,0,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#0cdcf7', // 改变折线点的颜色
              lineStyle: {
                color: '#50bcff' // 改变折线颜色
              }
            }
          },
          smooth: true
        },]
      }
      if (cklz !== null && cklz !== undefined) {
        series.push({
          name: legendName,
          data: dataCklz,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            normal: { color: 'rgba(255,0,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#ff0000', // 改变折线点的颜色
              lineStyle: {
                color: '#ff0000' // 改变折线颜色
              }
            }
          },
          smooth: true
        })
      }
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          show: true,
          top: 55,
          right: 35,
          left: 27,
          bottom: 30,
          containLabel: true
        },
        legend: {
          left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          itemGap: 10
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          min: 0,
          max: 500,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: series
      }
      if (data) {
        let list = []
        data.details.map(val => {
          list.push(val.value.kssw)
        })
        list.push(data.xxsw || data.max)
        let min = Math.min.apply(null, list)
        let max = Math.max.apply(null, list)
        if (cklz && cklz > max) {
          max = cklz - 0
        }
        if (data.max) {
          options.yAxis = { ...options.yAxis, ...{ max: Math.floor(max + 2), min: Math.floor(min - 2) } }
          myChart.setOption(options)
        } else {
          let content = document.getElementsByClassName('myechart')[0]
          // console.log(content)
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          text.innerHTML = '暂无数据'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      } else {
        myChart.setOption(options)
      }
      // 弹框结束
    },
    // 专门给积水点用的
    loadEchartDataJiShui(details, bool, data, xxsw, cklz, legendName) {
      let name = '汛限水位'
      if (data.type === 'hedao') {
        name = '警戒水位'
      }
      var dataname = []
      var datanum = []
      if (details || details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].name)
          datanum.push(details[i].value)
        }
      }
      let series = [
        {
          name: '积水点位',
          data: datanum,
          type: 'line',
          symbol: 'circle',
          areaStyle: {
            normal: { color: 'rgba(255,0,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#0cdcf7', // 改变折线点的颜色
              lineStyle: {
                color: '#50bcff' // 改变折线颜色
              }
            }
          },
          smooth: true
        }
      ]
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          show: true,
          top: 55,
          right: 35,
          left: 27,
          bottom: 30,
          containLabel: true
        },
        legend: {
          left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          itemGap: 10
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          min: 0,
          max: 500,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: series
      }
      if (data) {
        let list = []
        data.details.map(val => {
          list.push(val.value)
        })
        let min = Math.min.apply(null, list)
        let max = Math.max.apply(null, list)
        if (details.length > 0) {
          options.yAxis = { ...options.yAxis, ...{ max: Math.floor(max + 2), min: Math.floor(min - 2) } }
          myChart.setOption(options)
        } else {
          let content = document.getElementsByClassName('myechart')[0]
          // console.log(content)
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          text.innerHTML = '暂无数据'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      } else {
        myChart.setOption(options)
      }
      // 弹框结束
    },
    queryCameraBySmid(videoUrl, longitude, latitude, data) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + (data.name || data.NAME) + '</h3>'
        + '<div class="iframe-box">'
        + '<button onclick="showFullVideo(\'' + videoUrl + '\')">全屏</button>'
        + '<iframe class="iframe" src="' + videoUrl + '"></iframe>'
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      // console.log(tipElArr)
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    queryCameraBySmid2(videoUrl, data) {
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + (data.name || data.NAME) + '</h3>'
        + '<div class="iframe-box">'
        + '<button onclick="showFullVideo(\'' + videoUrl + '\')">全屏</button>'
        + '<iframe class="iframe" src="' + videoUrl + '"></iframe>'
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setHTML(html).addTo(this.map);
    },
    addBoatTipHtml(data, longitude, latitude) {
      console.log(data)
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + data.shipname + '</h3>'
        + '<ul>'
        + '<li><span>经度:</span><span>' + Number(longitude).toFixed(6) + '</span></li>'
        + '<li><span>纬度:</span><span>' + Number(latitude).toFixed(6) + '</span></li>'
        + '<li><span>吨位:</span><span>' + (data.tonnage || 0) + '吨</span></li>'
        + '<li><span>功率:</span><span>' + (data.power || 0) + 'kw</span></li>'
        + '<li><span>渔船属地:</span><span>' + (data.cgj || '暂无信息') + '</span></li>'
        + '<li><span>作业方式:</span><span>' + (data.workmode || '暂无信息') + '</span></li>'
        + '<li><span>渔船类型:</span><span>' + (data.worktype || '暂无信息') + '</span></li>'
        + '<li><span>航向:</span><span>' + (data.direction || '暂无信息') + '</span></li>'
        + '<li><span>速度:</span><span>' + (data.speed && (data.speed / 10).toFixed(2) + 'm/s' || '暂无信息') + '</span></li>'
        + '<li><span>上报时间:</span><span>' + (data.reportTime || '暂无信息') + '</span></li>'
        + '</ul>'
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    addEnterpriseTipHtml(data, longitude, latitude) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + data.plate + '</h3>'
        + '<ul>'
        + '<li><span>警报类型:</span><span>' + data.warnType + '</span></li>'
        + '</ul>'
        + '</div>';
      if (data.shipname) {
        var html = '<div class="pop-tip-jianceyujing">'
          + '<h3>' + data.shipname + '</h3>'
          + '<ul>'
          // + '<li><span>材质:</span><span>' + data.shipmate + '</span></li>'
          // + '<li><span>吨位:</span><span>' + data.tonnage + '</span></li>'
          // + '<li><span>功率:</span><span>' + data.power + '</span></li>'
          + '<li><span>渔船属地:</span><span>' + data.cgj + '</span></li>'
          // + '<li><span>作业方式:</span><span>' + data.workmode + '</span></li>'
          // + '<li><span>作业类型:</span><span>' + data.worktype + '</span></li>'
          + '</ul>'
          + '</div>';
      }
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    addEnterpriseTipHtml2(data, longitude, latitude) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing pop-tip-liangkeyiwei">'
        + '<h3>' + data.plate + '</h3>'
        + '<ul>'
        + '<li><span>警报类型:</span><span>' + data.warnType + '</span></li>'
        + '<li><span>警报时间:</span><span>' + data.gpsTime + '</span></li>'
        + '</ul>'
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    // 水闸监测弹框
    addShuizhajianceTipHtml(data, longitude, latitude, res) {
      console.log(data)
      // console.log('data: ' + CircularJSON.stringify(data));
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var smid = res.smid == undefined ? res.SMID : res.smid;
      var name = res.name == undefined ? res.NAME : res.name;
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + name + '</h3>'
        + `<div class="types">
            <div class='type-item' onclick="shuizhaTab('0')">水闸工情</div>
            <div class='' onclick="shuizhaTab('1')">水位-流量过程</div>
          </div>
          <div class='search'>
            <div class='start-time'>时间:<input type="text" value='${res.startTime}' id="startCreatetime"></div>
            <div class='end-time'>结束:<input type="text"  value='${res.endTime}' id="endCreatetime"></div>
            <button onclick="shuizhaSearch('${smid}', '${name}', '${longitude}', '${latitude}', '${res.startTime}', '${res.endTime}')">查询</button>
          </div>
          `
        + `<div class="chart">
          <div class='wrapper'>
            <div class='myechart'></div>
          </div>
        </div>`
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      })
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
      this.loadEchartDataShuizha(data, 0, longitude, latitude)
    },
    // 水闸加载echart
    loadEchartDataShuizha(details, type) {
      console.log(laydate)
      this.shuizhaDetail = details
      // if (this.dateTime1) {
      //   console.log(this.dateTime1)
      //   this.dateTime1.remove()
      // }
      // if (this.dateTime2) {
      //   this.dateTime2.remove()
      // }
      // this.dateTime1 = null
      // this.dateTime2 = null
      if (document.getElementById('startCreatetime')) {
        this.dateTime1 = laydate.render({
          elem: '#startCreatetime',
          type: 'datetime'
        })
      }
      if (document.getElementById('endCreatetime')) {
        this.dateTime2 = laydate.render({
          elem: '#endCreatetime',
          type: 'datetime'
        });
      }
      let name = '汛限水位'
      var dataname = [];
      var dwz = [];
      var upz = [];
      var mxgtq = []
      if (details && details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].name)
          upz.push(details[i].upz)
          dwz.push(details[i].dwz)
          mxgtq.push(details[i].mxgtq)
        }
      }

      let option = {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          itemGap: 10,
          data: ['闸上水位', '闸下水位', '流量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        // xAxis: {
        //   type: 'category',
        //   boundaryGap: false,
        //   data: dataname
        // },
        // yAxis: {
        //   type: 'value'
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255, 255, 255, 0.4)",
              type: "dotted"
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          // min: 0,
          // max: 500,
          // splitLine: {
          //   show: false
          // },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '闸上水位',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#5de1ff', // 改变折线点的颜色
                lineStyle: {
                  color: '#5de1ff' // 改变折线颜色
                }
              }
            },
            data: upz
          },
          {
            name: '闸下水位',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#b2e34e', // 改变折线点的颜色
                lineStyle: {
                  color: '#b2e34e' // 改变折线颜色
                }
              }
            },
            data: dwz
          },
          {
            name: '流量',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#eb7875', // 改变折线点的颜色
                lineStyle: {
                  color: '#eb7875' // 改变折线颜色
                }
              }
            },
            data: mxgtq
          }
        ]
      }
      if (type === 0) {
        option.legend.data = ['闸上水位', '闸下水位']
        option.series = [
          {
            name: '闸上水位',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#5de1ff', // 改变折线点的颜色
                lineStyle: {
                  color: '#5de1ff' // 改变折线颜色
                }
              }
            },
            data: upz
          },
          {
            name: '闸下水位',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#b2e34e', // 改变折线点的颜色
                lineStyle: {
                  color: '#b2e34e' // 改变折线颜色
                }
              }
            },
            data: dwz
          }
        ]
      } else {
        option.legend.data = ['流量']
        option.series = [
          {
            name: '流量',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#eb7875', // 改变折线点的颜色
                lineStyle: {
                  color: '#eb7875' // 改变折线颜色
                }
              }
            },
            data: mxgtq
          }
        ]
      }
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      if (details.length === 0) {
        let content = document.getElementsByClassName('myechart')[0]
        // console.log(content)
        let cover = document.createElement('div')
        cover.className = 'kong'
        let text = document.createElement('div')
        text.innerHTML = '暂无数据'
        text.className = 'text'
        cover.appendChild(text)
        content.appendChild(cover)
      } else {
        myChart.setOption(option)
      }
      // 弹框结束
    },
    addScenicTipHtml(data, longitude, latitude) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + data.name + '</h3>'
        + '<ul>'
        + '<li><span>街道:</span><span>' + data.street + '</span></li>'
        + '<li><span>当前人数:</span><span>' + (data.nowCount ? data.nowCount : 0) + '</span></li>'
        + '<li><span>瞬时承载客流量:</span><span>' + data.momentCount + '</span></li>'
        + '<li><span>当天承载客流量:</span><span>' + data.dayCount + '</span></li>'
        + '</ul>'
        + '</div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    addCameraHtml(videoUrl, longitude, latitude) {
    },
    // 添加弹框html
    addEchartHtml(name, time, station, longitude, latitude, type, data) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + name + '</h3>'
        + '<div class="time">'
        + '<span>' + time + '</span>'
        + (station !== '' ? '<span class="spc">测站所属:' + (station || "暂无信息") + '</span>' : '<span class="spc"></span>')
        + '</div>'
        + (this.userInfo.districtName === '永嘉县' && data && data.type === 'shuiku' ? '<div class="time time-top"><span>当前库容: ' + (data && data.nkr || '暂无') + ' (万立方) / 总库容: ' + (data && data.zkr || '暂无') + ' (万立方)</span></div>' : '')
        + '<div class="chart">'
        + '<div class="wrapper">'
        + '<div class="tip"><span style="margin-right:0.3rem;margin-top:14.6%">24小时水情监测</span>' +
        // '<div><span></span>当前水位</div>' +
        // '<div><span style="background-color:#ff0000"></span>汛限水位</div>' +
        '</div>'
        + '<div class="tip_2">单位(m)</div>'
        + '<div class="myechart"></div>'
        + '</div></div></div>';
      // 积水点监测
      if (type === 'jishuidianjiance') {
        console.log(type)
        // const data = name
        // html = '<div class="pop-tip-jianceyujing pop-jishuidian">'
        //   + '<h3>' + data.name + '</h3>'
        //   + '<ul>'
        //   + '<li><span>水位:</span><span>' + (data.waterLevel || '暂无') + (!data.waterLevel || data.waterLevel === '暂无' ? '' : 'cm') + '</span></li>'
        //   + '<li><span>历史最高水位:</span><span>' + data.historicalHighestWaterLevel + (data.historicalHighestWaterLevel === '暂无' ? '' : 'cm') + '</span></li>'
        //   // + '<li><span>采集时间:</span><span>' + data.acquisitionTime + '</span></li>'
        //   + '<li><span>最新更新时间:</span><span>' + (data.lastUpdatedTime || '暂无') + '</span></li>'
        //   + '</ul>'
        //   + '</div>';
        html = '<div class="pop-tip-jianceyujing">'
          + '<h3>' + name + '</h3>'
          // + '<div class="time">'
          // + '<span>' + time + '</span>'
          // + (station !== '' ? '<span class="spc">测站所属:' + (station || "暂无信息") + '</span>' : '<span class="spc"></span>')
          // + '</div>'
          // + (this.userInfo.districtName === '永嘉县' && data && data.type === 'shuiku' ? '<div class="time time-top"><span>当前库容: ' + (data && data.nkr || '暂无') + ' (万立方) / 总库容: ' + (data && data.zkr || '暂无') + ' (万立方)</span></div>' : '')
          + '<div class="chart">'
          + '<div class="wrapper">'
          // + '<div class="tip"><span style="margin-right:0.3rem;margin-top:14.6%">24小时水情监测</span>' +
          // // '<div><span></span>当前水位</div>' +
          // // '<div><span style="background-color:#ff0000"></span>汛限水位</div>' +
          // '</div>'
          // + '<div class="tip_2">单位(m)</div>'
          + '<div class="myechart"></div>'
          + '</div></div></div>';
      }
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      console.log(html)
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    loadEchartData(details, bool, data, xxsw) {
      // console.log(data)
      let name = '汛限水位'
      if (data.type === 'hedao') {
        name = '警戒水位'
      }
      var dataname = [];
      var datanum = [];
      var datawarn = [
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8',
        '0.8'
      ];
      if (details || details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].name);
          if (bool) {
            datanum.push(details[i].value.kssw);
            datawarn[i] = xxsw
          } else {
            datanum.push(details[i].value);
          }
        }
      }
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          show: true,
          top: 55,
          right: 35,
          left: 27,
          bottom: 30,
          containLabel: true
        },
        legend: {
          left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          itemGap: 20
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          min: 0,
          max: 500,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          // {},
          {
            name: '当前水位',
            data: datanum,
            type: 'line',
            symbol: 'circle',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#0cdcf7', // 改变折线点的颜色
                lineStyle: {
                  color: '#50bcff' // 改变折线颜色
                }
              }
            },
            smooth: true
          },
          {
            name: name,
            data: datawarn,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#ff0000', // 改变折线点的颜色
                lineStyle: {
                  color: 'rgba(255,0,0)' // 改变折线颜色
                }
              }
            },
            smooth: true
          }
        ]
      }
      if (data) {
        let list = []
        data.details.map(val => {
          list.push(val.value.kssw)
        })
        list.push(data.xxsw || data.max)
        let min = Math.min.apply(null, list)
        let max = Math.max.apply(null, list)
        if (data.max) {
          options.yAxis = { ...options.yAxis, ...{ max: Math.floor(max + 2), min: Math.floor(min - 2) } }
          // console.log(options)
          myChart.setOption(options)
        } else {
          let content = document.getElementsByClassName('myechart')[0]
          // console.log(content)
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          text.innerHTML = '暂无数据'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      } else {
        myChart.setOption(options)
      }
      // 弹框结束
    },
    // 添加雨情弹框html
    addEchartHtml2(name, time, station, longitude, latitude, type) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) }
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + (name || "暂无信息") + '</h3>'
        + '<div class="time">'
        + '<span>' + (time || "暂无信息") + '</span>'
        + (station !== '' ? '<span class="spc">测站所属:' + (station || "暂无信息") + '</span></div>' : '<span class="spc"></span></div>')
        + '<div class="chart">'
        + '<div class="wrapper">'
        + '<div class="tip"><span style="margin-right:0.3rem;margin-top:14%">24小时' + (type === 'qiwen' ? '温度' : '雨量') + '监测</span></div>'
        + '<div class="tip_2">单位(mm)</div>'
        + (this.userInfo.districtName === '文成县' && (type === 'qixiang' || type === 'qiwen') ? '<div class="tip_3">温度</div>' : '')
        + '<div class="myechart"></div>'
        + '</div></div></div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    // 添加风力弹框html
    addEchartHtmlFengli(name, time, station, longitude, latitude, type) {
      var lngLat = { "lng": Number(longitude), "lat": Number(latitude) }
      var html = '<div class="pop-tip-jianceyujing">'
        + '<h3>' + (name || "暂无信息") + '</h3>'
        + '<div class="chart">'
        + '<div class="wrapper">'
        + '<div class="tip_2">实时风力(m/s)</div>'
        + '<div class="myechart"></div>'
        + '</div></div></div>';
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
    },
    loadEchartData2(details, type) {
      var dataname = [];
      var datanum = [];
      if (details && details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].name);
          datanum.push(details[i].value);
        }
      }
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      if ((this.userInfo.districtName === '文成县' && type === 'qixiang') || type === 'qiwen') {
        var datatemperature = []
        for (var i = 0; i < details.length; i++) {
          datatemperature.push(details[i].temp);
        }
        myChart.setOption({
          grid: {
            show: true,
            top: 55,
            right: 35,
            left: 27,
            bottom: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: dataname,
              axisPointer: {
                type: 'shadow'
              }
              ,
              axisLabel: {
                align: 'center',
                margin: 10,
                textStyle: {
                  color: '#fff', // 坐标值得具体的颜色
                  fontSize: 14
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                textStyle: {
                  color: '#fff', // 坐标值得具体的颜色
                  fontSize: 14
                }
              },
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              }
            },
            {
              type: 'value',
              interval: 5,
              axisLabel: {
                formatter: '{value} °C',
                textStyle: {
                  color: '#fff', // 坐标值得具体的颜色
                  fontSize: 14
                }
              },
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '降雨',
              data: datanum,
              type: 'bar',
              areaStyle: {
                normal: { color: 'rgba(255,0,0,0)' }
              },
              itemStyle: {
                normal: {
                  color: '#EB7C30', // 改变折线点的颜色
                  // lineStyle: {
                  //   color: '#EB7C30' // 改变折线颜色
                  // }
                }
              },
              smooth: true
            },
            {
              name: '温度',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              symbol: 'none',
              data: datatemperature,
              itemStyle: {
                normal: {
                  color: '#f00', // 改变折线点的颜色
                  // lineStyle: {
                  //   color: '#EB7C30' // 改变折线颜色
                  // }
                }
              },
            }
          ]
        });
      } else {
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            show: true,
            top: 55,
            right: 35,
            left: 27,
            bottom: 30,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dataname,
            axisLabel: {
              align: 'center',
              margin: 10,
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            },
            // min:20,
            // max:500,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          series: [
            // {},
            {
              data: datanum,
              type: 'bar',
              // symbol: 'circle',
              areaStyle: {
                normal: { color: 'rgba(255,0,0,0)' }
              },
              itemStyle: {
                normal: {
                  color: '#EB7C30', // 改变折线点的颜色
                  // lineStyle: {
                  //   color: '#EB7C30' // 改变折线颜色
                  // }
                }
              },
              smooth: true
            }
          ]
        });
      }
      let max = 0
      for (let i = 0; i < datanum.length; i++) {
        if (datanum[i] - 0 > max) {
          max = datanum[i] - 0
        }
      }
      if (max === 0) {
        let kongFlag = true
        if (this.userInfo.districtName === '文成县' && (type === 'qixiang' || type === 'qiwen')) {
          for (let i = 0; i < datatemperature.length; i++) {
            console.log(datatemperature[i] - 0 > 0)
            if (datatemperature[i].length && datatemperature[i] - 0 > 0) {
              kongFlag = false
              break
            }
          }
        }
        if (kongFlag) {
          let content = document.getElementsByClassName('myechart')[0]
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          type === 'qiwen' ? text.innerHTML = '暂无数据' : text.innerHTML = '暂无降雨'
          // text.innerHTML = '暂无降雨'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      }
    },
    loadEchartDataFengli(details, type) {
      var dataname = [];
      var datanum = [];
      let dataMax = []
      if (details && details.length > 0) {
        for (var i = 0; i < details.length; i++) {
          dataname.push(details[i].tm);
          datanum.push(details[i].windv);
          dataMax.push(details[i].max_windv);
        }
      }
      const myChart = this.$echarts.init(document.querySelector('#map .pop-tip-jianceyujing .myechart'));
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          itemGap: 20
        },
        grid: {
          show: true,
          top: 55,
          right: 35,
          left: 27,
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          // min:20,
          // max:500,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '最高风力',
            data: dataMax,
            type: 'line',
            symbol: 'circle',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#0cdcf7', // 改变折线点的颜色
                lineStyle: {
                  color: '#50bcff' // 改变折线颜色
                }
              }
            },
            smooth: true
          },
          {
            name: '平均风力',
            data: datanum,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#ff0000', // 改变折线点的颜色
                lineStyle: {
                  color: 'rgba(255,0,0)' // 改变折线颜色
                }
              }
            },
            smooth: true
          }
          // {
          //   data: datanum,
          //   type: 'bar',
          //   // symbol: 'circle',
          //   areaStyle: {
          //     normal: { color: 'rgba(255,0,0,0)' }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: '#EB7C30', // 改变折线点的颜色
          //       // lineStyle: {
          //       //   color: '#EB7C30' // 改变折线颜色
          //       // }
          //     }
          //   },
          //   smooth: true
          // }
        ]
      });
      let max = 0
      for (let i = 0; i < dataMax.length; i++) {
        if (dataMax[i] - 0 > max) {
          max = dataMax[i] - 0
        }
      }
      if (max === 0) {
        let kongFlag = true
        // if (this.userInfo.districtName === '文成县' && (type === 'qixiang' || type === 'qiwen')) {
        //   for (let i = 0; i < datatemperature.length; i++) {
        //     console.log(datatemperature[i] - 0 > 0)
        //     if (datatemperature[i].length && datatemperature[i] - 0 > 0) {
        //       kongFlag = false
        //       break
        //     }
        //   }
        // }
        if (kongFlag) {
          let content = document.getElementsByClassName('myechart')[0]
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          type === 'qiwen' ? text.innerHTML = '暂无数据' : text.innerHTML = '暂无降雨'
          // text.innerHTML = '暂无降雨'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      }
    },
    // 删除要素图层
    removeLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.removeLayer(layname);
      }
    },
    hideLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.setLayoutProperty(layname, 'visibility', 'none');
      }
    },
    showLayer(layname) {
      this.map.setLayoutProperty(layname, 'visibility', 'visible');
    },
    // 图层添加弹框
    addAroundPopUp(layername) {
      var __this = this;
      this.map.on("click", layername, function(e) {
        // 详细信息处理
        e.features[0].properties.refresh = false;
        __this.$emit('setonePoint', e.features[0].properties);
        var feature = e.features[0];
        var showField = ['DISTRICT', 'NAME'];
        var mapPopName = ['名称', '地区', '地点'];
        var mapPopField = ['NAME', 'DISTRICT', 'ADDRESS'];

        // console.log('feature: ' + CircularJSON.stringify(feature));
        var longitude = feature.geometry.coordinates[0];
        var latitude = feature.geometry.coordinates[1];
        var lngLat = { "lng": Number(longitude), "lat": Number(latitude) };
        // 拼接地图气泡
        var str = '';
        for (var i = 1; i < mapPopField.length; i++) {
          str += `<p>${mapPopName[i]}:${feature.properties[mapPopField[i]] ? feature.properties[mapPopField[i]] : '暂无数据'}</p>`;
        }

        __this.showAroundRequestParam = { "center": feature.geometry.coordinates, "distance": "1000" };
        var html = `<div class="pop-tip">
                      <p class="">${feature.properties[mapPopField[0]]}</p>
                      ${str}
                      <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                      <span class="pop-tip-analyse" onclick="showAround()">周边分析</span>
                  </div>`;
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        // 弹出提示框
        var popup = new mapboxgl.Popup({
          closeOnClick: true
        });
        popup.setLngLat(lngLat).setHTML(html).addTo(__this.map);
      });
    },
    //zoom改变
    zoomChange(data) {
      if ('zoomIn' === data) {
        document.getElementsByClassName('mapboxgl-ctrl-zoom-in')[0].click();
      } else if ('zoomOut' === data) {
        document.getElementsByClassName('mapboxgl-ctrl-zoom-out')[0].click();
      }
    },
    baseMapChangedata(data) {
      // console.log('baseMapChangedata: ' + CircularJSON.stringify(data))
      if ('标准底图' === data) {
        this.checkValue('standard-raster');
      } else if ('大数据底图' === data) {
        this.checkValue('bigdata-raster');
      } else if ('影像' === data) {
        this.checkValue('YX-raster');
      }
    },
    currentMapToolData(data) {
      // console.log('currentMapToolData: ' + CircularJSON.stringify(data))
      if (data.value === 'line_string') {
        // 画线操作
        document.getElementsByClassName('mapbox-gl-draw_line')[0].click();
      }
    },
    measure(e) {
      // 用于空间查询，不做测量
      if (this.isSpatialQuery === true) {
        // 添加面图层
        var coordinatesAry = e.features[0].geometry.coordinates;
        // console.log("coordinatesAry: " + CircularJSON.stringify(coordinatesAry));
        this.addDrawPolygonLayer(coordinatesAry);

        // 设置几何查询范围
        var queryPolygonGeometry = {
          "type": "Polygon",
          "coordinates": coordinatesAry
        };
        var searchWithin = polygon(coordinatesAry);

        //遍历已加载的视频监控类型
        var smidList = '';
        for(var i = 0; i < this.videoAliasAry.length; i++) {
          var eachFeaturesAry = this.map.getSource(this.videoAliasAry[i] + "_source")._data.features;
          for(var j = 0; j < eachFeaturesAry.length; j++) {
            var currentPoint = point(eachFeaturesAry[j].geometry.coordinates);
            var ptsWithin = pointsWithinPolygon(currentPoint, searchWithin);
            if (ptsWithin.features.length > 0) {
              smidList += (eachFeaturesAry[j].properties.smid + ',');
            }
          }
        }
        if (smidList !== '') {
          smidList = smidList.substring(0, smidList.length-1);
        }
        // console.log('smidList: ' + smidList);
        var __this = this;
        getVideoTree('', this.videoLevel1Id, false, '', smidList).then(res => {
          // console.log('getVideoTreeData: ' + CircularJSON.stringify(res));
          res.smidList = smidList;
          __this.$bus.emit('videoTreeData', res);
        });
      } else {
        const type = e.features[0].geometry.type;
        var param = new SuperMap.MeasureParameters(e.features[0]);
        if ("LineString" === type) {
            // 添加线图层
            var coordinatesAry = e.features[0].geometry.coordinates;
            this.addDrawLineLayer(coordinatesAry);

            // console.log("e: " + CircularJSON.stringify(e));
            var __this = this;
            new MeasureService(URL_CONFIG.measureurl).measureDistance(param, (serviceResult) => {
              var distance = serviceResult.result.distance;
              var unit = serviceResult.result.unit;
              if (distance > 10000) {
                distance = distance / 1000;
                if ("METER" === unit) {
                  unit = "千米";
                }
              } else {
                if ("METER" === unit) {
                  unit = "米";
                }
              }
              // 保留2位小数
              distance = Math.round(distance * 100) / 100;
              __this.measureMsg = "当前长度: " + distance + " " + unit;

              var x = 0;
              var y = 0;
              var coordinatesAry = e.features[0].geometry.coordinates;
              if (coordinatesAry.length > 0) {
                x = coordinatesAry[0][0];
                y = coordinatesAry[0][1];
                var lngLat = [];
                lngLat[0] = x;
                lngLat[1] = y;
                var html = '<div class="pop-measure">' + __this.measureMsg + '</div>';
                // 删除别的提示框
                var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
                for (var i = 0; i < tipElArr.length; i++) {
                  tipElArr[i].click();
                }
                // 弹出提示框
                var popup = new mapboxgl.Popup({
                  closeOnClick: true
                });
                popup.setLngLat(lngLat).setHTML(html).addTo(__this.map);
                this.map.setCenter([x, y]);
                $(".mapboxgl-popup").css({ "min-width": "1rem", "width": "1.2rem", "height": "0.6rem" });
                $(".pop-measure").css({ "padding-bottom": "0rem", "line-height": "0.25rem" });
                $(".mapboxgl-popup-content").css({
                  "background-color": "rgba(0,47,87,0.9)",
                  "box-shadow": "rgb(46, 208, 255,0.4) 0px 0px 18px inset"
                });
              }
            });
        }
      }
    },
    addDrawLineLayer(coordinatesAry) {
      document.getElementsByClassName('mapbox-gl-draw_trash')[0].click();
      var dataFeature = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinatesAry
        }
      };
      if (!this.map.getSource("drawLine_source")) {
        this.map.addSource("drawLine_source", {
          "type": "geojson",
          "data": dataFeature
        });
      } else {
        this.map.getSource("drawLine_source").setData(dataFeature);
      }
      this.removeLayer("drawLine_layer");
      this.map.addLayer({
        "id": "drawLine_layer",
        "type": "line",
        "source": "drawLine_source",
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#0066e1",
          "line-width": 3
        }
      });
    },
    addDrawPolygonLayer(coordinatesAry) {
      document.getElementsByClassName('mapbox-gl-draw_trash')[0].click();
      var dataFeature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': coordinatesAry
        }
      };
      if (!this.map.getSource("drawPolygon_source")) {
        this.map.addSource("drawPolygon_source", {
          "type": "geojson",
          "data": dataFeature
        });
      } else {
        this.map.getSource("drawPolygon_source").setData(dataFeature);
      }
      this.removeLayer("drawPolygon_layer");
      this.map.addLayer({
        "id": "drawPolygon_layer",
        "type": "line",
        "source": "drawPolygon_source",
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#0066e1",
          "line-width": 3
        }
      });
    },
    mapInit() {
      if (this.userDistrict === '3303') {
        // 地图居中
        this.map.setZoom(8.5);
        this.map.flyTo({
          center: [120.462287, 27.90]
        });
      } else {
        // this.map.setZoom(10);
        if ('瑞安市' === this.districtName) {
          this.map.setZoom(10.2);
        } else if ('鹿城区' === this.districtName) {
          this.map.setZoom(10.8);
        } else if ('龙港市' === this.districtName) {
          this.map.setZoom(11);
        } else if ('龙湾区' === this.districtName) {
          this.map.setZoom(11.2);
        } else if ('经开区' === this.districtName) {
          this.map.setZoom(12);
        } else if ('瓯江口' === this.districtName) {
          this.map.setZoom(12.2);
        } else if ('永嘉县' === this.districtName) {
          this.map.setZoom(10.1);
        } else if ('瓯海区' === this.districtName || '洞头区' === this.districtName || '文成县' === this.districtName) {
          this.map.setZoom(10.5);
        } else {
          this.map.setZoom(10);
        }
        var districtCenter = [];
        for (var i = 0; i < getDistrictData.features.length; i++) {
          if (this.districtName === getDistrictData.features[i].properties.NAME) {
            districtCenter = getDistrictData.features[i].geometry.coordinates;
            break;
          }
        }
        if (districtCenter && districtCenter !== []) {
          // 地图移动到对应区县的中心点
          this.map.flyTo({
            center: districtCenter
          });
        }
      }
    },
    getCenterByDistrictCode(districtCode) {
      var districtCenter = [];
      for (var i = 0; i < getDistrictData.features.length; i++) {
        if (districtCode === getDistrictData.features[i].properties.CODE) {
          districtCenter = getDistrictData.features[i].geometry.coordinates;
          break;
        }
      }
      return districtCenter;
    },
    // 实时潮位pop框
    createChaoWeiPopup(data) {
      return `<div class='shishichaowei'>
      <div class="warn-dialog-title">${data.name}</div>
        <div class='myechart'></div>
      </div>`;
    },
    loadEchartDataChaowei(data) {
      let name = '警戒潮位'
      var dataname = [];
      var datanum = [];
      var datawarn = [
      ]
      if (data.timeLevel || data.timeLevel.length > 0) {
        for (var i = 0; i < data.timeLevel.length; i++) {
          dataname.push(data.timeLevel[i].name.split(' ')[1])
          datanum.push(data.timeLevel[i].value)
          datawarn.push(Number(data.jjcw.slice(0, data.jjcw.length - 1)))
        }
      }
      let series = [
        {
          name: '实时潮位',
          data: datanum,
          type: 'line',
          symbol: 'circle',
          areaStyle: {
            normal: { color: 'rgba(255,0,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#0cdcf7', // 改变折线点的颜色
              lineStyle: {
                color: '#50bcff' // 改变折线颜色
              }
            }
          },
          smooth: true
        },
        {
          name: name,
          data: datawarn,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            normal: { color: 'rgba(255,165,0,0)' }
          },
          itemStyle: {
            normal: {
              color: '#FFA500', // 改变折线点的颜色
              lineStyle: {
                color: '#FFA500' // 改变折线颜色
              }
            }
          },
          smooth: true
        }
      ]
      const myChart = this.$echarts.init(document.querySelector('#map .shishichaowei .myechart'));
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          show: true,
          top: 55,
          right: 35,
          left: 27,
          bottom: 30,
          containLabel: true
        },
        legend: {
          left: '40%',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          itemGap: 10
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            align: 'center',
            margin: 10,
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff', // 坐标值得具体的颜色
              fontSize: 14
            }
          },
          min: 0,
          max: 500,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: series
      }
      if (data) {
        let list = []
        data.timeLevel.map(val => {
          list.push(Number(val.value))
        })
        list.push(Number(data.jjcw.slice(0, data.jjcw.length - 1)))
        console.log(list)
        let min = Math.min.apply(null, list)
        let max = Math.max.apply(null, list)
        console.log(max)
        if (max) {
          options.yAxis = { ...options.yAxis, ...{ max: Math.floor(max + 2), min: Math.floor(min - 2) } }
          myChart.setOption(options)
        } else {
          let content = document.getElementsByClassName('myechart')[0]
          // console.log(content)
          let cover = document.createElement('div')
          cover.className = 'kong'
          let text = document.createElement('div')
          text.innerHTML = '暂无数据'
          text.className = 'text'
          cover.appendChild(text)
          content.appendChild(cover)
        }
      } else {
        myChart.setOption(options)
      }
      // 弹框结束
    },
    createWarnPopup(data) {
      // console.log(data)
      return `<div class='qixiangWarning'>
      <div class="warn-dialog-title">${data.title}</div>
      <div class='warn-from'>
        <div class='time'>发布时间：${data.publishDate}</div>
        <div class='position'>发布单位： ${data.PUBLISH_UNIT}</div>
      </div>
      <div class='warn-detail'>
        <p>${data.WARN_CONTENT}</p>
      </div>
      <div class='warn-measures'>
        <div class='title'>防范措施</div>
        <div class='measures-detail'>
          <p>${data.WARN_MEASURE}</p>
        </div>
      </div>
      <div class='cycle'>
        <div class='title'>预警生命周期</div>
        <div class='table-header'>
          <div class='title'>预警首发时间</div>
          <div class='title'>预警更新时间</div>
          <div class='title'>预警解除时间</div>
        </div>
        <div class='table-body'>
          <div class='title'>${data.publishDate}</div>
          <div class='title'></div>
          <div class='title'></div>
        </div>
      </div>
      </div>`;
    },
    createDzzhjcPopup(data) {
      return `<div class='qixiangWarning'>
      <div class="warn-dialog-title">${data.name}</div>
      </div>`;
    },
    getLiangkeyiweijianceData(sql, tablename, alias, name, icon, type) {
      var __this = this;
      var sqlText = '';
      if (this.userDistrict == '3303') {
        sqlText = sql;
      } else {
        if ("" === sql) {
          sqlText = "district_code='" + this.userDistrict + "'";
        } else {
          sqlText = "district_code='" + this.userDistrict + "' AND (" + sql + ")";
        }
      }

      getLiangkeyiweiList(sqlText, tablename, type).then(res => {
        // console.log('res: ' + CircularJSON.stringify(res))
        // console.log(res)
        var features = res.features;

        var featureAry1 = [];
        var featureAry2 = [];
        for (var i = 0; i < features.features.length; i++) {
          if (features.features[i].properties.alarm !== "" && features.features[i].properties.alarm.indexOf("1") >= 0) {
            featureAry2.push(features.features[i]);
          } else {
            featureAry1.push(features.features[i]);
          }
        }
        var features1 = { "type": "FeatureCollection", "features": featureAry1 };
        var features2 = { "type": "FeatureCollection", "features": featureAry2 };

        if (!__this.map.getSource(alias + "_source")) {
          __this.map.addSource(alias + "_source", {
            "type": "geojson",
            "data": features1
          });
        } else {
          __this.map.getSource(alias + "_source").setData(features1);
        }
        if (!__this.map.getSource(alias + "_warn_source")) {
          __this.map.addSource(alias + "_warn_source", {
            "type": "geojson",
            "data": features2
          });
        } else {
          __this.map.getSource(alias + "_warn_source").setData(features2);
        }

        if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
          if (__this.map.getLayer(alias + "_layer")) {
            __this.map.removeLayer(alias + "_layer");
          }
          __this.map.addLayer({
            "id": alias + "_layer",
            "type": "symbol",
            "source": alias + "_source",
            "layout": {
              'icon-image': alias + "_Point",
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          });
          if (__this.map.getLayer(alias + "_warn_layer")) {
            __this.map.removeLayer(alias + "_warn_layer");
          }
          __this.map.addLayer({
            "id": alias + "_warn_layer",
            "type": "symbol",
            "source": alias + "_warn_source",
            "layout": {
              'icon-image': alias + "_warn_Point",
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          });
        } else {
          __this.loadedLayer.push(alias + "_layer");

          var icon1 = icon.split(",")[0];
          var icon2 = icon.split(",")[1];
          __this.map.loadImage(icon1, function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_Point")) {
              __this.map.addImage(alias + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_layer")) {
              __this.map.removeLayer(alias + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_layer",
              "type": "symbol",
              "source": alias + "_source",
              "layout": {
                'icon-image': alias + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage(icon2, function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_warn_Point")) {
              __this.map.addImage(alias + "_warn_Point", image);
            }
            if (__this.map.getLayer(alias + "_warn_layer")) {
              __this.map.removeLayer(alias + "_warn_layer");
            }
            __this.map.addLayer({
              "id": alias + "_warn_layer",
              "type": "symbol",
              "source": alias + "_warn_source",
              "layout": {
                'icon-image': alias + "_warn_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.on("click", alias + "_layer", function(e) {
            var feature = e.features[0];

            var hignlightIcon = icon1.substring(0, 17) + "-light" + icon1.substring(17);
            __this.map.loadImage(hignlightIcon, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (__this.map.hasImage("highlight_Point")) {
                  __this.map.removeImage("highlight_Point");
                }
                __this.map.addImage("highlight_Point", image);

                var featuresAry = [];
                feature.id = 1;
                featuresAry.push(feature);
                if (!__this.map.getSource("highlight_source")) {
                  __this.map.addSource("highlight_source", {
                    "type": "geojson",
                    "data": {
                      "type":"FeatureCollection",
                      "features":featuresAry
                    }
                  });
                } else {
                  __this.map.getSource("highlight_source").setData({
                    "type":"FeatureCollection",
                    "features":featuresAry
                  });
                }
                if (__this.map.getLayer("highlight_layer")) {
                  __this.map.removeLayer("highlight_layer");
                }
                __this.map.addLayer({
                  "id": "highlight_layer",
                  "type": "symbol",
                  "source": "highlight_source",
                  "layout": {
                    'icon-image': "highlight_Point",
                    'icon-size': 0.8,
                    'icon-allow-overlap': true
                  }
                });
            });

            // console.log("feature: " + CircularJSON.stringify(feature));
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_warn_layer", function(e) {
            var feature = e.features[0];

            var hignlightIcon = icon2.substring(0, 17) + "-light" + icon2.substring(17);
            __this.map.loadImage(hignlightIcon, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (__this.map.hasImage("highlight_Point")) {
                  __this.map.removeImage("highlight_Point");
                }
                __this.map.addImage("highlight_Point", image);

                var featuresAry = [];
                feature.id = 1;
                featuresAry.push(feature);
                if (!__this.map.getSource("highlight_source")) {
                  __this.map.addSource("highlight_source", {
                    "type": "geojson",
                    "data": {
                      "type":"FeatureCollection",
                      "features":featuresAry
                    }
                  });
                } else {
                  __this.map.getSource("highlight_source").setData({
                    "type":"FeatureCollection",
                    "features":featuresAry
                  });
                }
                if (__this.map.getLayer("highlight_layer")) {
                  __this.map.removeLayer("highlight_layer");
                }
                __this.map.addLayer({
                  "id": "highlight_layer",
                  "type": "symbol",
                  "source": "highlight_source",
                  "layout": {
                    'icon-image': "highlight_Point",
                    'icon-size': 0.8,
                    'icon-allow-overlap': true
                  }
                });
            });
            // console.log("feature: " + CircularJSON.stringify(feature));
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
        }

        var isAddedLegend = false;
        for (var i = 0; i < __this.legendAry.length; i++) {
          if (__this.legendAry[i].des === name) {
            isAddedLegend = true;
            break;
          }
        }
        if (isAddedLegend === false) {
          var icon1 = icon.split(",")[0];
          __this.legendAry.push({ "icon": icon1, "des": name });
          __this.legendMsg = { "legendAry": __this.legendAry };
        }
      });
    },
    getYuchuanjianceData(sql, tablename, alias, name, icon) {
      var __this = this;
      var sqlText = '';
      if (this.userDistrict == '3303') {
        sqlText = sql;
      } else {
        if ("" === sql) {
          sqlText = "district_code='" + this.userDistrict + "'";
        } else {
          sqlText = "district_code='" + this.userDistrict + "' AND (" + sql + ")";
        }
      }

      getYuchuanjianceList(sqlText, tablename).then(res => {
        // console.log('res: ' + CircularJSON.stringify(res))
        var features = res.features;

        var featureAry1 = [];
        var featureAry2 = [];
        var featureAry3 = [];
        var featureAry4 = [];
        var featureAry5 = [];
        var featureAry6 = [];
        var featureAry7 = [];
        var featureAry8 = [];
        for (var i = 0; i < features.features.length; i++) {
          var trackDirection = Number(features.features[i].properties.direction) * 2;
          // console.log('trackDirection: ' + trackDirection);
          if (trackDirection >= 337.5 || trackDirection < 22.5) {
            featureAry1.push(features.features[i]);
          } else if (trackDirection >= 22.5 && trackDirection < 67.5) {
            featureAry2.push(features.features[i]);
          } else if (trackDirection >= 67.5 && trackDirection < 112.5) {
            featureAry3.push(features.features[i]);
          } else if (trackDirection >= 112.5 && trackDirection < 157.5) {
            featureAry4.push(features.features[i]);
          } else if (trackDirection >= 157.5 && trackDirection < 202.5) {
            featureAry5.push(features.features[i]);
          } else if (trackDirection >= 202.5 && trackDirection < 247.5) {
            featureAry6.push(features.features[i]);
          } else if (trackDirection >= 247.5 && trackDirection < 292.5) {
            featureAry7.push(features.features[i]);
          } else if (trackDirection >= 292.5 && trackDirection < 337.5) {
            featureAry8.push(features.features[i]);
          }
        }
        var features1 = { "type": "FeatureCollection", "features": featureAry1 };
        var features2 = { "type": "FeatureCollection", "features": featureAry2 };
        var features3 = { "type": "FeatureCollection", "features": featureAry3 };
        var features4 = { "type": "FeatureCollection", "features": featureAry4 };
        var features5 = { "type": "FeatureCollection", "features": featureAry5 };
        var features6 = { "type": "FeatureCollection", "features": featureAry6 };
        var features7 = { "type": "FeatureCollection", "features": featureAry7 };
        var features8 = { "type": "FeatureCollection", "features": featureAry8 };
        if (!__this.map.getSource(alias + "_1" + "_source")) {
          __this.map.addSource(alias + "_1" + "_source", {
            "type": "geojson",
            "data": features1
          });
        } else {
          __this.map.getSource(alias + "_1" + "_source").setData(features1);
        }
        if (!__this.map.getSource(alias + "_2" + "_source")) {
          __this.map.addSource(alias + "_2" + "_source", {
            "type": "geojson",
            "data": features2
          });
        } else {
          __this.map.getSource(alias + "_2" + "_source").setData(features2);
        }
        if (!__this.map.getSource(alias + "_3" + "_source")) {
          __this.map.addSource(alias + "_3" + "_source", {
            "type": "geojson",
            "data": features3
          });
        } else {
          __this.map.getSource(alias + "_3" + "_source").setData(features3);
        }
        if (!__this.map.getSource(alias + "_4" + "_source")) {
          __this.map.addSource(alias + "_4" + "_source", {
            "type": "geojson",
            "data": features4
          });
        } else {
          __this.map.getSource(alias + "_4" + "_source").setData(features4);
        }
        if (!__this.map.getSource(alias + "_5" + "_source")) {
          __this.map.addSource(alias + "_5" + "_source", {
            "type": "geojson",
            "data": features5
          });
        } else {
          __this.map.getSource(alias + "_5" + "_source").setData(features5);
        }
        if (!__this.map.getSource(alias + "_6" + "_source")) {
          __this.map.addSource(alias + "_6" + "_source", {
            "type": "geojson",
            "data": features6
          });
        } else {
          __this.map.getSource(alias + "_6" + "_source").setData(features6);
        }
        if (!__this.map.getSource(alias + "_7" + "_source")) {
          __this.map.addSource(alias + "_7" + "_source", {
            "type": "geojson",
            "data": features7
          });
        } else {
          __this.map.getSource(alias + "_7" + "_source").setData(features7);
        }
        if (!__this.map.getSource(alias + "_8" + "_source")) {
          __this.map.addSource(alias + "_8" + "_source", {
            "type": "geojson",
            "data": features8
          });
        } else {
          __this.map.getSource(alias + "_8" + "_source").setData(features8);
        }

        // 添加图层
        if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
          for (var i = 1; i <= 8; i++) {
            if (__this.map.getLayer(alias + "_" + i + "_layer")) {
              __this.map.removeLayer(alias + "_" + i + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_" + i + "_layer",
              "type": "symbol",
              "source": alias + "_" + i + "_source",
              "layout": {
                'icon-image': alias + "_" + i + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          }
        } else {
          __this.loadedLayer.push(alias + "_layer");

          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance1.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_1" + "_Point")) {
              __this.map.addImage(alias + "_1" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_1" + "_layer")) {
              __this.map.removeLayer(alias + "_1" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_1" + "_layer",
              "type": "symbol",
              "source": alias + "_1" + "_source",
              "layout": {
                'icon-image': alias + "_1" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance2.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_2" + "_Point")) {
              __this.map.addImage(alias + "_2" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_2" + "_layer")) {
              __this.map.removeLayer(alias + "_2" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_2" + "_layer",
              "type": "symbol",
              "source": alias + "_2" + "_source",
              "layout": {
                'icon-image': alias + "_2" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance3.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_3" + "_Point")) {
              __this.map.addImage(alias + "_3" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_3" + "_layer")) {
              __this.map.removeLayer(alias + "_3" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_3" + "_layer",
              "type": "symbol",
              "source": alias + "_3" + "_source",
              "layout": {
                'icon-image': alias + "_3" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance4.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_4" + "_Point")) {
              __this.map.addImage(alias + "_4" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_4" + "_layer")) {
              __this.map.removeLayer(alias + "_4" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_4" + "_layer",
              "type": "symbol",
              "source": alias + "_4" + "_source",
              "layout": {
                'icon-image': alias + "_4" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance5.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_5" + "_Point")) {
              __this.map.addImage(alias + "_5" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_5" + "_layer")) {
              __this.map.removeLayer(alias + "_5" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_5" + "_layer",
              "type": "symbol",
              "source": alias + "_5" + "_source",
              "layout": {
                'icon-image': alias + "_5" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance6.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_6" + "_Point")) {
              __this.map.addImage(alias + "_6" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_6" + "_layer")) {
              __this.map.removeLayer(alias + "_6" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_6" + "_layer",
              "type": "symbol",
              "source": alias + "_6" + "_source",
              "layout": {
                'icon-image': alias + "_6" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance7.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_7" + "_Point")) {
              __this.map.addImage(alias + "_7" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_7" + "_layer")) {
              __this.map.removeLayer(alias + "_7" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_7" + "_layer",
              "type": "symbol",
              "source": alias + "_7" + "_source",
              "layout": {
                'icon-image': alias + "_7" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });
          __this.map.loadImage('./static/gitimage/shishishuju/yuchuanjiance8.png', function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_8" + "_Point")) {
              __this.map.addImage(alias + "_8" + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_8" + "_layer")) {
              __this.map.removeLayer(alias + "_8" + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_8" + "_layer",
              "type": "symbol",
              "source": alias + "_8" + "_source",
              "layout": {
                'icon-image': alias + "_8" + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });

          __this.map.on("click", alias + "_1" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_2" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_3" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_4" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_5" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_6" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_7" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
          __this.map.on("click", alias + "_8" + "_layer", function(e) {
            var feature = e.features[0];
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
        }

        var isAddedLegend = false;
        for (var i = 0; i < __this.legendAry.length; i++) {
          if (__this.legendAry[i].des === name) {
            isAddedLegend = true;
            break;
          }
        }
        if (isAddedLegend === false) {
          __this.legendAry.push({ "icon": icon, "des": name });
          __this.legendMsg = { "legendAry": __this.legendAry };
        }
      });
    },
    getWcxYuqingjiancejianceData(startTime, endTime, type, alias, name, icon) {
      var __this = this;

      getWcxRainMonitorPoint(startTime, endTime, type).then(res => {
        // console.log('res: ' + CircularJSON.stringify(res))
        var features = res.features;
        for(var i=0;i<features.features.length;i++) {
          features.features[i].properties.stationYl = features.features[i].properties.station + ':' + features.features[i].properties.yl
        }

        // 添加数据源
        if (!__this.map.getSource(alias  + "_source")) {
          __this.map.addSource(alias + "_source", {
            "type": "geojson",
            "data": features
          });
        } else {
          __this.map.getSource(alias + "_source").setData(features);
        }
        // 添加图层
        if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
          if (__this.map.getLayer(alias + "_layer")) {
            __this.map.removeLayer(alias + "_layer");
          }
          __this.map.addLayer({
            "id": alias + "_layer",
            "type": "symbol",
            "source": alias + "_source",
            "layout": {
              'icon-image': alias + "_Point",
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          });
          if (__this.map.getLayer(alias + "_notelayer")) {
            __this.map.removeLayer(alias + "_notelayer");
          }
          __this.map.addLayer({
            "id": alias + "_notelayer",
            "type": "symbol",
            "source": alias + "_source",
            "layout": {
              "text-field": "{stationYl}",
              "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
              "text-offset": [0, 2],
              "text-size": 12,
              "text-max-width": 20
            },
            "paint": {
              "text-color": "#00d8ff",
              "text-halo-width": 1,
              "text-halo-color": "rgba(0, 0, 0, 1)"
            }
          });
        } else {
          __this.loadedLayer.push(alias + "_layer");

          __this.map.loadImage(icon, function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_Point")) {
              __this.map.addImage(alias + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_layer")) {
              __this.map.removeLayer(alias + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_layer",
              "type": "symbol",
              "source": alias + "_source",
              "layout": {
                'icon-image': alias + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
            if (__this.map.getLayer(alias + "_notelayer")) {
              __this.map.removeLayer(alias + "_notelayer");
            }
            __this.map.addLayer({
              "id": alias + "_notelayer",
              "type": "symbol",
              "source": alias + "_source",
              "layout": {
                "text-field": "{stationYl}",
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                "text-offset": [0, 2],
                "text-size": 12,
                "text-max-width": 20
              },
              "paint": {
                "text-color": "#00d8ff",
                "text-halo-width": 1,
                "text-halo-color": "rgba(0, 0, 0, 1)"
              }
            });
          });
          __this.map.on("click", alias + "_layer", function(e) {
            var feature = e.features[0];
            // console.log("feature: " + CircularJSON.stringify(feature));
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.smid;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
        }
        // 添加图例
        var isAddedLegend = false;
        for (var i = 0; i < __this.legendAry.length; i++) {
          if (__this.legendAry[i].des === name) {
            isAddedLegend = true;
            break;
          }
        }
        if (isAddedLegend === false) {
          __this.legendAry.push({ "icon": icon, "des": name });
          __this.legendMsg = { "legendAry": __this.legendAry };
        }
      });
    },
    getShuiliYuqingjiancejianceData(alias, name, icon) {
      var __this = this;
      getRainMonitorPoint().then(res => {
        // console.log('res: ' + CircularJSON.stringify(res))
        if (res.success == false) {
          return;
        }

        var features = res.features;
        if (!__this.map.getSource(alias + "_source")) {
          __this.map.addSource(alias + "_source", {
            "type": "geojson",
            "data": features
          });
        } else {
          __this.map.getSource(alias + "_source").setData(features);
        }

        if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
          if (__this.map.getLayer(alias + "_layer")) {
            __this.map.removeLayer(alias + "_layer");
          }
          __this.map.addLayer({
            "id": alias + "_layer",
            "type": "symbol",
            "source": alias + "_source",
            "layout": {
              'icon-image': alias + "_Point",
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          });
        } else {
          __this.loadedLayer.push(alias + "_layer");

          __this.map.loadImage(icon, function(error, image) {
            if (error) {
              console.log("error: " + error);
            }
            if (!__this.map.hasImage(alias + "_Point")) {
              __this.map.addImage(alias + "_Point", image);
            }
            if (__this.map.getLayer(alias + "_layer")) {
              __this.map.removeLayer(alias + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_layer",
              "type": "symbol",
              "source": alias + "_source",
              "layout": {
                'icon-image': alias + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          });

          __this.map.on("click", alias + "_layer", function(e) {
            var feature = e.features[0];
            // console.log("feature: " + CircularJSON.stringify(feature));
            // 高亮
            var hignlightIcon = icon.substring(0, 17) + "-light" + icon.substring(17);
            __this.map.loadImage(hignlightIcon, function(error, image) {
              if (error) {
                console.log("error: " + error);
              }
              if (__this.map.hasImage("highlight_Point")) {
                __this.map.removeImage("highlight_Point");
              }
              __this.map.addImage("highlight_Point", image);

              var featuresAry = [];
              feature.id = 1;
              featuresAry.push(feature);
              if (!__this.map.getSource("highlight_source")) {
                __this.map.addSource("highlight_source", {
                  "type": "geojson",
                  "data": {
                    "type":"FeatureCollection",
                    "features":featuresAry
                  }
                });
              } else {
                __this.map.getSource("highlight_source").setData({
                  "type":"FeatureCollection",
                  "features":featuresAry
                });
              }
              if (__this.map.getLayer("highlight_layer")) {
                __this.map.removeLayer("highlight_layer");
              }
              __this.map.addLayer({
                "id": "highlight_layer",
                "type": "symbol",
                "source": "highlight_source",
                "layout": {
                  'icon-image': "highlight_Point",
                  'icon-size': 0.8,
                  'icon-allow-overlap': true
                }
              });
            });
            // 弹框
            var longitude = e.features[0].geometry.coordinates[0];
            var latitude = e.features[0].geometry.coordinates[1];
            var smid = feature.properties.SMID;
            __this.queryMonitorBySmid(alias, smid, longitude, latitude);
          });
        }
      });
    },
    addorremoveShipinjiankongLayer(val) {
      var id = val.id;
      var icon = val.icon;
      var alias = "shipin_" + id;
      if (val.checked) {
        this.videoAliasAry.push(alias);
        var __this = this;
        getVideoPictureInfo(id).then(res => {
          // console.log('res: ' + CircularJSON.stringify(res))
          if (res.success == false) {
            return;
          }

          var features = res.features;
          if (!__this.map.getSource(alias + "_source")) {
            __this.map.addSource(alias + "_source", {
              "type": "geojson",
              "data": features
            });
          } else {
            __this.map.getSource(alias + "_source").setData(features);
          }

          if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
            if (__this.map.getLayer(alias + "_layer")) {
              __this.map.removeLayer(alias + "_layer");
            }
            __this.map.addLayer({
              "id": alias + "_layer",
              "type": "symbol",
              "source": alias + "_source",
              "layout": {
                'icon-image': alias + "_Point",
                'icon-size': 0.6,
                'icon-allow-overlap': true
              }
            });
          } else {
            __this.loadedLayer.push(alias + "_layer");

            __this.map.loadImage(icon, function(error, image) {
              if (error) {
                console.log("error: " + error);
              }
              if (!__this.map.hasImage(alias + "_Point")) {
                __this.map.addImage(alias + "_Point", image);
              }
              if (__this.map.getLayer(alias + "_layer")) {
                __this.map.removeLayer(alias + "_layer");
              }
              __this.map.addLayer({
                "id": alias + "_layer",
                "type": "symbol",
                "source": alias + "_source",
                "layout": {
                  'icon-image': alias + "_Point",
                  'icon-size': 0.6,
                  'icon-allow-overlap': true
                }
              });
            });

            __this.map.on("click", alias + "_layer", function(e) {
                var feature = e.features[0];
                // console.log("feature: " + CircularJSON.stringify(feature));

                var longitude = e.features[0].geometry.coordinates[0];
                var latitude = e.features[0].geometry.coordinates[1];
                var videoUrl = feature.properties.VIDEO_URL;
                __this.queryCameraBySmid(videoUrl, longitude, latitude, e.features[0].properties);
            });
          }
        });
      } else {
        if (this.map.getLayer(alias + "_layer")) {
          this.map.removeLayer(alias + "_layer");
        }
        for (var i = 0; i < this.videoAliasAry.length; i++) {
          if (this.videoAliasAry[i] === alias) {
            this.videoAliasAry.splice(i, 1);
            i--;
          }
        }
      }
    }
  }
}
/* eslint-disable */
</script>
<style scoped lang="less">
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  /deep/ .mapboxgl-popup {
    top: -0.14rem;
    /*min-width: 5rem;*/
  }
  /deep/ .mapboxgl-popup-content {
    background: rgba(3, 67, 106, 0.9);
    color: #fff;
  }
  /deep/ .mapboxgl-canvas {
    top: 0;
    left: 0;
  }
  .search{
    position: absolute;
    left: -1.8rem;
  }
  .search.collapse {
    left: 0.5rem;
  }
  .meter-box.collapse {
    left: 0.1rem;
  }
  /*弹出的提示框*/
  /deep/ .pop-tip {
    position: relative;
    font-size: 0.16rem;
    padding-bottom: 0.3rem;
    width: 370px;
    > p:first-child {
      font-size: 0.2rem;
      line-height: 0.3rem;
      padding-right: 0.25rem;
      margin-bottom: 10px;
      color: #7acdfd;
    }
    > p {
      display: flex;
      line-height: 0.35rem;
      padding-right: 0rem;
      margin-bottom: 5px;
    }
    > div {
      line-height: 0.3rem;
      display: flex;
      > p:nth-child(1) {
        padding-right: 15px;
      }
      > p:nth-child(2) {
        width: calc(370px - 1.2rem);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
  /deep/ .pop-tip-title {
    color: #58a7db;
    font-size: 0.16rem;
    line-height: 0.2rem;
    margin-bottom: 0.05rem;
  }
  // 修改地图poptip样式
  /deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: rgba(38, 104, 159, 0.8);
  }
  /deep/ .mapboxgl-popup-content {
    background: rgba(38, 104, 159, 0.8);
    color: #fff;
    padding: 10px 10px 10px;
  }
  /deep/ .mapboxgl-popup-close-button {
    top: 0.05rem;
    right: 0.05rem;
    z-index: 1;
    /*font-size: 0.26rem;*/
    cursor: pointer;
    // &:hover {
    /*background: transparent !important;*/
    // }
  }
  /deep/ .flex-1 {
    position: relative;
  }
  /deep/ #monitor-popup {
    top: -0.14rem;
    min-width: 2.1rem;
    height: 30%;
  }
  /deep/ .el-button {
    padding: 4px 20px;
    background-color: #091b46;
    border: 1px solid #00ffff;
    color: #00ffff;
    outline: none;
    border-radius: 4px;
  }
  /deep/ .dialog-footer {
    text-align: left;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
  }
  /deep/ .el-button--primary {
    background-color: #091b46;
    border: 1px solid #ffa438;
    color: #ffa438;
  }
  /deep/ .shishichaowei .myechart{
    height: 3.5rem;
  }
  /deep/ .pop-tip-jianceyujing {
    font-size: 16px;
    .time {
      width: 4.5rem;
      padding-left: 0.2rem;
      padding-right: 0.1rem;
      margin: auto;
      text-align: left;
      height: 35px;
      line-height: 35px;
      &.time-top {
        position: relative;
        top: -0.05rem;
      }
    }
    .spc {
      float: right;
    }
    .types {
      width: 98%;
      margin: auto;
      line-height: 30px;
      height: 31px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      margin-top: 0.1rem;
      div {
        float: left;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }
      .type-item {
        color: #ffffff;
        background-color: rgba(38, 104, 159);
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        border-left: 1px solid rgba(255, 255, 255, 0.5);
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }
    }
    h3 {
      padding-right: 30px;
      text-align: left;
      width: 98%;
      margin: auto;
      // height: 35px;
      font-size: 20px;
      line-height: 35px;
      color: #00baff;
      position: relative;
    }
    .search {
      width: 98%;
      margin: auto;
      height: 40px;
      line-height: 40px;
      button {
        border-radius: 4px;
        width: 15%;
        background-color: #159bfd;;
        color: #ffffff;
        height: 28px;
        border: none;
        line-height: 26px;
        margin-top: 5px;
        border: 1px solid #159bfd;
        cursor: pointer;
      }
      div {
        float: left;
        width: 42%;
        input {
          width: 75%;
          margin-left: 0.1rem;
          height: 25px;
          line-height: 25px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background-color: rgba(255, 255, 255, 0.9);
          // color:#ffffff;
        }
      }
    }
    .chart {
      width: 100%;
      height: 300px;
      .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        .tip {
          position: absolute;
          color: #13cff4;
          top: -22%;
          left: 55%;
          transform: translate(-50%, 0);
          font-size: 0.16rem;
          width: 100%;
        }
        .tip_2 {
          position: absolute;
          color: #ffffff;
          top: 8%;
          left: 10%;
          transform: translate(-50%, 0);
          font-size: 0.14rem;
        }
        .tip_3 {
          position: absolute;
          color: #ffffff;
          top: 8%;
          right: 8%;
          transform: translate(-50%, 0);
          font-size: 0.14rem;
        }
        .tip div {
          float: left;
          line-height: 25px;
          margin-top: 14%;
          color: #ffffff !important;
          cursor: pointer;
        }
        .tip span {
          float: left;
          display: block;
        }
        .tip div span {
          width: 12px;
          height: 12px;
          background-color: #0cdcf7;
          margin-top: 7px;
          margin-right: 8px;
          margin-left: 8px;
          border-radius: 6px;
        }
        .myechart {
          width: 100%;
          height: 100%;
        }
      }
    }
    h3 img {
      position: absolute;
      right: 0;
      top: 4px;
      cursor: pointer;
    }
    ul {
      margin-bottom: 0.1rem;
    }
    li {
      color: #ffffff;
      width: 90%;
      margin: auto;
      line-height: 30px;
      height: 30px;
    }
    li span {
      width: 50%;
      display: block;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }
  /deep/ .pop-tip-jianceyujing {
    min-width: 4.6rem;
    &.pop-jishuidian {
      min-width: 2.6rem;
    }
  }
  /deep/ .pop-tip-liangkeyiwei {
    min-width: 2.7rem;
    ul {
      li {
        span {
          width: 30%;
          & + span {
            width: 70%;
          }
        }
      }
    }
  }
  /deep/ .iframe-box {
    position: relative;
    button {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      cursor: pointer;
    }
  }
  /deep/ .iframe {
    width: 4rem;
    height: 3rem;
    display: block;
    margin: 0 auto;
    background: #000;
  }
  /deep/ .kong {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(40, 68, 106, 0.7);
    .text {
      color: #64bfee;
      font-size: 30px;
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border: 0.02rem solid #64bfee;
      padding: 0.1rem;
    }
  }
  /deep/ .dial {
    background-color: #091b46;
    border: 1px solid #00ffff;
    color: #00ffff;
    outline: none;
    border-radius: 4px;
    height: 25px;
    width: 70px;
    float: right;
    margin-left: 0.05rem;
    cursor: pointer;
  }
  /deep/ .hangUp {
    background-color: #091b46;
    border: 1px solid #ffa438;
    color: #ffa438;
    outline: none;
    border-radius: 4px;
    height: 25px;
    width: 60px;
    float: right;
    margin-left: 0.05rem;
    cursor: pointer;
  }
</style>
<style lang="less">
  .fullScreen {
    width: 100%;
    height: 100%;
    background: rgba(9, 27, 70, 0.8);
    .el-message-box__title, .el-message-box__headerbtn .el-message-box__close {
      color: #fff;
    }
    .el-message-box__content {
      height: calc(100% - 43px);
      div, p {
        height: 100%;
      }
    }
  }
  .pop-tip-jianceyujing .wx_ul {
    width: 100%;
  }
  .wx_ul {
    width: 300px;
    background: rgba(13, 20, 34, 0.8);
    height: 82%;
    padding: 20px;
  }
  .legend-box {
    position: absolute;
    bottom: 0.05rem;
    right: 5rem;
    z-index: 2;
    width: 1.8rem;
    min-height: 0.4rem;
    transition: all 0.3s linear;
    &.collapse {
      right: 0.14rem;
    }
  }
  .modal {
    width: 4rem;
    position: fixed;
    right: 5rem;
    top: 1rem;
    background: rgba(38, 104, 159, 0.8);
    color: #fff;
    padding: 10px 10px 10px;
    nav {
      display: flex;
      justify-content: space-between;
    }
    header {
      display: flex;
      justify-content: space-between;
      font-size: 0.2rem;
      line-height: 0.3rem;
      margin-bottom: 10px;
      color: #7acdfd;
      .type {
        color: #ffd800;
        font-size: 0.16rem;
        position: absolute;
        right: 0.4rem;
      }
    }
    section {
      height: 3rem;
    }
  }
  .shipinjiankongModal {
    width: 4rem;
    position: fixed;
    right: 5.2rem;
    top: 1rem;
    background: rgba(38, 104, 159, 0.8);
    color: #fff;
    // padding: 10px 10px 10px;
    h3 {
      padding-right: 30px;
      text-align: left;
      width: 100%;
      margin: 0 4%;
      height: 35px;
      font-size: 20px;
      line-height: 35px;
      color: #00baff;
      position: relative;
    }
  }
  .dialog-footer {
    text-align: right;
    padding-right: 0.3rem;
  }
  .qixiangWarning, .shishichaowei {
    width: 4.5rem;
    padding: 0.1rem;
    .warn-dialog-title {
      padding-left: 0.5rem;
      font-size: 0.2rem;
      margin-bottom: 0.15rem;
      color: #ffd800;
    }
    .warn-from {
      color: #57A7AD;
      display: flex;
      justify-content: space-between;
    }
    .warn-detail {
      color: #53CBF2;
      width: 100%;
      background: #13455C;
      box-sizing: border-box;
      padding: 0.05rem 0.08rem;
    }
    .warn-measures {
      padding-bottom: 0.05rem;
      border-bottom: 1px solid #57A7AD;
      .title {
        color: #57A7AD;
        font-size: 0.16rem;
        margin-top: 0.05rem;
        margin-bottom: 0.05rem;
      }
      .measures-detail {
        color: #9AE0E6;
      }
    }
    .cycle {
      & > .title {
        color: #57A7AD;
        font-size: 0.16rem;
        margin-top: 0.05rem;
        margin-bottom: 0.05rem;
      }
      .table-header, .table-body {
        font-size: 0.14rem;
        display: flex;
        justify-content: space-between;
        & > div {
          width: 33.33%;
          text-align: center;
          border: 1px solid #316FB0;
          padding: 0.05rem 0;
        }
      }
      .table-header > .title {
        background: #2F7BC5;
        color: #fff;
      }
    }
  }
  .el-dialog__close {
    cursor: pointer;
  }
</style>
