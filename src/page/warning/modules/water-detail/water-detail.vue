<template>
  <div class="water_detail" v-show="isShow">
    <i class="close" @click="close"></i>
    <div class="title">雨情监测点
      <el-date-picker
        v-model="value"
        type="datetimerange"
        popper-class='water-detail'
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format='yyyy-MM-dd HH:mm'
        value-format='yyyy-MM-dd HH:mm:ss'
        @change='changeTime'
        align="right">
      </el-date-picker>
      <!-- <span class="time">{{time}}</span> -->
    </div>
    <!-- <div class="time-wrapper">
      <div
        class="item"
        @click="ChangeTimeValue(item.value)"
        :class="{'active':item.value===timeValue}"
        :key="index"
        v-for="(item,index) in timeArr">
        <div class="flex">
          <i></i>
          <span class="flex-1">{{item.name}}</span>
        </div>
      </div>
    </div> -->
    <div class="title">区域分析 <span>(单位mm)</span></div>
    <div class="table-wrapper">
      <el-table
        height="200"
        class="table-content"
        v-loading='loading1'
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="table1">
        <el-table-column
          prop="district_name"
          label="区域名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avg_yl"
          label="雨平均值"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="max_yl"
          label="最大雨量"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="站点名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="title">站点列表 <span>(单位mm)</span>
      <div class="el-input">
        <input class="el-input__inner" placeholder='名称搜索' type="text" v-model="districtName">
        <span class="input__suffix">
          <span class="el-input__suffix-inner" @click="confirm">
            <i class="el-input__icon el-icon-search"></i>
          </span>
        </span>
      </div>
      <!-- <el-input ref='search' placeholder='名称搜索' suffix-icon="el-icon-search" @change="confirm" v-model="districtName"></el-input> -->
    </div>
    <div class="table-wrapper">
      <el-table
        height="200"
        class="table-content"
        v-loading='loading2'
        @row-click="rowClick"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="table2">
        <el-table-column
          prop="position"
          label="序号"
          align="center"
          header-align="center"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="站点名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="yl"
          label="雨量"
          align="center"
          header-align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTimeRainInfo, getDistructRainInfo } from 'api/warning/warning'
import { debounce } from 'common/js/util'
import { mapActions } from 'vuex'

export default {
  name: 'WaterDetail',
  props: {
    isShow: {
      default: false
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timeValue: 1,
      districtName: '',
      loading1: true,
      loading2: false,
      timer: null,
      time: '',
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近1小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近2小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 2)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近3小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近6小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近12小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 12)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近24小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeArr: [
        { name: '最近1小时', value: 1 },
        { name: '最近2小时', value: 2 },
        { name: '最近3小时', value: 3 },
        { name: '最近6小时', value: 6 },
        { name: '最近12小时', value: 12 },
        { name: '最近24小时', value: 24 }
      ],
      table1: [
        {
          'district_name': '永嘉县',
          'max_yl': 2,
          'avg_yl': 0.018,
          'name': '阳岙站'
        },
        {
          'district_name': '永嘉县',
          'max_yl': 2,
          'avg_yl': 0.018,
          'name': '阳岙站'
        }
      ],
      table2: [
        { name: '1111', position: 1, yl: 10 },
        { name: '1111', position: 1, yl: 10 }
      ]
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 1)
        var Y = start.getFullYear() + '-'
        var M = (start.getMonth() + 1 < 10 ? '0' + (start.getMonth() + 1) : start.getMonth() + 1) + '-'
        var D = (start.getDate() < 10 ? '0' + start.getDate() : start.getDate()) + ' '
        var h = (start.getHours() < 10 ? '0' + start.getHours() : start.getHours()) + ':'
        var m = (start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()) + ':'
        var s = '00'
        var Y2 = end.getFullYear() + '-'
        var M2 = (end.getMonth() + 1 < 10 ? '0' + (end.getMonth() + 1) : end.getMonth() + 1) + '-'
        var D2 = (end.getDate() < 10 ? '0' + end.getDate() : end.getDate()) + ' '
        var h2 = (end.getHours() < 10 ? '0' + end.getHours() : end.getHours()) + ':'
        var m2 = (end.getMinutes() < 10 ? '0' + end.getMinutes() : end.getMinutes()) + ':'
        this.value = [Y + M + D + h + m + s, Y2 + M2 + D2 + h2 + m2 + s]
        console.log(this.value)
        this.queryData()
      }
    }
  },
  methods: {
    ...mapActions('warning', [
      'SetSpecalPoint'
    ]),
    rowClick(data) {
      this.SetSpecalPoint(data)
    },
    close() {
      this.$emit('close')
    },
    // 搜索框确认
    confirm() {
      this.loading2 = true
      getTimeRainInfo(this.value, this.districtName, this.type).then(res => {
        this.loading2 = false
        this.table2 = res
      })
    },
    changeTime() {
      console.log(this.value)
      this.queryData()
    },
    // 查询数据
    queryData() {
      console.log(this.value)
      this.loading1 = true
      this.loading2 = true
      getTimeRainInfo(this.value, this.districtName, this.type).then(res => {
        this.loading2 = false
        this.table2 = res
      })
      getDistructRainInfo(this.value, this.type).then(res => {
        this.loading1 = false
        this.table1 = res
      })
    }
  },
  // mounted() {
  //   console.log(this.$refs.search)
  //   this.$nextTick(() => {
  //     this.$refs.search.$el.getElementsByTagName('span').forEach(val => {
  //       console.log(val)
  //       val.onClick = function() {
  //         alert('111')
  //       }
  //     })
  //     console.log(this.$refs.search.$el.getElementsByTagName('span')[0].onClick)
  //     console.log(this.$refs.search.$el.getElementsByTagName('span')[1].onClick)
  //   })
  // },
  created() {
    this.$watch('districtName', debounce(() => {
      this.confirm()
    }, 200))
  }
}
</script>

