<template>
  <div class="wrapper">
    <div class="wrapper-list flex flex-y">
      <div class="search-wrapper flex">
        <el-select
          v-model="searchValue1"
          placeholder="请选择"
          class="flex-1 global-search"
          :popper-append-to-body="appendBody"
          @change="selectChange">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <b></b>
        <el-select
          v-model="searchValue2"
          placeholder="请选择"
          class="flex-1 global-search"
          :popper-append-to-body="appendBody"
          @change="selectChange">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="list-wrapper flex-1 relative">
        <ul class="list-box flex flex-y">
          <li class="flex-1" :key="'a'+index" v-for="(item,index) in list">
            <div
              @click="changeActiveIndex(index,item)"
              :class="{'active':activeIndex===index}"
              class="item flex flex-y">
              <div class="flex-1">
                <div>事件名称：<span>{{item && item.caseName}}</span><i></i></div>
              </div>
              <div class="flex-1">
                <div>事件发生时间：<span>{{item.sTime}}</span></div>
              </div>
              <div class="flex-1">
                <div>发生地：<span>{{item.place}}</span></div>
              </div>
            </div>
          </li>
          <li
            class="flex-1"
            :key="'b'+index"
            v-for="(_,index) in (pageSize - (list && list.length ? list.length : 0))"></li>
        </ul>
      </div>
      <div class="wrapper-page">
        <el-pagination
          small
          :hide-on-single-page="total<pageSize"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNo"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div v-show="list && list.length<=0" class="empty">
        暂无数据
      </div>
    </div>
    <div class="wrapper-info" v-show="activeIndex!==-1">
      <ItemTitle id="card0" :title="info && info.caseName" color="orange"></ItemTitle>
      <i class="close" @click="close"></i>
      <div class="table-box">
        <div class="item">
          <span class="key">案例名称</span>
          <b class="value">{{info.caseName}}</b>
        </div>
        <div class="item hasbtn">
          <span class="key">关联预案</span>
          <b class="value">{{info.planName}}
            <i @click="showInfo(info)">详情</i></b>
        </div>
        <div class="item">
          <span class="key">所属部门</span>
          <b class="value">{{info.department}}</b>
        </div>
        <div class="item">
          <span class="key">发生地</span>
          <b class="value">{{info.place}}</b>
        </div>
        <div class="item full">
          <span class="key">事件描述</span>
          <b class="value">{{info.description}}</b>
        </div>
        <div class="item full">
          <span class="key">受灾情况</span>
          <b class="value">{{info.disasterSituation}}</b>
        </div>
        <div class="item full">
          <span class="key">处置过程</span>
          <b class="value">{{info.disposalProcess}}</b>
        </div>
        <div class="item full">
          <span class="key">人员伤亡</span>
          <b class="value">{{info.casualties}}</b>
        </div>
        <div class="item full">
          <span class="key">经验总结</span>
          <b class="value">{{info.experience}}</b>
        </div>
      </div>
      <div v-show="isShowMore" class="wrapper-info-more">
        <i class="close" @click="closeMoreInfo"></i>
        <div>
          <div class="title">基本信息</div>
          <div class="table-box">
            <div class="item">
              <span class="key">预案级别</span>
              <b class="value">{{moreInfo.dictName}}</b>
            </div>
            <div class="item hasbtn">
              <span class="key">预案类型</span>
              <b class="value">{{moreInfo.dictItemName}}</b>
            </div>
            <div class="item">
              <span class="key">预案名称</span>
              <b class="value">{{moreInfo.name}}</b>
            </div>
            <div class="item">
              <span class="key">预案编号</span>
              <b class="value">{{moreInfo.planNo}}</b>
            </div>
            <div class="item">
              <span class="key">预案版本号</span>
              <b class="value">{{moreInfo.edition}}</b>
            </div>
            <div class="item">
              <span class="key">所属部门</span>
              <b class="value">{{moreInfo.depName}}</b>
            </div>
            <div class="item">
              <span class="key">事件分类</span>
              <b class="value">{{moreInfo.planTypeName && moreInfo.planTypeName.join('，')}}</b>
            </div>
            <div class="item">
              <span class="key">灾害类型</span>
              <b class="value">{{moreInfo.typeDetailName && moreInfo.typeDetailName.join('，')}}</b>
            </div>
            <div class="item">
              <span class="key">关键字</span>
              <b class="value">{{moreInfo.keyword}}</b>
            </div>
            <div class="item">
              <span class="key">发布时间</span>
              <b class="value">{{moreInfo.planStartTime}}</b>
            </div>
            <div class="item">
              <span class="key">到期时间</span>
              <b class="value">{{moreInfo.planEndTime}}</b>
            </div>
            <div class="item">
              <span class="key">更新频率</span>
              <b class="value">{{moreInfo.updateFrequency}}</b>
            </div>
            <div class="item full">
              <span class="key">编制部门</span>
              <b class="value">{{moreInfo.preparationdDepartment}}</b>
            </div>
          </div>
          <div class="title">成员单位</div>
          <div class="table-box">
            <div class="item full" :key="'a'+index1" v-for="(item1,index1) in moreInfo.smartPlanUnitList">
              <span class="key">{{item1.depName}}</span>
              <b class="value">{{item1.depDescription}}</b>
            </div>
          </div>
          <div class="title">分级响应</div>
          <div class="level-btn">
            <div
              @click="changeLevelIndex(index2)"
              :class="{'active':moreInfoLevelActive===index2}"
              :key="'b'+index2"
              v-for="(item2,index2) in moreInfoLevel">
              {{item2.level | levelFormat}}级响应
            </div>
          </div>
          <div class="level-table">
            <table v-show="moreInfoLevelActive===index3" :key="'c'+index3" v-for="(item3,index3) in moreInfoLevel">
              <colgroup>
                <col width="15%">
                <col width="25%">
                <col width="30%">
                <col width="30%">
              </colgroup>
              <thead>
              <tr>
                <td colspan="4"> {{item3.level | levelFormat}}级响应</td>
              </tr>
              <tr>
                <td>说明</td>
                <td>工作组</td>
                <td>工作组职责</td>
                <td>工作组成员</td>
              </tr>
              </thead>
              <tbody>
              <tr :key="'d'+index4" v-for="(item4,index4) in item3.data">
                <td v-if="index4===0" :rowspan="item3.data.length">{{item3.description}}</td>
                <td>{{item4.groupName}}</td>
                <td>{{item4.groupDuty}}</td>
                <td class="member"><span :key="index5" v-for="(item5,index5) in item4.uname">{{item5.userName}}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="title">附件</div>
          <div class="wrapper-file level-table">
            <table>
              <colgroup>
                <col width="30%">
                <col width="15%">
                <col width="30%">
                <col width="25%">
              </colgroup>
              <thead>
              <tr>
                <td>附件名称</td>
                <td>大小</td>
                <td>时间</td>
                <td>操作</td>
              </tr>
              </thead>
              <tbody>
              <tr :key="index5" v-for="(item5,index5) in moreInfo.smartPlanAnnexList">
                <td>{{item5.name}}</td>
                <td>{{item5.size}}</td>
                <td>{{item5.createTime}}</td>
                <td>
                  <button>预览</button>
                  <button :aaa="item5.filePath">下载</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-show="isLoading">
      <Loading></Loading>
    </div>
  </div>
