<template>
  <div class='dizai-dialog' :class="isShow?'active':''">
    <div class='dizai-dialog-title'>
      {{ shuizhaData.name }}
      <span class='dizai-dialo-close' @click='close'></span>
      <input type="date" id="startCreatetime" max="">
    </div>
    <ul class='dizai-tab'>
      <li
        v-for='(value, index) of tabs'
        :key='index'
        :class="[index === tabIndex ? 'dizai-current-tab' : '']"
        @click='changeTab(index)'
      >{{ value.name }}
      </li>
    </ul>
    <div class='dizai-tool'>
      <!-- <el-radio-group v-model='timeRadio' style='margin-right: 3px;' @change='changeRadio'>
        <el-radio-button label='0'>实时</el-radio-button>
        <el-radio-button label='1'>7日</el-radio-button>
        <el-radio-button label='2'>2周</el-radio-button>
        <el-radio-button label='3'>1个月</el-radio-button>
        <el-radio-button label='4'>3个月</el-radio-button>
      </el-radio-group> -->
      <el-date-picker
        prefix-icon='el-icon-time'
        v-model='startTime'
        type='datetime'
        placeholder='选择起始时间'
        style='margin-right: 3px;'
      ></el-date-picker>
      <el-date-picker
        prefix-icon='el-icon-time'
        v-model='endTime'
        type='datetime'
        placeholder='选择结束时间'
      ></el-date-picker>
      <el-button type='primary' @click='queryData'>确认</el-button>
      <!-- <el-button type='primary' @click='downloadImg'>图片下载</el-button> -->
    </div>
    <div class='dizai-content relative'>
      <div class="dizai-echart-box">
        <div id='dizai-echart'></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getDeviceDetail
} from 'api/warning/warning'

