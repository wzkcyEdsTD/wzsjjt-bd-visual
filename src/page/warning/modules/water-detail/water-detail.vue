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
    <div class="wrapper-item">
      <div class="item-left">
        <div class="title">区域分析 <span>(单位mm)</span>
          <span @click="showTable" class="tubiao" v-show="$store.state.userInfo.districtName === '文成县'">图表</span>
        </div>
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
              label="全区面雨量"
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
              width="100"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="dialog" v-show="dialogTableVisible">
        <div class="title spc">站点图表
          <span @click="dialogTableVisible=false">关闭</span>
        </div>
        <div ref="echart2" class="echart"></div>
      </div>
      <!-- <div class="item-right" v-if="$store.state.userInfo.districtName === '文成县'">
        <div class="title">区域图表</div>
        <div class="table-wrapper">
          <div ref="echart1" class="echart"></div>
        </div>
        <div class="title">站点图表
        </div>
        <div class="table-wrapper">
        </div>
      </div> -->
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
      dialogTableVisible: false,
      timeValue: 1,
      districtName: '',
      loading1: true,
      loading2: false,
      timer: null,
      time: '',
      value: '',
      pickerMinDate: '',
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
        }],
        disabledDate: (time) => {
          if (this.pickerMinDate) {
            const day1 = 30 * 24 * 3600 * 1000
            const maxTime = this.pickerMinDate + day1
            const minTime = this.pickerMinDate - day1
            return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() >= Date.now()
          }
          // console.log(time.getTime())
          return time.getTime() >= Date.now()
        },
        onPick: (obj) => {
          this.pickerMinDate = new Date(obj.minDate).getTime()
        }
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
        // {
        //   'district_name': '永嘉县',
        //   'max_yl': 2,
        //   'avg_yl': 0.018,
        //   'name': '阳岙站'
        // },
        // {
        //   'district_name': '永嘉县',
        //   'max_yl': 2,
        //   'avg_yl': 0.018,
        //   'name': '阳岙站'
        // }
      ],
      table2: [
        // { name: '1111', position: 1, yl: 10 },
        // { name: '1111', position: 1, yl: 10 }
      ],
      echart1: null,
      echart2: null,
      backgroundIndexList1: {},
      backgroundIndexList2: []
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        const end = new Date()
        const start = new Date()
        if (end.getHours() <= 8) {
          start.setTime(start.getTime() - 3600 * 1000 * 24)
        }
        start.setTime(start.getTime() - 3600 * 1000 * 1)
        var Y = start.getFullYear() + '-'
        var M = (start.getMonth() + 1 < 10 ? '0' + (start.getMonth() + 1) : start.getMonth() + 1) + '-'
        var D = (start.getDate() < 10 ? '0' + start.getDate() : start.getDate()) + ' '
        // var h = (start.getHours() < 10 ? '0' + start.getHours() : start.getHours()) + ':'
        // var m = (start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()) + ':'
        var s = '00'
        var Y2 = end.getFullYear() + '-'
        var M2 = (end.getMonth() + 1 < 10 ? '0' + (end.getMonth() + 1) : end.getMonth() + 1) + '-'
        var D2 = (end.getDate() < 10 ? '0' + end.getDate() : end.getDate()) + ' '
        var h2 = (end.getHours() < 10 ? '0' + end.getHours() : end.getHours()) + ':'
        var m2 = (end.getMinutes() < 10 ? '0' + end.getMinutes() : end.getMinutes()) + ':'
        this.value = [Y + M + D + '08:00:00', Y2 + M2 + D2 + h2 + m2 + s]
        // console.log(this.value)
        this.queryData()
      }
    }
  },
  methods: {
    ...mapActions('warning', [
      'SetSpecalPoint',
      'SetYuqingTime'
    ]),
    rowClick(data) {
      this.SetSpecalPoint(data)
    },
    close() {
      this.$emit('close')
    },
    showTable() {
      this.$nextTick(() => {
        console.log(this.$refs.dialog.$refs.dialog.lastElementChild.children)
      })
      this.dialogTableVisible = true
      if (this.$store.state.userInfo.districtName !== '文成县') return
      const dataName = []
      const dataShortName = []
      const data = []
      let max = 0
      let min = 0
      const maxArr = []
      const _this = this
      this.table2.forEach((item) => {
        data.push(item.yl)
        dataName.push(item.name)
        dataShortName.push(item.name.slice(0, 4))
        if (item.yl < min) {
          min = item.yl
        }
        if (item.yl > max) {
          max = item.yl
        }
        // 背景色
        this.backgroundIndexList1[item.name] = item.street
        if (!this.backgroundIndexList2.includes(item.street)) {
          this.backgroundIndexList2.push(item.street)
        }
      })
      console.log(this.backgroundIndexList1)
      console.log(this.backgroundIndexList2)
      this.table2.forEach((item) => {
        maxArr.push({
          value: max,
          street: item.street
        })
      })
      const myChart = this.$echarts.init(this.$refs.echart2)
      console.log(maxArr)
      const option = {
        grid: {
          show: false,
          top: 40,
          right: 14,
          left: 55,
          bottom: 40
        },
        dataZoom: [
          {
            show: true,
            height: 15,
            start: 0,
            end: 6,
            top: '90%',
            textStyle: {
              color: '#fff'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOffsetX: 20
            }
          },
          formatter: function(data) {
            return Math.floor(data[1].value * 1000) / 1000
          }
        },
        xAxis: [
          {
            type: 'category',
            color: '#fff',
            data: dataName,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            axisLabel: {
              // rotate: 40,
              align: 'center',
              interval: 0,
              margin: 20,
              color: '#fff',
              textStyle: {
                fontSize: 14
              }
            }
          }
        ],
        yAxis: [
          {
            nameTextStyle: {
              align: 'right'
            },
            name: '单位(mm)',
            type: 'value',
            min: 0,
            max: max,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ffff'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
                fontSize: 14
              }
            }
          }
        ],
        series: [
          {
            silent: true,
            cursor: 'default',
            barGap: '-60%',
            type: 'bar',
            data: maxArr,
            barWidth: '60%',
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              formatter: (val) => {
                return val.data.street
              }
            },
            itemStyle: {
              color: function(params) {
                const code = _this.backgroundIndexList1[params.name]
                let index
                for (let i = 0; i < _this.backgroundIndexList2.length; i++) {
                  if (code === _this.backgroundIndexList2[i]) index = i
                }
                if (index % 2 === 0) {
                  return 'rgba(0, 120, 189, 0.5)'
                } else {
                  return 'rgba(0, 203, 167, 0.5)'
                }
                // return 'rgba(220, 220, 220, 0.8)'
              },
              borderWidth: 0,
              // barBorderRadius: [5, 5, 5, 5],
              shadowBlur: 0
            }
          },
          {
            type: 'bar',
            data: data,
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
              color: '#2bd0ff'
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#fdff63' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#ff8726' // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [5, 5, 5, 5],
                shadowColor: 'rgba(18,72,92,0.4)',
                shadowBlur: 4
              }
            }
          }
        ]
      }
      if (this.$store.state.userInfo.districtName !== '文成县') {
        option.series[0] = {
          silent: true,
          cursor: 'default',
          barGap: '-100%',
          type: 'bar',
          data: maxArr,
          barWidth: 10,
          itemStyle: {
            color: '#1d538d',
            barBorderRadius: [5, 5, 5, 5],
            shadowBlur: 4
          }
        }
      }
      myChart.setOption(option)
      this.echart2 = myChart
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
      // console.log(this.value[0].getTime())
      this.queryData()
    },
    // 查询数据
    queryData() {
      if (this.$parent.$refs.shuiliyuqingjiance.dotIndex[this.$parent.$refs.shuiliyuqingjiance.btnIndex] || this.$parent.$refs.qixiangyuqingjiance.dotIndex[this.$parent.$refs.qixiangyuqingjiance.btnIndex]) {
        this.SetYuqingTime(this.value)
      }
      this.loading1 = true
      this.loading2 = true
      getTimeRainInfo(this.value, this.districtName, this.type).then(res => {
        this.loading2 = false
        this.table2 = res
        // if (this.$store.state.userInfo.districtName !== '文成县') return
      })
      getDistructRainInfo(this.value, this.type).then(res => {
        this.loading1 = false
        this.table1 = res
        if (this.$store.state.userInfo.districtName !== '文成县') return
        const dataName = []
        const dataShortName = []
        const data = []
        let max = 0
        let min = 0
        const _this = this
        const maxArr = []
        res.forEach((item) => {
          dataName.push(item.name)
          data.push(item.avg_yl)
          dataShortName.push(item.name.slice(0, 4))
          if (item.avg_yl < min) {
            min = item.avg_yl
          }
          if (item.avg_yl > max) {
            max = item.avg_yl
          }
        })
        res.forEach((item) => {
          maxArr.push({
            value: max,
            street: item.street
          })
        })
        const myChart = this.$echarts.init(this.$refs.echart1)
        const option = {
          grid: {
            show: false,
            top: 40,
            right: 14,
            left: 55,
            bottom: 40
          },
          dataZoom: [
            {
              show: true,
              height: 15,
              start: 0,
              end: 6,
              top: '90%',
              textStyle: {
                color: '#fff'
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              return Math.floor(data[1].value * 1000) / 1000
            }
          },
          xAxis: [
            {
              type: 'category',
              color: '#fff',
              data: dataName,
              splitLine: {
                show: false
              },
              axisLine: {
                show: true
              },
              axisTick: {
                show: true,
                alignWithLabel: true
              },
              axisLabel: {
                // rotate: 40,
                align: 'center',
                interval: 0,
                margin: 20,
                color: '#fff',
                textStyle: {
                  fontSize: 14
                }
              }
            }
          ],
          yAxis: [
            {
              nameTextStyle: {
                align: 'right'
              },
              name: '单位(mm)',
              type: 'value',
              min: 0,
              max: max,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ffff'
                }
              },
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#333'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#333'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#fff', // 坐标值得具体的颜色
                  fontSize: 14
                }
              }
            }
          ],
          series: [
            {
              silent: true,
              cursor: 'default',
              barGap: '-60%',
              type: 'bar',
              data: maxArr,
              barWidth: 50,
              label: {
                show: true,
                position: 'top',
                formatter: (val) => {
                  console.log(val)
                  return val.data.street
                }
              },
              itemStyle: {
                color: function(params) {
                  const code = _this.backgroundIndexList1[params.name]
                  let index
                  for (let i = 0; i < _this.backgroundIndexList2.length; i++) {
                    if (code === _this.backgroundIndexList2[i]) index = i
                  }
                  if (index % 2 === 0) {
                    return 'rgba(248, 147, 29, 1)'
                  } else {
                    return 'rgba(179, 214, 110, 1)'
                  }
                  // return 'rgba(220, 220, 220, 0.8)'
                },
                borderWidth: 0,
                // barBorderRadius: [5, 5, 5, 5],
                shadowBlur: 0
              }
            },
            {
              type: 'bar',
              data: data,
              barWidth: 10,
              label: {
                show: true,
                position: 'top',
                color: '#2bd0ff'
              },
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(
                    0,
                    0,
                    1,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#00f3c2' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#2969ff' // 100% 处的颜色
                      }
                    ],
                    false
                  ),
                  barBorderRadius: [5, 5, 5, 5],
                  shadowColor: 'rgba(18,72,92,0.4)',
                  shadowBlur: 4
                }
              }
            }
          ]
        }
        myChart.setOption(option)
        this.echart1 = myChart
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
    z-index: 100;
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
  .echart{
    width: 100%;
    height: 200px;
  }
  .water_detail {
    // width: 3.5rem;
    background: #081a39;
    position: absolute;
    top: 0;
    z-index: 9000000;
    border: 0.01rem solid #006294;
    border-radius: 0.04rem;
  }
  .wrapper-item{
    &>div{
      width: 3.5rem;
    }
    &>.dialog{
      left: 50%;
      top: 50%;
      width: 15.5rem;
      height: 8.2rem;
      -webkit-transform: translate(-50%, -50%);
      position: fixed;
      z-index: 200000;
      background: #aaa;
      transform: translate(-50%, -50%);
      box-shadow: 0px 0px 23px 0px #5a9fb7;
      background: #02293e;
      padding: 16px 16px;
      border-radius: 4px;
      .title{
        width: 100%;
        span{
          position: absolute;
          right: 0;
          cursor: pointer;
        }
      }
      .echart{
        width: 15rem;
        height: 7.5rem;
        margin: 0 auto;
      }
    }
    display: flex;
  }
  .spc{
    font-size: 20px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    span{
      font-weight: 400;
      font-size: 14px;
      color:rgba(255, 255, 255, 0.8)
    }
  }
  .title {
    position: relative;
    color: #F8EF00;
    padding: 0 0.1rem;
    line-height: 0.3rem;
    width: 3.5rem;
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
  .tubiao{
    cursor: pointer;
    float: right;
    color: #F8EF00;
  }
</style>
