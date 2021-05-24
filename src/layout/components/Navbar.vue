<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <span class="el-dropdown-link" style="cursor: pointer;">
          下拉菜单<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item divided @click.native="showDialog">
              修改公司展示资料
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <dialog-out
      v-model="dialogVisible"
      :dialog-data="dialogData"
      @dialogBtnClick="dialogBtnClick"
      @dialogOpen="dialogOpen"
    >
      <dialog-form
        ref="infoForm"
        :search-form-datas="dialogFormData"
        :search-form="formData"
        :rule="formRule"
      />
    </dialog-out>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dialogForm from '@/components/Form/form'
import dialogOut from '@/components/Dialog/index'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getInfo, updateInfo } from '@/api/info'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    dialogForm,
    dialogOut
  },
  data() {
    return {
      dialogVisible: false,
      dialogData: {
        headTitle: '修改公司展示资料',
        footButton: [{
          name: '确定',
          type: 'primary'
        },
        {
          name: '取消'
        }]
      },
      dialogFormData: [
        {
          label: '邮箱地址',
          type: 'input',
          prop: 'emailAddress'
        }, {
          label: '联系人',
          type: 'input',
          prop: 'contact'
        },
        {
          label: '电话',
          type: 'input',
          prop: 'telephone'
        },
        {
          label: '传真',
          type: 'input',
          prop: 'fax'
        },
        {
          label: '地址',
          type: 'input',
          prop: 'address'
        },
        {
          label: '权限信息',
          type: 'input',
          prop: 'rightsInfo'
        },
        {
          label: '备案号',
          type: 'input',
          prop: 'recordNumber'
        }, {
          label: '介绍',
          type: 'textarea',
          prop: 'introduce',
          maxlength: 1000,
          rows: 8
        }
      ],
      formData: {},
      formRule: {
        emailAddress: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], telephone: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], fax: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], address: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], rightsInfo: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], recordNumber: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ], introduce: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    showDialog() {
      this.dialogVisible = true
    },
    dialogBtnClick(name) {
      const methods = {
        '确定': () => {
          if (this.$refs.infoForm.validateForm()) {
            updateInfo(this.formData).then(() => {
              this.$message(
                { message: '修改成功',
                  type: 'success' }
              )
              this.dialogVisible = false
            })
          }
        },
        '取消': () => { this.dialogVisible = false }
      }
      methods[name]()
    },
    async dialogOpen() {
      await getInfo().then(response => {
        this.formData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    margin-right:10px;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