export default {
  name: 'ShuizhaDialog',
  props: {
    shuizhaData: {
      type: Object,
      default: function() {
        return {
          smid: 1,
          type: 3, //  0为地表位移、1为GPS、2为双轴倾角、3为雨量
          name: '温州市瓯海区景山街道精神病院东首不稳定斜坡'
        }
      }
    }
  },
  data() {
    return {
      tabs: [
        {
          name: '水闸工情'
        },
        {
          name: '水位-流量过程'
        }
      ],
      unitArr: [
        '伸缩量（mm）',
        '累计位移量（mm）',
        ['度', '摄氏度'],
        '降雨量（mm）'
      ],
      tabIndex: 0,
      timeRadio: 0,
      startTime: '',
      endTime: '',
      mychart: null,
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    close() {
      this.isShow = false
    },
    initTab() {
      this.timeRadio = 0
      this.startTime = ''
      this.endTime = ''
    },
    changeTab(index) {
      if (this.tabIndex === index) return
      this.initTab()
      this.tabIndex = index
      this.queryData()
    },
    changeRadio() {
      if (this.timeRadio !== 0) {
        this.startTime = ''
        this.endTime = ''
      }
      this.queryData()
    },
    drawEchart(data) {
      if (!this.mychart) {
        this.mychart = this.$echarts.init(
          document.getElementById('dizai-echart')
        )
      }
      const unit = this.tabs[this.shuizhaData.type].unit
      const res = []
      data.map(item => {
        res.push([item.name, item.value])
      })
      this.mychart.setOption({
        grid: {
          left: '8%',
          right: '4%'
        },
        legend: {
          show: true,
          top: '3%',
          right: '4%',
          textStyle: {
            fontSize: 16,
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 16,
            margin: 25
          }
        },
        yAxis: {
          name: unit,
          nameGap: 25,
          nameTextStyle: {
            fontSize: 16,
            color: '#fff'
          },
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisLabel: {
            fontSize: 16,
            color: '#fff'
          }
        },
        series: [
          {
            name: this.tabs[this.shuizhaData.type].unit,
            color: '#FFA533',
            symbolSize: 10,
            data: res,
            type: 'line',
            smooth: true
          }
        ]
      })
    },
    // downloadImg() {
    //   const link = document.createElement('a')
    //   link.href = this.mychart.getDataURL({
    //     type: 'png',
    //     backgroundColor: '#000'
    //   })
    //   //  对下载的文件命名
    //   link.download =
    //     this.tabs[this.shuizhaData.type][this.tabIndex] + '图表.png'
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // },
    dateFormat(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'S+': date.getMilliseconds()
      }
      // 因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
      if (/(y+)/.test(fmt)) {
        // 第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          // 第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(String(o[k]).length)
          )
        }
      }
      return fmt
    },
    queryData() {
      let startTime = ''
      let endTime = ''
      console.log(this.startTime)
      if (this.timeRadio === 0 || (this.startTime === '' && this.endTime === '')) {
        const date = new Date()
        startTime = this.dateFormat(
          new Date(date.getTime() - 1000 * 60 * 60 * 24),
          'yyyy-MM-dd HH:mm:ss'
        )
        endTime = this.dateFormat(date, 'yyyy-MM-dd HH:mm:ss')
        console.log(startTime)
      } else {
        startTime = this.dateFormat(
          new Date(this.startTime),
          'yyyy-MM-dd HH:mm:ss'
        )
        endTime = this.dateFormat(
          new Date(this.endTime),
          'yyyy-MM-dd HH:mm:ss'
        )
      }
      console.log(startTime)
      getDeviceDetail(this.tabIndex, this.shuizhaData.deviceId, startTime, endTime, this.shuizhaData.tablename, this.startTime || this.endTime ? 0 : this.timeRadio).then(res => {
        console.log(res)
        this.drawEchart(res)
      })
    }
  },
  watch: {
    shuizhaData() {
      this.queryData()
    }
  },
  mounted() {
    // this.queryData()
  }
}
</script>
<style scoped lang="less">
  .dizai-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    width: 10.84rem;
    height: 7.96rem;
    padding: 22px 32px;
    box-sizing: border-box;
    background: rgba(2, 41, 62, 1);
    box-shadow: 0px 0px 23px 0px rgba(90, 159, 183, 1);
    border-radius: 4px;
    border: 2px solid rgba(90, 159, 183, 1);
    display: flex;
    flex-direction: column;
    visibility: hidden;
    &.active {
      z-index: 3;
      visibility: visible;
    }
  }
  .dizai-dialog-title {
    width: 100%;
    font-size: 26px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: rgba(243, 222, 63, 1);
    position: relative;
  }
  .dizai-dialog-title::before {
    content: '';
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: middle;
    background-image: radial-gradient(rgba(14, 214, 245, 1),
    rgba(29, 100, 121, 1));
    /*background:linear-gradient(360deg,rgba(14,214,245,1) 0%,rgba(29,100,121,1) 100%);*/
    border-radius: 50% 50%;
    margin-right: 3px;
  }
  .dizai-dialo-close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    cursor: pointer;
    background: url(./images/close.png) 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .dizai-tab {
    overflow: hidden;
    margin: 20px 0;
  }
  .dizai-tab li {
    float: left;
    font-size: 20px;
    margin-right: 10px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  .dizai-tab li::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 25px;
    background: #fff;
    margin-right: 2px;
    vertical-align: middle;
    border-radius: 20px;
  }
  li.dizai-current-tab {
    color: #17b0ce;
  }
  li.dizai-current-tab::before {
    background: #17b0ce;
  }
  .dizai-tool /deep/ .el-radio-group {
    background: #041115;
    border-radius: 4px;
    border: 1px solid rgba(90, 159, 183, 1);
    box-sizing: border-box;
  }
  .dizai-tool /deep/ .el-radio-button__inner {
    background: transparent;
    border-radius: 0;
    color: #fff;
    border: none;
    box-sizing: border-box;
    font-size: 16px;
  }
  .dizai-tool
  /deep/
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
    background-color: #17b0ce;
    box-shadow: -1px 0 0 0 #17b0ce;
  }
  .dizai-tool /deep/ .el-date-editor--datetime {
    background: #041115;
    border-radius: 4px;
    border: 1px solid rgba(90, 159, 183, 1);
    box-sizing: border-box;
    width: 222px;
  }
  .dizai-tool /deep/ .el-date-editor--datetime input {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #fff;
  }
  .dizai-tool /deep/ .el-button {
    font-size: 16px;
    padding: 12px 15px;
    background: #17b0ce;
    border-color: #17b0ce;
  }
  .dizai-content {
    margin-top: 18px;
    width: 100%;
    flex-grow: 1;
    min-height: 0;
    .dizai-echart-box{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  #dizai-echart {
    position: relative;
    width: 100%;
    height: 100%;
    background: #041115;
  }
</style>
