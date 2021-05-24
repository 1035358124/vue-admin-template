<template>
  <div class="dialog-form">
    <el-form ref="dialogForm" :model="searchForm" size="medium" label-position="left" label-width="90px" :rules="rule">
      <el-form-item
        v-for="item in searchFormDatas"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
        class="head-form-item"
      >
        <el-input v-if="item.type === 'input'" v-model="searchForm[item.prop]" :disabled="item.disable" :placeholder="item.placeholder||'请输入'" style="width:400px;" />
        <el-input
          v-if="item.type === 'textarea'"
          v-model="searchForm[item.prop]"
          type="textarea"
          placeholder="请输入内容"
          :maxlength="item.maxlength||100"
          :rows="item.rows||3"
          show-word-limit
          style="width:400px;"
        />
        <el-input-number v-if="item.type === 'number'" v-model="searchForm[item.prop]" style="width:400px;" />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="searchForm[item.prop]"
          :placeholder="item.placeholder||'请选择'"
          style="width:400px;"
          @change="selectChange(item.prop,searchForm[item.prop])"
        >
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
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'DialogOut',
  props: {
    searchFormDatas: {
      type: Array,
      default() {
        return []
      }
    },
    searchForm: {
      type: Object,
      default() {
        return {}
      }
    },
    rule: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    searchSubmit() {
      console.log(this.searchForm)
    },
    validateForm() {
      let result = false
      this.$refs.dialogForm.validate((valid) => {
        result = valid
      })
      return result
    },
    clear() {
      this.$refs['dialogForm'].resetFields()
    },
    selectChange(name, value) {
      this.$emit('selectChange', name, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-form{
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>

