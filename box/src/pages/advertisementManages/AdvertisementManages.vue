<template>
  <div class="advertisement">
    <div class="formData">
      <el-card class="searchModule">
        <el-form
          :model="advertisement"
          label-width="100px"
          :rules="rulsa"
          :inline="true"
          :ref="advertisement"
        >
          <el-form-item label="广告标题" prop="searchValue">
            <el-input v-model="advertisement.searchValue" clearable></el-input>
          </el-form-item>

          <el-button class="btnmm" type="primary" @click="search()">查询</el-button>
          <el-button class="btnnn" type="primary" @click="resetForm(advertisement)">重置</el-button>
        </el-form>
      </el-card>
    </div>
    <div class="table">
      <el-card>
        <div class="btn">
          <el-button type="primary" @click="addData">新增</el-button>
          <el-button type="primary" @click="editData">编辑</el-button>
          <el-button type="primary" @click="isOpen">启用</el-button>
          <el-button type="primary" @click="isClose">禁用</el-button>
          <el-button type="primary" @click="delData">删除</el-button>
        </div>
      </el-card>
      <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="true">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>-->
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
          <el-table-column align="center" type="selection" width="45"></el-table-column>
          <el-table-column
            v-for="(item,index) in columnList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.sort"
            :fixed="item.fixed"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="imgUrl" label="图片地址" height="100px" weight="60px" min-width="70">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" min-width="70px" height="70px" weight="50px" alt=" " />
            </template>
          </el-table-column>
        </sirui-table>
      </div>
    </div>
    <AdvertisementAdd ref="addData" v-on:search="search"></AdvertisementAdd>
    <AdvertisementEdit ref="editData" v-on:search="search"></AdvertisementEdit>
  </div>
</template>

<script>
import SiruiTable from "@/components/SiruiTable";
import AdvertisementAdd from "@/pages/advertisementManages/AdvertisementAdd";
import AdvertisementEdit from "@/pages/advertisementManages/AdvertisementEdit";
export default {
  name: "usermanages",
  components: {
    SiruiTable,
    AdvertisementAdd,
    AdvertisementEdit
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    search() {
      this.getData();
    },
    getData() {
      this.$axios
        .get(
          "prod-api/backend/advertisement/list?" +
            "pageNum=" +
            this.page.pageNum +
            "&pageSize=" +
            this.page.pageSize +
            "&searchValue=" +
            this.advertisement.searchValue
        )

        .then(res => {
          if (200 == res.data.code) {
            for (var i = 0; i < res.data.rows.length; i++) {
              if (res.data.rows[i].imgUrl) {
                res.data.rows[i].imgUrl = "prod-api/" + res.data.rows[i].imgUrl;
              }
            }
            this.tableData = res.data.rows;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].isEnable == "1") {
                this.tableData[i].isEnable = "禁用";
              } else if (this.tableData[i].isEnable == "0") {
                this.tableData[i].isEnable = "启用";
              }
            }

            this.page.total = res.data.total;
          } else {
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
    },
    //重置
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.getData();
    },
    //新增按钮
    addData() {
      this.$refs.addData.openDialog(true);
    },
    //修改
    editData() {
      if (1 == this.multipleSelection.length) {
        this.$refs.editData.openDialog(
          true,
          JSON.parse(JSON.stringify(this.multipleSelection[0]))
        );
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行查看详情",
          type: "error"
        });
      }
    },
    //启用
    isOpen() {
      if (this.multipleSelection.length >= 1) {
        if (0 != this.multipleSelection.length) {
          this.$confirm("是否启用？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let param = {
                ids: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.ids.push(this.multipleSelection[i].id);
              }
              param.ids = param.ids.join(",");
              this.$axios
                .put(
                  "prod-api/backend/advertisement/enable/" + param.ids,
                  param
                )
                .then(res => {
                  if (200 == res.data.code) {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "success"
                    });
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消启用"
              });
            });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择数据进行操作",
          type: "error"
        });
      }
    },
    //禁用
    isClose() {
      if (this.multipleSelection.length >= 1) {
        if (0 != this.multipleSelection.length) {
          this.$confirm("是否禁用？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let param = {
                ids: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.ids.push(this.multipleSelection[i].id);
              }
              param.ids = param.ids.join(",");
              this.$axios
                .put(
                  "prod-api/backend/advertisement/disable/" + param.ids,
                  param
                )
                .then(res => {
                  if (200 == res.data.code) {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "success"
                    });
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消禁用"
              });
            });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择数据进行操作",
          type: "error"
        });
      }
    },
    //删除
    delData() {
      if (this.multipleSelection.length >= 1) {
        if (0 != this.multipleSelection.length) {
          this.$confirm("此操作将永久删除改数据", "是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let param = {
                ids: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.ids.push(this.multipleSelection[i].id);
              }
              param.ids = param.ids.join(",");
              this.$axios
                .delete(
                  "prod-api/backend/advertisement/delete/" + param.ids,
                  param
                )
                .then(res => {
                  if (200 == res.data.code) {
                    this.getData();
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getData();
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择数据进行操作",
          type: "error"
        });
      }
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
        title: {
          required: true,
          validator: fh,
          trigger: "blur"
        }
      },
      advertisement: {
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
      searchValue: "",
      tableHeight: 400,
      load: false,
      multipleSelection: [],
      columnList: [
        {
          prop: "id",
          label: "广告编号",
          width: 200
        },
        {
          prop: "title",
          label: "标题"
        },
        { prop: "content", label: "内容" },
        { prop: "version", label: "奖励积分" },

        { prop: "isEnable", label: "状态" },
        { prop: "sortNo", label: "序号" }
      ],
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