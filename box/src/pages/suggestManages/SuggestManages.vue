<template>
  <div class="suggest">
    <div class="formData">
      <el-card class="searchModule">
        <el-form :model="suggest" label-width="100px" :rules="rulsa" :inline="true" :ref="suggest">
          <el-form-item label="提交人" prop="searchValue">
            <el-input v-model="suggest.searchValue" clearable></el-input>
          </el-form-item>

          <el-button class="btnmm" type="primary" @click="search()">查询</el-button>
          <el-button class="btnnn" type="primary" @click="resetForm(suggest)">重置</el-button>
        </el-form>
      </el-card>
    </div>
    <div class="table">
      <div class="tabledata">
        <sirui-table
          class="operateTaable"
          :page="page"
          :loading="load"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :tableHeight="tableHeight"
        >
          <el-table-column prop="id" label="编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userId" label="提交人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" label="意见标题" show-overflow-tooltip></el-table-column>
          <el-table-column prop="content" label="意见内容 " :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" label="提交时间" show-overflow-tooltip></el-table-column>
        </sirui-table>
      </div>
    </div>
  </div>
</template>

<script>
import SiruiTable from "@/components/SiruiTable";

export default {
  name: "usermanages",
  components: {
    SiruiTable
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    //查询
    search() {
      this.getData();
    },
    //重置
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.getData();
    },
    //获取数据函数
    getData() {
      this.$axios
        .get(
          "prod-api/backend/advice/list?" +
            "pageNum=" +
            this.page.pageNum +
            "&pageSize=" +
            this.page.pageSize +
            "&searchValue=" +
            this.suggest.searchValue
        )

        .then(res => {
          if (200 == res.data.code) {
            this.tableData = res.data.rows;
            this.page.total = res.data.total;

            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "res.data.msg",
              type: "error"
            });
          }
        });
    },
    //选中触发
    handleSelectionChange(row) {
      this.multipleSelection = row;
      //alert(JSON.stringify(this.multipleSelection));
    },
    //每页条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getData();
    }
  },
  data() {
    var fh = (rule, value, callback) => {
      var ze = /[`~!@#$%^&()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&（）——\-+={}|《》？：“”【】、；‘'，。、]/im;

      if (ze.test(value)) {
        callback(new Error("不可以含有特殊符号"));
      }
    };
    return {
      rulsa: {
        gmtName: {
          required: true,
          validator: fh,
          trigger: "blur"
        }
      },
      suggest: {
        gmtName: "",
        title: "",
        searchValue: ""
      },

      dialogVisible: false,
      page: {
        pages: 0, //总共多少页
        pageNum: 1, //第几页
        pageSize: 10, //一页多少条数据
        total: 0 // 总共多少条
      },
      load: false,
      tableHeight: 400,
      multipleSelection: [],
      // columnList: [
      //   {
      //     prop: "id",
      //     label: "编号",
      //     width: 200
      //   },
      //   {
      //     prop: "gmtName",
      //     label: "提交人"
      //   },
      //   { prop: "title", label: "意见标题" },
      //   { prop: "conent", label: "意见内容" },
      //   { prop: "gmtModified", label: "提交时间" },
      //   { prop: "isDeleted", label: "删除状态" }
      // ],
      //表格数据
      tableData: []
    };
  }
};
</script>
<style lang="scss" scoped>
.user {
  position: relative;
}

.table {
  margin-top: 11px;
}
</style>