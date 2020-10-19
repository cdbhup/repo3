<template>
  <div class="customerDialog">
    <el-dialog title :visible.sync="dialogAdd" width="400px" :close-on-click-modal="true">
      <el-form
        :model="addInfo"
        :rules="rules"
        ref="addInfo"
        label-width="100px"
        label-position="right"
        :inline="true"
      >
        <el-form-item label="客户名" prop="userName" label-width="110px">
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
        userName: "",
        nickName: "",
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
        idCard: [
          {
            required: true,
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
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
        email: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            trigger: "blur",
            message: "证件号码格式有误"
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
            .post("prod-api/backend/customer/create", paramForm)
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