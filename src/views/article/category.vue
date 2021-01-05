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
        <el-button type="primary" icon="el-icon-search" circle></el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          @click="addCategory()"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="handleDelete()"
        ></el-button>
      </el-col>
    </el-row>
    <el-table
      @select-all="selectAll"
      ref="multipleTable"
      height="580px"
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      :lazy="true"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="分类名称"> </el-table-column>
      <el-table-column prop="createtime" label="添加时间">
        <template slot-scope="scope">{{
          scope.row.createtime.substring(0, 10)
        }}</template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="操作">
        <template slot="header" slot-scope> </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <categoryDialog ref="categoryDialog" />
  </div>
</template>

<script>
import { getCategoryList, search } from "@/api/article";
import categoryDialog from "@/components/dialog/categoryDialog";
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
  components: { categoryDialog },
  data() {
    return {
      checkedKeys: false,
      multipleSelection: [],
      ids: [],
      sumTotal: 0,
      currentPage: Number(sessionStorage.getItem("currentPage"))
        ? Number(sessionStorage.getItem("currentPage"))
        : 1,
      pageSize: 13,
      searchKey: "",
      list: [],
      listLoading: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 全选
    selectAll() {
      this.checkedKeys = !this.checkedKeys;
      this.splite(this.list, this.checkedKeys);
    },
    // 处理数据，循环全选子项。
    splite(data, flag) {
      data.forEach((row) => {
        this.$refs.multipleTable.toggleRowSelection(row, flag);
        // 递归
        if (row.children != undefined) {
          this.splite(row.children);
        }
      });
    },
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
      getCategoryList({ id: "all" }).then((response) => {
        this.list = this.$treeData(
          response.data,
          "id",
          "parent_id",
          "children"
        );
        this.listLoading = false;
      });
    },
    // 编辑
    handleEdit(index, item) {
      this.$refs.categoryDialog.showDialog(item);
    },
    // 删除
    handleDelete(item) {
      let data = item ? [item.id] : this.ids;
      if (data.length > 0) {
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
      } else {
        this.$message("请选择要删除的评论!");
      }
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
    // 新增
    addCategory() {
      this.$refs.categoryDialog.showDialog();
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