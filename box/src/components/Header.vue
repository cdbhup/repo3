<template>
  <div class="header">
    <h3>楚留香后台管理系统</h3>
    <div class="header-right">
      <div class="touxiang">
        <img src="../assets/头像.png" alt />
      </div>
      <!-- 下拉列表 -->
      <div class="dropdown">
        <el-dropdown class="username" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <span>{{this.name}}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu class="menu" slot="dropdown">
            <el-dropdown-item divided command="changepw">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 修改密码 -->

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
        prop="editPwd"
        ref="editPwd"
        label-width="100px"
        label-position="right"
        class="changePassword"
      >
        <el-form-item label="旧密码" prop="passWord">
          <el-input ref="password" :type="passWordType" v-model="editPwd.passWord"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="rePassWord">
          <el-input ref="passWordCheck" :type="passWordCheck" v-model="editPwd.rePassWord"></el-input>
        </el-form-item>
        <el-form-item label="密码强度">
          <password-strength v-model="editPwd.rePassWord" style="padding-top: 10px;"></password-strength>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editPwdSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PasswordStrength from "@/components/PasswordStrength";
export default {
  name: "Header",

  components: { PasswordStrength },
  data() {
    // var validatePassWord = (rule, value, callback) => {
    //   var ze = /^[0-9A-Za-z]{8,16}$/;
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   }
    //   if (!ze.test(value)) {
    //     callback(new Error("请输入8-16位数字或字母"));
    //   } else {
    //     if (this.editPwd.passWordCheck !== "") {
    //       this.$refs.editPwd.validatePassWord("passWordCheck");
    //     }
    //     callback();
    //   }
    // };
    // var validatePassWordCheck = (rule, value, callback) => {
    //   var ze = /^[0-9A-Za-z]{8,16}$/;
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.editPwd.passWord) {
    //     callback(new Error("两次输入密码不一致！"));
    //   } else if (!ze.test(value)) {
    //     callback(new Error("请输入8-16位数字或字母"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      collapse: true,
      message: 2,
      name: "",
      editPwd: {
        passWord: "",
        rePassWord: ""
      },
      dialogPwdEdit: false,
      passWordType: "passWord",
      passWordCheck: "passWord",

      rules: {
        passWord: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,16}$/,
            message: "请输入8到16位数字或字母组成的密码",
            trigger: "blur"
          }
        ],
        rePassWord: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,16}$/,
            message: "请输入8到16位数字或字母组成的密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    //this.toggleSideBar();
    this.loginpPerson();
  },
  methods: {
    //判断是修改密码还是退出登录
    handleCommand(command) {
      if (command == "loginout") {
        let paramFormss = {};
        this.$axios.post("prod-api/common/logout", paramFormss).then(res => {
          if (200 == res.data.code) {
            this.$router.push("/");
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
      }
      if (command == "changepw") {
        this.dialogPwdEdit = true;
      }
    },
    loginpPerson() {
      let paramForms = {};
      this.$axios.get("prod-api/common/getLoginInfo", paramForms).then(res => {
        if (200 == res.data.code) {
          localStorage.setItem("userName", res.data.user.userName);
          this.name = res.data.user.userName;
        } else {
          this.ruleForm = "";
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
      this.$refs["editPwd"].validate(valid => {
        if (valid) {
          this.$axios
            .put(
              "prod-api/backend/home/updatePassword/" +
                this.editPwd.passWord +
                "/" +
                this.editPwd.rePassWord
            )

            .then(res => {
              if (200 == res.data.code) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
                this.cancelDialog();
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  h3 {
    position: absolute;
    left: 18px;
    top: -11px;
    color: #146fc0;
  }
  .touxiang {
    position: absolute;
    right: 170px;
    top: 6px;
  }
  .dropdown {
    position: absolute;
    right: 85px;
    top: 14px;
  }
  .el-icon-check:before {
    content: "\e6da";
  }
}
</style>
