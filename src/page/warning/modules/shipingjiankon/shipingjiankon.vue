<template>
  <div class="wrapper">
    <div class="video-block">
      <ItemTitle title="视频监控" :num="videoCount"></ItemTitle>
      <!-- <ItemTitle title="视频监控" ></ItemTitle> -->
      <div>
        <span
          class="konjian-search"
          @click="spaceSearch"
          :class="{ active: searchActive }"
          >空间查询</span
        >
      </div>
      <div class="video-buttons">
        <el-select
          v-model="xqValue"
          @change="getVideoData"
          :popper-append-to-body="appendBody"
        >
          <el-option
            v-for="item in xqList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <span
          class="dot-white"
          @click="changeDot"
          style="margin-left: 40px; cursor: pointer"
        >
          <img
            v-if="dotIndex === 0"
            src="../item-title/images/dot_white.png"
            style="vertical-align: middle"
          />
          <img
            v-else
            src="../item-title/images/dot_blue.png"
            style="vertical-align: middle"
          />
        </span>
      </div>
      <div class="list-camera">
        <span class="list" :class="{ active: isShow }" @click="heatlive">
          <img v-if="isShow" src="../item-title/images/renli_blue.png" />
          <img v-else src="../item-title/images/renli_white.png" />
        </span>
      </div>
      <!-- <div class="list-camera">
        <span class='list' :class="{active: isShow}" @click="listShow">
           <img v-if="isShow" src="../item-title/images/camera_blue.png"/>
           <img v-else src="../item-title/images/camera_white.png"/>
          </span>
      </div> -->
      <div class="shoucang-list">
        <span class="list" @click="chsngaShoucangShow">
          <img v-if="!shoucangShow" src="./images/shoucang1.png" />
          <img v-else src="./images/shoucang2.png" />
        </span>
      </div>
      <nav style="display: none">
        <span
          v-for="(item, index) in navList"
          @click="changeId(item)"
          :class="{ active: item.id === videoListId }"
          :key="'n' + index"
          >{{ item.name }}</span
        >
      </nav>
      <div
        class="video-block-content"
        v-loading="loadingFlag"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <el-input
          placeholder="输入监控名称"
          v-model="searchContent"
          @change="getVideoData(true)"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getVideoData(true)"
          ></el-button>
        </el-input>
        <el-tree
          ref="tree"
          :props="defaultProps"
          :data="videoList"
          :load="loadNode"
          @node-click="handleNodeClick"
          node-key="id"
          :highlight-current="true"
          :default-expanded-keys="expandedKeys"
          lazy
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span
              v-show="data.level === 1"
              @click="showInMap($event, data.id, data.icon)"
              class="dot"
              :class="{ active: data.isActive }"
            >
            </span>
            <span
              @click="
                changeCollection(data.collection, data.leaf, data.id, $event)
              "
              :class="{
                sign: typeof data.collection === 'boolean',
                active: data.collection,
              }"
            >
            </span>
          </span>
        </el-tree>
      </div>
      <!-- <div v-show="shoucangShow" class="shoucang-list-wrapper">
        <Collection ref="collection" @handleNodeClick="handleNodeClick"></Collection>
      </div> -->
    </div>
  </div>
</template>
<script>
import {
  getDistrictAndTypeInfo,
  // getVideoInfo,
  // getMonitorCameraDetail,
  addUserVideo,
  deleteUserVideo,
  getFirstVideoLevel,
  getVideoTree,
  getVideoTreeDetail,
} from "api/warning/warning";
import ItemTitle from "../item-title/item-title";
import { monitorTypeMixin } from "common/js/mixin";
import Collection from "./modules/collection/collection";
import { mapActions } from "vuex";

