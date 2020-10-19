<template>
  <div class="boxDialog">
    <el-dialog title :visible.sync="dialogAdd" width="400px" :close-on-click-modal="true">
      <el-form
        :model="addInfo"
        :rules="rules"
        ref="addInfo"
        label-width="100px"
        label-position="right"
        :inline="true"
      >
        <el-form-item label="箱子规格" prop="boxStandard" label-width="110px">
          <el-input v-model="addInfo.boxStandard" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="箱子积分单价" prop="boxUnitPrice" label-width="110px">
          <el-input v-model="addInfo.boxUnitPrice" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="inventoryNumber" label-width="110px">
          <el-input v-model="addInfo.inventoryNumber" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="110px">
          <el-input v-model="addInfo.remark" maxlength="40" clearable></el-input>
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
        boxStandard: "",
        boxUnitPrice: "",
        inventoryNumber: "",
        remark: ""
      },
      rules: {
        boxStandard: [
          {
            required: true,
            pattern: /\d+\*\d+\*\d+/,
            message: "请输入正确的箱子规格",
            trigger: "blur"
          }
        ],
        boxUnitPrice: [
          {
            required: true,
            pattern: /^\+?[1-9]\d*$/,
            trigger: "blur",
            message: "请输入大于0的整数"
          }
        ],
        inventoryNumber: [
          {
            required: true,
            pattern: /^\+?[1-9]\d*$/,
            trigger: "blur",
            message: "请输入大于0的整数"
          }
        ],
        remark: [
          {
            required: true,
            pattern: /^.{3,256}$/,
            trigger: "blur",
            message: "不能为空并且长度不能大于256"
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
            boxStandard: this.addInfo.boxStandard,
            boxUnitPrice: this.addInfo.boxUnitPrice,
            inventoryNumber: this.addInfo.inventoryNumber,
            remark: this.addInfo.remark
          };
          this.$axios
            .post("prod-api/backend/box/standard/create", paramForm)
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