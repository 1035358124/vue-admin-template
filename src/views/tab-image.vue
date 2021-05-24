<template>
  <div class="main">
    <tree-layout
      ref="treeLayout"
      :tree-data="treeData"
      :default-props="defaultProps"
      :table-form="tableForm"
      :table-button="tableButton"
      :table-column-data="tableColumnData"
      :table-data="tableData"
      :total="total"
      @checkedNode="checkedNode"
      @nodeClick="nodeClick"
      @parameterChange="parameterChange"
      @tableButtonClick="tableButtonClick"
      @tableHeadButtonClick="tableHeadButtonClick"
      @tableSelectionChange="tableSelectionChange"
    />

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
        @selectChange="selectChange"
      />
      <div style="text-align:center;margin-bottom:20px;">
        <img v-if="imageShow" :src="tabFormData.url" style="width:100%;height:100%; object-fit: cover;">
      </div>
    </dialog-out>
    <dialog-out
      v-model="imageVisible"
      :dialog-data="imageDialogData"
      @dialogBtnClick="imageBtnClick"
    >
      <div style="text-align:center;">
        <img :src="dialogImageUrl" alt="" style="width:100%;height:100%; object-fit: cover;">
      </div>
    </dialog-out>
  </div>
</template>

<script>
import treeLayout from '@/components/TreeLayout/index'
import dialogForm from '@/components/Form/form'
import dialogOut from '@/components/Dialog/index'
import { getWithoutPage, getTabImage, getImageByTabId, addTabImage, deleteTabImage } from '@/api/tab'
export default {
  name: 'Group',
  components: { treeLayout, dialogOut, dialogForm },
  data() {
    return {
      tabDialogVisible: false,
      imageVisible: false,
      imageShow: false,
      treeData: [],
      dialogImageUrl: '',
      tableChecked: [],
      defaultProps: {
        children: 'children',
        label: 'tabName',
        show: false
      },
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
          label: '备注',
          type: 'input',
          prop: 'remark'
        }
      ],
      tableColumnData: {
        emptyText: '暂无数据',
        noSelect: false,
        column: [{
          prop: 'remark',
          label: '备注'
        }, {
          prop: 'describeInfo',
          label: '描述'
        }, {
          prop: 'url',
          label: '图片路径'
        },
        {
          prop: 'createTime',
          label: '创建日期'
        }],
        operation: [
          {
            name: '查看图片',
            type: 'primary'
          }
        ]
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
      imageDialogData: {
        headTitle: '查看图片',
        footButton: [{
          name: '确定',
          type: 'primary'
        }]
      },
      dialogType: '',
      tabDialogType: ' ',
      tabDialogFormData: [
        { label: '标签名',
          type: 'input',
          prop: 'tabName',
          disable: true
        },
        { label: '图片',
          type: 'select',
          prop: 'imageId',
          options: []
        }
      ],
      searchForm: {
        groupName: null,
        sort: 0,
        homeFlag: 1,
        remark: null
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
          { imageId: true, message: '请选择标签', trigger: 'change' }
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
    dialogBtnClick(name) {
      const methods = {
        '确定': () => {
          if (this.$refs.groupForm.validateForm()) {
            if (this.dialogType === 'add') {
              (this.formData).then(() => {
                this.$message(
                  { message: '添加组成功',
                    type: 'success' }
                )
                this.dialogVisible = false
                this.getGroupData()
              })
            } else if (this.dialogType === 'update') {
              (this.formData).then(() => {
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
              'tabId': this.node.id,
              'imageId': this.tabFormData.imageId
            }
            addTabImage(param).then(() => {
              this.$message(
                { message: '标签添加图片成功',
                  type: 'success' }
              )
              this.tabDialogVisible = false
              this.getImageData(this.initPage)
            })
          }
        },
        '取消': () => { this.tabDialogVisible = false }
      }
      methods[name]()
    },
    fetchdata() {
      this.getTabData()
    },
    getTabData() {
      getWithoutPage().then(response => {
        this.treeData = response.data
      })
    },
    tabDialogClose() {
      this.imageShow = false
      this.$refs.tabForm.clear()
    },
    getImageData(data) {
      const param = data
      param.id = this.node.id
      getTabImage(data).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
      })
    },
    checkedNode(node) {
      this.searchForm = node
    },
    nodeClick(data) {
      this.node = data
      this.getImageData(this.initPage)
    },
    parameterChange(data) {
      this.getImageData(data)
    },
    tableHeadButtonClick(name) {
      const method = {
        '新增': () => {
          this.tabFormData = this.tabSearchForm
          this.tabFormData.tabName = this.node.tabName
          this.tabDialogVisible = true
          this.tabDialogType = 'add'
          this.tabDialogData.headTitle = '添加标签下的图片'
        },
        '删除': () => {
          this.$confirm('此操作将删除该标签中的图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              'imageIdList': this.tableChecked
            }
            deleteTabImage(param).then(() => {
              this.$message(
                { message: '删除标签中的图片成功',
                  type: 'success' }
              )
              this.getImageData(this.initPage)
            })
          }).catch(() => {
          })
        }
      }
      method[name]()
    },
    tabDialogOpen() {
      const param = {
        'id': this.node.id
      }
      getImageByTabId(param).then(reponse => {
        const data = reponse.data
        const info = []
        data.forEach(element => {
          const t = {
            label: element.remark,
            value: element.id,
            url: element.url
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
    },
    selectChange(name, value) {
      if (name === 'imageId') {
        this.imageShow = false
        this.tabDialogFormData[1].options.forEach(element => {
          if (element.value === value) {
            this.imageShow = true
          }
        })
      }
    },
    tableButtonClick(item, data) {
      this.dialogImageUrl = data.url
      this.imageVisible = true
    },
    imageBtnClick() {
      this.imageVisible = false
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