</template>

<script>
import ItemTitle from 'components/item-title/item-title'
import Loading from 'components/loading/loading'
import { queryByTypeTime, queryById } from 'api/zaihai/zaihai'

export default {
  data() {
    return {
      isLoading: false,
      pageNo: 1,
      pageSize: 6,
      total: 0,
      activeIndex: -1,
      appendBody: false,
      searchValue1: '自然灾害',
      options1: [
        {
          value: '自然灾害',
          label: '自然灾害'
        },
        {
          value: '事故灾难',
          label: '事故灾难'
        },
        {
          value: '公用卫生事件',
          label: '公用卫生事件'
        },
        {
          value: '社会安全事件',
          label: '社会安全事件'
        }
      ],
      searchValue2: 'desc',
      options2: [
        {
          value: 'desc',
          label: '时间最近'
        },
        {
          value: 'asc',
          label: '时间最远'
        }
      ],
      list: [],
      moreInfo: {
        smartPlanUnitList: [],
        smartPlanOrgnizationList: [],
        smartPlanLevelList: [],
        smartPlanAnnexList: []
      },
      moreInfoLevelActive: 0,
      isShowMore: false
    }
  },
  watch: {
    activeIndex(val) {
      if (val === -1) {
        this.isShowMore = false
      }
    }
  },
  filters: {
    levelFormat(val) {
      let str = ''
      switch (val) {
        case 1:
          str = 'Ⅰ'
          break
        case 2:
          str = 'Ⅱ'
          break
        case 3:
          str = 'Ⅲ'
          break
        case 4:
          str = 'Ⅳ'
          break
        default:
          str = val
          break
      }
      return str
    }
  },
  computed: {
    info() {
      let res = []
      if (this.activeIndex !== -1) {
        res = this.list[this.activeIndex]
      }
      return res
    },
    moreInfoLevel() {
      const newData = [...this.moreInfo.smartPlanLevelList]
      for (let i = 0; i < newData.length; i++) {
        const arr = []
        for (let j = 0; j < newData[i].orgnizationList.length; j++) {
          for (let k = 0; k < this.moreInfo.smartPlanOrgnizationList.length; k++) {
            if (newData[i].orgnizationList[j] === this.moreInfo.smartPlanOrgnizationList[k].id) {
              arr.push(JSON.parse(JSON.stringify(this.moreInfo.smartPlanOrgnizationList[k])))
              break
            }
          }
        }
        newData[i].data = arr
      }
      return newData.reverse()
    }
  },
  mounted() {
    this.selectChange()
  },
  methods: {
    closeMoreInfo() {
      this.isShowMore = false
    },
    changeLevelIndex(index) {
      this.moreInfoLevelActive = index
    },
    showInfo(item) {
      this.isShowMore = false
      this.isLoading = true
      item.pid = '1271064925483323394'
      queryById(item.pid).then((data) => {
        console.log(data)
        this.isLoading = false
        this.moreInfo = data
        this.isShowMore = true
      })
    },
    selectChange() {
      this.pageNo = 1
      this.initData()
    },
    changeActiveIndex(index, data) {
      if (this.activeIndex === index) {
        this.activeIndex = -1
      } else {
        this.activeIndex = index
      }
      data.checked = this.activeIndex !== -1
      this.$emit('addPoint', data)
    },
    initData() {
      // this.searchValue1 = '市级应急预案'
      this.isLoading = true
      queryByTypeTime(this.pageNo, this.pageSize, this.searchValue2, this.searchValue1).then((data) => {
        this.isLoading = false
        if (data === null || data.code === 500) {
          this.total = 0
          this.list = []
        } else {
          this.total = data.total
          this.list = data.records
        }
      })
    },
    handleCurrentChange() {
      this.initData()
    },
    close() {
      const data = this.list[this.activeIndex]
      this.activeIndex = -1
      this.changeActiveIndex(this.activeIndex, data)
    }
  },
  components: {
    ItemTitle,
    Loading
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    width: 100%;
    height: 0;
    .wrapper-list {
      background: rgba(3, 67, 106, 0.9);
      position: fixed;
      left: 0.14rem;
      bottom: 0.05rem;
      top: 0.56rem;
      width: 3.8rem;
      padding: 0.1rem;
      .search-wrapper {
        position: relative;
        z-index: 3;
        > b {
          width: 10px;
        }
      }
      .list-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        padding: 0.1rem 0;
        > li {
          padding: 0.05rem 0;
          .item {
            height: 100%;
            border: 1px solid #31A5DD;
            position: relative;
            padding: 0 0.1rem 0 0.25rem;
            border-radius: 0.04rem;
            cursor: pointer;
            &.active {
              background-color: #1381A6;
            }
            > div {
              position: relative;
              > div {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                transform: translate(0, -50%);
                height: 0.3rem;
                line-height: 0.3rem;
                color: #fff;
                > span {
                  color: #02F2F6;
                }
                > i {
                  width: 0.1rem;
                  height: 0.16rem;
                  position: absolute;
                  top: 50%;
                  left: -0.16rem;
                  .bg-image('./images/dot');
                  display: block;
                  transform: translate(0, -50%);
                }
              }
            }
          }
        }
      }
    }
    .wrapper-page {
      text-align: right;
    }
    .wrapper-info {
      position: fixed;
      right: 0.14rem;
      top: 0.56rem;
      background: #01334e;
      padding: 0.1rem;
      width: 5rem;
      .table-box {
        border-top: 0.01rem solid #0D5978;
        border-left: 0.01rem solid #0D5978;
        overflow: hidden;
        &.no-line {
          border-top: none;
        }
        .item {
          position: relative;
          float: left;
          width: 50%;
          &.full {
            width: 100%;
            .key {
              height: 100%;
            }
            .value {
              text-overflow: initial;
              overflow: initial;
              white-space: initial;
              min-height: 0.32rem;
              height: auto;
            }
          }
          &.hasbtn {
            position: relative;
            i {
              position: absolute;
              right: 0.05rem;
              top: 50%;
              display: block;
              transform: translate(0, -50%);
              font-style: normal;
              background: #159BFD;
              font-size: 0.15rem;
              height: 0.24rem;
              line-height: 0.24rem;
              padding: 0 0.05rem;
              border-radius: 0.04rem;
              cursor: pointer;
            }
            .value {
              padding-right: 0.55rem;
            }
          }
          .key {
            color: #ebe8c6;
            background: #184660;
            width: 1.2rem;
            height: 0.32rem;
            line-height: 0.32rem;
            text-align: center;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            border-right: 0.01rem solid #024364;
            border-bottom: 0.01rem solid #2c5a73;
            font-size: 0.16rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 0.05rem;
          }
          .value {
            color: #fff;
            width: 100%;
            height: 0.32rem;
            line-height: 0.32rem;
            border-right: 0.01rem solid #024364;
            border-bottom: 0.01rem solid #024364;
            padding: 0 0.1rem 0 1.3rem;
            display: block;
            font-size: 0.16rem;
            font-weight: 400;
            .no-wrap();
          }
        }
      }
      .wrapper-info-more {
        width: 7rem;
        background: #01334e;
        position: absolute;
        right: 100%;
        top: 0;
        padding: 0.1rem;
        > div {
          overflow: auto;
          max-height: 5rem;
          .title {
            color: #33BECD;
            line-height: 0.28rem;
            margin-top: 0.1rem;
          }
        }
      }
    }
  }
  .global-search {
    width: 1.3rem;
    z-index: 1;
    height: 0.28rem;
    color: #00192E;
    border-radius: 0.15rem;
    outline: none;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
  /deep/ .global-search {
    .el-select-dropdown {
      background: #43bafe;
      border: none;
    }
    .el-select-dropdown__empty {
      color: #fff;
    }
    .el-popper[x-placement^=bottom] .popper__arrow {
      border-bottom-color: #43bafe;
      &:after {
        border-bottom-color: #43bafe;
      }
    }
    .el-select-dropdown__item {
      color: #fff;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background-color: rgba(0, 122, 192, 0.6)
    }
    .el-input__inner {
      background: transparent;
      color: #3BABEC;
      height: 0.28rem;
      border: 1px solid #3BABEC;
      border-radius: 0;
      &::placeholder {
        color: #43bafe;
      }
    }
    .el-input {
      position: relative;
      font-size: 0.14rem;
    }
    .el-input__icon {
      line-height: 0.3rem;
      color: #43bafe;
    }
  }
  /deep/ .el-select-dropdown {
    left: auto !important;
  }
  // 分页
  /deep/ .el-pagination {
    .btn-prev, .btn-next {
      background-color: transparent !important;
      color: #1599F9 !important;
      padding: 0.06rem;
      &:disabled {
        color: #065F97 !important;
      }
    }
    .number, .more {
      border-radius: 0.02rem;
      margin-left: 0.05rem;
      &:first-child {
        margin-left: 0;
      }
      &.active {
        background: #159BFD;
        color: #fff;
      }
    }
    .el-pagination__jump {
      margin-left: 0;
      color: #0D7BC7;
      .el-pagination__editor.el-input {
        width: 0.4rem;
      }
      input {
        border: 1px solid #0D7BC7;
        background: transparent;
        color: #fff;
      }
    }
  }
  .close {
    position: absolute;
    right: 0.2rem;
    top: 0.17rem;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image('./images/zoom-in');
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    &:hover {
      transform: rotate(45deg);
    }
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
  }
  .level-btn {
    overflow: hidden;
    > div {
      float: left;
      border-top: 1px solid #116798;
      border-bottom: 1px solid #116798;
      border-right: 1px solid #116798;
      padding: 0.02rem 0.05rem;
      color: #fff;
      cursor: pointer;
      &:first-child {
        border-left: 1px solid #116798;
        border-radius: 0.04rem 0 0 0.04rem;
      }
      &:last-child {
        border-radius: 0 0.04rem 0.04rem 0;
      }
      &.active {
        background: #1C95EE;
      }
    }
  }
  .level-table {
    table {
      border-collapse: collapse;
      width: 100%;
      thead {
        tr {
          td {
            line-height: 0.32rem;
            color: #ebe8c6;
            border: 0.01rem solid #024364;
            padding: 0 0.1rem;
          }
        }
      }
      tbody {
        tr {
          td {
            border: 0.01rem solid #024364;
            color: #fff;
            padding: 0.1rem;
            &.member {
              > span {
                padding-right: 0.1rem;
              }
            }
          }
        }
      }
    }
  }
</style>
