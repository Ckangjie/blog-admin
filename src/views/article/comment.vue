<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="发表用户" width="300px" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="内容" width="700px">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column label="path" align="center">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="@" align="center">
        <template slot-scope="scope">{{ scope.row.reply_name }}</template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="发表日期">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.time.slice(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { commentList, deleteComment, search } from "@/api/article";
import { MessageBox } from "element-ui";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      searchKey: "",
      list: null,
      listLoading: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 列表
    fetchData() {
      this.listLoading = true;
      commentList().then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    // 编辑
    handleEdit(index, item) {
      console.log(index, item);
    },
    // 删除
    handleDelete(index, item) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteComment({ id: item.id }).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: res.message,
                center: true,
              });
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true,
          });
        });
    },
    // 搜索
    search(value) {
      search({ value }).then((res) => {
        if (res.status === 200) {
          this.list = res.data;
        }
      });
    },
  },
};
</script>
