/* eslint-disable */
<template>
  <div class="table">
    <div class="tab_top"></div>
    <div class="title">排班表</div>
    <div class="rili" ref="rill">
      <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
          <div @click="updataMonthList(data)">
            <div
              id="day"
              :class="data.isSelected ? 'is-selected' : ''"
            >{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}</div>
            <div
              class="z"
              :style="{color:getMonthListDataType(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'am')}"
            >{{getMonthListDataContent(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'am')}}</div>
            <div
              class="zh"
              :style="{color:getMonthListDataType(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'zw')}"
            >{{getMonthListDataContent(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'zw')}}</div>
            <div
              class="w"
              :style="{color:getMonthListDataType(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'pm')}"
            >{{getMonthListDataContent(data.day.substr(5, 2),(data.day.substr(8, 2))-1 , 'pm')}}</div>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getMonthList } from "@/api/onduty/workFrom";
export default {
  name: "table",
  data() {
    return {
      // 异步请求参数
      getMonthListData: {
        startTime: null,
        endTime: null
      },

      // 日历数据
      MonthList: [],

      // 早中晚数据
      MonthListAm: [],
      MonthListPm: [],
      MonthListZW: [],
      _Month:"01"
    };
  },
  created() {
    // 打开页面异步显示数据
    // console.log(this.getMonthListData)
    this.getMonthListData.startTime = new Date().toJSON().substr(0, 8) + "1";
    let endYear = new Date().toJSON().substr(0, 4);
    let endMonth = new Date().toJSON().substr(5, 2);
    let lastDay = new Date(endYear, endMonth, 0).getDate();
    this.getMonthListData.endTime = new Date().toJSON().substr(0, 8) + lastDay;
    this._Month= new Date().toJSON().substr(5, 2)
    getMonthList(
      this.getMonthListData.startTime,
      this.getMonthListData.endTime
    ).then(res => {
      // console.log(res)
      // console.log(this._Month)
      this.MonthListAxios(res);

    });
  },
  mounted() {
    this.$refs.rill.addEventListener("click", e => {
      var e = e || window.event;
      // console.log(e.target.innerText);
      // console.log(this.getMonthListData);
      let year = null;
      let month = null;
      let lastDay = null;
      if (e.target.innerText === "今天") {
        this.getMonthListData.startTime =
          new Date().toJSON().substr(0, 8) + "1";
        year = new Date().toJSON().substr(0, 4);
        month = new Date().toJSON().substr(5, 2);
        lastDay = new Date(year, month, 0).getDate();
        this.getMonthListData.endTime =
          new Date().toJSON().substr(0, 8) + lastDay;
        getMonthList(
          this.getMonthListData.startTime,
          this.getMonthListData.endTime
        ).then(res => {
          this.MonthListAxios(res);
           this._Month=res[0].date.substr(5,2)
        });
      }
      if (e.target.innerText === "上个月") {
        if (parseInt(this.getMonthListData.startTime.substr(5, 2)) === 1) {
          year = parseInt(this.getMonthListData.startTime.substr(0, 4));
          year -= 1;
          this.getMonthListData.startTime = `${year}-12-1`;
          this.getMonthListData.endTime = `${year}-12-31`;
          getMonthList(
            this.getMonthListData.startTime,
            this.getMonthListData.endTime
          ).then(res => {
            // console.log(res)
            this.MonthListAxios(res);
          });
        } else {
          year = parseInt(this.getMonthListData.startTime.substr(0, 4));
          month = parseInt(this.getMonthListData.startTime.substr(5, 2));
          month -= 1;
          lastDay = new Date(year, month, 0).getDate();
          this.getMonthListData.startTime = `${year}-${month}-1`;
          this.getMonthListData.endTime = `${year}-${month}-${lastDay}`;
          getMonthList(
            this.getMonthListData.startTime,
            this.getMonthListData.endTime
          ).then(res => {
             // console.log(res)
            this.MonthListAxios(res);
          });
        }
      }
      if (e.target.innerText === "下个月") {
        if (parseInt(this.getMonthListData.startTime.substr(5, 2)) === 12) {
          year = parseInt(this.getMonthListData.startTime.substr(0, 4));
          year += 1;
          this.getMonthListData.startTime = `${year}-1-1`;
          this.getMonthListData.endTime = `${year}-1-31`;
          this._Month=this.getMonthListData.startTime.substr(5,2)
          getMonthList(
            this.getMonthListData.startTime,
            this.getMonthListData.endTime
          ).then(res => {
             // console.log(res)
            this.MonthListAxios(res);
          });
        } else {
          year = parseInt(this.getMonthListData.startTime.substr(0, 4));
          month = parseInt(this.getMonthListData.startTime.substr(5, 2));
          month += 1;
          lastDay = new Date(year, month, 0).getDate();
          this.getMonthListData.startTime = `${year}-${month}-1`;
          this.getMonthListData.endTime = `${year}-${month}-${lastDay}`;
          this._Month=this.getMonthListData.startTime.substr(5,2)
          getMonthList(
            this.getMonthListData.startTime,
            this.getMonthListData.endTime
          ).then(res => {
             // console.log(res)
            this.MonthListAxios(res);
          });
        }
      }
    });
  },
  methods: {
    // 异步请求数据
    /**
     * res Promise
     */
    MonthListAxios(res) {
      this.MonthList = res;
      // console.log(res[0].date.substr(5,2))
      this._Month=res[0].date.substr(5,2)
      this.MonthListAm = [];
      this.MonthListZW = [];
      this.MonthListPm = [];
      this.MonthList.forEach((item, index) => {
        if ("dutyList" in item) {
          let tmpArr = [
            {content: "早班" },
            {content: "午班" },
            {content: "晚班" }
          ];
          item.dutyList.forEach(tmp => {
            if (tmp.content.substr(0, 2) === "早班") {
              tmpArr[0].content = tmp.content;
              tmpArr[0] = this.MonthListType(0, tmp.type, tmpArr);
            }
            if (tmp.content.substr(0, 2) === "午班") {
              tmpArr[1].content = tmp.content;
              tmpArr[1] = this.MonthListType(1, tmpArr.type, tmpArr);
            }
            if (tmp.content.substr(0, 2) === "晚班") {
              tmpArr[2].content = tmp.content;
              tmpArr[2] = this.MonthListType(2, tmpArr.type, tmpArr);
            }
          });
          // console.log(tmpArr)
          this.MonthListAm.push(tmpArr[0]);
          this.MonthListZW.push(tmpArr[1]);
          this.MonthListPm.push(tmpArr[2]);

        } else {
          this.MonthListAm.push({content: "早班:" });
          this.MonthListZW.push({content: "午班:" });
          this.MonthListPm.push({content: "晚班:" });
        }
      });
    },

    // 判断排班紧急程度
    /**
     * index 排班0-2
     * type warning/danger/success
     * array 零时排版数据
     */
    MonthListType(index, type, array) {
      if (type == "warning") {
        array[index].type = "#e6a23c";
        array[index].content += " (离岗)";
      } else if (type == "danger") {
        array[index].type = "#f56c6c";
        array[index].content += " (danger)";
      } else {
        array[index].type = "#67c23a";
      }
      return array[index];
    },

    // 点击事件切换日历数据
    updataMonthList(data) {
      if (data.type != "current-month") {
        this.getMonthListData.startTime = data.day.substr(0, 8) + 1;
        let endYear = data.day.substr(0, 3);
        let endMonth = data.day.substr(5, 2);
        let lastDay = new Date(endYear, endMonth, 0).getDate();
        this.getMonthListData.endTime = data.day.substr(0, 8) + lastDay;
        getMonthList(
          this.getMonthListData.startTime,
          this.getMonthListData.endTime
        ).then(res => {
          this.MonthListAxios(res);
        });
      }
    },

    // 获取排班颜色
    getMonthListDataType(mon,index, type) {
      switch (type) {
        case "am":
          if((this._Month==mon)&&(
            this.MonthListAm.length >= 28 &&
            "content" in this.MonthListAm[index]
          )) {
            return this.MonthListAm[index].type;
          }
        case "pm":
           if ((this._Month==mon)&&(
            this.MonthListPm.length >= 28 &&
            "content" in this.MonthListPm[index]
          )) {
            return this.MonthListPm[index].type;
          }
        case "zw":
          if ((this._Month==mon)&&(
            this.MonthListZW.length >= 28 &&
            "content" in this.MonthListZW[index]
          )){
            return this.MonthListZW[index].type;
          }
        default:
          return "rgb(148, 146, 146)";
      }
    },

    // 获取排班数据
    getMonthListDataContent(mon,index, type) {
      var i=0
      switch (type) {
        case "am":
          // console.log(this._Month)
          if((this._Month==mon)&&(
            this.MonthListAm.length >= 28 &&
            "content" in this.MonthListAm[index]
          )) {
            return this.MonthListAm[index].content;
          }
          else return "早班"
        case "pm":
          if ((this._Month==mon)&&(
            this.MonthListPm.length >= 28 &&
            "content" in this.MonthListPm[index]
          )) {
            return this.MonthListPm[index].content;
          }
           else return "晚班"
        case "zw":
          if ((this._Month==mon)&&(
            this.MonthListZW.length >= 28 &&
            "content" in this.MonthListAm[index]
          )) {
            return this.MonthListZW[index].content;
          }
          else return "午班"
        default:
          return "loading"
      }
    }
  }
};
</script>

