/* eslint-disable */
<template>
  <div class="case">
    <div class="title">值班要情记录</div>
    <div class="tab">
      <el-tabs type="border-card">
        <!-- tab选项卡 -->
        <el-tab-pane label="事件接报">
          <!-- 输入框 -->
          <div class="inp_top">
            <div class="top_wrap">
              <div class="location">
                事件编号
                <input type="text" class="ev" v-model="no" />
              </div>

              <div class="watchman_b">
                事件标题
                <input type="text" class="watchman" v-model="title" />
              </div>

              <div class="location">
                接报时间
                <input type="text" class="ev" v-model="receiv_time" />
              </div>

              <div class="watchman_b">
                事发时间
                <input type="text" class="watchman" v-model="incident_time" />
              </div>
              <div class="location">
                事发地点
                <input type="text" class="loc" v-model="location" />
                <span class="dw">定位</span>
              </div>

              <div class="location">
                影响范围
                <input type="text" class="range" v-model="range" />
                <span>米</span>
              </div>

              <div class="region_a">
                事发区域
                <input type="text" class="region" v-model="region" />
                <span class="dw">选择</span>
              </div>

              <div class="location">
                报送单位
                <input type="text" class="range" v-model="company" />
                <span class="dw">选择</span>
              </div>

              <div class="watchman_a">
                <span class="bg">报告人</span>
                <input type="text" class="watchman" v-model="name" />
              </div>

              <div class="location">
                事件类型
                <input type="text" class="range" v-model="type" />
                <span class="dw">选择</span>
              </div>

              <div class="watchman_a">
                值班人员
                <input type="text" class="watchman" v-model="Watchman" />
              </div>
            </div>
          </div>
          <div class="inp_cen">
            <h4>事件参数</h4>
            <div class="peo_num">
              <div class="death">
                死亡人数
                <input type="text" class="death_num" v-model="death_num" />
              </div>
              <div class="death">
                受伤人数
                <input type="text" class="death_num" />
              </div>
              <div class="death">
                失踪人数
                <input type="text" class="death_num" />
              </div>
              <div class="death">
                受困人数
                <input type="text" class="death_num" />
              </div>
              <div class="death">
                受灾人数
                <input type="text" class="death_num" />
              </div>
              <div class="death">
                经济损失
                <input type="text" class="death_num" />
              </div>
            </div>
          </div>
          <div class="inp_bot">
            <h4>事件参数</h4>
            <div class="bto_wrap">
              <textarea class="area" />
            </div>
          </div>
          <div>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
          <!-- 底部按钮 -->
          <div class="footer_btn_wrap">
            <div class="main_btn">保存</div>
            <div class="main_btn">新增</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="事件续报">事件续报</el-tab-pane>
        <el-tab-pane label="现场人员核实说明">现场人员核实说明</el-tab-pane>
        <el-tab-pane label="通讯记录">通讯记录</el-tab-pane>
        <el-tab-pane label="操作记录">操作记录</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "case",
  data() {
    return {
      no: "",
      title: "",
      receiv_time: "",
      incident_time: "",
      location: "",
      range: "",
      region: "",
      company: "",
      type: "",
      Watchman: "",
      death_num: "",
      name: ""
    };
  },
  methods: {
    onSubmit() {
      // console.log("submit!");
    }
  }
};
/* eslint-disable */
</script>

