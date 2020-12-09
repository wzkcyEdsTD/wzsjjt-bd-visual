<template>
  <div class="wrapper flex flex-y">
    <ItemTitle title="车辆轨迹" ref="itemTitle" @changeIndex="changeIndex"></ItemTitle>
    <div class="list-camera">
      <span class="list" :class="{active: isShow}" @click="heatlive">
        <img v-if="isShow" src="../item-title/images/renli_blue.png" />
        <img v-else src="../item-title/images/renli_white.png" />
      </span>
    </div>
    <div class="flex-1">
      <List
        ref="list1"
        @next="next"
        :isShow="this.btnIndex === 0"
        :data="listData1"
        :fild="listFild1"
      ></List>
      <List
        ref="list2"
        @next="next"
        :isShow="this.btnIndex === 1"
        :data="listData2"
        :fild="listFild2"
      ></List>
    </div>
  </div>
</template>

<script>
import ItemTitle from "../item-title/item-title-liangkeyiwei";
import List from "../list/chelianglist";
import { getEnterpriseMainByUser } from "api/warning/warning";
import { monitorTypeMixin } from "common/js/mixin";
import {
  Logo,
  QueryByBoundsParameters,
  QueryService,
  FeatureService,
  MeasureService
} from "@supermap/iclient-mapboxgl";
import {
  distance,
  point,
  circle,
  bboxPolygon,
  booleanPointInPolygon,
  polygon,
  pointsWithinPolygon
} from "@turf/turf";
import {
  getTableData,
  getCategoryByPid,
  getPointTreeList,
  getSearchNameList,
  getTypeDetail,
  getPictureDistrictTypeNum,
  getCommonPictureList,
  getNearAnalysisList
} from "api/map/map";
export default {
  name: "BusMonitor",
  mixins: [monitorTypeMixin],
  data() {
    return {
      isShow: false,
      btnIndex: 0,
      numOne: "",
      numTwo: "",
      listData1: [],
      listData2: [],
      searchContent1: "",
      searchContent2: "",
      timer: null,
      listFild1: [
        { name: "车牌号", fild: "plate" },
        { name: "公司名称", fild: "companyName" }
      ],
      listFild2: [
        { name: "车牌号", fild: "plate" },
        { name: "警报类型", fild: "warnType" }
      ],
      point: "liangkeyiweijiance",
      listDataO: [],
      listDataT: [],
      index: 1
    };
  },
  watch: {
    currentMonitorType() {
      if (this.currentMonitorType.from !== this.point) {
        if (
          this.currentMonitorType.alias &&
          this.currentMonitorType.alias.indexOf(this.point) === 0
        ) {
          if (this.currentMonitorType.checked) {
            this.dotIndex = 1;
          } else {
            this.dotIndex = 0;
          }
        }
      }
    }
  },
  mounted() {
    this.searchList1();
    this.searchList2();
    this.timer = setInterval(() => {
      this.searchList1();
      this.searchList2();
    }, 300000);
  },
  methods: {
    changeIndex(index) {
      this.btnIndex = index;
    },
    searchList1() {
      this.initData(0);
    },
    searchList2() {
      this.initData(1);
    },
    // 加载其他数据
    next() {
      if (this.searchContent) {
        this.$refs.list1.isAll = true;
        return;
      }
      this.index += 1;
      if (this.btnIndex === 0) {
        if (
          this.listDataO.length > 0 &&
          this.listData1.length < this.listDataO.length
        ) {
          this.listData1 = [
            ...this.listData1,
            ...this.listDataO.slice(10 * (this.index - 1), 10 * this.index)
          ];
        } else {
          this.$refs.list1.isAll = true;
        }
      } else if (this.btnIndex === 1) {
        if (
          this.listDataT.length > 0 &&
          this.listData2.length < this.listDataT.length
        ) {
          this.listData2 = [
            ...this.listData2,
            ...this.listDataT.slice(10 * (this.index - 1), 10 * this.index)
          ];
        } else {
          this.$refs.list2.isAll = true;
        }
      }
    },
    initData(num) {
      console.log("刷新");
      let type = this.btnIndex;
      if (typeof num === "number") {
        type = num;
      }
      let search = this.searchContent1;
      if (type === 1) {
        search = this.searchContent2;
      }
      getEnterpriseMainByUser(type, search).then(data => {
        this.index = 1;
        this.$refs.list1.isAll = false;
        this.$refs.list2.isAll = false;
        let dataValue = {};
        if (type === 0) {
          $.ajax({
            //请求方式为get
            type: "GET",
            //json文件位置
            url: "http://172.20.83.195:9000/file/map/static/yjjson/Bus.json",
            //返回数据格式为json
            dataType: "json",
            async: false,
            //请求成功完成后要执行的方法
            success: function(data) {
              dataValue = data;
            }
          });
          this.listDataO = dataValue;
          this.listData1 = dataValue;
          this.numOne = "接入数" + data.totalCount;
        } else if (type === 1) {
          this.listDataT = data.details;
          this.listData2 = data.details.slice(
            10 * (this.index - 1),
            10 * this.index
          );
          this.numTwo = "报警数" + data.totalCount;
        }
      });
    },
    heatlive() {
      if (window.earths.getLayer("heatmap")) {
        if (window.earths.getLayer("WX_layer")) {
          console.log("WX_layer");
          window.earths.removeLayer("WX_layer");
          window.earths.removeSource("WX_source");
        }
        if (window.earths.getLayer("showAround_layer")) {
          console.log("showAround_layer");
          window.earths.removeLayer("showAround_layer");
          window.earths.removeSource("showAround_source");
        }
        $(".mapboxgl-popup-close-button").off("click");
        var tipElArr = document.getElementsByClassName(
          "mapboxgl-popup-close-button"
        );
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        window.earths.off("click", "heatmaponclick");
        window.earths.removeLayer("heatmaponclick");
        window.earths.removeLayer("heatmap");
        window.earths.removeSource("heatmap");
      }
      if (!this.isShow) {
        var mapsss = window.earths;
        var unit = "px";
        //视频热力图
        var dataValue;
        $.ajax({
          //请求方式为get
          type: "GET",
          //json文件位置
          url: "http://172.20.83.195:9000/file/map/static/yjjson/Busstop.json",
          //url: "../../static/yjjson/Busstop.json",
          //返回数据格式为json
          dataType: "json",
          async: false,
          //请求成功完成后要执行的方法
          success: function(data) {
            dataValue = data;
          }
        });
        var features = [];
        for (var i = 0; i < dataValue.RECORDS.length; i++) {
          features[i] = {
            type: "feature",
            geometry: {
              type: "Point",
              coordinates: [dataValue.RECORDS[i][1], dataValue.RECORDS[i][0]]
            },
            properties: {
              value: ""
            }
          };
        }
        var heatPoint1 = {
          type: "FeatureCollection",
          features: features
        };
        mapsss.addSource("heatmap", {
          type: "geojson",
          data: heatPoint1
        });
        mapsss.addLayer({
          id: "heatmap",
          type: "heatmap",
          source: "heatmap",
          paint: {
            "heatmap-weight": 1,
            "heatmap-intensity": 2,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(0,255,240)",
              0.4,
              "rgb(0,255,40)",
              0.6,
              "rgb(255,255,0)",
              0.8,
              "rgb(255,125,0)",
              1,
              "rgb(255,0,0)"
            ],
            "heatmap-radius": 10
          }
        });
        mapsss.addLayer({
          id: "heatmaponclick",
          type: "circle",
          source: "heatmap",
          paint: {
            "circle-radius": 10,
            "circle-color": "blue",
            "circle-opacity": 0
          }
        });
        mapsss.on("click", "heatmaponclick", function(e) {
          var points = [e.lngLat.lng, e.lngLat.lat];
          var circles = createCircle(points, 1000);
          function createCircle(center, radius) {
            var options = { steps: 100, units: "meters", properties: "" };
            let res = circle(center, radius, options);
            return res;
          }
          if (mapsss.getLayer("showAround_layer")) {
            mapsss.removeLayer("showAround_layer");
          }
          if (!mapsss.getSource("showAround_source")) {
            mapsss.addSource("showAround_source", {
              type: "geojson",
              data: circles
            });
          } else {
            mapsss.getSource("showAround_source").setData(circles);
          }
          mapsss.addLayer({
            id: "showAround_layer",
            type: "fill",
            source: "showAround_source",
            paint: {
              "fill-outline-color": "#00fff2",
              "fill-color": "rgba(0, 53, 53, 0.2)"
            }
          });
          var queryCoordinates = circles.geometry.coordinates;
          var queryPolygonGeometry = {
            type: "Polygon",
            coordinates: queryCoordinates
          };
          mapsss.setZoom(15);
          mapsss.flyTo({
            center: points
          });
          var dataUrl =
            "http://172.20.83.223:8090/iserver/services/data-WZKG0728/rest/data/";
          var aaa = addAroundQueryScatterLayer();
          function addAroundQueryScatterLayer() {
            var geometryParam = [];
            geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
              attributeFilter: "SMID>0",
              datasetNames: ["172.20.83.196_ersjdata:AQFX_HGJWXP"],
              geometry: queryPolygonGeometry,
              spatialQueryMode: "INTERSECT", // 相交空间查询模式
              fromIndex: 0,
              toIndex: 99999,
              maxFeatures: 100000
            });
            new FeatureService(dataUrl).getFeaturesByGeometry(
              geometryParam,
              function(serviceResult) {
                const result = serviceResult && serviceResult.result;
                if (result) {
                  let features = result.features;
                  for (let c = 0; c < features.features.length; c++) {
                    features.features[c].properties.alias = "WX";
                    features.features[c].properties.icon =
                      "./static/gitimage/wx/wx.png";
                    features.features[c].properties._mapPopField = [
                      "NAME",
                      "ADDRESS",
                      "TYPE"
                    ];
                    features.features[c].properties._mapPopName = [
                      "名称",
                      "地址",
                      "类型"
                    ];
                  }
                  if (!mapsss.getSource("WX_source")) {
                    mapsss.addSource("WX_source", {
                      type: "geojson",
                      data: features
                    });
                  } else {
                    mapsss.getSource("WX_source").setData(features);
                  }
                  mapsss.loadImage("./static/gitimage/wx/wx.png", function(
                    error,
                    image
                  ) {
                    if (error) {
                      console.log("erro", error);
                    }
                    if (!mapsss.hasImage("WX_point")) {
                      mapsss.addImage("WX_point", image);
                    }
                    if (mapsss.getLayer("WX_layer")) {
                      mapsss.removeLayer("WX_layer");
                    }
                    mapsss.addLayer({
                      id: "WX_layer",
                      type: "symbol",
                      source: "WX_source",
                      layout: {
                        "text-field": "{NAME}",
                        "text-font": [
                          "DIN Offc Pro Bold",
                          "Arial Unicode MS Bold"
                        ],
                        "text-offset": [0, 2],
                        "text-size": 15,
                        "text-max-width": 18,
                        "icon-image": "WX_point",
                        "icon-size": 0.6,
                        "icon-allow-overlap": true
                      },
                      paint: {
                        "text-color": "#00d8ff",
                        "text-halo-width": 1,
                        "text-halo-color": "rgba(0, 0, 0, 1)"
                      }
                    });
                    mapsss.on("click", "WX_layer", function(e) {
                      var longitude = e.features[0].properties.LONGITUDE;
                      var latitude = e.features[0].properties.LATITUDE;
                      var lngLat = {
                        lng: Number(longitude),
                        lat: Number(latitude)
                      };
                      var mapPopName = ["名称", "地址", "类型"];
                      var mapPopField = ["NAME", "ADDRESS", "TYPE"];
                      var str = "";
                      for (var i = 1; i < mapPopField.length; i++) {
                        str += `<div><span>${mapPopName[i]}：</span><p>${
                          e.features[0].properties[mapPopField[i]]
                            ? e.features[0].properties[mapPopField[i]]
                            : "暂无数据"
                        }</p></div>`;
                      }
                      var html = `<div class="pop-tip">
                        <p class=""  >${
                          e.features[0].properties[mapPopField[0]]
                            ? e.features[0].properties[mapPopField[0]]
                            : "暂无数据"
                        }</p>
                        ${str}
                    </div>`;
                      var tipElArr = document.getElementsByClassName(
                        "mapboxgl-popup-close-button"
                      );
                      for (var i = 0; i < tipElArr.length; i++) {
                        tipElArr[i].click();
                      }
                      // 弹出提示框
                      var popup = new mapboxgl.Popup({
                        closeOnClick: true
                      });
                      popup
                        .setLngLat(lngLat)
                        .setHTML(html)
                        .addTo(mapsss);
                    });
                  });
                } else {
                  console.log("查询失败");
                }
              }
            );
          }
        });
      }
      this.isShow = !this.isShow;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  components: {
    ItemTitle,
    List
  }
};
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  .title-btn-group {
    position: absolute;
    top: 0;
    right: 0;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.14rem;
    margin-right: 0.05rem;
    .dot-white {
      cursor: pointer;
      width: 0.32rem;
      height: 0.35rem;
      float: right;
      > img {
        margin: 0 auto;
        display: block;
        width: 0.12rem;
        height: 0.19rem;
        margin-top: 0.08rem;
      }
    }
  }
}
.list-camera {
  position: absolute;
  z-index: 100;
  right: 40px;
  top: 0px;
  height: 0.35rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
