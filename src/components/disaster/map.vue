<template>
  <div>
    <div id="base-map"></div>
    <div class="mapMenu">
      <mapMenu
        ref="mapMenu"
        @mapInit='mapInit'
        @mapSwicth='mapSwicth'/>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue';
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
import mapMenu from './mapMenu'
import MAP_CONFIG from '../map-view/mapconfig';

export default {
  name: 'BaseMap',
  props: {
    data: {
      type: Object,
      defaule() {
        return {}
      }
    },
    onePoint: {
      type: Object,
      defaule() {
        return {}
      }
    }
  },
  components: {
    mapMenu
  },
  computed: {
    ...mapGetters('map', [
      'treeCheckedList',
      'currentMapType',
      'typeIndex',
      'collapse1',
      'collapse2',
      'collapse3',
      'splitScreen'
    ]),
    ...mapGetters([
      'userInfo'
    ]),

  },
  watch: {
    onePoint(data) {
      // console.log('data: ' + CircularJSON.stringify(data));
      if (data.checked) {
        if (data.longitude===null || data.latitude===null) {
          return;
        }
        this.addScatterLayer(data);
        this.isScatterChecked = true;
        this.scatterData = data;
      }
      else {
        if (this.map.getLayer("searchObj_layer")) {
            this.map.removeLayer("searchObj_layer");
        }
        this.isScatterChecked = false;
        this.scatterData = {};
      }
    }
  },
  data() {
    return {
      map: null,
      dataUrl: '',
      getBlurNames: [],
      levelFeatures: [],
      t: null,
      districtFeaturesAry: [],
      streetFeaturesAry: [],
      baseMapDistrictFeatures: [],
      baseMapStreetFeatures: [],
      selectedDistrict: '',
      selectedStreet: '',
      showSwicthMenu: false,
      basemapTiles: '',
      isMapLoaded: false,
      isShwo: false,
      loadedLayer: [],
      isClose: false,
      mapQueryTreeList: [],
      scaleControl: {},
      isScatterChecked: false,
      scatterData: {}
    }
  },
  mounted() {
    this.dataUrl = MAP_CONFIG.dataurl;
    this.basemapTiles = MAP_CONFIG.basemapTiles;
    this.createBaseMapAndLayer();
  },
  methods: {
    ...mapActions('map', [
      'setSplitScreen'
    ]),
    ...mapActions('map', [
      'SetMapLoaded'
    ]),
    createBaseMap() {
      var tiles = {};
      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      var WWW_MAP = document.location.protocol + '//' + window.location.host;
      for (var i = 0; i < basemapSourcesTiles.length; i++) {
        if (basemapSourcesTiles[i].name === this.basemapTiles) {
          tiles = basemapSourcesTiles[i].tiles;
          break;
        }
      }
      //选中
      this.$emit('baseMapType', this.basemapTiles);

      if ('bigdata-raster' === this.basemapTiles) {
        $("#base-map").css({ "background-color": "#162445" });
      } else {
        $("#base-map").css({ "background-color": "#204f77" });
      }
      if ("standard-raster" === this.basemapTiles || "bigdata-raster" === this.basemapTiles) {
        this.map = new mapboxgl.Map({
          container: "base-map",
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
            "layers": [
              {
                "id": "base-layer",
                "type": "raster",
                "source": "baselayer-source",
                "minzoom": 8.8,
                "maxzoom": 21
              }
            ]
          },
          crs: 'EPSG:4490',
          // scrollZoom: false,
          center: [120.352287, 27.90],
          zoom: 8.8,
          minZoom: 8.8,
        });
        if ("standard-raster" === this.basemapTiles) {
          this.map.setMaxZoom(19);
        } else if ("bigdata-raster" === this.basemapTiles) {
          this.map.setMaxZoom(18);
        }
      }

      var __this = this;
      this.scaleControl = new mapboxgl.ScaleControl({});
      this.map.addControl(this.scaleControl);
      this.map.addControl(new mapboxgl.AttributionControl({ compact: true }));

      var __this = this;
      this.map.loadImage('./static/gitimage/other/position.png', function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("searchObj_Point")) {
          __this.map.addImage("searchObj_Point", image);
        }
      });
      this.map.on("click", "searchObj_layer", function(e) {
        // console.log('e:' + CircularJSON.stringify(e));
        // 详细信息处理
        e.features[0].properties.refresh = false;
        __this.$emit('setonePoint', e.features[0].properties);
        // console.log("feature: " + CircularJSON.stringify(e.features[0]));
        var feature = e.features[0];
        // console.log('table_name: ' + feature.properties.table_name);
        var tablename = '';
        if (feature.properties.table_name !== undefined) {
          tablename = feature.properties.table_name;
        } else if (feature.properties.TABLE_NAME !== undefined) {
          tablename = feature.properties.TABLE_NAME;
        }

        var str = '';
        var lngLat = feature.geometry.coordinates;
        if (tablename === 'D_DMDZ') {
          str += `<p><span>区域：</span><p>${feature.properties.TOWN ? feature.properties.TOWN : '暂无数据'}</p></p><p><span>地址：</span><p>${feature.properties.ADDRESS ? feature.properties.ADDRESS : '暂无数据'}</p></p>`;
          __this.showAroundRequestParam = { "center": lngLat, "distance": "1000" };
          __this.areaQueryCenterCoordinates = lngLat;
          var html = `<div class="pop-tip">
                            <p class="">${feature.properties.NAME}</p>
                            ${str}
                            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                          </div>`;
          var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          var popup = new mapboxgl.Popup({
            closeOnClick: true
          });
          popup.setLngLat(lngLat).setHTML(html).addTo(__this.map);
        } else {
          //获取弹框字段
          var mapPopName = [];
          var mapPopField = [];
          var datasetname = "pg_wzyjdb:" + tablename;
          for (var i = 0; i < __this.mapQueryTreeList.length; i++) {
            if (__this.mapQueryTreeList[i].datasetname === datasetname) {
              mapPopName = __this.mapQueryTreeList[i].mapPopName.split(",");
              mapPopField = __this.mapQueryTreeList[i].mapPopField.split(",");
              break;
            }
          }
          //弹框
          for (var i = 1; i < mapPopField.length; i++) {
            if (mapPopField[i] === 'FIND_TIME') {
              feature.properties[mapPopField[i]] = feature.properties[mapPopField[i]].replace(/\//g, "-");
              ;
            }
            str += `<div><span>${mapPopName[i]}：</span><p>${(feature.properties[mapPopField[i]] != undefined && feature.properties[mapPopField[i]].trim() != '') ? feature.properties[mapPopField[i]] : '暂无数据'}</p></div>`;
          }
          __this.showAroundRequestParam = { "center": lngLat, "distance": "1000" };
          __this.areaQueryCenterCoordinates = lngLat;
          var html = `<div class="pop-tip">
                            <p class="">${feature.properties[mapPopField[0]] ? feature.properties[mapPopField[0]] : '暂无数据'}</p>
                            ${str}
                            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                        </div>`;
          var tipElArr = document.getElementsByClassName('mapboxgl-popup-close-button');
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          var popup = new mapboxgl.Popup({
            closeOnClick: true
          });
          popup.setLngLat(lngLat).setHTML(html).addTo(__this.map);
        }
      });
    },
    createBaseMapAndLayer() {
        var __this = this;
        let p = new Promise((resolve, reject) => {
          resolve('success');
          reject('failed');
        });
        // 创建底图
        var p1 = p.then(function(value) {
          __this.isMapLoaded = false;
          __this.createBaseMap();
          __this.lastMapType = __this.currentMapType;
        });
        // 告诉前端底图加载完毕
        var p2 = p1.then(function(value) {
            __this.map.on('load', function() {
            __this.SetMapLoaded(true);
            __this.isMapLoaded = true;
            __this.$store.dispatch('changeLoad', false);
          });
        });
    },
    // 添加散点图
    addScatterLayer(data) {
          //添加点
          var dataJson = {
            "type": "FeatureCollection", "features": [
              {
                "type": "Feature",
                "properties": data,
                "geometry": { "type": "Point", "coordinates": [data.longitude, data.latitude] },
                "id": '1'
              }
            ]
          };
          if (!this.map.getSource("searchObj_source")) {
            this.map.addSource("searchObj_source", {
              "type": "geojson",
              "data": dataJson
            });
          } else {
            this.map.getSource("searchObj_source").setData(dataJson);
          }
          if (this.map.getLayer("searchObj_layer")) {
            this.map.removeLayer("searchObj_layer");
          }
          this.map.addLayer({
            "id": "searchObj_layer",
            "type": "symbol",
            "source": "searchObj_source",
            "layout": {
              'icon-image': "searchObj_Point",
              'icon-size': 0.8,
              'icon-allow-overlap': true
            }
          });
    },
    // 删除要素图层
    removeLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.removeLayer(layname);
      }
    },
    mapInit() {
      // 地图居中
      this.map.setZoom(8.8);
      this.map.flyTo({
        center: [120.352287, 27.90]
      });
    },
    mapSwicth(data) {
      // console.log('data: ' + CircularJSON.stringify(data));
      if ('标准' === data) {
        this.checkValue('standard-raster');
      } else if ('影像' === data) {
        this.checkValue('2019YX');
      }
    },
    checkValue(data) {
      if (this.basemapTiles === data) {
        return;
      }
      this.basemapTiles = data;
      var tiles = '';
      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      for (var i = 0; i < basemapSourcesTiles.length; i++) {
        if (basemapSourcesTiles[i].name === this.basemapTiles) {
          tiles = basemapSourcesTiles[i].tiles;
          break;
        }
      }
      if ("2019YX" === this.basemapTiles) {
          var zjTiles = '';
          for (var i = 0; i < basemapSourcesTiles.length; i++) {
            if (basemapSourcesTiles[i].name === '2019YXZJ') {
              zjTiles = basemapSourcesTiles[i].tiles;
              break;
            }
          }
          this.map.setStyle({
            "version": 8,
            "sources": {
              "baselayer-source": {
                "type": "raster",
                "tiles": [tiles],
                "tileSize": 256,
                "rasterSource": 'iserver'
              }
            },
            "layers": [
              {
                "id": "base-layer",
                "type": "raster",
                "source": "baselayer-source",
                "minzoom": 8.8,
                "maxzoom": 21
              }
            ]
          });

          if (this.map.getLayer("2019YXZJ_layer")) {
            this.map.removeLayer("2019YXZJ_layer");
          }
          if (this.map.getSource("2019YXZJ_source")) {
            this.map.removeSource("2019YXZJ_source");
          }
          this.map.addSource("2019YXZJ_source", {
            "type": "raster",
            "tiles": [zjTiles],
            "tileSize": 256,
            "rasterSource": 'iserver'
          });
          this.map.addLayer({
            "id": "2019YXZJ_layer",
            "type": "raster",
            "source": "2019YXZJ_source"
          });
      }
      else if ("standard-raster" === this.basemapTiles) {
          if (this.map.getLayer("2019YXZJ_layer")) {
            this.map.removeLayer("2019YXZJ_layer");
          }
          this.map.setStyle({
            "version": 8,
            "sources": {
              "baselayer-source": {
                "type": "raster",
                "tiles": [tiles],
                "tileSize": 256,
                "rasterSource": 'iserver'
              }
            },
            "layers": [
              {
                "id": "base-layer",
                "type": "raster",
                "source": "baselayer-source",
                "minzoom": 8.8,
                "maxzoom": 21
              }
            ]
          });
      }

      if ("2019YX" === this.basemapTiles) {
        this.map.setMaxZoom(18);
      } else if ("standard-raster" === this.basemapTiles) {
        this.map.setMaxZoom(19);
      }
      //设置比例尺
      this.map.removeControl(this.scaleControl);
      this.scaleControl = new mapboxgl.ScaleControl({});
      this.map.addControl(this.scaleControl);
      //加载点
      if (this.isScatterChecked) {
        this.addScatterLayer(this.scatterData);
      }
    }
  },
}
</script>
<style scoped lang="less">
  #base-map {
    position: absolute;
    height: 100%;
    width: 100%;
    // background-color: white;
    background-color: "#204f77";
  }
  .mapboxgl-popup-content {
    position: relative;
    color: black;
    background: white;
    border-radius: 0.03rem;
    box-shadow: 0 0.01rem 0.02rem rgba(0, 0, 0, 0.1);
    padding: 0.1rem 0.1rem 0.15rem;
    pointer-events: auto;
  }
  /deep/ .mapboxgl-canvas {
    top: 0;
    left: 0;
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
        width: calc(370px - 1.3rem);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
  /deep/ .pop-body {
    display: flex;
    align-items: flex-start;
    span:nth-child(1) {
      display: inline-block;
    }
    span:nth-child(2) {
      display: inline-block;
      width: 350px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-align: justify;
    }
  }
  /deep/ .pop-tip-more {
    position: absolute;
    bottom: -0.2rem;
    left: 0;
    font-size: 0.14rem;
    line-height: 0.14rem;
    display: block;
    cursor: pointer;
  }
  /deep/ .pop-tip-analyse {
    position: absolute;
    bottom: -0.25rem;
    font-size: 0.14rem;
    line-height: 0.2rem;
    border: 0.01rem solid #2090C5;
    padding: 0.02rem 0.3rem;
    background: #0A4C6E;
    cursor: pointer;
  }
  .mapMenu {
      position: absolute;
      top: 0;
      left: 4rem;
      z-index: 2;
      transition: left .3s linear, right .3s linear;
      &.collapse {
        left: 0.14rem;
      }
  }
  /deep/ .mapboxgl-ctrl-bottom-left {
    z-index: 0;
    left: 4rem;
    bottom: 0.1rem;
    transition: left 0.3s linear;
  }
  /deep/ .mapboxgl-ctrl-scale {
    background: rgba(0, 0, 0, 0.4);
    border: none;
    color: #fff;
    float: left;
    margin: 0;
  }
</style>
