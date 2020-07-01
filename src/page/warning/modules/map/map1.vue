/* eslint-disable */
<template>
  <div>
    <div id="cesiumContainer" v-bind:style="styleObject">
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import list from "./modules/list";
// import total from "./modules/total";
// import bottomlist from "./modules/bottom_list";
// import point from "./modules/point2";
// import steps from "./modules/step4";
import mapboxgl from 'mapbox-gl';
import {
  Logo,
  QueryByBoundsParameters,
  QueryService,
  FeatureService,
  MeasureService
} from '@supermap/iclient-mapboxgl';
import CircularJSON from 'circular-json';
import Vue from 'vue';
import $ from 'jquery';
import URL_CONFIG from './urlconfig';

const Cesium = window.Cesium;
import echartJoinus1 from "./joinus_1";
import echartJoinus2 from "./joinus_2";
import { getRainMonitorDetailBySmid,getRiverMonitorDetailBySmid,getReservoirMonitorDetailBySmid,getPondingDetailBySmid,getEnterpriseDetailSmid,getScenicDetailBySmid } from 'api/save/save';
import { mapGetters } from 'vuex'
export default {
  name: "state",
  components: {
    // list,
    // total,
    // point,
    echartJoinus1,
    echartJoinus2
  },
  props: ['zoom'],
  computed: {
    ...mapGetters('warning', [
      'currentMonitorType',
      'specalPoint'
    ])
  },
  watch: {
    currentMonitorType(data) {
      // console.log("data: " + CircularJSON.stringify(data));
      // 勾选
      // console.log(data)
      if (data.checked === true) {
        // 添加散点图
        this.getScatterLayerFeatures(data.alias, data.url, data.icon, data.datasetname, data.sql, data.geotype, data.mapPopName, data.mapPopField);
      }
      // 取消
      else {
        var idArray = [];
        for (var i = 0; i < this.entitiesIdList.length; i++) {
          if (this.entitiesIdList[i].alias === data.alias) {
            idArray = this.entitiesIdList[i].idArray;
          }
        }
        // console.log("idArray: " + idArray);
        for (var i = 0; i < idArray.length; i++) {
          this.smviewer.entities.removeById(idArray[i]);
        }
        $(".mapboxgl-popup").remove();
      }
    },
    specalPoint(data){
      // console.log("data: " + JSON.stringify(data));
      var alias = data.alias;
      var smid = data.smid;
      if(alias==="" || !alias || smid==="" || !smid) {
        return;
      }

      this.$emit('chooseMenu', data)

      this.queryBySmid(alias, smid, data.location.split(','));
    }
  },
  data: function() {
    return {
      styleObject: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: '0px',
        backgroundColor: '#000000'
      },
      smviewer: {},
      scenePosition: null,
      movementPosition: {},
      entitiesIdList: [],
      isCLickMouseBlank: false
    }
  },
  mounted: function() {
    var __this = this;
    var scene = '';
    var widget = '';
    const WWW_MAP = document.location.protocol + '//' + window.location.host;
    // 本地和演示环境
    if (WWW_MAP.indexOf('http://pshyz.f3322.net:9000') >= 0 || WWW_MAP.indexOf('http://localhost') === 0) {
      // 1.创建viewer
      this.smviewer = new Cesium.Viewer('cesiumContainer', {
        animation: true
      });
      scene = this.smviewer.scene;
      widget = this.smviewer.cesiumWidget;

      // 2.创建图层
      // 隐藏logo
      $(".cesium-widget-credits")[0].style.visibility = "hidden";
      $(".cesium-viewer-animationContainer")[0].style.visibility = "hidden";
      this.smviewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
          mapStyle: Cesium.TiandituMapsStyle.IMG_C,
          token: URL_CONFIG.TOKEN_TIANDITU
      }));
    }
    // 客户环境
    else {
      // 1.创建viewer
      this.smviewer = new Cesium.Viewer('cesiumContainer');
      scene = this.smviewer.scene;
      widget = this.smviewer.cesiumWidget;

      // 2.创建图层
      $(".cesium-widget-credits")[0].style.visibility = "hidden";
      var layer = this.smviewer.imageryLayers.addImageryProvider(new Cesium.SuperMapImageryProvider({
          url: URL_CONFIG.MAP_STYLE
      }));
    }

    try {
      // 打开所发布三维服务下的所有图层，只有白模数据，没有矢量数据图层
      var promise = scene.open(URL_CONFIG.GZ_SCENE);
      Cesium.when.all(promise, function(layers) {
        //设置图层的阴影模式
        scene.camera.setView({
          //将经度、纬度、高度的坐标转换为笛卡尔坐标
          destination: Cesium.Cartesian3.fromDegrees(120.65, 27.95, 5000),
          orientation: {
            // 指向
            heading: Cesium.Math.toRadians(0, 0),
            // 视角
            pitch: Cesium.Math.toRadians(-60),
            roll: 0.0
          }
        });
     }, function(e) {
        if (widget._showRenderLoopErrors) {
          var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
          widget.showErrorPanel(title, undefined, e);
        }
      });
    } catch (e) {
      if (widget._showRenderLoopErrors) {
        var title = '渲染时发生错误，已停止渲染。';
        widget.showErrorPanel(title, undefined, e);
      }
    }

    // 气泡弹框的关闭功能
    window.closePopup = function() {
      $(".mapboxgl-popup").remove();
    }


    $(".cesium-widget canvas").css({
      "display": "block",
      "width": "100%",
      "height": "100%"
    });
    $(".cesium-widget").css({
      "width": "100%",
      "height": "100%"
    });
    $(".cesium-viewer-cesiumWidgetContainer").css({
      "width": "100%",
      "height": "100%"
    });
    $(".cesium-viewer").css({
      "width": "100%",
      "height": "100%"
    });

    $(".cesium-viewer-navigationContainer").css({
      "top": "5%",
      "right": "26%"
    });


    var scene = __this.smviewer.scene;
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
      // console.log('movement: ' + movement)
            var position = scene.pickPosition(movement.position);
            // console.log('position: ' + position)

            __this.movementPosition = movement.position;
            // 设置场景位置
            __this.scenePosition = position;
            // console.log(position)
            var pick = scene.pick(movement.position);
            if (pick && pick.id && Cesium.defined(pick)) {
              var featureId = pick.id.id;
              var alias = featureId.substring(0, featureId.indexOf("_"));
              var smid = featureId.substring(featureId.indexOf("_") + 1);
              __this.queryBySmid(alias, smid, '');
            } else {
              __this.isCLickMouseBlank = true;
            }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 每一帧都去计算气泡的正确位置
    var scene = __this.smviewer.scene;
    scene.postRender.addEventListener(function() {
      if (__this.isCLickMouseBlank === true) {
        $(".mapboxgl-popup").remove();
        __this.isCLickMouseBlank = false;
        return;
      }
      if (__this.scenePosition) {
        var canvasHeight = scene.canvas.height;
        var windowPosition = new Cesium.Cartesian2(__this.movementPosition.x, __this.movementPosition.y);

        Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, __this.scenePosition, windowPosition);
        var x = windowPosition.x - ($(".mapboxgl-popup").width()) / 2;
        // console.log('windowPosition.x: ' + windowPosition.x);
        var y = windowPosition.y - ($(".mapboxgl-popup").height());
        $(".mapboxgl-popup").css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
      }
    });

  },
  methods: {
    // zoom改变
    zoomChange(data) {
      console.log(data)
    },
    getScatterLayerFeatures(alias, url, icon, datasetname, sql, geotype, mapPopName, mapPopField) {
      var __this = this;
      // var userDistrict = __this.userInfo.district;
      var userDistrict = "3303";
      var sqlParam = {};
      if ("3303" === userDistrict) {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: sql
          },
          datasetNames: [datasetname],
          toIndex: -1
        });
      } else {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: "DISTRICT_CODE='" + userDistrict + "'"
          },
          datasetNames: [datasetname],
          toIndex: -1
        });
      }

      var __this = this;
      new FeatureService(url).getFeaturesBySQL(sqlParam, function(serviceResult) {
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          // console.log("features: " + CircularJSON.stringify(features));
          // var dataSource = new Cesium.CustomDataSource('yuqingjiance');
          var idArray = [];
          for (var i = 0; i < features.features.length; i++) {
            idArray.push(alias + "_" + features.features[i].properties.SMID);
            __this.smviewer.entities.add({
              id: alias + "_" + features.features[i].properties.SMID,
              name: alias + "_points",
              position: Cesium.Cartesian3.fromDegrees(features.features[i].geometry.coordinates[0], features.features[i].geometry.coordinates[1], 100),
              billboard: {
                image: icon,
                width: 100,
                height: 100,
                show: true
              },
              clampToGround: true
              // ellipse:{
              //   semiMinorAxis: 15.0,
              //   semiMajorAxis: 20.0,
              //   material: Cesium.Color.CHARTREUSE.withAlpha(0.3),
              // }
            });
          }
          __this.entitiesIdList.push({ "alias": alias, "idArray": idArray });
        }
      });
    },
    addEnterpriseTipHtml(data) {
      $(".pop-tip-sanwei").remove();
      var tipDiv = '<div class="pop-tip-sanwei">'
                      + '<h3>' + data.plate + '</h3>'
                      + '<ul>'
                      + '<li><span>警报类型:</span><span>' + data.warnType + '</span></li>'
                      + '</ul>'
                      + '</div>';
      $(".mapboxgl-popup-content").append(tipDiv);
      var c = new Cesium.Cartesian2(this.movementPosition.x, this.movementPosition.y);
      var x = c.x - ($(".mapboxgl-popup").width()) / 2;
      var y = c.y - ($(".mapboxgl-popup").height());
      $(".mapboxgl-popup").css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
    },
    addScenicTipHtml(data) {
      $(".pop-tip-sanwei").remove();
      var tipDiv = '<div class="pop-tip-sanwei">'
                      + '<h3>' + data.name + '</h3>'
                      + '<ul>'
                      + '<li><span>街道:</span><span>' + data.street + '</span></li>'
                      + '<li><span>当前人数:</span><span>' + data.nowCount + '</span></li>'
                      + '<li><span>瞬时承载客流量:</span><span>' + data.momentCount + '</span></li>'
                      + '<li><span>当天承载客流量:</span><span>' + data.dayCount + '</span></li>'
                      + '</ul>'
                      + '</div>';
      $(".mapboxgl-popup-content").append(tipDiv);
      var c = new Cesium.Cartesian2(this.movementPosition.x, this.movementPosition.y);
      var x = c.x - ($(".mapboxgl-popup").width()) / 2;
      var y = c.y - ($(".mapboxgl-popup").height());
      $(".mapboxgl-popup").css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
    },
    // 添加弹框html
    addEchartHtml(name, time, station) {
      $(".pop-tip-sanwei").remove();
      var tipDiv = '<div class="pop-tip-sanwei">'
                      + '<h3>' + name + '</h3>'
                      + '<div class="time">'
                      + '<span>' + time + '</span>'
                      + (station!=='' ? '<span class="spc">测站所属:' + (station || "暂无信息") + '</span></div>' : '<span class="spc"></span></div>')
                      + '<div class="chart">'
                      + '<div class="wrapper">'
                      + '<div class="tip"><span style="margin-right:0.3rem">24小时水情监测</span><div><span></span>当前值</div><div><span style="background-color:#ff0000"></span>汛限水位</div></div>'
                      + '<div class="tip_2">单位(m)</div>'
                      + '<div class="myechart"></div>'
                      + '</div></div></div>';
      $(".mapboxgl-popup-content").append(tipDiv);
      var c = new Cesium.Cartesian2(this.movementPosition.x, this.movementPosition.y);
      // console.log(c)
      var x = c.x - ($(".mapboxgl-popup").width()) / 2;
      var y = c.y - ($(".mapboxgl-popup").height());
      $(".mapboxgl-popup").css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
    },
    loadEchartData(details, bool) {
      console.log(details)
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
      if(details || details.length > 0) {
        for(var i=0;i<details.length;i++) {
          dataname.push(details[i].name);
          if (bool) {
            console.log(123)
            datanum.push(details[i].value.kssw);
            datawarn[i] = details[i].value.xxsw
          } else {
            datanum.push(details[i].value);
          }
        }
      }
      const myChart = this.$echarts.init(document.querySelector('#cesiumContainer .pop-tip-sanwei .myechart'));
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
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            interval: 0,
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
          splitLine: {
            show: true
          },
          axisLine: {
            show: false
          }
        },
        series: [
          // {},
          {
            data: datanum,
            type: 'line',
            symbol: 'none',
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
      });
      // 弹框结束
    },
    addEchartHtml2() {
      console.log('addEchartHtml2')
      $(".pop-tip-sanwei").remove();
      var tipDiv = '<div class="pop-tip-sanwei">'
                      + '<h3>' + '林溪' + '</h3>'
                      + '<div class="time"><span>' + '2020-02/28 10:11-02/29 10:11' + '</span><span class="spc">测站所属:'
                      + '瑞安市文化站' + '</span></div>'
                      + '<div class="chart">'
                      + '<div class="wrapper">'
                      + '<div class="tip"><span style="margin-right:0.3rem">24小时水情监测</span><div><span></span>当前值</div><div><span style="background-color:#ff0000"></span>预警值</div></div>'
                      + '<div class="tip_2">单位(m)</div>'
                      + '<div class="myechart"></div>'
                      + '</div></div></div>';
      $(".mapboxgl-popup-content").append(tipDiv);
      var c = new Cesium.Cartesian2(this.movementPosition.x, this.movementPosition.y);
      var x = c.x - ($(".mapboxgl-popup").width()) / 2;
      var y = c.y - ($(".mapboxgl-popup").height());
      $(".mapboxgl-popup").css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
    },
    loadEchartData2() {
      console.log('loadEchartData2')
      var dataname = [
        '10:11',
        '13:11',
        '16:11',
        '19:11',
        '22:11',
        '01:11',
        '04:11',
        '07:11',
        '10:11'
      ]
      var datanum = [
        '0.45',
        '0.1',
        '0.4',
        '0.3',
        '0.2',
        '0.3',
        '0.4',
        '0.25',
        '1'
      ]
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
      ]
      var datatype = ['07:11',
        '10:11'
      ]
      const myChart = this.$echarts.init(document.querySelector('#cesiumContainer .pop-tip-sanwei .myechart'));
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
        legend: {
          left: 'left',
          data: datatype
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataname,
          axisLabel: {
            interval: 0,
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
          splitLine: {
            show: true
          },
          axisLine: {
            show: false
          }
        },
        series: [
          // {},
          {
            data: datanum,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#ffffff', // 改变折线点的颜色
                lineStyle: {
                  color: '#50bcff' // 改变折线颜色
                }
              }
            },
            smooth: true
          },
          {
            data: datawarn,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              normal: { color: 'rgba(255,0,0,0)' }
            },
            itemStyle: {
              normal: {
                color: '#ffffff', // 改变折线点的颜色
                lineStyle: {
                  color: 'rgba(255,0,0)' // 改变折线颜色
                }
              }
            },
            smooth: true
          }
        ]
      });
      // 弹框结束
    },
    // 绘制弹框
    queryBySmid(alias, smid, location) {
        // console.log("alias: " + alias);
        // console.log('location: ' + location)
        // console.log('movementPosition: ' + this.movementPosition);
        // var point = new Cesium.Cartesian2(location[0], location[1]);
        // console.log('point: ' + point)

        // 点击旁边菜单
        if (location !== '') {
          // var cartesian3 = new Cesium.Cartesian3(location[0], location[1], 100);
          // var scene = this.smviewer.scene;
          // var dikaerCoor = Cesium.Cartesian3.fromDegrees(Number(location[0]), Number(location[1]), 100);
          // var c3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(dikaerCoor);
          // this.scenePosition = dikaerCoor;

          // var windowPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, dikaerCoor);
          // console.log('windowPos: ' + windowPos);
          // //  此处展示了，从经纬度（单位：度）-->笛卡尔坐标（单位：米）。
          // var offset = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);
          // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
          // this.model.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

          // idArray.push(alias + "_" + smid);
          // this.smviewer.entities.add({
          //     id: alias + "_" + smid,
          //     name: alias + "_points",
          //     position: Cesium.Cartesian3.fromDegrees(Number(location[0]), Number(location[1]), 100),
          //     billboard: {
          //       image: icon,
          //       width: 100,
          //       height: 100,
          //       show: true
          //     },
          //     clampToGround: true
          //   });
        }

        $(".mapboxgl-popup").remove();
        // 弹框开始
        var infoDiv = '<div class="mapboxgl-popup mapboxgl-popup-anchor-bottom" style="max-width: 240px; ">'
          + '<div class="mapboxgl-popup-tip"></div>'
          + '<div class="mapboxgl-popup-content"><button onclick="closePopup()" class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</button></div>'
          + '</div>';
        // var infoDiv = '<echartJoinus1 class="flex-1"></echartJoinus1>';
        $("#cesiumContainer").append(infoDiv);

        var __this = this;
        switch(alias) {
          case "yuqingjiance":
            getRainMonitorDetailBySmid(smid).then(
              data => {
                // var name = data.name;
                console.log("data: " + JSON.stringify(data));
                __this.addEchartHtml(data.name, data.time, data.station);
                __this.loadEchartData(data.details);
              }
            );
            break;
          case "hedaoshuiqingjiance":
            getRiverMonitorDetailBySmid(smid).then(
              data => {
                // var name = data.name;
                // console.log("data: " + JSON.stringify(data));
                __this.addEchartHtml(data.name, data.time, data.station);
                __this.loadEchartData(data.details);
              }
            );
            break;
          case "shuikushuiqingjiance":
            getReservoirMonitorDetailBySmid(smid).then(
              data => {
                console.log(data)
                // var name = data.name;
                // console.log("data: " + JSON.stringify(data));
                __this.addEchartHtml(data.name, data.time, data.station);
                __this.loadEchartData(data.details, true);
              }
            );
            break;
          case "jishuidianjiance":
            getPondingDetailBySmid(smid).then(
              data => {
                // console.log("data: " + JSON.stringify(data));
                __this.addEchartHtml(data.name, data.time, data.station);
                __this.loadEchartData(data.details);
              }
            );
            break;
          case "liangkeyiweijiance":
            getEnterpriseDetailSmid(smid).then(
              data => {
                // console.log("data: " + JSON.stringify(data));
                __this.addEnterpriseTipHtml(data);
              }
            );
            break;
          case "jingqukeliuliangjiance":
            getScenicDetailBySmid(smid).then(
              data => {
                __this.addScenicTipHtml(data);
              }
            );
            break;
          default:
            __this.addEchartHtml2();
            __this.loadEchartData2();
            break;
        }
    },
    queryByFeatureId2(datasetname, featureId, mapPopName, mapPopField) {
      var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          attributeFilter: "SMID = " + featureId
        },
        datasetNames: [datasetname]
      });
      var __this = this;
      new FeatureService(URL_CONFIG.dataServiceUrl).getFeaturesBySQL(sqlParam, function(serviceResult) {
        // 获取服务器返回的结果
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          // console.log("features: " + CircularJSON.stringify(features));
          var feature = features.features[0];

          // import echartJoinus1 from "./joinus_1.vue";
          // Vue.component('echartJoinus1', echartJoinus1);
          // $("echartJoinus1").remove();

          // console.log("echartJoinus1: " + JSON.stringify(echartJoinus1.__file));

          $(".mapboxgl-popup").remove();
          // 弹框开始
          var infoDiv = '<div class="mapboxgl-popup mapboxgl-popup-anchor-bottom" style="max-width: 240px; ">'
            + '<div class="mapboxgl-popup-tip"></div>'
            + '<div class="mapboxgl-popup-content"><button onclick="closePopup()" class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</button></div>'
            + '</div>';
          // var infoDiv = '<echartJoinus1 class="flex-1"></echartJoinus1>';
          $("#cesiumContainer").append(infoDiv);

          // var content = '';
          // for (var i = 1; i < mapPopField.length; i++) {
          //   content += `<p>${mapPopName[i]}：${feature.properties[mapPopField[i]] != undefined ? feature.properties[mapPopField[i]] : ''}</p>`;
          // }


        }
      });
    },
  }
};
/* eslint-disable */
</script>
<style scoped lang="less">
  #cesiumContainer {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .sm-compass {
    pointer-events: auto;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 128px;
    height: 128px;
    overflow: hidden;
  }
  .sm-zoom {
    top: 130px;
  }
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
    background: url("images/map.png");
    background-size: 100% 100%;
  }
  .map1 {
    position: relative;
    width: 42%;
    margin: auto;
    height: auto;
    margin-top: 11%;
  }
  .list1,
  .list2,
  .list3 {
    position: fixed;
    left: 27%;
    top: 90px;
    /* width: 183px;
    height: 58px; */
    line-height: 75px;
  }
  .list2 {
    top: 223px;
  }
  .list3 {
    top: 291px;
  }
  .total {
    position: fixed;
    /* line-height: 75px; */
    left: 52%;
    top: 100px;
  }
  .bottomlist {
    position: fixed;
    right: 28%;
    bottom: 16%;
    /* line-height: 35px; */
  }
  .steps {
    position: absolute;
    left: 30%;
    bottom: 4%;
    position: fixed !important;
    line-height: 35px;
  }
  #mapView {
    width: 100%;
  }
  .cesium-viewer {
    height: 100%
  }
  .cesium-viewer-cesiumWidgetContainer {
    height: 100%
  }
  /deep/ .pop-tip-sanwei {
    position: relative;
    font-size: 0.16rem;
    text-align: left;
    padding-bottom: 0.25rem;
    min-width: 1.5rem;
    > p:first-child {
      font-size: 0.18rem;
      line-height: 0.3rem;
    }
    > p {
      line-height: 0.2rem;
    }
  }
  /deep/ .pop-tip-title {
    color: #58A7DB;
    font-size: 0.16rem;
    line-height: 0.2rem;
    margin-bottom: 0.05rem;
  }
  /deep/ .pop-tip-more {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.12rem;
    line-height: 0.12rem;
    display: block;
    cursor: pointer;
  }
  /deep/ .mapboxgl-popup {
    top: -0.14rem;
    min-width: 5rem;
  }
  // 修改地图poptip样式
  /deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: rgba(38, 104, 159, 0.8);
  }
  /deep/ .mapboxgl-popup-content {
    background: rgba(38, 104, 159, 0.8);
    color: #fff;
  }
  /deep/ .mapboxgl-popup-close-button {
    top: 0.05rem;
    right: 0.05rem;
    z-index: 1;
    font-size: 0.26rem;
    cursor: pointer;
    &:hover {
      background: transparent !important;
    }
  }
  /deep/ .flex-1 {
    position: relative;
  }
  /deep/ #monitor-popup {
    top: -0.14rem;
    min-width: 2.1rem;
    height: 30%
  }
  /*后加的*/
  /deep/ .pop-tip-sanwei {
    .time {
      font-size: 16px;
      width: 92%;
      margin: auto;
      text-align: left;
      height: 35px;
      line-height: 35px;
    }
    .spc {
      float: right;
    }
    h3 {
      margin: 0px;
      padding: 0px;
      text-align: left;
      width: 92%;
      margin: auto;
      height: 35px;
      font-size: 20px;
      line-height: 35px;
      color: #0d95c7;
      position: relative;
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
          top: -20%;
          left: 33.5%;
          transform: translate(-50%, 0);
          font-size: 0.16rem;
        }
        .tip_2 {
          position: absolute;
          color: #ffffff;
          top: -13%;
          left: 10%;
          transform: translate(-50%, 0);
          font-size: 0.14rem;
        }
        .tip div {
          float: left;
          line-height: 25px;
          margin-top: 0.65rem;
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
    h3 img{
      position: absolute;
      right:0;
      top:4px;
      cursor:pointer;
    }
    ul{
      margin-bottom:0.1rem;
    }
    li{
      color:#ffffff;
      width: 90%;
      margin: auto;
      line-height: 30px;
      height: 30px;
    }
    li span{
      width:50%;
      display: block;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }
</style>