<style  scoped lang="less">
.table {
  width: 80%;
  border: 0px;
  /deep/ td,
  th {
    border: 0px;
  }

  margin-left: 40px;
  .tab_top {
    height: 40px;
  }
  .is-selected {
    color: #1989fa;
  }
  .title {
    width: 100%;
    height: 55px;
    margin: 0 auto;
    background: #263674;
    font-size: 22px;
    color: white;
    text-align: center;
    line-height: 55px;
  }
  .rili {
    width: 100%;
    border: 0px;
    margin: 0 auto;
    background: #263674;
  }

  .z,
  .zh,
  .w {
    padding-top: 12px;
    color: white;
    margin-left: 12px;
    line-height: 12px;
    font-size: 12px;
  }

  /deep/ .el-calendar__body {
    background: #192026;
    border: 0px;
    padding: 0px 20px 35px;
  }

  /deep/ .el-calendar__header {
    background: #192026;
    color: white;
    border-bottom: 0px;
  }

  /deep/ .el-calendar__title {
    color: white;
  }

  /deep/ .el-calendar-day {
    height: 100px;
    background: #0d0d0d;
    // color: #34ccda;
    margin: 5px;
  }
  #day {
    color: #34ccda;
    margin-left: 12px;
  }
  /deep/ tbody {
    border: 0px;
  }
  /deep/ .el-calendar-table {
    border: 0px;
  }
  /deep/ .el-calendar-table__row {
    border: 0px;
  }

  /deep/ .el-calendar-table td.is-today {
    color: #eced30;
  }
  /deep/ .el-calendar-table td.is-today #day {
    color: #eced30;
  }
  /deep/ .el-calendar-table td.is-today .z {
    color: #eced30;
  }
  /deep/ .el-calendar-table td.is-today .zh {
    color: #eced30;
  }
  /deep/ .el-calendar-table td.is-today .w {
    color: #eced30;
  }
  /deep/ .is-selected {
    border: 1px;
  }

  /deep/ .is-selected #day {
    color: #eced30;
  }
  /deep/ .el-calendar-table:not(.is-range) td.next #day,
  .el-calendar-table:not(.is-range) td.prev #day {
    color: rgb(148, 146, 146);
    // color: #0d0d0d;
  }
  /deep/ .el-calendar-table:not(.is-range) td.next .z,
  .el-calendar-table:not(.is-range) td.prev .z {
    color: rgb(148, 146, 146);
    // color: #0d0d0d;
  }
  /deep/ .el-calendar-table:not(.is-range) td.next .zh,
  .el-calendar-table:not(.is-range) td.prev .zh {
    color: rgb(148, 146, 146);
    // color: #0d0d0d;
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
    text-align: center;
  }

  /deep/ .el-tabs__nav-scroll {
    background: #11141b;
    width: 100%;
    color: #fff;
  }

  /deep/ .el-tabs--border-card > .el-tabs__content {
    background: #0e1327;
    color: #fff;
  }

  /deep/ .el-tabs__item.is-active {
    background: #33447a;
    color: #fff;
  }
  /deep/ .el-calendar-table tr:first-child td,
  /deep/ .el-calendar-table tr td:first-child {
    border: none;
  }
}
</style>
