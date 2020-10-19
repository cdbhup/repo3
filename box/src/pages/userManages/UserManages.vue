<template>
  <div class="user">
    <div class="formData">
      <el-card class="searchModule">
        <el-form :model="user" :rules="rulsa" label-width="100px" :inline="true" :ref="user">
          <el-form-item label prop="searchValue">
            <el-input v-model="user.searchValue" placeholder="用户名/姓名/手机号/邮箱" clearable></el-input>
          </el-form-item>

          <el-button class="btnmm" type="primary" @click="search()">查询</el-button>
          <el-button class="btnnn" type="primary" @click="resetForm(user)">重置</el-button>
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
          <el-button type="primary" @click="resetPs">重置密码</el-button>
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
    <UserAdd ref="addData" v-on:search="search"></UserAdd>
    <UserEdit ref="editData" v-on:search="search"></UserEdit>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPwdEdit"
      width="30%"
      :close-on-click-modal="false"
      :before-close="cancelDialog"
    >
      <el-form
        :model="editPwd"
        :rules="rules"
        ref="editPwd"
        label-width="100px"
        label-position="right"
        class="changePassword"
      >
        <!-- <el-form-item label="新密码" prop="passWord">
          <el-input ref="password" :type="passWordType" v-model="editPwd.passWord"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWordCheck">
          <el-input ref="passWordCheck" :type="passWordCheck" v-model="editPwd.passWordCheck"></el-input>
        </el-form-item>-->
        确定要重置密码？
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editPwdSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SiruiTable from "@/components/SiruiTable";
import UserAdd from "@/pages/userManages/UserAdd";
import UserEdit from "@/pages/userManages/UserEdit";
export default {
  name: "usermanages",
  components: {
    SiruiTable,
    UserAdd,
    UserEdit
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    created() {
      this.getData();
    },
    search() {
      this.getData();
    },
    getData() {
      this.$axios
        .get(
          "prod-api/backend/user/list?" +
            "pageNum=" +
            this.page.pageNum +
            "&pageSize=" +
            this.page.pageSize +
            "&searchValue=" +
            this.user.searchValue
        )

        .then(res => {
          if (200 == res.data.code) {
            this.tableData = res.data.rows;
            this.page.total = res.data.total;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].sex == "1") {
                this.tableData[i].sex = "女";
              } else if (this.tableData[i].sex == "0") {
                this.tableData[i].sex = "男";
              }
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].status == "1") {
                this.tableData[i].status = "禁用";
              } else if (this.tableData[i].status == "0") {
                this.tableData[i].status = "启用";
              }
            }
          } else {
          }
        });
    },
    //取消操作
    cancelDialog() {
      this.passWordType = "password";
      this.passWordCheck = "password";
      this.dialogPwdEdit = false;
      this.$refs["editPwd"].resetFields();
    },
    //确认操作
    editPwdSure() {
      this.dialogPwdEdit = false;
      let param = {
        userIds: []
      };
      for (var i = 0; i < this.multipleSelection.length; i++) {
        param.userIds.push(this.multipleSelection[i].userId);
      }
      param.userIds = param.userIds.join(",");
      this.$axios
        .put("prod-api/backend/user/reset/" + param.userIds, param)
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
    },
    //重置密码
    resetPs() {
      if (this.multipleSelection.length >= 1) {
        this.dialogPwdEdit = true;
      }
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
                userIds: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.userIds.push(this.multipleSelection[i].userId);
              }
              param.userIds = param.userIds.join(",");
              this.$axios
                .put("prod-api/backend/user/enable/" + param.userIds, param)
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
                userIds: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.userIds.push(this.multipleSelection[i].userId);
              }
              param.userIds = param.userIds.join(",");
              this.$axios
                .put("prod-api/backend/user/disable/" + param.userIds, param)
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
                userIds: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.userIds.push(this.multipleSelection[i].userId);
              }
              param.userIds = param.userIds.join(",");
              this.$axios
                .delete("prod-api/backend/user/delete/" + param.userIds, param)
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
    var validatePassWord = (rule, value, callback) => {
      var ze = /^[0-9A-Za-z]{8,16}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      if (!ze.test(value)) {
        callback(new Error("请输入8-16位数字或字母"));
      } else {
        if (this.editPwd.passWordCheck !== "") {
          this.$refs.editPwd.validatePassWord("passWordCheck");
        }
        callback();
      }
    };
    var validatePassWordCheck = (rule, value, callback) => {
      var ze = /^[0-9A-Za-z]{8,16}$/;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPwd.passWord) {
        callback(new Error("两次输入密码不一致！"));
      } else if (!ze.test(value)) {
        callback(new Error("请输入8-16位数字或字母"));
      } else {
        callback();
      }
    };
    var fh = (rule, value, callback) => {
      var ze = /[`~!@#$%^&()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&（）——\-+={}|《》？：“”【】、；‘'，。、]/im;

      if (ze.test(value)) {
        callback(new Error("不可以含有特殊符号"));
      }
    };
    return {
      editPwd: {
        passWord: "",
        passWordCheck: ""
      },
      tableHeight: 400,
      dialogPwdEdit: false,
      passWordType: "passWord",
      passWordCheck: "passWord",
      rulsa: {
        name: {
          required: true,
          validator: fh,
          trigger: "blur"
        }
      },
      rules: {
        passWord: [
          {
            required: true,
            validator: validatePassWord,

            trigger: "blur"
          }
        ],
        passWordCheck: [
          {
            required: true,
            validator: validatePassWordCheck,

            trigger: "blur"
          }
        ]
      },
      user: {
        name: "",
        phone: "",
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
      multipleSelection: [],
      columnList: [
        {
          prop: "userName",
          label: "用户账号",
          width: 200
        },
        {
          prop: "nickName",
          label: "姓名"
        },

        { prop: "phonenumber", label: "手机号" },
        { prop: "email", label: "邮箱" },
        { prop: "sex", label: "性别" },
        { prop: "status", label: "状态" }
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