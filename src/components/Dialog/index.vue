<template>
  <el-dialog class="own-dialog" :visible.sync="dialogVisible" @close="close" @open="open">
    <div slot="title" class="dialog-headertext">{{ dialogData.headTitle || '' }}</div>
    <slot />
    <div
      v-if="dialogData.footButton && dialogData.footButton.length > 0"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        v-for="item in dialogData.footButton"
        :key="item.name"
        :type="item.type||''"
        size="small"
        @click="dialogBtnClick(item.name)"
      >{{ item.name }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogOut',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    dialogBtnClick(name) {
      this.$emit('dialogBtnClick', name)
    },
    close() {
      this.$emit('dialogClose')
    },
    open() {
      this.$emit('dialogOpen')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  border-radius: 8px;
  .el-dialog__body {
    padding: 10px;
  }
}
.el-dialog__header{
  .dialog-headertext {
    text-align: center;
    font-size:14px;
    font-weight:400;
    line-height:20px;
    color:rgba(0,0,0,1);
  }
  .el-dialog__headerbtn {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 0;
    right: -36px;
    .el-dialog__close {
      font-size: 28px;
      color: #fff;
    }
  }
}
.own-dialog {
  .el-dialog__body{
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.dialog-footer {
  text-align: center;
  .el-button {
    width: 92px;
    height: 32px;
  }
}
</style>

