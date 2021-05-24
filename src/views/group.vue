<template>
  <div class="main">
    <tree-layout
      ref="treeLayout"
      :tree-data="treeData"
      :default-props="defaultProps"
      :head-button="headButton"
      :table-form="tableForm"
      :table-button="tableButton"
      :table-column-data="tableColumnData"
      :table-data="tableData"
      :total="total"
      @treeButtonClick="treeButtonClick"
      @checkedNode="checkedNode"
      @nodeClick="nodeClick"
      @parameterChange="parameterChange"
      @tableHeadButtonClick="tableHeadButtonClick"
      @tableButtonClick="tableButtonClick"
      @tableSelectionChange="tableSelectionChange"
    />
    <dialog-out
      v-model="dialogVisible"
      :dialog-data="dialogData"
      @dialogBtnClick="dialogBtnClick"
      @dialogClose="dialogClose"
    >
      <dialog-form
        ref="groupForm"
        :search-form-datas="dialogFormData"
        :search-form="formData"
        :rule="formRule"
      />
    </dialog-out>

    <dialog-out
      v-model="tabDialogVisible"
      :dialog-data="tabDialogData"
      @dialogBtnClick="tabDialogBtnClick"
      @dialogClose="tabDialogClose"
      @dialogOpen="tabDialogOpen"
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
import treeLayout from '@/components/TreeLayout/index'
import dialogForm from '@/components/Form/form'
import dialogOut from '@/components/Dialog/index'
import { getGroup, addGroup, updateGroup, deleteGroup, getGroupNotTab, addGroupTab, getGroupTab, deleteGroupTab } from '@/api/group'
export default {
  name: 'Group',
  components: { treeLayout, dialogOut, dialogForm },
  data() {
    return {
      dialogVisible: false,
      tabDialogVisible: false,
      treeData: [],
      tableChecked: [],
      defaultProps: {
        children: 'children',
        label: 'groupName',
        show: true
      },
      headButton: [{
        name: '新增',
        type: 'primary',
        show: true
      }, {
        name: '修改',
        type: 'warning'
      }, {
        name: '删除',
        type: 'danger'
      }],
      tableButton: [{
        name: '新增',
        type: 'primary',
        disable: true
      }, {
        name: '删除',
        type: 'danger',
        hidden: true
      }],
      tableForm: [
        {
          label: '标签名',
          type: 'input',
          prop: 'tabName'
        }
      ],
      tableColumnData: {
        emptyText: '暂无数据',
        noSelect: false,
        column: [{
          prop: 'tabName',
          label: '标签名'
        }, {
          prop: 'sort',
          label: '排序'
        }, {
          prop: 'carouselSort',
          label: '是否轮播图'
        },
        {
          prop: 'remark',
          label: '备注'
        }]
      },
      tableData: [],
      dialogData: {
        headTitle: '',
        footButton: [{
          name: '确定',
          type: 'primary'
        },
        {
          name: '取消'
        }]
      },
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
      dialogType: '',
      tabDialogType: ' ',
      dialogFormData: [
        {
          label: '组名',
          type: 'input',
          prop: 'groupName'
        }, {
          label: '顺序',
          type: 'number',
          prop: 'sort'
        },
        { label: '页面',
          type: 'select',
          prop: 'homeFlag',
          options: [{
            label: '主页',
            value: 1
          }, {
            label: '口罩',
            value: 2
          }, {
            label: '手套',
            value: 3
          }, {
            label: '针管',
            value: 4
          }]
        },
        {
          label: '备注',
          type: 'textarea',
          prop: 'remark'
        }
      ],
      tabDialogFormData: [
        { label: '组名',
          type: 'input',
          prop: 'groupName',
          disable: true
        },
        { label: '标签',
          type: 'select',
          prop: 'tabId',
          options: []
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
        tabId: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ]
      },
      total: 0,
      node: {},
      initPage: {
        'pageNum': 1,
        'pageSize': 10
      }
    }
  },
  mounted() {
    this.fetchdata()
  },
  methods: {
    treeButtonClick(name) {
      const methods = {
        '新增': () => {
          this.dialogData.headTitle = '新增组'
          this.formData = this.searchForm
          this.dialogType = 'add'
          this.resetSearchForm()
          this.dialogVisible = true
        },
        '删除': () => {
          this.$confirm('此操作将删除该组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteGroup(this.formData).then(response => {
              this.$message(
                { message: '删除组成功',
                  type: 'success' }
              )
              this.$refs.treeLayout.resetCheckedNode()
              this.resetSearchForm()
              this.getGroupData()
            })
          }).catch(() => {
          })
        },
        '修改': () => {
          this.dialogData.headTitle = '修改组'
          this.formData = this.searchForm
          this.dialogType = 'update'
          this.dialogVisible = true
        }
      }
      methods[name]()
    },
    dialogBtnClick(name) {
      const methods = {
        '确定': () => {
          if (this.$refs.groupForm.validateForm()) {
            if (this.dialogType === 'add') {
              addGroup(this.formData).then(() => {
                this.$message(
                  { message: '添加组成功',
                    type: 'success' }
                )
                this.dialogVisible = false
                this.getGroupData()
              })
            } else if (this.dialogType === 'update') {
              updateGroup(this.formData).then(() => {
                this.$message(
                  { message: '修改组成功',
                    type: 'success' }
                )
                this.dialogVisible = false
                this.getGroupData()
              })
            }
          }
        },
        '取消': () => { this.dialogVisible = false }
      }
      methods[name]()
    },
    tabDialogBtnClick(name) {
      const methods = {
        '确定': () => {
          if (this.$refs.tabForm.validateForm()) {
            const param = {
              'groupId': this.node.id,
              'tabId': this.tabFormData.tabId
            }
            addGroupTab(param).then(() => {
              this.$message(
                { message: '标签挂接组成功',
                  type: 'success' }
              )
              this.tabDialogVisible = false
              this.getTabData(this.initPage)
            })
          }
        },
        '取消': () => { this.tabDialogVisible = false }
      }
      methods[name]()
    },
    fetchdata() {
      this.getGroupData()
    },
    dialogClose() {
      this.resetSearchForm()
      this.$refs.groupForm.clear()
    },
    tabDialogClose() {
      this.resetTabSearchForm()
      this.$refs.tabForm.clear()
    },
    getGroupData() {
      getGroup().then(response => {
        this.treeData = response.data
      })
    },
    getTabData(data) {
      const param = data
      param.id = this.node.id
      getGroupTab(data).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
      })
    },
    checkedNode(node) {
      this.searchForm = node
    },
    resetSearchForm() {
      this.formData = {
        groupName: null,
        sort: 0,
        homeFlag: 1,
        remark: null
      }
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
    nodeClick(data) {
      this.node = data
      this.getTabData(this.initPage)
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
        },
        '删除': () => {
          this.$confirm('此操作将删除该组中选中的标签, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              'recordIdList': this.tableChecked
            }
            deleteGroupTab(param).then(() => {
              this.$message(
                { message: '删除组内标签成功',
                  type: 'success' }
              )
              this.getTabData(this.initPage)
            })
          }).catch(() => {
          })
        }
      }
      method[name]()
    },
    tableButtonClick(item, data) {
      const method = {
        '删除': () => {
          this.$confirm('此操作将删除该组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              'id': data.id
            }
            deleteGroup(param).then(response => {
              this.$message(
                { message: '删除组成功',
                  type: 'success' }
              )
              this.$refs.treeLayout.resetCheckedNode()
              this.resetSearchForm()
              this.getGroupData()
            })
          }).catch(() => {
          })
        },
        '修改': () => {
          this.dialogData.headTitle = '修改组'
          this.formData = data
          this.dialogType = 'update'
          this.dialogVisible = true
        }
      }
      method[item]()
      console.log(data)
    },
    tabDialogOpen() {
      const param = {
        'id': this.node.id
      }
      getGroupNotTab(param).then(reponse => {
        const data = reponse.data
        const info = []
        data.forEach(element => {
          const t = {
            label: element.tabName,
            value: element.tabId
          }
          info.push(t)
        })
        this.tabDialogFormData[1].options = info
      })
    },
    tableSelectionChange(val) {
      const idList = []
      val.forEach(element => {
        idList.push(element.id)
      })
      this.tableChecked = idList
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