<style scoped lang="less">
.case {
  padding-top: 40px;
  width: 100%;
  height: 800px;

  color: #fff;
  .title {
    width: 97%;
    height: 55px;
    margin: 0 auto;
    background: #263674;
    font-size: 22px;
    color: white;
    text-align: center;
    line-height: 55px;
  }
  .tab {
    width: 97%;
    margin: 0 auto;
  }
  .dw {
    color: #8594e5;
    text-decoration: underline;
  }
  .bg {
    margin-left: 10px;
    margin-right: 6px;
  }
  .top_wrap,
  .peo_num,
  .bto_wrap {
    width: 732px;
    height: 108px;
    margin-top: 10px;
    border: 1px solid#fff;
    border-radius: 5px;
    padding: 10px;
    padding-left: 20px;
    padding-right: 0px;
  }
  .top_wrap {
    height: 330px;
  }
  .bto_wrap {
    padding: 0;
  }
  .area {
    margin: 0;
    padding: 0;
    width: 730px;
    height: 106px;
  }
  /deep/ .inp_top {
    width: 100%;
    height: 342px;
  }
  /deep/ .inp_cen {
    width: 100%;
    height: 144px;
  }
  .inp_bot {
    width: 100%;
    height: 147px;
  }
  /deep/ .el-input {
    width: 270px;
  }

  /deep/ .el-input__inner {
    width: 228px;
    height: 35px;
  }

  /deep/ .el-form-item__label {
    color: #fff;
    font-size: 16px;
  }

  /deep/ .el-fo-left {
    float: left;
  }

  /deep/ .el-fo-right {
    float: left;
    margin-left: 98px;
  }

  /deep/ .el-form-item__content {
    width: 270px;
  }

  /deep/ .content .el-form-item__content {
    width: 270px;
    height: 45px;
  }

  /deep/ .el-form-item {
    width: 270px;
    margin-bottom: 17px;
  }

  /deep/ .el-fo-lo {
    width: 547px;
  }

  /deep/ .location,
  .region_a,
  .watchman_a,
  .watchman_b,
  .death {
    float: left;
    font-size: 16px;
    margin-left: 5px;
    //
  }

  /deep/ .region_a {
    margin-left: 80px;
  }

  /deep/ .watchman_a {
    margin-left: 62px;
  }

  /deep/ .watchman_b {
    margin-left: 50px;
  }

  /deep/ .death {
    // margin-left: 7px;
    float: left;
    margin-right: 20px;
  }
  /deep/ .loc,
  .range,
  .region,
  .watchman,
  .ev,
  .death_num {
    width: 547px;
    margin-left: 10px;
    margin-right: 15px;
    height: 35px;
    border-radius: 5px;
    border: none;
    padding: 0 15px;
    margin-bottom: 17px;
  }

  /deep/ .range {
    width: 182px;
  }

  /deep/ .region {
    width: 180px;
  }

  /deep/ .watchman {
    width: 230px;
  }

  /deep/ .ev {
    width: 230px;
  }

  /deep/ .death_num {
    width: 117px;
  }
  /deep/ .el-calendar__body {
    background: #0d0d0d;
  }

  /deep/ .el-calendar__header {
    background: #070b0e;
    color: white;
  }

  /deep/ .el-calendar__title {
    color: white;
  }

  /deep/ .el-calendar-day {
    height: 100px;
    background: #0d0d0d;
    color: white;
  }

  /deep/ .el-calendar-day:hover {
    box-shadow: 0 0 0 5px #2ad833 inset;
    background: #0e1434;
    color: #f5f9fb;
  }

  /deep/ .el-button {
    background: #070b0e;
    color: white;
  }

  /deep/ .el-button:hover {
    background: #c6e2ff;
    color: #409eff;
  }

  /deep/ .el-calendar-table thead th {
    background: #223270;
    color: white;
  }

  /deep/ .el-tabs__nav-scroll {
    background: #11141b;
    width: 100%;
    color: #fff;
  }

  /deep/ .el-tabs--border-card > .el-tabs__content {
    background: #0e1327;
    color: #fff;
    border: 0px;
  }

  /deep/.el-tabs--border-card {
    border: none;
  }
  /deep/ .el-tabs__item.is-active {
    background: #33447a;
    color: #fff;
  }
  h4 {
    color: white;
    padding-left: 6px;
  }
  /deep/ input {
    color: #000;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border-left-color: #33447a;
    border-right-color: #33447a;
  }
  .footer_btn_wrap {
    width: 100%;
    text-align: center;
    .main_btn {
      width: 125px;
      height: 45px;
      line-height: 45px;
      display: inline-block;
      background: #243472;
    }
  }

  .main_btn {
    background: #263674;
    color: white;
    border-radius: 4px;
    text-align: center;
  }
}
</style>
