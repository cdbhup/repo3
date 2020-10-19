<template>
  <div class="boxi">
    <div class="formData">
      <el-card class="searchModule">
        <el-form :model="box" label-width="100px" :rules="rulsa" :inline="true" :ref="box">
          <el-form-item label="箱子规格" prop="boxStandard">
            <el-select v-model="box.boxStandard" placeholder="请选择">
              <el-option
                v-for="item in options.data"
                :key="item.value"
                :label="item.label"
                :value="item.boxStandard"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="箱子状态" prop="isUsed">
            <el-select v-model="box.isUsed" placeholder="请选择">
              <el-option
                v-for="item in optionss"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用人" prop="code">
            <el-input v-model="box.code" clearable></el-input>
          </el-form-item>
          <el-button class="btnmm" type="primary" @click="search()">查询</el-button>
          <el-button class="btnnn" type="primary" @click="resetForm(box)">重置</el-button>
        </el-form>
      </el-card>
    </div>
    <div class="table">
      <el-card>
        <div class="btn">
          <el-button type="primary" @click="addData">新增</el-button>
          <!-- <el-button type="primary" @click="editData">编辑</el-button> -->
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
          ></el-table-column>
        </sirui-table>
      </div>
    </div>
    <BoxiAdd ref="addData"></BoxiAdd>
  </div>
</template>

<script>
import SiruiTable from "@/components/SiruiTable";
import BoxiAdd from "@/pages/boxiManages/BoxiAdd";

export default {
  name: "boxmanages",
  components: {
    SiruiTable,
    BoxiAdd
  },
  mounted: function() {
    this.getData();
    this.getGGData();
  },
  methods: {
    search() {
      this.getData();
    },
    getGGData() {
      this.$axios.get("prod-api/backend/box/standard/select").then(res => {
        if (200 == res.data.code) {
          this.options = res.data;
        } else {
        }
      });
    },
    getData() {
      this.$axios
        .get(
          "prod-api/backend/box/info/list?" +
            "pageNum=" +
            this.page.pageNum +
            "&pageSize=" +
            this.page.pageSize +
            "&boxStandard=" +
            this.box.boxStandard +
            "&isUsed=" +
            this.box.isUsed +
            "&usedByName=" +
            this.box.usedByName
        )

        .then(res => {
          if (200 == res.data.code) {
            this.tableData = res.data.rows;
            this.page.total = res.data.total;

            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].isUsed == 1) {
                this.tableData[i].searchValue = "使用中";
              } else if (this.tableData[i].isUsed == 0) {
                this.tableData[i].searchValue = "未使用";
              }
            }
            console.log(this.tableData);
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
                .delete("prod-api/backend/box/info/delete/" + param.ids, param)
                .then(res => {
                  if (200 == res.data.code) {
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
      options: "",
      optionss: [
        {
          value: "0",
          label: "未使用"
        },
        {
          value: "1",
          label: "已使用"
        }
      ],
      tableHeight: 400,
      rulsa: {
        code: {
          required: true,
          validator: fh,
          trigger: "blur"
        }
      },
      box: {
        code: "",
        number: "",
        boxStandard: "",
        isUsed: "",
        usedByName: ""
      },
      dialogVisible: false,
      page: {
        pages: 0, //总共多少页
        pageNum: 1, //第几页
        pageSize: 10, //一页多少条数据
        total: 0 // 总共多少条
      },
      load: false,
      multipleSelection: [],
      columnList: [
        {
          prop: "boxStandard",
          label: "箱子规格",
          width: 200
        },

        { prop: "boxCode", label: "箱子编号" },
        { prop: "boxUnitPrice", label: "所需积分" },
        { prop: "searchValue", label: "使用状态" },
        { prop: "usedBy", label: "使用人" },
        { prop: "remark", label: "备注" }
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