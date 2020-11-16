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
      <el-select
        v-model="status"
        placeholder="请选择"
        class="skill"
        @change="change"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        type="text"
        class="desc"
        placeholder="请输入原因"
        name="title"
        v-model="reason"
        v-if="status === 1 ? true : false"
      />
      <!-- 提交按钮 -->
      <el-button type="primary" @click="submit()" class="submit fr"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { details, articleStatus } from "../../api/article";
import Editor from "wangeditor";
export default {
  data() {
    return {
      details: [],
      editor: "",
      title: "",
      status: -1,
      reason: "",
      skill: "",
      options: [
        {
          value: -1,
          label: "审核中",
        },
        {
          value: 0,
          label: "审核通过",
        },
        {
          value: 1,
          label: "审核不通过",
        },
      ],
    };
  },
  methods: {
    // 下拉变化事件
    change() {
      console.log(this.status);
    },
    //获取详情信息
    getData() {
      var detailsID = this.$route.params.id;
      details({ id: detailsID }).then((res) => {
        if (res.status === 200) {
          res.data.forEach((item) => {
            this.title = item.title;
            this.reason = item.reason;
            this.status = item.status;
            this.editor.txt.html(item.content);
          });
        }
      });
    },
    // 创建编辑器
    createEditor() {
      //实例化一个编辑器
      this.editor = new Editor("#editor");
      // 图片上传格式
      this.editor.customConfig.uploadImgShowBase64 = true;
      // 显示网络图片上传选项
      this.editor.customConfig.showLinkImg = true;
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
        detailsID = Number(this.$route.params.id),
        data = {};
      data.id = detailsID;
      data.status = this.status;
      data.reason = this.reason;
      data.title = this.title;
      data.content = content;
      data.skill = this.skill;
      console.log(5);
      articleStatus(data).then((res) => {
        this.$router.push("/article");
      });
    },
  },
  mounted() {
    this.createEditor();
    this.getData();
  },
};
</script>
<style scoped>
.editor >>> .w-e-text-container {
  height: 600px !important;
  z-index: 1 !important;
}
.app-container /deep/ .el-input.desc {
  width: 20%;
  margin-left: 10px;
}
</style>
