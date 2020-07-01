<template>
  <div class="wrapper">
    <div class="tree">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <div class="tree-wrapper">
        <el-tree
          class="tree-content"
          ref="tree"
          :data="dataType"
          show-checkbox
          :node-key="defaultProps.key"
          :props="defaultProps"
          @check="handleCheckChange"
        ></el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { getMonitorCamera } from 'api/warning/warning'
import { debounce } from 'common/js/util'

export default {
  data() {
    return {
      appendBody: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'key'
      },
      search: '',
      dataType: []
    }
  },
  created() {
    this.$watch('search', debounce((newQuery) => {
      this.initData()
    }, 200))
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getMonitorCamera().then((res) => {
        this.dataType = res
      })
    },
    handleCheckChange(data) {
    },
    handleCurrentChange(value) {
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
    top: 0;
    .tree {
      padding: 0.1rem 0;
      border-radius: 0.04rem;
      border: 0.01rem solid #38cbda;
      background: rgba(8, 26, 68, 0.8);
      .tree-wrapper {
        height: 2rem;
        width: 4rem;
        overflow: auto;
        .tree-content {
          width: 100%;
        }
      }
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
  }

</style>
