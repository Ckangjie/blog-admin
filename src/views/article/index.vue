<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
      height="760"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="标题" width="300px">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="内容" width="600px">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column label="Author" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读量" align="center" width="70px">
        <template slot-scope="scope">{{ scope.row.readCount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===-1" style="color:rgb(64, 158, 255)">待审核</span>
          <span v-else-if="scope.row.status===0" style="color:#67c23a">审核通过</span>
          <span v-else style="color:#dd6161">未通过</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="发表日期">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.time.slice(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope>
          <el-input
            v-model="searchKey"
            placeholder="输入关键字搜索"
            class="searchKey"
            @input="search(searchKey)"
          />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
import { getList, Delete, search, details } from "@/api/article";
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
      list: [],
      sumTotal: 0,
      listLoading: true,
      currentPage: Number(sessionStorage.getItem("currentPage"))
        ? Number(sessionStorage.getItem("currentPage"))
        : 1,
      pageSize: 10,
    };
  },
  computed: {
    // 文章列表
    showData() {
      var _this = this;
      let list = _this.list;
      list.forEach((item) => {
        item.time = rTime(item.time);
      });
      // 按阅读量排序
      list.sort(_this.handle("readCount"));
      return list;
    },
    // 文章总数
    total: function () {
      return this.sumTotal;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取文章总数
    getTotal() {
      getTotal().then((res) => {
        this.sumTotal = res.data.length;
      });
    },
    // 列表
    fetchData() {
      let data = {
        pageSize: this.pageSize,
        currentPage: (this.currentPage - 1) * this.pageSize,
        client: "admin",
      };
      this.listLoading = true;
      getList(data).then((response) => {
        this.sumTotal = response.total;
        this.list = response.data;
        this.listLoading = false;
      });
    },
    // 查看
    handleEdit(index, item) {
      let id = item.id;
      this.$router.push({ path: "/details/" + id });
    },
    // 删除
    handleDelete(index, item) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete({ id: item.id }).then((res) => {
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
};
</script>
