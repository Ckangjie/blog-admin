<template>
  <div class="app-container">
    <!-- 添加富文本编辑器 wangeditor -->
    <div class="clearfix">
      <!-- 标题 -->
      <el-input
        type="text"
        class="title"
        placeholder="请输入标题"
        name="title"
        v-model="title"
      />
      <!-- 富文本编辑框 -->
      <div id="editor" class="editor"></div>
      <!-- 标签技能 -->
      <el-select v-model="skill" placeholder="请选择" class="skill">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 提交按钮 -->
      <el-button
        type="primary"
        @click="submit()"
        class="submit fr"
        :disabled="disabled"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { saveArticle } from "../api/article";
import { getToken } from "../utils/auth";
import Editor from "wangeditor";
export default {
  data() {
    return {
      details: [],
      disabled: false,
      editor: "",
      skill: "",
      title: "",
      api:
        process.env.NODE_ENV === "production"
          ? "http://it.ckjblog.com:3306/"
          : "http://localhost:9528/dev-api/",
      status: -1,
      reason: "",
      options: [
        {
          value: "java",
        },
        {
          value: "JavaScript",
        },
        {
          value: "node.js",
        },
        {
          value: "react.js",
        },
        {
          value: "css",
        },
        {
          value: "Angular.js",
        },
        {
          value: "php",
        },
        {
          value: "vue.js",
        },
        {
          value: "html",
        },
      ],
    };
  },
  methods: {
    // 下拉变化事件
    change() {
      console.log(this.status);
    },
    // 创建编辑器
    createEditor() {
      var _this = this;
      //实例化一个编辑器
      this.editor = new Editor("#editor");
      this.editor.customConfig.debug = true; // 开启debug模式
      this.editor.customConfig.uploadImgTimeout = 50000; //时间
      // 图片上传格式
      // this.editor.customConfig.uploadImgShowBase64 = true;
      // 显示网络图片上传选项
      this.editor.customConfig.showLinkImg = false;
      // 图片上传服务器
      this.editor.customConfig.uploadImgServer =
        process.env.NODE_ENV === "production"
          ? "http://it.ckjblog.com:3306/uploadAvatar"
          : "/dev-api/uploadAvatar";
      // 上传属性
      this.editor.customConfig.uploadFileName = "file";
      // 设置请求头
      this.editor.customConfig.uploadImgHeaders = {};
      // 监听图片上传
      this.editor.customConfig.uploadImgHooks = {
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
        },
        customInsert: function (insertImg, result, editor) {
          var url = _this.api + result.data.url;
          insertImg(url);
        },
      };
      // 关闭样式过滤(貌似不生效)
      this.editor.customConfig.pasteFilterStyle = false;
      // 多语言
      // this.editor.customConfig.lang = {'设置标题': 'title','正文': 'p', '链接文字': 'link text','链接': 'link','上传图片': 'upload image','上传': 'upload','创建': 'init'}
      // 开发语言配置
      // this.editor.config.codeDefaultLang = 'javascript'
      // 自定义颜色
      this.editor.customConfig.colors = [
        "#000000",
        "#eeece0",
        "#1c487f",
        "#4d80bf",
        "#c24f4a",
        "#8baa4a",
        "#7b5ba1",
        "#46acc8",
        "#f9963b",
        "#ffffff",
      ];
      // 配置字体
      this.editor.customConfig.fontNames = [
        "宋体",
        "微软雅黑",
        "Arial",
        "Tahoma",
        "Verdana",
      ];
      //创建
      this.editor.create();
      // 富文本内容
      // 初始 <p style='color:#cccccc'>请输入内容……</p>
      this.editor.txt.html();
    },
    submit() {
      let content = this.editor.txt.html(),
        data = {};
      if (this.title && content && this.skill) {
        this.disabled = true;
        data.title = this.title;
        data.content = content;
        data.skill = this.skill;
        data.author = "adminmaster";
        saveArticle(data)
          .then((res) => {
            if (res.status === 200) {
              this.disabled = false;
              setTimeout(() => {
                this.$router.push("/article");
              }, 2000);
            }
          })
          .catch((err) => {
            this.disabled = false;
          });
      } else {
        this.$message("请填写或选择相关内容!");
      }
    },
  },
  mounted() {
    this.createEditor();
    // this.getData();
  },
};
</script>
<style scoped>
.editor {
  margin-bottom: 5px;
}
.editor >>> .w-e-text-container {
  height: 600px !important;
  z-index: 1 !important;
}
.app-container /deep/ .el-input.desc {
  width: 20%;
  margin-left: 10px;
}
</style>
