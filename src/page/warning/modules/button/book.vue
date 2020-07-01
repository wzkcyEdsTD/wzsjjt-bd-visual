<template>
  <div class="tree">
    <div ref="acp">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        :node-key="defaultProps.key"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check="treeHandleCheckChange"
      ></el-tree>
      <div class="close" @click.stop="close"></div>
    </div>
  </div>
</template>
<script>
import { getRoleMonitorCategory } from 'api/warning/warning'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      data: [
        // {
        //   key: 1,
        //   name: '雨情监测',
        //   alias: 'yuqingjiance',
        //   url: 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data',
        //   icon: './static/gitimage/3d/yuqingjiance.png',
        //   datasetname: 'pg_wzyjdb:rain_stabasicatt',
        //   sql: 'SMID >= 0',
        //   geotype: 'point',
        //   mapPopName: ['名称', '地区', '地点'], // 地图pop提示框名称
        //   mapPopField: ['NAME', 'DISTRICT', 'STLC'] // 地图pop提示框字段
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'key'
      }
    }
  },
  computed: {
    ...mapGetters('warning', [
      'currentMonitorType'
    ])
  },
  mounted() {
    this.initData()
  },
  watch: {
    currentMonitorType(val) {
      const list = this.data.filter(val => {
        return val.name === '两客一危监测货车' || val.name === '两客一危监测客车'
      })
      if (this.currentMonitorType.from !== 'list') {
        const key = this.currentMonitorType.key
        let checkedKeysArr = this.$refs.tree.getCheckedKeys()
        if (this.currentMonitorType.checked) {
          if (val.from === 'liangkeyiweijiance' || val.alias === 'liangkeyiweijiance_kc' || val.alias === 'liangkeyiweijiance_hc') {
            checkedKeysArr.push(list[0].key)
            checkedKeysArr.push(list[1].key)
          } else {
            checkedKeysArr.push(key)
          }
        } else {
          if (val.from === 'liangkeyiweijiance' || val.alias === 'liangkeyiweijiance_kc' || val.alias === 'liangkeyiweijiance_hc') {
            checkedKeysArr.push(list[0].key)
            checkedKeysArr.push(list[1].key)
            checkedKeysArr = checkedKeysArr.filter((item) => {
              return item !== list[0].key && item !== list[1].key
            })
          } else {
            checkedKeysArr = checkedKeysArr.filter((item) => {
              return item !== key
            })
          }
        }
        console.log('setCheckedKeys15')
        this.$refs.tree.setCheckedKeys(checkedKeysArr)
      }
    }
  },
  methods: {
    // tree值的改变
    treeHandleCheckChange(data) {
      this.handleCheckChange(data)
    },
    handleCheckChange(data, bool) {
      const checkedKeysArr = this.$refs.tree.getCheckedKeys()
      const key = data.key
      const obj = JSON.parse(JSON.stringify(data))
      obj.checked = bool ? true : checkedKeysArr.indexOf(key) !== -1
      obj.from = bool ? 'special' : 'list'
      obj.allData = this.$refs.tree.getCheckedNodes()
      if (obj.alias !== 'shuikushuiqingjiance') {
        this.SetCurrentMonitorType(obj)
      }
    },
    initData() {
      getRoleMonitorCategory().then((data) => {
        this.data = data
        this.SetMonitorType(data)
        // this.$refs.tree.setCheckedKeys(['4bc0f69a199c023ff1fe743ccff776b9'])
      })
    },
    getTreeCheckNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    close() {
      this.$emit('close', -1)
    },
    chooseMenu(data) {
      let item = this.data.filter((item) => {
        return item.alias === data.alias
      })
      if (data.alias === 'liangkeyiweijiance') {
        item = this.data.filter((val) => {
          return val.name === '两客一危监测货车' || val.name === '两客一危监测客车'
        })
      }
      if (data.alias === 'liangkeyiweijiance') {
        item = item.map(val => {
          val.checked = true
          val.from = 'liangkeyiweijiance'
          return val
        })
        this.SetCurrentMonitorTypeArr(item)
      } else if (item[0]) {
        this.handleCheckChange(item[0], true)
      }
      // if (item[1]) this.handleCheckChange(item[1], true)
    },
    ...mapActions('warning', [
      'SetMonitorType',
      'SetCurrentMonitorTypeArr',
      'SetCurrentMonitorType'
    ])
  }
}
</script>
<style scoped lang="less">
  .tree {
    position: absolute;
    left: 0.45rem;
    top: 0;
    width: 2.1rem;
    padding: 0.1rem 0;
    border-radius: 0.04rem;
    border: 0.01rem solid #38cbda;
    background: rgba(8, 26, 68, 0.8);
    .close {
      color: #ffffff;
      font-size: 0.14rem;
      position: absolute;
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
  }
  /* 树 */
  /deep/ .el-tree {
    background: transparent;
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover {
    background-color: rgba(27, 147, 254, 0.4);
    background: transparent;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba(27, 147, 254, 0.4) !important;
    background: transparent !important;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    .bg-image('images/btn_checked');
    border: none;
  }
  /deep/ .el-checkbox__inner {
    .bg-image('images/btn_kong');
    border: none;
  }
  /deep/ .el-checkbox__inner::after {
    /*display: none;*/
  }
  /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    .bg-image('images/btn_zhankai');
    background-size: 0.14rem 0.14rem;
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-icon-caret-right:before {
    visibility: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    .bg-image('images/btn_shouqi');
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
  }
  /deep/ .custom-tree-node span {
    font-size: 0.16rem;
  }
  /deep/ .el-tree-node__content {
    height: 0.3rem;
  }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border: none;
    .bg-image('images/btn_have');
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
    /*display: none;*/
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
</style>
