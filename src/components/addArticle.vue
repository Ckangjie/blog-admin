<template>
  <div class="app-container">
    <el-row class="toolBar" :gutter="20">
      <el-col :md="22" class="title">
        <el-input placeholder="请输入标题" v-model="title"></el-input
      ></el-col>
      <el-col :md="2"
        ><el-button class="submit" @click="submitData">发布</el-button>
      </el-col>
    </el-row>
    <v-md-editor
      v-model="text"
      height="600px"
      mode="editable"
      :placeholder="placeholder"
      @save="save"
      :disabled-menus="[]"
      :value="markdown"
      @upload-image="handleUploadImage"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | image code | tip | emoji | save"
      :include-level="[3, 4]"
    ></v-md-editor>
    <el-dialog
      title="发布文章"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
      class="dialog-box"
    >
      <div class="article-class-box">
        <span>文章分类:</span>
        <div class="article-class-list">
          <div>
            <el-tag
              :disable-transitions="false"
              closable
              @close="handleClose('class', 'class')"
            >
              {{ checkedCities.length === 0 ? "选择分类" : category[0] }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputClassVisible"
              v-model="inputClassValue"
              ref="saveClassInput"
              size="small"
              @keyup.enter.native="handleClassInputConfirm"
              @blur="handleClassInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showClassInput()"
              >+ New Tag</el-button
            >
          </div>
          <div class="class-item">
            <template>
              <el-radio-group
                v-model="radio"
                @change="handleCheckedCitiesChange"
              >
                <el-radio v-for="city in listClass" :label="city" :key="city">{{
                  city
                }}</el-radio>
              </el-radio-group>
            </template>
          </div>
        </div>
      </div>
      <div class="skilltags-box">
        <span>文章标签:</span>
        <div class="skilltag-list">
          <div>
            <el-tag v-if="SelectTags.length === 0">选择标签</el-tag>
            <el-tag
              :key="tag"
              v-for="tag in SelectTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, 'tag')"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ New Tag</el-button
            >
            <div class="skilltag-item">
              <template>
                <el-checkbox-group
                  v-model="checkedTag"
                  @change="handleCheckedTagChange"
                >
                  <el-checkbox v-for="city in tags" :label="city" :key="city">{{
                    city
                  }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  handleUploadFile,
  saveArticle,
  details,
  articleEdit,
  getCategoryList,
} from "@/api/article";

import axios from "axios";
export default {
  data() {
    return {
      markdown: "### 标题",
      dialogVisible: false,
      title: "",
      text: "",
      htmlText: "",
      placeholder: "请输入内容",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      inputClassVisible: false,
      inputClassValue: "",
      radio: null,
      tags: [],
      SelectTags: [],
      listClass: [],
      checkedCities: [],
      checkedTag: [],
    };
  },
  computed: {
    category: function () {
      return this.checkedCities;
    },
  },
  methods: {
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    // 标签选框
    handleCheckedTagChange(value) {
      let checkedCount = value.length;
      checkedCount > 0 && checkedCount < this.tags.length;
      this.SelectTags = value;
    },
    // 文章选框
    handleCheckedCitiesChange(value) {
      this.checkedCities.splice(0, 1);
      this.checkedCities.push(value);
    },
    // 关闭标签
    handleClose(tag, value) {
      value === "tag"
        ? this.SelectTags.splice(this.SelectTags.indexOf(tag), 1)
        : this.checkedCities.splice(0, 1);
    },
    // 显示input框
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 显示input框
    showClassInput() {
      this.inputClassVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveClassInput.$refs.input.focus();
      });
    },
    // input 失焦事件
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.SelectTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // input 失焦事件
    handleClassInputConfirm() {
      this.checkedCities.splice(0, 1);
      let inputValue = this.inputClassValue;
      if (inputValue) {
        this.checkedCities.push(inputValue);
      }
      this.inputClassVisible = false;
      this.inputClassValue = "";
    },
    submit() {
      const submitObj = {};
      submitObj.title = this.title;
      submitObj.content = this.text;
      submitObj.htmlCon = this.htmlText;
      submitObj.category = this.category[0];
      submitObj.author = "adminmaster";
      submitObj.tags = JSON.stringify(this.SelectTags);
      submitObj.id = this.$route.params.id;
      if (this.$route.params.id) {
        articleEdit(submitObj).then((res) => {
          this.$router.push({ path: "/article" });
        });
      } else {
        saveArticle(submitObj).then((res) => {
          this.$router.push({ path: "/article" });
        });
      }
      this.dialogVisible = false;
    },
    // 发布文章前
    submitData() {
      if (!this.text) {
        this.$message.warning("请编辑斌并保存文章");
        return;
      }
      this.dialogVisible = true;
      getCategoryList({ id: "all" }).then((res) => {
        res.data.forEach((item) => {
          item.parent_id === 0
            ? this.listClass.push(item.name)
            : this.tags.push(item.name);
        });
      });
    },
    save(text, html) {
      if (!html) {
        this.$message.warning("请编辑内容!");
        return;
      }
      this.text = text;
      this.htmlText = html;
      this.$message.success("保存成功!");
    },
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      const url =
        process.env.NODE_ENV === "production"
          ? "http://it.ckjblog.com:3306/uploadAvatar"
          : "http://127.0.0.1:3001/uploadAvatar";
      var formData = new FormData();
      formData.append("file", files[0]);
      axios({
        url,
        method: "post",
        data: formData,
      }).then((res) => {
        // 插入到页面
        insertImage({
          url: url.substring(0, url.lastIndexOf("/") + 1) + res.data.data.url,
          desc: res.data.data.name,
          width: "100px",
          height: "auto",
        });
      });
    },
    //获取详情信息
    getData() {
      var detailsID = this.$route.params.id;
      details({ id: detailsID }).then((res) => {
        if (res.status === 200) {
          const item = res.data[0];
          this.title = item.title;
          // this.reason = item.reason;
          // this.status = item.status;
          this.category.push(item.category);
          this.SelectTags = item.skill === null ? [] : JSON.parse(item.skill);
          this.text = item.content;
        }
      });
    },
  },
  mounted() {
    var detailsID = this.$route.params.id;
    if (detailsID) {
      this.getData();
    }
  },
};
</script>
<style scoped>
.dialog-box >>> .el-dialog__body {
  padding: 20px !important;
}
.toolBar {
  margin-bottom: 5px;
}
.submit {
  width: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.skilltags-box,
.article-class-box {
  line-height: 35px;
}
.article-class-box {
  margin-top: 10px;
}
.skilltags-box span:first-child,
.article-class-box span:first-child {
  margin-right: 10px;
}
.article-class-list,
.skilltag-list {
  position: relative;
  left: 80px;
  top: -30px;
  width: 80%;
}
.class-item,
.skilltag-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 5px;
  overflow-y: auto;
  max-height: 100px;
  border-radius: 3px;
}
.el-radio {
  margin-top: 5px;
}
</style>