export default {
  components: {
    ItemTitle,
    Collection,
  },
  mixins: [monitorTypeMixin],
  data() {
    return {
      shoucangShow: false,
      listFild: [{ name: "视屏名称", fild: "name" }],
      listData: [],
      videoCount: "",
      loadingFlag: false,
      xqValue: "",
      xqList: [],
      // 视频播放列表
      videoList: [],
      list: [{ name: "region" }, { name: "region1" }],
      defaultProps: {
        childern: "childern",
        label: "name",
        isLeaf: "leaf",
      },
      expandedKeys: [1],
      point: "shipinjiance",
      selectFlag: true,
      appendBody: false,
      isShow: false,
      searchContent: "",
      navList: [],
      videoListId: "",
      searchActive: false,
      smidList: "",
      dsjdt: "",
      nums: [],
      readiuss: [],
      unitss: "",
      heatPoints: [],
      features: [],
      // defaultProps: {
      //   childern: 'childern',
      //   label: 'name',
      //   key: 'key'
      // },
      // search: '',
      // dataType: []
    };
  },
  async created() {
    await getFirstVideoLevel().then((res) => {
      this.navList = res;
      this.videoListId = res[2].id;
    });
    if (this.$store.state.userInfo.district === "3303") {
      // 判断是否是温州市区
      await this.getVideoData(true);
      this.getXqTypeList();
    } else {
      this.getXqTypeList();
      await this.getVideoData(true);
    }
    // await getVideoTree('', this.videoListId, this.shoucangShow, this.searchContent).then(res => {
    //   let total = 0
    //   this.videoList = res.childern.map(item => {
    //     total += item.count
    //     item = this.videoManage(item)
    //     return item
    //   })
    //   this.$bus.$emit('monitorList', this.videoList)
    //   this.videoCount = '接入总数' + total
    // })
    // this.$watch('search', debounce((newQuery) => {
    //   this.initData()
    // }, 200))
  },
  mounted() {
    this.$bus.$on("monitorShow", (data) => {
      this.isShow = data.isShow;
    });
    this.$bus.$on("clearVideoMonitor", (data) => {
      this.videoList = this.videoList.map((item) => {
        item.isActive = false;
        return item;
      });
      console.log(this.videoList);
    });
    // 接收空间查询信息
    this.$bus.$on("videoTreeData", (data) => {
      console.log(data);
      this.smidList = data.smidList;
      this.videoList = data.childern.map((item) => {
        item.isActive = true;
        item = this.videoManage(item, item.id, item.icon);
        return item;
      });
    });
  },
  methods: {
    changeDot() {
      this.dotIndex = (this.dotIndex + 1) % 2;
      const arr = [];
      if (this.dotIndex === 1) {
        this.videoList.forEach((val, i) => {
          // 数据库id重复，用label来区别
          // if (val.label === node.data.label) {
          this.videoList[i].isActive = true;
          // }
          arr.push({
            id: val.id,
            checked: true,
            icon: val.icon,
            alias: "shipingjiankon",
          });
        });
        console.log("视频监控定位", arr);
        this.SetCurrentMonitorTypeArr(arr);
      } else {
        this.videoList.forEach((val, i) => {
          // 数据库id重复，用label来区别
          // if (val.label === node.data.label) {
          this.videoList[i].isActive = false;
          // }
          arr.push({
            id: val.id,
            checked: false,
            icon: val.icon,
            alias: "shipingjiankon",
          });
        });
        this.SetCurrentMonitorTypeArr(arr);
      }
    },
    ...mapActions("warning", ["SetVideoFirstMenuID"]),
    changeId(item) {
      if (this.videoListId !== item.id) {
        this.searchActive = false;
        this.$bus.emit("spaceSearch", {
          id: item.id,
          isChecked: this.searchActive,
        });
      }
      this.videoListId = item.id;
      this.getVideoData();
    },
    // 空间查询
    spaceSearch() {
      this.searchActive = !this.searchActive;
      if (!this.searchActive) {
        this.smidList = "";
        this.getVideoData();
      }
      this.$bus.emit("spaceSearch", {
        id: this.videoListId,
        isChecked: this.searchActive,
      });
    },
    // 视频一级打点
    showInMap(e, id, icon) {
      e.stopPropagation();
      console.log(this.videoList);
      // this.videoList[0].isActive = true
      const node = this.$refs.tree.getNode(id);
      let checked = false;
      this.videoList.forEach((val, i) => {
        // 数据库id重复，用label来区别
        if (val.label === node.data.label) {
          this.videoList[i].isActive = !this.videoList[i].isActive;
          checked = this.videoList[i].isActive;
        }
      });
      this.SetVideoFirstMenuID({
        id: id,
        checked: checked,
        icon: icon,
      });
    },
    changeCollection(collection, leaf, smid, e) {
      e.stopPropagation();
      const node = this.$refs.tree.getNode(smid);
      // 如果不是叶子节点 return
      if (node.childNodes && node.childNodes.length > 0) {
        return false;
      }
      if (node.data.collection) {
        deleteUserVideo(smid).then((data) => {
          const newData = JSON.parse(JSON.stringify(node.data));
          newData.collection = false;
          node.setData(newData);
          // this.$refs.collection.getVideoData(true)
        });
      } else {
        addUserVideo(smid).then((data) => {
          const newData = JSON.parse(JSON.stringify(node.data));
          newData.collection = true;
          node.setData(newData);
          // this.$refs.collection.getVideoData(true)
        });
      }
    },
    // renderContent(h, { node, data, store }) {
    //   /* eslint-disable */
    //   return (
    //     <span class='custom-tree-node'>
    //     <span> { node.label } </span>
    //     <span
    //   onclick = { 'changeCollection("'+data.collection_smid + '","' + data.leaf + '","' + data.smid + '")' }
    // class
    //   = { data.leaf ? (data.collection_smid && data.collection_smid !== '' ? 'sign active' : 'sign') : '' } > < /span>
    //     < /span>);
    //   /* eslint-disable */
    // },
    chsngaShoucangShow() {
      this.shoucangShow = !this.shoucangShow;
      this.getVideoData();
      this.$bus.$emit("monitorShow", {
        isShow: this.isShow,
        shoucangShow: this.shoucangShow,
        videoListId: this.videoListId,
        // shoucang: this.$refs.collection.videoList
      });
    },
    loadNode(node, resolve) {
      if (!this.videoListId) return;
      console.log(node);
      if (node.level === 0) {
        var total = 0;
        getVideoTree(
          "",
          this.videoListId,
          this.shoucangShow,
          this.searchContent
        ).then((res) => {
          console.log(res);
          this.videoList = res.childern.map((item) => {
            // item.name = `${item.name}(${item.total}个)`
            total += item.count;
            item = this.videoManage(item, item.id, item.icon);
            item.isActive = false;
            return item;
          });
          this.$bus.$emit("monitorList", this.videoList);
          this.videoCount = total;
          this.videoList[0].smid = 1;
          return resolve(this.videoList);
        });
      }
      // if (node.level === 1 || node.level === 2) {
      //   node.data.childern = node.data.childern.map(val => {
      //     if (val.total === 0) val.leaf = true
      //     return val
      //   })
      //   return resolve(node.data.childern)
      // }
      if (node.data && node.data.childern && node.data.childern.length > 0) {
        node.data.childern = node.data.childern.map((val) => {
          if (val.count > 0 && !val.childern) val.childern = [];
          if (!val.childern || val.count === 0) val.leaf = true;
          return val;
        });
        return resolve(node.data.childern);
      }
      if (node.data && node.data.count > 0) {
        console.log(node);
        let requestId = node.parent.data.id;
        if (this.$store.state.userInfo.district !== "3303")
          requestId = node.data.id;
        getVideoTreeDetail(
          this.smidList ? "" : this.xqValue || node.data.code,
          requestId,
          this.shoucangShow,
          this.searchContent,
          this.smidList
        ).then((res) => {
          res = res.map((val) => {
            if (!val.childern || val.childern.length === 0) val.leaf = true;
            val = this.videoManage(val, node.data.parentId, node.data.icon);
            return val;
          });
          return resolve(res);
        });
      }
      if (!node.data || !node.data.childern) return resolve([]);
      // if (node.level > 1) return resolve([{ name: 'data1' }])

      // setTimeout(() => {
      //   const data = [{
      //     name: 'leaf',
      //     leaf: true
      //   }, {
      //     name: 'zone'
      //   }]
      //   resolve(data)
      // }, 500)
    },
    handleNodeClick(data) {
      console.log(data);
      const node1 = this.$refs.tree.getNode(data.id);
      console.log(node1.parent.data.parentId);
      const node = this.$refs.tree.getNode(node1.parent.data.parentId);
      if (data.childern) return;
      // if (this.dotIndex === 0) {
      //   this.changeDot()
      // }
      const newData = JSON.parse(JSON.stringify(node.data));
      console.log(newData);
      if (!newData.isActive) {
        // newData.isActive = true
        // // node.setData(newData)
        // this.SetVideoFirstMenuID({
        //   id: newData.id,
        //   checked: newData.isActive,
        //   icon: newData.icon
        // })
        let checked = false;
        this.videoList.forEach((val, i) => {
          // 数据库id重复，用label来区别
          if (val.label === newData.label) {
            this.videoList[i].isActive = true;
            checked = this.videoList[i].isActive;
          }
        });
        this.SetVideoFirstMenuID({
          id: newData.id,
          checked: checked,
          icon: newData.icon,
        });
      }
      this.$emit("treeCheckedCamera", data);
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
          //url:"../../static/yjjson/video.json",
          url: "http://172.20.83.195:9000/file/map/static/yjjson/video.json",
          //返回数据格式为json
          dataType: "json",
          async: false,
          //请求成功完成后要执行的方法
          success: function (data) {
            dataValue = data;
          },
        });
        var features = [];
        for (var i = 0; i < dataValue.RECORDS.length; i++) {
          features[i] = {
            type: "feature",
            geometry: {
              type: "Point",
              coordinates: [dataValue.RECORDS[i][0], dataValue.RECORDS[i][1]],
            },
            properties: {
              value: "",
            },
          };
        }
        var heatPoint1 = {
          type: "FeatureCollection",
          features: features,
        };
        mapsss.addSource("heatmap", {
          type: "geojson",
          data: heatPoint1,
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
              "rgb(255,0,0)",
            ],
            "heatmap-radius": 10,
          },
        });
      } else {
        if (window.earths.getLayer("heatmap")) {
          window.earths.removeLayer("heatmap");
          window.earths.removeSource("heatmap");
        }
      }
      this.isShow = !this.isShow;
    },
    // 监控列表
    listShow() {
      this.isShow = !this.isShow;
      this.$bus.$emit("monitorShow", {
        isShow: this.isShow,
        shoucangShow: this.shoucangShow,
        videoListId: this.videoListId,
        // shoucang: this.$refs.collection.videoList
      });
    },
    // 获取区县列表
    getXqTypeList() {
      getDistrictAndTypeInfo().then((res) => {
        const xq = res.districtInfo;
        if (this.$store.state.userInfo.district === "3303") {
          xq.unshift({
            code: "",
            name: "全市",
          });
        } else {
          xq.unshift({
            code: "",
            name: "全区县",
          });
        }
        this.xqList = xq;
        this.xqValue = xq[0].code;
      });
    },
    // 视频数据处理
    videoManage(data, id, icon) {
      if (typeof data.count === "number" && data.childern) {
        data.label = data.name;
        data.name = `${data.name}(${data.count}个)`;
        data.parentId = id;
        data.icon = icon;
      }
      if (data.childern) {
        data.childern = data.childern.map((val) => {
          val = this.videoManage(val, id, icon);
          return val;
        });
      }
      return data;
    },
    // 获取视频信息
    getVideoData(bool) {
      this.loadingFlag = true;
      this.videoListId = '3303002';
      getVideoTree(
        this.xqValue,
        this.videoListId,
        this.shoucangShow,
        this.searchContent
      ).then((res) => {
        let total = 0;
        console.log("获取数据",res);
        this.videoList = res.childern.map((item) => {
          total += item.count;
          item = this.videoManage(item, item.id, item.icon);
          item.isActive = false;
          return item;
        });
        this.$bus.$emit("monitorList", this.videoList);
        this.videoCount = "" + total;
        this.loadingFlag = false;
        console.log("获取视频数据",this.videoList);
      });
      // getVideoInfo(this.xqValue, this.searchContent)
      //   .then(res => {
      //     this.videoList = res.map(item => {
      //       // item.name = `${item.name}(${item.total}个)`
      //       total += item.total
      //       item = this.videoManage(item)
      //       return item
      //     })
      //     this.$bus.$emit('monitorList', this.videoList)
      //     this.$bus.$emit('video-search', this.searchContent)
      //     this.videoCount = '接入总数' + total
      //     this.videoList[0].childern[0].cameraId = 1
      //     this.videoList[1].childern[0].cameraId = 2
      //     if (bool && this.$store.state.warning.waterState === 'shipingjiankon') {
      //       this.expandedKeys = [2]
      //     }
      //     this.loadingFlag = false
      //   })
      //   .catch(_ => {
      //     this.videoCount = ''
      //     this.loadingFlag = false
      //   })
    },
    // nodeClick(data, node, el) {
    //   if (data.video_url) {
    //     this.$nextTick(() => {
    //       if (el.$el.className.indexOf('active') === -1) {
    //         el.$el.className = 'el-tree-node is-expanded is-focusable active'
    //         data.checked = true
    //       } else {
    //         el.$el.className = 'el-tree-node is-expanded is-focusable'
    //         data.checked = false
    //       }
    //       const checkedListKey = this.$refs.tree.getCheckedKeys()
    //       if (checkedListKey.indexOf(node.parent.key) === -1) {
    //         checkedListKey.push(node.parent.key)
    //         this.$refs.tree.setCheckedKeys(checkedListKey)
    //         this.$nextTick(() => {
    //           el.$el.className = 'el-tree-node is-expanded is-focusable active'
    //         })
    //         this.handleCheckChange(node.parent.data)
    //       }
    //       this.$emit('treeCheckedCamera', data)
    //     })
    //   }
    // },
    // initData() {
    //   getMonitorCamera().then((res) => {
    //     this.dataType = res
    //   })
    // },
    close() {
      this.$emit("close", -1);
    },
  },
};
</script>
<style scoped lang="less">
.konjian-search {
  color: #fff;
  cursor: pointer;
  display: none;
  width: 0.8rem;
  height: 0.2rem;
  line-height: 0.2rem;
  background-color: #2497ce;
  text-align: center;
  border-radius: 4px;
  float: right;
  font-size: 0.14rem;
  cursor: pointer;
  margin-top: 0.05rem;
  margin-bottom: 0.1rem;
  &.active {
    color: #ffd800;
  }
}
.konjian-search:hover {
  background-color: #22b4fa;
}
.shoucang-list {
  position: absolute;
  z-index: 100;
  right: 0.7rem;
  top: 0;
  height: 0.35rem;
  display: none;
  align-items: center;
  cursor: pointer;
  .list {
    img {
      width: 0.24rem;
      height: 0.24rem;
    }
  }
}
.shoucang-list-wrapper {
  flex-grow: 1;
  min-height: 0;
  height: 100%;
  padding: 15px 20px 15px 14px;
  box-sizing: border-box;
  overflow: auto;
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
.wrapper {
  /*    position: fixed;
      left: 0.14rem;
      top: 0.5rem;
      z-index: 1;
      width: 4.8rem;
      bottom: 0.1rem;*/
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  .tree,
  .video-block {
    padding: 0.1rem 0.2rem;
    padding-top: 0.35rem;
    border-radius: 0.04rem;
    border: 0.01rem solid #38cbda;
    // background: rgba(8, 26, 68, 1);
    height: 100%;
    .tree-wrapper {
      height: 100%;
      width: 100%;
      overflow: auto;
      .tree-content {
        width: 100%;
      }
    }
  }
}
.close {
  color: #ffffff;
  font-size: 0.14rem;
  position: absolute;
  top: 0.07rem;
  right: 0.1rem;
  cursor: pointer;
  width: 0.2rem;
  height: 0.2rem;
  display: block;
  .bg-image("./images/close");
  transform: rotate(-45deg);
  transition: all 0.1s linear;
  z-index: 99;
  &:hover {
    transform: rotate(45deg);
  }
}
.wrapper .video-block {
  padding: 0;
  border-radius: 0;
  border: none;
  display: flex;
  flex-direction: column;
  // background: rgba(0, 0, 0, 0.5);
}
.video-buttons {
  position: absolute;
  z-index: 100;
  right: 15px;
  top: 0px;
  height: 0.35rem;
  display: flex;
  align-items: center;
  /deep/ .el-select {
    width: 86px;
    /* margin-right: 0.7rem; */
  }
  /deep/ input {
    height: 0.25rem;
    line-height: 0.25rem;
    padding-right: 20px;
    background: transparent;
    border-color: rgba(56, 64, 74, 1);
    color: #a2aabf;
    border: 1px solid;
  }
  /deep/ .el-input__suffix {
    right: 1px;
    i {
      color: #a2aabf;
      line-height: 0.25rem;
    }
  }
}
.video-block-content {
  flex-grow: 1;
  min-height: 0;
  height: 100%;
  padding: 15px 20px 15px 14px;
  box-sizing: border-box;
  overflow: auto;
}
.video-block-content /deep/ .el-tree {
}
.video-block-content /deep/ .el-tree > div > .el-tree-node__content {
  color: #0ed6f5;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(
    270deg,
    rgba(56, 64, 74, 0) 0%,
    rgba(56, 64, 74, 0.7) 100%
  ) !important;
}
/* 树 */
/deep/ .active .el-tree-node__label {
  color: #ffd800 !important;
}
/deep/
  .el-tree
  .el-tree-node__childern
  .el-tree-node__childern
  .el-tree-node__childern
  .el-tree-node__content
  .el-checkbox {
  display: none;
}
/deep/ .el-tree {
  background: transparent;
  color: #fff;
}
/deep/ .el-tree-node__content:hover {
  background-color: rgba(27, 147, 254, 0.4);
  background: transparent;
}
/deep/ .el-tree-node.is-current > .el-tree-node__content,
/deep/ .el-tree-node:focus > .el-tree-node__content {
  /*background-color: rgba(27, 147, 254, 0.4) !important;*/
  background: transparent !important;
  color: #0ed6f5;
}
/deep/
  .el-tree-node.is-current
  > .el-tree-node__childern
  .el-tree-node__content {
  /*background: linear-gradient(90deg,rgba(14,214,245,0.25) 0%,rgba(14,214,245,0) 100%);*/
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  .bg-image("images/btn_checked");
  border: none;
}
/deep/ .el-checkbox__inner {
  .bg-image("images/btn_kong");
  border: none;
}
/deep/ .el-checkbox__inner::after {
  display: none;
}
/deep/ .el-tree-node__content > .el-tree-node__expand-icon {
  .bg-image("images/btn_zhankai");
  background-size: 0.14rem 0.14rem;
  margin-left: 0.04rem;
  margin-right: 0.04rem;
}
/deep/ .el-icon-caret-right:before {
  visibility: hidden;
}
/deep/ .el-tree-node__expand-icon.expanded {
  .bg-image("images/btn_shouqi");
  background-size: 0.14rem 0.14rem;
  transform: rotate(0);
  margin-left: 0.04rem;
  margin-right: 0.04rem;
}
/deep/ .el-tree-node__expand-icon.is-leaf {
  background: none;
}
/deep/ .custom-tree-node {
  font-size: 0.18rem;
  width: 100%;
  position: relative;
  height: 0.3rem;
  display: block;
  line-height: 0.3rem;
  overflow: hidden;
}
/deep/ .custom-tree-node > span:first-child {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 0.3rem;
}
/deep/ .custom-tree-node span {
  font-size: 0.14rem;
}
/deep/ .custom-tree-node .sign {
  width: 0.2rem;
  height: 0.2rem;
  display: block;
  background: url("./images/shoucang1.png") no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  &.active {
    background: url("./images/shoucang2.png") no-repeat center;
    background-size: 100% 100%;
  }
}
/deep/ .custom-tree-node .dot {
  width: 0.1rem;
  height: 0.18rem;
  display: block;
  background: url("../item-title/images/dot_white.png") no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  &.active {
    background: url("../item-title/images/dot_blue.png") no-repeat center;
    background-size: 100% 100%;
  }
}
/deep/ .el-tree-node__content {
  height: 0.3rem;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: none;
  .bg-image("images/btn_have");
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  visibility: hidden;
}
/deep/ .el-tree-node .is-hidden {
  display: block !important;
}
/deep/ .blod {
  color: @color-text-hover;
}
/deep/ .el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
  display: none;
}
/deep/ .el-tree-node {
  font-size: @font-size-medium-x;
}
/deep/ .el-tree-node .el-tree-node {
  font-size: @font-size-medium;
}
/deep/ .el-tree-node .el-tree-node .el-tree-node {
  font-size: @font-size-small;
}
/deep/ .el-tree-node__content > label.el-checkbox {
  margin-top: 0.03rem;
}
/deep/ .el-checkbox__inner {
  width: 0.14rem;
  height: 0.14rem;
}
/deep/ .el-input-group {
  border: 1px solid #43bafe;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 4px;
  width: 100%;
  height: 0.25rem;
  margin-left: 0;
  margin-bottom: 0.1rem;
}
/deep/ .el-input__inner {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  border-right: 1px solid #43bafe;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #fff;
}
/deep/ .el-input__inner:hover {
  background-color: rgba(0, 0, 0, 0);
}
/deep/ .el-button {
  background-color: rgba(0, 0, 0, 0);
}
/deep/ .el-icon-search {
  color: #43bafe;
}
/deep/ .el-input-group__append {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  padding: 0 12px;
}
// 滚动条
*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #2d70b5;
}
*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
nav {
  width: 93%;
  margin-left: 3%;
  border-radius: 4px;
  background-color: #040c1c;
  border: 1px solid #43bafe;
  height: 0.3rem;
  line-height: 0.3rem;
  box-shadow: rgb(33, 200, 255, 0.2) 0px 0px 10px inset;
}
nav > span {
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: block;
  float: left;
  width: 33.3333%;
  text-align: center;
  &.active {
    color: #ffffff;
    background-color: #00aadd;
  }
}
</style>
<style lang="less">
/deep/ .el-select-dropdown {
  left: 18.75rem !important;
}
// .el-select{
//   background: #fff;
// }
</style>