<style lang="less" scoped>
  .close {
    color: #ffffff;
    font-size: 0.14rem;
    position: absolute;
    top: 0.05rem;
    right: 0.1rem;
    cursor: pointer;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image('../button/images/close');
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    &:hover {
      transform: rotate(45deg);
    }
  }
  .water_detail {
    width: 3.5rem;
    background: #081a39;
    position: absolute;
    top: 0;
    z-index: 9000000;
    border: 0.01rem solid #006294;
    border-radius: 0.04rem;
  }
  .title {
    color: #F8EF00;
    padding: 0 0.1rem;
    line-height: 0.3rem;
    > span {
      color: #fff;
    }
    .el-input__inner {
      height: 0.2rem;
      line-height: 0.2rem;
      border: 0.01rem solid #006C79;
      background: rgba(0, 0, 0, 0);
    }
    /deep/ .el-input {
      position: absolute;
      font-size: 14px;
      display: inline-block;
      width: 1.5rem;
      right: 0.1rem;
      .el-input__inner {
        height: 0.2rem;
        line-height: 0.2rem;
        border: 0.01rem solid #006C79;
        background: rgba(0, 0, 0, 0);
      }
      .el-input__icon {
        position: absolute;
        right: 0;
        top: 0.05rem;
        color: #006C79;
        height: 0.2rem;
        line-height: 0.2rem;
        cursor: pointer;
      }
    }
  }
  .time-wrapper {
    overflow: hidden;
    border-top: 0.01rem solid #006294;
    border-bottom: 0.01rem solid #006294;
    padding: 0.05rem;
    .item {
      width: 33.33%;
      float: left;
      cursor: pointer;
      &.active {
        .flex {
          i {
            border: 0.01rem solid #fff;
            background: #fff;
          }
          span {
            color: #fff;
          }
        }
      }
      .flex {
        padding: 0 0.05rem;
        i {
          width: 0.10rem;
          height: 0.10rem;
          border: 0.01rem solid #00BCE0;
          border-radius: 50%;
          display: block;
          position: relative;
          top: 0.1rem;
          background: transparent;
        }
        span {
          color: #00BCE0;
          font-size: 0.14rem;
          padding: 0 0.05rem;
          height: 0.3rem;
          line-height: 0.3rem;
        }
      }
    }
  }
  .table-wrapper {
    border-top: 0.01rem solid #006294;
    border-bottom: 0.01rem solid #006294;
    padding: 0.05rem;
    .table-content {
      width: 100%;
    }
  }
  /deep/ .el-table {
    background: transparent;
    &::before {
      display: none;
    }
    th, tr {
      background: transparent;
    }
    th {
      border-bottom: 0.01rem solid #005682;
      padding: 0.02rem 0;
    }
    td {
      border-bottom: 0.01rem dashed rgba(41, 97, 137, 0.8);
      padding: 0.02rem 0;
    }
    .cell {
      color: #A5A5A5;
    }
    tr:hover > td {
      background: transparent !important;
    }
  }
  .time {
    float: right;
    margin-right: 0.3rem;
    font-size: 0.14rem;
  }
  /deep/.el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width: 100%;
    height: 0.4rem;
  }
  /deep/.el-date-editor .el-range-separator{
    width: 8%;
    color: #b8b8b8;
    font-size:0.14rem;
  }
  /deep/.el-date-editor .el-range-input{
    color:#ebebeb;
    font-size:0.14rem;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
