<template>
  <div class="form-table">
    <div class="table-form">
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini" label-position="left">
        <el-form-item
          v-for="item in searchFormDatas"
          :key="item.label"
          :label="item.label"
          label-width="55px"
          :prop="item.prop"
          class="head-form-item"
        >
          <el-input v-if="item.type === 'input'" v-model="searchForm[item.prop]" :placeholder="item.placeholder||'请输入'" />
          <el-select v-else-if="item.type === 'select'" v-model="searchForm[item.prop]" :placeholder="item.placeholder||'请选择'">
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="searchForm[item.prop]"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item class="fromButtons">
          <el-button type="primary" size="mini" @click="searchSubmit">搜索</el-button>
          <el-button type="primary" size="mini" @click="resetSubmit">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="center">
      <div class="table-button">
        <el-button
          v-for="(item) in tableButton"
          v-show="item.hidden != true || tableChecked.length > 0"
          :key="item.name"
          :disabled="item.disable && buttonDisable"
          size="mini"
          :type="item.type||'primary'"
          @click="tableHeadButtonClick(item.name)"
        >
          {{ item.name }}
        </el-button>
      </div>
      <div class="table">
        <el-table
          ref="table"
          :data="tableData"
          :empty-text="tableColumnData.emptyText || '暂无数据'"
          height="calc(100vh - 268px)"
          size="small"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          @selection-change="tableSelectionChange"
        >
          <el-table-column
            v-if="!tableColumnData.noSelect"
            fixed="left"
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column fixed="left" label="序号" width="50" type="index" align="center" />
          <el-table-column
            v-for="item in tableColumnData.column"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            align="center"
            :show-overflow-tooltip="item.hiddenOverflow?false: true"
          >
            <template slot-scope="scope">
              <slot v-if="item.formatter" name="tableColum" :row="scope.row" :column="item">{{ item.formatter[scope.row[item.prop]] }}</slot>
              <slot v-else name="tableColum" :row="scope.row" :column="item">{{ scope.row[item.prop] }}</slot>
            </template>
          </el-table-column>
          <el-table-column
            v-if="tableColumnData.operation && tableColumnData.operation.length > 0"
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope" class="buttonColumn">
              <el-button
                v-for=" item in tableColumnData.operation"
                :key="item.name"
                size="mini"
                :type="item.type||'primary'"
                @click="tableButtonClick(item,scope.row)"
              >{{ item.name }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        background
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        :total="total"
        :page-sizes="[5, 10, 30,]"
        layout="prev, pager, next, total, sizes"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'FormTable',
  props: {
    searchFormDatas: {
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
    },
    buttonDisable: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      searchForm: {},
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableChecked: []
    }
  },
  mounted() {
  },
  methods: {
    searchSubmit() {
      this.searchForm.pageNum = this.page.pageNum
      this.searchForm.pageSize = this.page.pageSize
      this.$emit('parameterChange', this.searchForm)
    },
    resetSubmit() {
      this.constructRequestData()
      this.$refs.searchForm.resetFields()
    },
    tableHeadButtonClick(name) {
      this.$emit('tableHeadButtonClick', name)
    },
    tableButtonClick(item, scope) {
      this.$emit('tableButtonClick', item, scope)
    },
    tableSelectionChange(val) {
      this.tableChecked = val
      this.$emit('tableSelectionChange', val)
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.constructRequestData()
      this.$emit('parameterChange', this.searchForm)
    },
    currentChange(val) {
      this.page.pageNum = val
      this.constructRequestData()
      this.$emit('parameterChange', this.searchForm)
    },
    constructRequestData() {
      this.searchForm.pageNum = this.page.pageNum
      this.searchForm.pageSize = this.page.pageSize
    },
    resetPage() {
      this.page = {
        pageNum: 1,
        pageSize: 10
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table{
  height: 100%;
  width: calc(100% - 20px);
  background-color: #FFF;
  margin-left: 20px;
  padding: 20px 20px;
  .center{
    height: calc(100% - 47px - 32px);
  }

  .footer{
    float: right;
  }
}
</style>
