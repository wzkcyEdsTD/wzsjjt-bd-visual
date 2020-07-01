<template>
  <div class="record">
    <!-- 标题 -->
    <div class="title">值班要情记录</div>
    <!-- header按钮 -->
    <div class="header">
      <div class="week_btn">
        <button class="line_btn" @click="lastMonday">&lt; 上一周</button>
        <button class="line_btn" @click="nextMonday">下一周 &gt;</button>
      </div>
      <div class="now_week main_btn">本周</div>
      <div id="select_wrap">
        <select id="select_time">
          <option name="1">本周全部</option>
        </select>
        <span id="select_border">|</span>
      </div>
    </div>
    <!-- 表格 -->
    <div class="work_table_wrap flex-1">
      <table class="work_table">
        <thead>
          <tr>
            <th></th>
            <th>早班</th>
            <th>中班</th>
            <th>晚班</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in day" :key="index">
            <td>
              <span>{{item}}</span>
            </td>
            <td @click="paizban">
              <p v-if="pd1(pd(index),1)">{{test.staffNames}}</p>
              <p v-else>请点击排班</p>
            </td>
            <td>
              <p v-if="pd1(pd(index),2)">{{test.staffNames}}</p>
              <p v-else>请点击排班</p>
            </td>
            <td>
              <p v-if="pd1(pd(index),3)">{{test.staffNames}}</p>
              <p v-else>请点击排班</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 底部按钮 -->
    <div class="footer_btn_wrap">
      <div class="main_btn">保存</div>
      <div class="main_btn">新增</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getSchedul } from "@/api/onduty/scheduling";
import { getArrange } from "@/api/onduty/dutyArrange";
import { log } from "util";
import axios from "axios";
export default {
  name: "record",
  data() {
    return {
      getSchedulData: {
        startTime: null,
        endTime: null
      },
      test: [],
      person: [],
      week: [],
      day: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      today: "",
      _lastMonday: "",
      _nextMonday: ""
    };
  },
  created() {
    var now = new Date();
    this._lastMonday = this._nextMonday = now;
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayTime = 24 * 60 * 60 * 1000;
    var MondayTime = nowTime - (day - 1) * oneDayTime; //显示周一
    var SundayTime = nowTime + (7 - day) * oneDayTime; //显示周日
    this.getSchedulData.startTime = new Date(MondayTime).toJSON().substr(0, 10);
    // let endYear = new Date().toJSON().substr(0, 4);
    // let endMonth = new Date().toJSON().substr(5, 2);
    // let lastDay = new Date(endYear, endMonth, 0).getDate();
    this.getSchedulData.endTime = new Date(SundayTime).toJSON().substr(0, 10);
    getSchedul(this.getSchedulData.startTime, this.getSchedulData.endTime).then(
      res => {
        // console.log(res);
        this.person = res;
        const that = this;
        res.forEach(item => {
          that.week.push(item.week);
          // console.log(that.week);
        });
      }
    );
  },
  methods: {
    pd(index) {
      var arr = [];
      var arr1 = [];
      this.week.forEach((item, key) => {
        if (item == Number(index) + 1) {
          arr.push(key);
        }
      });
      arr.forEach(item => {
        arr1.push(this.person[item]);
      });
      return arr1;
    },
    pd1(arr, num) {
      var kk = 0;
      arr.forEach((item, index) => {
        if (item.times == num) {
          this.test = item;
          kk = 1;
        }
      });
      if (kk == 1) {
        return true;
      } else {
        return false;
      }
    },
    lastMonday() {
      var today = this._lastMonday;
      var oneday = 1000 * 60 * 60 * 24;
      var lastMonday1 = new Date(today - oneday * (today.getDay() + 6))
        .toJSON()
        .substr(0, 10);
      var lastSunday1 = new Date(
        today - oneday * (today.getDay() + 6) + oneday * 6
      )
        .toJSON()
        .substr(0, 10);
      this._lastMonday = new Date(today - oneday * (today.getDay() + 6));
      // console.log(lastMonday1);
      // console.log(lastSunday1);
      this.week = [];
      getSchedul(lastMonday1, lastSunday1).then(res => {
        // console.log(res);
        this.person = res;
        const that = this;
        this.data = [];
        this.data[("周一", "周二", "周三", "周四", "周五", "周六", "周日")];
        res.forEach(item => {
          that.week.push(item.week);
          // console.log(that.week);
        });
      });
    },
    nextMonday() {
      var today = this._lastMonday;
      var oneday = 1000 * 60 * 60 * 24;
      var nextMonday1 = new Date(today - oneday * today.getDay() + oneday * 8)
        .toJSON()
        .substr(0, 10);
      var nextSunday1 = new Date(today - oneday * today.getDay() + oneday * 14)
        .toJSON()
        .substr(0, 10);
      // console.log(nextMonday1);
      // console.log(nextSunday1);
      this._lastMonday = new Date(today - oneday * today.getDay() + oneday * 8);
      this.week = [];
      getSchedul(nextMonday1, nextSunday1).then(res => {
        // console.log(res);
        this.person = res;
        const that = this;
        this.data = [];
        this.data[("周一", "周二", "周三", "周四", "周五", "周六", "周日")];
        res.forEach(item => {
          that.week.push(item.week);
          // console.log(that.week);
        });
      });
    },
    paizban() {
      // const loading = this.$loading({
      //   lock: true,
      //   // type:"success",
      //   // center,
      //   text: "排早班，请选择右边的值班人员",
      //   // title:'排早班，请选择右边的值班人员',
      //   // spinner: 'el-alert',
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      this.$router.push("/onduty/scheduling");
      getArrange("3303", "liuhui", "2020-01-06", "1", "2", "张三").then(res => {
        // console.log(res);
      });
      // let data = {
        // district: "3303",
        // staffNos: "liuhui",
        // dutyDate: "2020-01-06",
        // week: "1",
        // times: "3",
        // staffNames: "张三"
      // };
      // axios
      //   .post(
      //    "http://pshyz.f3322.net:9000/dutyArrange/",
      //     qs.stringify({
      //       data
      //     })
      //   )
      //   .then(res => {
      //     console.log("res=>", res);
      //   });
      // loading.close();
    }
  }
};
</script>

