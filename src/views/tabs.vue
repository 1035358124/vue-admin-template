<template>
  <div class="main">
    <form-table
      ref="formTable"
      :search-form-datas="tableForm"
      :table-button="tableButton"
      :table-column-data="tableColumnData"
      :table-data="tableData"
      :total="total"
      :button-disable="false"
      @parameterChange="parameterChange"
      @tableHeadButtonClick="tableHeadButtonClick"
      @tableButtonClick="tableButtonClick"
    />
    <dialog-out
      v-model="tabDialogVisible"
      :dialog-data="tabDialogData"
      @dialogBtnClick="dialogButtonClick"
      @dialogClose="tabDialogClose"
    >
      <dialog-form
        ref="tabForm"
        :search-form-datas="tabDialogFormData"
        :search-form="tabFormData"
        :rule="tabFormRule"
      />
    </dialog-out>
  </div>
</template>

<script>
import dialogForm from '@/components/Form/form'
import dialogOut from '@/components/Dialog/index'
import FormTable from '@/components/TreeLayout/FormTable'
import { getTab, addTab, updateTab, deleteTab } from '@/api/tab'
export default {
  name: 'Tab',
  components: { dialogOut, dialogForm, FormTable },
  data() {
    return {
      tabDialogVisible: false,
      treeData: [],
      tableButton: [{
        name: '新增',
        type: 'primary',
        disable: true
      }],
      tableForm: [
        {
          label: '名称',
          type: 'input',
          prop: 'groupName'
        }
      ],
      tableColumnData: {
        emptyText: '没数据啦!',
        noSelect: true,
        column: [{
          prop: 'tabName',
          label: '标签名'
        }, {
          prop: 'sort',
          label: '排序'
        }, {
          prop: 'carouselSort',
          label: '是否轮播图',
          formatter: {
            '0': '否',
            '1': '是'
          }
        },
        {
          prop: 'remark',
          label: '备注'
        }],
        operation: [
          {
            name: '删除',
            type: 'danger'
          },
          {
            name: '修改',
            type: 'primary'
          }]
      },
      tableData: [],
      tabDialogData: {
        headTitle: '',
        footButton: [{
          name: '确定',
          type: 'primary'
        },
        {
          name: '取消'
        }]
      },
      tabDialogType: ' ',
      tabDialogFormData: [
        {
          label: '标签名',
          type: 'input',
          prop: 'tabName'
        }, {
          label: '顺序',
          type: 'number',
          prop: 'sort'
        },
        { label: '轮播图',
          type: 'select',
          prop: 'carouselSort',
          options: [{
            label: '否',
            value: 0
          }, {
            label: '是',
            value: 1
          }]
        },
        {
          label: '备注',
          type: 'textarea',
          prop: 'remark'
        }
      ],
      searchForm: {
        groupName: null,
        sort: 0,
        homeFlag: 1,
        remark: null
      },
      formData: {},
      formRule: {
        groupName: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ]
      },
      tabSearchForm: {
        groupName: null,
        tabName: null,
        sort: 0,
        carouselSort: 0,
        remark: null
      },
      tabFormData: {

      },
      tabFormRule: {
        tabName: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ]
      },
      total: 0,
      node: {},
      initPage: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.fetchdata()
  },
  methods: {
    dialogButtonClick(name) {
      const methods = {
        '确定': () => {
          if (this.$refs.tabForm.validateForm()) {
            if (this.tabDialogType === 'add') {
              addTab(this.tabFormData).then(() => {
                this.$message(
                  { message: '添加标签成功',
                    type: 'success' }
                )
                this.tabDialogVisible = false
                this.$refs.formTable.resetPage()
                this.getTabData(this.initPage)
              })
            } else if (this.tabDialogType === 'update') {
              updateTab(this.tabFormData).then(() => {
                this.$message(
                  { message: '修改标签成功',
                    type: 'success' }
                )
                this.tabDialogVisible = false
                this.$refs.formTable.resetPage()
                this.getTabData(this.initPage)
              })
            }
          }
        },
        '取消': () => { this.tabDialogVisible = false }
      }
      methods[name]()
    },
    tableButtonClick(item, data) {
      const method = {
        '删除': () => {
          this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              'id': data.id
            }
            deleteTab(param).then(response => {
              this.$message(
                { message: '删除标签成功',
                  type: 'success' }
              )
              this.$refs.treeLayout.resetCheckedNode()
              this.$refs.formTable.resetPage()
              this.getTabData(this.initPage)
            })
          }).catch(() => {
          })
        },
        '修改': () => {
          this.tabDialogData.headTitle = '修改标签'
          this.tabFormData = data
          this.tabFormData.groupName = this.node.groupName
          this.tabDialogType = 'update'
          this.tabDialogVisible = true
        }
      }
      method[item.name]()
      console.log(data)
    },
    tabDialogClose() {
      this.resetTabSearchForm()
      this.$refs.tabForm.clear()
    },
    getTabData(data) {
      getTab(data).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
      })
    },
    resetTabSearchForm() {
      this.tabSearchForm = {
        groupName: null,
        tabName: null,
        sort: 0,
        carouselSort: 0,
        remark: null
      }
    },
    parameterChange(data) {
      this.getTabData(data)
    },
    tableHeadButtonClick(name) {
      const method = {
        '新增': () => {
          this.tabFormData = this.tabSearchForm
          this.tabFormData.groupName = this.node.groupName
          this.tabDialogVisible = true
          this.tabDialogType = 'add'
          this.tabDialogData.headTitle = '新增标签'
        }
      }
      method[name]()
    },
    fetchdata() {
      this.getTabData(this.initPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
}
</style>
