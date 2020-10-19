<template>
  <div class="userDialog">
    <el-dialog title :visible.sync="dialogAdd" width="420px" :close-on-click-modal="true">
      <el-form
        :model="addInfo"
        :rules="rules"
        ref="addInfo"
        label-width="100px"
        label-position="right"
        :inline="true"
      >
        <el-form-item label="账号" prop="userName" label-width="110px">
          <el-input v-model="addInfo.userName" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickName" label-width="110px">
          <el-input v-model="addInfo.nickName" maxlength="40" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phonenumber" label-width="110px">
          <el-input v-model="addInfo.phonenumber" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="110px">
          <el-input v-model="addInfo.email" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" label-width="110px">
          <el-radio v-model="addInfo.sex" label="0">男</el-radio>
          <el-radio v-model="addInfo.sex" label="1">女</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="addSure('addInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogAdd: false,
      addInfo: {
        nickName: "",
        userName: "",
        email: "",
        phonenumber: "",
        sex: "0"
      },
      rules: {
        nickName: [
          {
            required: true,
            pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
            trigger: "blur",
            message: "请输入1-20位中文或英文"
          }
        ],
        email: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            trigger: "blur",
            message: "证件号码格式有误"
          }
        ],
        phonenumber: [
          {
            required: true,
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            trigger: "blur",
            message: "请输入正确的手机号"
          }
        ],
        userName: [
          {
            required: true,
            pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
            trigger: "blur",
            message: "请输入1-20位中文或英文"
          }
        ]
      }
    };
  },
  methods: {
    cancelDialog() {
      this.dialogAdd = false;
    },
    //新增确认
    addSure() {
      this.$refs["addInfo"].validate(valid => {
        if (valid) {
          let paramForm = {
            nickName: this.addInfo.nickName,
            userName: this.addInfo.userName,
            email: this.addInfo.email,
            phonenumber: this.addInfo.phonenumber,
            sex: this.addInfo.sex
          };
          this.$axios
            .post("prod-api/backend/user/create", paramForm)
            .then(res => {
              if (200 == res.data.code) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
                this.$emit("search");
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
    },
    openDialog(flag, val) {
      this.dialogAdd = flag;
      this.$nextTick(() => {
        this.$refs.addInfo.resetFields();
        // console.log(val.role);
        // this.addInfo.role = val.role;
      });
    }
  }
};
</script>