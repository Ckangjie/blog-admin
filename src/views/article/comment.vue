<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col>
        <el-input
          v-model="searchKey"
          placeholder="关键字"
          class="searchKey"
          @input="search(searchKey)"
        />
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="danger" @click="handleDelete()">删除评论</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
      height="720"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="发表用户" width="300px" align="center">
        <template slot-scope="scope">{{ scope.row.username }}</template>
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
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,15,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
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
      multipleSelection: [],
      ids: [],
      sumTotal: 0,
      currentPage: Number(sessionStorage.getItem("currentPage"))
        ? Number(sessionStorage.getItem("currentPage"))
        : 1,
      pageSize: 13,
      searchKey: "",
      list: null,
      listLoading: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleSelectionChange(data) {
      this.ids = [];
      data.forEach((item, index) => {
        this.ids.push(item.id);
      });
      this.multipleSelection = data;
    },
    // 列表
    fetchData() {
      let data = {
        pageSize: this.pageSize,
        currentPage: (this.currentPage - 1) * this.pageSize,
      };
      this.listLoading = true;
      commentList(data).then((response) => {
        this.sumTotal = response.total;
        this.list = response.data;
        this.listLoading = false;
      });
    },
    // 编辑
    handleEdit(index, item) {
      console.log(index, item);
    },
    // 删除
    handleDelete(item) {
      let data = [];
      if (item === undefined) {
        data = this.ids;
      } else {
        data.push(item.id);
      }
      this.$confirm("永久删除" + data.length + "条评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteComment({ ids: data }).then((res) => {
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      sessionStorage.setItem("currentPage", val);
      this.fetchData();
    },
  },
  computed: {
    // 文章总数
    total: function () {
      return this.sumTotal;
    },
  },
};
</script>
<style scoped lang="scss">
.toolbar {
  margin-bottom: 5px;
  .searchKey.el-input {
    width: 15%;
    margin-right: 10px;
  }
}
</style>