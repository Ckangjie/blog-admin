<template>
  <div class="category-Box">
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择父级" prop="parent_id">
          <el-select
            v-model="ruleForm.parent_id"
            clearable
            placeholder="默认为顶层父级"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addCategory, getCategoryList } from "@/api/article";
export default {
  data() {
    return {
      options: [],
      dialogVisible: false,
      ruleForm: {
        parent_id: "",
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose(done) {
      done();
      this.resetForm();
    },
    getCategoryList() {
      getCategoryList({ id: "0" }).then((res) => {
        res.data.forEach((item) => {
          this.options.push(item);
        });
      });
    },
    showDialog(item) {
      if (item) {
        item.parent_id =
          item.parent_id === 0 ? "默认为顶层父级" : item.parent_id;
        this.ruleForm = item;
      }
      this.dialogVisible = true;
      // 请求前清空  防止key 重复
      this.options = [];
      this.getCategoryList();
    },
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const objData = this.ruleForm;
          objData.parent_id =
            typeof objData.parent_id !== "number" ? 0 : objData.parent_id;
          addCategory(objData).then((res) => {
            this.resetForm();
          });
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
</style>