<template>
  <div class="content">
    <div class="left-part">
      <div class="head-button">
        <el-button
          v-for="(item) in headButton"
          v-show="checkedId || item.show"
          :key="item.name"
          size="mini"
          :type="item.type"
          @click="headButtonClick(item.name)"
        >
          {{ item.name }}
        </el-button>
      </div>
      <el-tree
        ref="treeForm"
        :indent="0"
        node-key="id"
        :check-strictly="true"
        :data="treeData"
        :show-checkbox="defaultProps.show"
        :props="defaultProps"
        class="tree"
        highlight-current
        @node-click="nodeClick"
        @check="handleCheckChangeArea"
      />
    </div>
    <div class="right-part">
      <form-table
        :search-form-datas="tableForm"
        :table-button="tableButton"
        :table-column-data="tableColumnData"
        :table-data="tableData"
        :total="total"
        :button-disable="buttonDisable"
        @parameterChange="parameterChange"
        @tableHeadButtonClick="tableHeadButtonClick"
        @tableButtonClick="tableButtonClick"
        @tableSelectionChange="tableSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import FormTable from './FormTable'
export default {
  name: 'TreeLayout',
  components: { FormTable },
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'chilrden',
          label: 'label'
        }
      }
    },
    headButton: {
      type: Array,
      default() {
        return []
      }
    },
    tableForm: {
      type: Array,
      default() {
        return []
      }
    },
    tableButton: {
      type: Array,
      default() {
        return []
      }
    },
    tableColumnData: {
      type: Object,
      default() {
        return {}
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      checkedId: null,
      buttonDisable: true
    }
  },
  methods: {
    nodeClick(data) {
      this.buttonDisable = false
      this.$emit('nodeClick', data)
    },
    headButtonClick(name) {
      this.$emit('treeButtonClick', name)
    },
    // 当复选框被点击的时候触发
    handleCheckChangeArea(data) {
      var labvalojb = data // 暂存选中节点
      if (this.checkedId === data.id) {
        this.checkedId = null
        this.$refs.treeForm.setCheckedKeys([]) // 删除所有选中节点
      } else {
        this.checkedId = data.id
        this.$refs.treeForm.setCheckedKeys([])
        this.$refs.treeForm.setCheckedNodes([labvalojb]) // 选中已选中节点
      }null
      this.$emit('checkedNode', data)
    },
    resetCheckedNode() {
      this.checkedId = null
      this.$refs.treeForm.setCheckedKeys([])
    },
    tableHeadButtonClick(name) {
      this.$emit('tableHeadButtonClick', name)
    },
    parameterChange(data) {
      this.$emit('parameterChange', data)
    },
    tableButtonClick(item, scope) {
      this.$emit('tableButtonClick', item.name, scope)
    },
    tableSelectionChange(val) {
      this.$emit('tableSelectionChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: 100%;
  display: flex;
  .left-part{
    height: 100%;
    width: 25%;
    padding: 10px;
    background-color: #FFF;
    .head-button{
      margin: 10px 22px;
    }
  }
  .right-part{
    width: 75%;
  }
}
</style>
