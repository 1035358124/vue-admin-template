<template>
  <div class="container">
    <div class="head-form">
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini" label-position="left">
        <el-form-item
          v-for="item in searchFormDatas"
          :key="item.label"
          :label="item.label"
          label-width="75px"
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
            value-format="yyyy-MM-dd"
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
      <div class="head-button">
        <el-button size="small" type="primary" @click="dialogShow">新增图片</el-button>
      </div>
    </div>
    <div class="image-wrapper">
      <div class="image-ul">
        <viewer>
          <div v-for="(item, index) in imageData" :key="index" class="image-li">
            <img :src="item.url" class="image" style="cursor: Pointer;" @click="imageClick(item)">
            <span class="title">{{ item.describeInfo }}</span>
          </div>
        </viewer>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.pageSize"
          class="pagination"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <dialog-out
      v-model="uploadDialogVisible"
      :dialog-data="dialogData"
      @dialogBtnClick="dialogBtnClick"
      @dialogClose="imageDialogClose"
    >
      <el-upload
        ref="upload"
        action="#"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :multiple="true"
        :limit="20"
        :auto-upload="false"
        :on-exceed="handleExceed"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </dialog-out>
    <dialog-out
      v-model="dialogVisible"
      :dialog-data="dialogInfo"
      @dialogBtnClick="dialogFormBtnClick"
      @dialogClose="dialogClose"
    >
      <div style="text-align:center;margin-bottom:20px;">
        <img :src="formData.url" style="width:100%;height:100%; object-fit: cover;">
      </div>
      <dialog-form
        ref="imageForm"
        :search-form-datas="dialogFormData"
        :search-form="formData"
        :rule="formRule"
      />
    </dialog-out>
  </div>
</template>

<script>
import { batchUpload, getImage, updateImage, deleteImage } from '@/api/image'
import dialogOut from '@/components/Dialog/index'
import dialogForm from '@/components/Form/form'
export default {
  components: { dialogOut, dialogForm },
  props: {},
  data() {
    return {
      dialogImageUrl: '',
      uploadDialogVisible: false,
      dialogVisible: false,
      fileList: [],
      dialogData: {
        headTitle: '上传图片',
        footButton: [{
          name: '确认上传',
          type: 'primary'
        },
        {
          name: '取消'
        }]
      },
      searchFormDatas: [{
        label: '描述',
        type: 'input',
        prop: 'describe'
      }, {
        label: '备注',
        type: 'input',
        prop: 'remark'
      }, {
        label: '上传日期',
        type: 'date',
        prop: 'createTime'
      }],
      searchForm: {
        describe: null,
        createTime: [],
        pageNum: 1,
        pageSize: 10
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      imageData: [],
      dialogFormData: [
        {
          label: '描述',
          type: 'input',
          prop: 'describeInfo'
        }, {
          label: '顺序',
          type: 'number',
          prop: 'sort'
        },
        {
          label: '备注',
          type: 'textarea',
          prop: 'remark'
        }
      ],
      formData: {},
      formRule: {
        describeInfo: [
          { required: true, message: '请输入组名称', trigger: 'blur' }]
      },
      dialogInfo: {
        headTitle: '修改图片信息',
        footButton: [{
          name: '确定',
          type: 'primary'
        },
        {
          name: '删除',
          type: 'danger'
        },
        {
          name: '取消'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.fetchData()
  },
  methods: {
    submitUpload() {

    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange(file, fileList) {
      console.log(fileList)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    dialogBtnClick(name) {
      const methods = {
        '确认上传': () => {
          var formData = new FormData()
          for (const index in this.fileList) {
            formData.append('file', this.fileList[index].raw)
          }
          batchUpload(formData).then(() => {
            this.$message({
              message: '图片上传成功',
              type: 'success'
            })
            this.uploadDialogVisible = false
            this.searchForm.pageNum = 1
            this.freshImage()
          })
        },
        '取消': () => { this.uploadDialogVisible = false }
      }
      methods[name]()
    },
    dialogFormBtnClick(name) {
      const methods = {
        '确定': () => {
          updateImage(this.formData).then(() => {
            this.$message({
              type: 'success',
              message: '编辑图片成功!'
            })
            this.dialogVisible = false
            this.freshImage()
          })
        },
        '删除': () => {
          this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteImage(this.formData).then(response => {
              this.$message(
                { message: '删除图片成功',
                  type: 'success' }
              )
              this.dialogVisible = false
              this.searchForm.pageNum = 1
              this.freshImage()
            })
          }).catch(() => {
          })
        },
        '取消': () => { this.dialogVisible = false }
      }
      methods[name]()
    },
    searchSubmit() {
      console.log(this.searchForm)
      this.searchForm.begin = this.searchForm.createTime[0]
      this.searchForm.end = this.searchForm.createTime[1]
      this.freshImage()
    },
    resetSubmit() {
      this.$refs.searchForm.resetFields()
    },
    dialogShow() {
      this.uploadDialogVisible = true
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.freshImage()
    },
    fetchData() {
      this.freshImage()
    },
    freshImage() {
      getImage(this.searchForm).then(response => {
        this.imageData = response.data.list
        this.page.total = response.data.total
      })
    },
    imageClick(data) {
      this.dialogVisible = true
      this.formData = Object.assign({}, data)
    },
    dialogClose() {
      this.formData = {}
    },
    imageDialogClose() {
      this.$refs.upload.clearFiles()
      this.fileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  background-color: #fff;
  height: 100%;
  width: 100%;
  padding: 20px;
  .image-wrapper {
    height: calc(100% - 100px);
    margin-top: 20px ;
    width:100%;
    .image-ul{
      height: calc(100% - 32px);
      display: inline-block;
      width: 100%;
      .image-li{
        display: inline-block;
        padding-right: 20px;
        text-align: center;
        .image{
          width:278px;
          height:278px;
        }
        .title{
          display: block;
          margin-bottom: 20px;
          margin-top: 10px;
          font-size: 14px;
        }
      }
    }
    .pagination-wrapper {
      width: 100%;
      padding: 0px 0px 20px 0px;
      .pagination{
        text-align: center;
      }
      >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: var(--buttonColor);
        color: #FFF;
      }
    }
  }
}
</style>
