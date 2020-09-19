<!--
 * @Author: eds
 * @Date: 2020-07-29 9.11
 * @LastEditTime: 2020-07-29 9:12:10
 * @LastEditors: wat
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\sightline.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'550px'}">
    <div class="sightline tframe">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="Date">
              <el-select
                v-model="dxForm.rivername"
                popper-class="select-option"
                placeholder="请选择日期"
                size="small"
                @change="changeDate($event)"
              >
                <el-option
                  v-for="item in Dateoption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="阴影分析" class="elformbtns">
              <el-button class="elformbtn" @click="shadowAnalysis">阴影分析</el-button>
              <el-button class="elformbtn" @click="sunlight">日照效果</el-button>
              <el-button class="elformbtn" @click="clear">清除</el-button>
              <el-button class="elformbtn" @click="shadowRadio">获取阴影率</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <canvas
      style="position : fixed;z-index: 10, right : 2%; bottom : 2%;background-color:rgba(65, 65, 65, 0.5)"
      id="pro"
      height="0"
      width="0"
    ></canvas>
  </div>
</template>
<script>
const Cesium = window.Cesium;
export default {
  name: "Sightline",
  data() {
    return {};
  },
};
</script>>