<template>
  <div class="wrapper" v-show="isShow">
    <div class="content flex flex-y">
      <h3 class="flex">
        <span class="flex-1" :key="'a' + index" v-for="(item, index) in fild">{{
          item.name
        }}</span>
      </h3>
      <div class="box-wrapper flex-1">
        <div class="box" ref="wrapper" :id="myUuid">
          <ul ref="ul">
            <li
              @click="jumpMap(item)"
              class="flex"
              :key="'b' + index"
              v-for="(item, index) in data"
            >
              <span
                :class="{ special: item[item2.fild] === '是' }"
                class="flex-1"
                :key="'c' + index2"
                v-for="(item2, index2) in fild"
                >{{ item[item2.fild] }}</span
              >
            </li>
          </ul>
          <Kong v-if="isKong"></Kong>
        </div>
      </div>
    </div>
    <div class="car" v-show="iscars">
      <div>
        <img
          style="vertical-align: middle; padding-right: 5%"
          src="../../../../../static/image/carinfo.png"
        />
        <span class="carinfo">车辆详情</span>
        <span class="carnum">{{ this.carsData.plate }}</span>
      </div>
      <div>
        <div class="carbk">
          <div class="carone">
            <div class="cars">车辆状态</div>
            <div class="carname">{{ this.carsData.STATUS_NAME }}</div>
          </div>
          <div class="lines"></div>
          <div class="cartwo">
            <div class="cars">品牌</div>
            <div class="carname">{{ this.carsData.BRAND }}</div>
          </div>
          <div class="lines"></div>
          <div class="cartwo">
            <div class="cars">型号</div>
            <div class="carname">{{ this.carsData.MODEL }}</div>
          </div>
        </div>
        <div class="carbk">
          <div class="carone">
            <div class="cars">车辆类型</div>
            <div class="carname">{{ this.carsData.VEHICLE_TYPE_NAME }}</div>
          </div>
          <div class="lines"></div>
          <div class="cartwo">
            <div class="cars">购买时间</div>
            <div class="carname">{{ this.carsData.PURCHASE_DATE }}</div>
          </div>
          <div class="lines"></div>
          <div class="cartwo">
            <div class="cars">公司地址</div>
            <div class="carname">{{ this.carsData.AREA_NAME }}</div>
          </div>
        </div>
        <div class="carbk">
          <div class="cars">公司名称</div>
          <div class="carname">{{ this.carsData.companyName }}</div>
        </div>
        <div class="carbk">
          <div class="cars">业务范围</div>
          <div class="carname">
            {{ this.carsData.BSLW_BUSINESS_SCOPE_DESC }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { uuid } from "common/js/util";
import Kong from "components/noData/noData";
import { mapActions } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    fild: {
      type: Array,
      default() {
        return [];
      },
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    iscars: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollTop: 0,
      scrollFlag: null,
      myUuid: "uuid" + uuid(),
      isKong: false,
      monitor: null,
      monitorTime: 1000 * 60,
      isAll: true,
      carsData: "",
    };
  },
  watch: {
    data() {
      // console.log(this.data)
      if (this.isAll) {
        // this.scrollTop = 0
        // $('#' + this.myUuid)[0].scrollTop = 0
      }
      if (!this.data || !this.data.length) {
        this.isKong = true;
      } else {
        this.isKong = false;
      }
      clearTimeout(this.monitor);
      this.scrollDestroyHandler();
    },
  },
  mounted() {
    $("#" + this.myUuid).on({
      mouseover: () => {
        this.scrollDestroyHandler();
      },
      mouseout: () => {
        this.scrollStartHandler();
      },
      scroll: () => {
        if ($("#" + this.myUuid)[0]) {
          this.scrollTop = $("#" + this.myUuid)[0].scrollTop;
          const dom = $("#" + this.myUuid)[0];
          if (!this.scrollFlag) {
            // const dom = $('#' + this.myUuid)[0]
            // this.scrollTop += 1
            // dom.scrollTop = this.scrollTop
            // console.log(this.data.length)
            // console.log(dom.scrollTop + dom.clientHeight === dom.scrollHeight - 50)
            if (dom.scrollTop + dom.clientHeight === dom.scrollHeight - 1) {
              if (this.scrollTop !== 0) {
                if (!this.isAll) this.$emit("next");
              }
            }
            if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
              // console.log(this.isAll)
              if (this.scrollTop !== 0) {
                this.$emit("next");
              }
              if (this.isAll) {
                // this.scrollTop = 0
                // dom.scrollTop = this.scrollTop
                this.scrollDestroyHandler();
                // console.log('refresh')
                // this.$emit('refresh')
              }
              // console.log(this.scrollTop)
            }
          }
          // if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight - 50) {
          //   this.$emit('next')
          // }
        }
      },
    });
  },
  updated() {
    if (this.isShow) {
      this.initScroll();
    } else {
      this.scrollDestroyHandler();
    }
    // const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
    // const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
    // if (ul <= wrapper) {
    //   this.monitor = setTimeout(() => {
    //     this.scrollTop = 0
    //     $('#' + this.myUuid)[0].scrollTop = 0
    //     if (this.isAll) {
    //       // console.log('refresh')
    //       this.$emit('refresh')
    //     }
    //   }, this.monitorTime)
    // }
  },
  methods: {
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $("#" + this.myUuid)[0];
          this.scrollTop += 1;
          dom.scrollTop = this.scrollTop;
          // console.log(dom.scrollTop + dom.clientHeight === dom.scrollHeight - 50)
          if (dom.scrollTop + dom.clientHeight === dom.scrollHeight - 1) {
            if (this.scrollTop !== 0) {
              this.$emit("next");
            }
          }
          if (this.scrollTop === dom.scrollHeight - dom.clientHeight) {
            console.log(this.isAll);
            // if (this.scrollTop !== 0) {
            //   this.$emit('next')
            // }
            if (this.isAll) {
              // this.scrollTop = 0
              // dom.scrollTop = this.scrollTop
              this.scrollDestroyHandler();
              // this.$emit('refresh')
            }
            console.log(this.scrollTop);
          }
          // if (this.scrollTop > dom.scrollHeight - dom.clientHeight) {
          //   this.scrollTop = 0
          //   dom.scrollTop = this.scrollTop
          // }
        }, 100);
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag);
        this.scrollFlag = null;
      }
    },
    initScroll() {
      this.$nextTick(() => {
        const ul = parseInt(window.getComputedStyle(this.$refs.ul).height);
        if (ul) {
          clearInterval(this.t);
          const wrapper = parseInt(
            window.getComputedStyle(this.$refs.wrapper).height
          );
          if (ul > wrapper) {
            this.scrollStartHandler();
          } else {
            this.scrollDestroyHandler();
          }
        }
      });
    },
    jumpMap(item) {
      console.log("线路",window.echartslayer)
      if (window.echartslayer != undefined) {
        window.echartslayer.remove();
      }
      var data, option, echartslayer;
      var map = window.earths;
      var datas = [];
      datas[0] = item;
      map.setZoom(10);
      this.carsData = datas[0];
      //console.log("车辆数据", datas);
      this.iscars = true;
      map.flyTo({
        center: [datas[0].coords[0][0], datas[0].coords[0][1]],
      });
      option = {
        animation: false,
        GLMap: {
          roam: true,
        },
        coordinateSystem: "GLMap",
        geo: {
          map: "GLMap",
        },

        series: [
          {
            type: "lines",
            polyline: true,
            data: datas,
            silent: true,
            lineStyle: {
              normal: {
                opacity: 0.2,
                width: 5,
              },
            },
            progressiveThreshold: 500,
            progressive: 100,
          },
          {
            type: "lines",
            coordinateSystem: "GLMap",
            polyline: true,
            data: datas,
            lineStyle: {
              normal: {
                width: 3,
              },
            },
            effect: {
              constantSpeed: 40,
              show: true,
              trailLength: 0,
              symbolSize: 50,
            },
          },
        ],
      };
      echartslayer = new EchartsLayer(map);
      echartslayer.chart.setOption(option);
      window.echartslayer = echartslayer;
      //视频热力图
      var dataValue;
      $.ajax({
        //请求方式为get
        type: "GET",
        //json文件位置
        url: "../../file/map/static/yjjson/video.json",
        //返回数据格式为json
        dataType: "json",
        async: false,
        //请求成功完成后要执行的方法
        success: function (data) {
          dataValue = data;
        },
      });
      console.log("视频点数据",dataValue);
      var features = [];
      for (var i = 0; i < dataValue.RECORDS.length; i++) {
        features[i] = {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: [dataValue.RECORDS[i][1], dataValue.RECORDS[i][0]],
          },
          properties: {
            value: "",
          },
        };
      }

    },
    ...mapActions("warning", ["SetSpecalPoint"]),
  },
  beforeDestroy() {
    clearTimeout(this.monitor);
    this.scrollDestroyHandler();
  },
  components: {
    Kong,
  },
};
</script>