<style scoped lang="less">
.record {
  padding-top: 40px;
  width: 100%;
  height: 800px;
  //   background: rgba(0, 0, 0, 0.3);
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

  .header {
    width: 95%;
    margin: 7px auto;
    overflow: hidden;
    .main_btn {
      height: 30px;
      width: 85px;
      line-height: 30px;
      margin: 0 25px;
      float: left;
    }
  }

  .work_table_wrap {
    width: 94.3%;
    background: #1c2a5c;
    margin: 0 auto;
    padding-top: 10px;
    border-radius: 7px;
    font-weight: bold;
    .work_table {
      width: 100%;
      thead {
        th {
          height: 40px;
          background: #101733;
          color: #54abdc;
          line-height: 40px;
          text-align: center;
        }
      }
      tbody {
        tr {
          &:not(:last-child) {
            border-bottom: #616f9e 1px solid;
          }
        }
      }
      tr {
        td {
          border-right: #616f9e 1px solid;
          width: 30.5%;
          height: 85px;
          text-align: center;
          color: #9badc2;
          &:first-child {
            width: 55px;
            color: #dfe8ff;
            border: none;
            position: relative;
            span {
              position: absolute;
              left: 50%;
              top: 50%;
              writing-mode: vertical-rl;
              transform: translate(-50%, -50%);
              -webkit-writing-mode: vertical-rl;
              -ms-writing-mode: vertical-rl;
            }
          }
          &:not(:first-child) {
            background: #212f5e;
            line-height: 85px;
          }
        }
        td:not(:nth-of-type(4n + 1)):hover {
          background: #0e1434;
          color: #f5f9fb;
          box-shadow: 0 0 0 5px #2ad833 inset;
        }
        &:nth-of-type(3n-2) {
          background: #374a8c;
        }
        &:nth-of-type(3n-1) {
          background: #6aa3e6;
        }
        &:nth-of-type(3n) {
          background: #859ef0;
        }
      }
    }
  }

  .footer_btn_wrap {
    width: 90%;
    margin: 10px auto;
    overflow: hidden;
    text-align: center;
    .main_btn {
      width: 125px;
      height: 45px;
      line-height: 45px;
      display: inline-block;
    }
  }

  .week_btn {
    float: left;
  }
  .line_btn {
    width: 90px;
    height: 30px;
    background: none;
    color: #fff;
    border-radius: 4px;
    border: 2px solid #fff;
    float: left;
    text-align: center;
  }
  #select_wrap {
    position: relative;
    float: left;
    width: 130px;
  }
  #select_time {
    width: 120px;
    height: 30px;
    background: none;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 4px;
  }
  #select_border {
    font-size: 26px;
    position: absolute;
    left: 90px;
    color: #fff;
  }
  .main_btn {
    background: #263674;
    color: white;
    border-radius: 4px;
    text-align: center;
  }
  .line_btn:hover {
    background: #c6e2ff;
    color: #409eff;
  }
}
</style>
