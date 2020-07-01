<template>
  <div class="wrapper flex">
    <div class="tree">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <el-tree
        ref="tree"
        :data="dataType"
        show-checkbox
        :node-key="defaultProps.key"
        default-expand-all
        :props="defaultProps"
        @check="handleCheckChange"
        :default-checked-keys="defaultCheckedKeys"
      ></el-tree>
    </div>
    <div class="paging flex-1">
      <div class="close" @click="close"></div>
      <div class="camera" ref="camera">
        <div class="camera_choose">
          <el-select
            class="global-search"
            v-model="pageNumListValue"
            placeholder="请选择"
            @change="selechChange"
            :popper-append-to-body="appendBody">
            <el-option
              v-for="item in pageNumList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            :disabled="cityListDisabled"
            class="global-search"
            v-model="cityListValue"
            placeholder="请选择地区"
            @change="selechChange"
            :popper-append-to-body="appendBody">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div
          class="camera_content"
          :class="'content_'+pageNumListValue +(!flag?' visibility':'')"
          ref="cameraContent">
          <div v-for="(item, index) in cameraList" :key='index'>
            <div class="camera_mod">
              <div>
                <div>
                  <div>
                    <iframe :src="item.video_url"></iframe>
                  </div>
                </div>
                <span> {{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          :class="!flag?' visibility':''"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="pageNumListValue"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getVideoType, getCityVideoInfo } from 'api/warning/warning'
import { mapGetters } from 'vuex'
import { debounce } from 'common/js/util'

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    cityListDisabled() {
      return this.userInfo.district !== '3303'
    }
  },
  data() {
    return {
      appendBody: false,
      defaultProps: {
        children: 'children',
        label: 'typename',
        key: 'type'
      },
      defaultCheckedKeys: ['1'],
      search: '',
      page: 1,
      typeString: '',
      dataType: [], // 记录类别tree数据
      pageNumListValue: 4,
      pageNumList: [
        {
          label: '2*2',
          value: 4
        },
        {
          label: '1*1',
          value: 1
        },
        {
          label: '3*3',
          value: 9
        }
      ],
      cityListValue: '',
      cityList: [
        { label: '温州市', value: '3303' },
        { label: '鹿城区', value: '330302' },
        { label: '龙湾区', value: '330303' },
        { label: '瓯海区', value: '330304' },
        { label: '洞头区', value: '330305' },
        { label: '乐清市', value: '330382' },
        { label: '瑞安市', value: '330381' },
        { label: '龙港市', value: '330383' },
        { label: '永嘉县', value: '330324' },
        { label: '文成县', value: '330328' },
        { label: '平阳县', value: '330326' },
        { label: '泰顺县', value: '330329' },
        { label: '苍南县', value: '330327' }
      ],
      cameraList: [],
      total: 0,
      flag: true
    }
  },
  created() {
    this.$watch('search', debounce((newQuery) => {
      this.page = 1
      this.initData()
    }, 200))
  },
  mounted() {
    // 设置当前地区
    this.cityListValue = this.userInfo.district
    getVideoType().then((res) => {
      this.dataType = [{
        type: '1',
        typename: '类别',
        children: res
      }]
    })
    this.initData()
  },
  methods: {
    initData() {
      this.flag = false
      getCityVideoInfo(this.cityListValue, this.search, this.page, this.pageNumListValue, this.typeString).then((data) => {
        this.cameraList = data.records
        this.total = data.total
        this.flag = true
      })
    },
    handleCheckChange(data) {
      let checkedList = this.$refs.tree.getCheckedKeys()
      // console.log(checkedList)
      if (checkedList.length === 0) {
        console.log('setCheckedKeys16')
        this.$refs.tree.setCheckedKeys([data.type])
        // 设置数组
      } else {
        const index = checkedList.indexOf('1')
        if (index !== -1) {
          checkedList = checkedList.splice(index, 1)
        }
        this.typeString = checkedList.join(',')
        if (this.typeString === '1') {
          this.typeString = ''
        }
        this.page = 1
        this.initData()
      }
    },
    selechChange() {
      this.page = 1
      const arr = []
      for (let i = 0; i < this.pageNumListValue; i++) {
        arr.push({
          // video_url: ''
        })
      }
      this.cameraList = arr
      this.initData()
    },
    handleCurrentChange(value) {
      this.page = value
      this.initData()
    },
    close() {
      this.$emit('close', -1)
    }
  }
}
</script>
<style scoped lang="less">
  .wrapper {
    position: absolute;
    left: 0.45rem;
    top: -0.05rem;
    .tree {
      width: 2.1rem;
      padding: 0.1rem 0;
      border-radius: 0.04rem;
      border: 0.01rem solid #38cbda;
      background: rgba(8, 26, 68, 0.8);
      /* 树 */
      /deep/ .el-tree-node__label {
        color: #ffffff;
      }
      /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background: rgba(7, 89, 99, 0);
      }
      /deep/ .el-tree-node__content:hover .el-tree-node__label {
        color: #0ed6f5;
      }
      /deep/ .el-tree-node__content:hover {
        background: rgba(7, 89, 99, 0);
      }
      /deep/ .el-checkbox__inner {
        background: rgba(7, 89, 99, 0);
        border: 0.01rem solid #ffffff;
      }
      /deep/ .el-checkbox__inner {
        background: rgba(7, 89, 99, 0) !important;
        border: 0.01rem solid #ffffff !important;
      }
      /deep/ .el-tree {
        position: relative;
        width: 100%;
        background: transparent;
      }
      /* 搜索框 */
      /deep/ .el-autocomplete {
      }
      /deep/ .el-input {
        width: 92%;
        margin-left: 4%;
        display: block;
        height: 0.4rem;
      }
      /deep/ .el-input__inner {
        background: rgba(7, 89, 99, 0);
        border: 1px solid #43bafe;
        color: #43bafe;
        height: 0.3rem;
      }
      /deep/ .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(0, 0, 0, 0);
      }
      /deep/ .el-autocomplete {
        display: block;
        height: 0.6rem
      }
    }
    .paging {
      margin-left: 0.2rem;
      border-radius: 0.04rem;
      background-color: rgba(8, 26, 69, 0.8);
      border: 1px solid #38cbda;
      padding-bottom: 0.2rem;
      .close {
        color: #ffffff;
        font-size: 0.14rem;
        position: absolute;
        z-index: 1;
        top: 0.1rem;
        right: 0.1rem;
        cursor: pointer;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image('./images/close');
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        &:hover {
          transform: rotate(45deg);
        }
      }
      .camera {
        min-width: 5.2rem;
        .camera_choose {
          position: relative;
          padding: 0.1rem;
          font-size: 0;
          &:before, :after {
            content: '';
            display: table;
            clear: both;
          }
          .global-search {
            width: 1.6rem;
            border: 1px solid #38cbda;
            color: #fff;
            outline: none;
            background-color: rgba(8, 186, 237, 0.4);
            border-radius: 0.04rem;
            margin-right: 0.1rem;
          }
          /deep/ .el-tag {
            font-size: 0.16rem !important;
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
              border: none;
              color: #fff;
              height: 0.3rem;
              font-size: 0.14rem;
              &::placeholder {
                color: #43bafe;
              }
            }
            .el-input {
              position: relative;
            }
            .el-input__icon {
              line-height: 0.3rem;
              color: #43bafe;
            }
          }
        }
        .camera_content {
          margin: auto;
          visibility: visible;
          &.content_9 {
            width: 7.11rem;
            > div {
              float: left;
              width: 33.33%;
            }
          }
          &.content_4 {
            width: 4.74rem;
            > div {
              float: left;
              width: 50%;
            }
          }
          &.content_1 {
            width: 2.37rem;
            > div {
              float: left;
              width: 100%;
            }
          }
          &::after {
            content: '';
            display: block;
            clear: both;
          }
          .camera_mod {
            width: 2.5rem;
            text-align: center;
            > div {
              padding: 0 0.05rem;
              > div {
                overflow: hidden;
                > div {
                  text-align: center;
                  overflow: hidden;
                  width: 2.27rem;
                  height: 1.74rem;
                  > iframe {
                    width: 3.9rem;
                    height: 3rem;
                    display: block;
                    transform: scale(0.58);
                    transform-origin: 0 0;
                  }
                }
              }
              > span {
                color: #ffffff;
                width: 100%;
                font-size: 0.14rem;
                height: 0.35rem;
                line-height: 0.35rem;
                display: block;
              }
            }
          }
        }
        /* 分页 */
        /deep/ .el-pagination .btn-prev {
          background: rgba(0, 0, 0, 0);
          color: #ffffff;
          // height: 1rem;
        }
        /deep/ .el-pagination{
          margin-top:0.1rem;
        }
        /deep/ .el-pager, .el-pager li {
          color: #ffffff;
        }
        /deep/ .el-dialog, .el-pager li {
          background-color: rgba(0, 0, 0, 0) !important;
        }
        /deep/ .el-pager li.btn-quicknext{
          color:#ffffff !important;
        }
        /deep/ .el-pager li.btn-quickprev{
          color:#ffffff !important;
        }
        /deep/ .el-dialog, .el-pager li {
          background-color: rgba(0, 0, 0, 0) !important;
        }
        /deep/ .el-pagination .btn-next, .el-pagination .btn-prev {
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0) !important;
        }
        /deep/ .el-pager li{
          background-color: rgba(0, 0, 0, 0) !important;
          min-width: 32px;
          height: 26px;
          line-height: 26px;
        }
        /deep/ .el-pager li.active{
          background: #159bfd !important;
          border-radius: 4px;
          color: #ffffff !important;
        }
        /deep/ .el-input__inner:hover {
          border-color: #159bfd;
        }
        /deep/ .el-input__inner {
          color: #ffffff;
          border: 2px solid #159bfd;
          background: rgba(0, 0, 0, 0);
        }
        /deep/ .el-pagination__jump {
          color: #ffffff;
        }
        /deep/ .el-pagination__total {
          color: #ffffff;
        }
        /deep/ .el-pagination__sizes {
          display: none;
        }
        /deep/ .el-pagination {
          margin-right: 0.1rem;
          text-align: right;
          padding: 0 0.2rem;
          visibility: visible;
        }
      }
    }
  }
  .visibility {
    visibility: hidden !important;
  }

</style>