<style lang="less" scoped>
.lines {
  width: 1px;
  height: 40px;
  display: inline-block;
  background-color: rgba(151, 151, 151, 1);
  vertical-align: middle;
}
.carone {
  width: 26%;
  display: inline-block;
  margin-left: 1%;
  margin-top: 1%;
  vertical-align: middle;
}
.cartwo {
  width: 33%;
  display: inline-block;
  margin-left: 1%;
  margin-top: 1%;
  vertical-align: middle;
}
.cars {
  margin-left: 5%;
  font-size: 16px;
  font-family: PingFangSC-Regular, "PingFang SC";
  font-weight: 400;
  color: rgb(30, 194, 221);
  line-height: 22px;
  margin-top: 2%;
  margin-bottom: 2%;
}
.carname {
  font-size: 15px;
  font-family: PingFangSC-Regular, "PingFang SC";
  font-weight: 400;
  color: rgb(255, 255, 255);
  line-height: 22px;
  margin-left: 5%;
  margin-bottom: 3%;
  margin-right: 5%;
}
.car {
  width: 85%;
  margin: auto;
  line-height: 0.3rem;
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.carinfo {
  color: white;
  font-size: 0.18rem;
  line-height: 0.35rem;
  height: 0.35rem;
  font-weight: 700;
  vertical-align: middle;
}
.carnum {
  font-size: 24px;
  font-weight: 600;
  color: #0ed3f3;
  line-height: 33px;
  vertical-align: middle;
  float: right;
  padding-right: 7%;
}
.carbk {
  width: 100%;
  //height: 76px;
  height: auto;
  background: linear-gradient(
    180deg,
    rgba(10, 18, 29, 0.6) 0%,
    rgba(255, 255, 255, 0.2) 100%
  );
  opacity: 0.6;
  border: 1px solid #979797;
  margin-top: 5%;
}
.wrapper {
  height: 83%;
  font-size: 0;
  padding: 0.15rem 0;
  .special {
    color: #0ed2f1;
  }
  .content {
    width: 85%;
    margin: auto;
    line-height: 0.3rem;
    color: #fff;
    height: 100%;
    h3 {
      // background-color: #28446a;
      font-size: 0.14rem;
      width: 100%;
      height: 0.3rem;
      color: white;
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
        li:nth-child(even) {
          background-color: rgba(25, 45, 73, 0.4);
        }
      }
    }
    span {
      display: block;
      float: left;
      text-align: center;
      padding: 0 0.05rem;
      .no-wrap();
      > input {
        cursor: pointer;
      }
    }
    ul::-webkit-scrollbar {
      display: none;
    }
    ul {
      overflow-y: scroll;
      li {
        width: 100%;
        height: 0.3rem;
        font-size: 0.14rem;
        cursor: pointer;
        border-bottom: 1px solid rgba(136, 171, 218, 0.2);
      }
    }
  }
}
</style>
