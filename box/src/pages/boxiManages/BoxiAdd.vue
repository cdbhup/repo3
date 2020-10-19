<template>
  <div class="boxiDialog">
    <el-dialog title :visible.sync="dialogAdd" width="400px" :close-on-click-modal="true">
      <el-form
        :model="addInfo"
        :rules="rules"
        ref="addInfo"
        label-width="100px"
        label-position="right"
        :inline="true"
      >
        <el-form-item label=" 箱子规格" prop="boxStandard">
          <el-select v-on:change="indexSelect" v-model="addInfo.boxStandard" placeholder="请选择">
            <el-option
              v-for="item in options.data"
              :key="item.id"
              :label="item.boxStandard"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所需积分" prop="boxUnitPrice" label-width="110px">
          <el-input v-model="addInfo.boxUnitPrice" maxlength="40" clearable></el-input>
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
      options: "",
      dialogAdd: false,
      addInfo: {
        boxUnitPrice: "",
        surplusCount: "",
        boxStandard: "",
        remark: ""
      },
      rules: {
        remark: [
          {
            required: true,
            pattern: /^.{1,256}$/,
            trigger: "blur",
            message: "不能为空并且长度不能大于256"
          }
        ]
      }
    };
  },
  mounted: function() {
    this.getGGData();
  },
  methods: {
    cancelDialog() {
      this.dialogAdd = false;
    },
    getGGData() {
      this.$axios.get("prod-api/backend/box/standard/select").then(res => {
        if (200 == res.data.code) {
          this.options = res.data;
          this.boxUnitPrice = res.data.boxUnitPrice;
          this.$message({
            showClose: true,
            message: "操作成功",
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
    addSure() {
      this.$refs["addInfo"].validate(valid => {
        if (valid) {
          let paramForm = {
            boxStandard: this.addInfo.boxStandard,
            boxUnitPrice: this.addInfo.boxUnitPrice,
            remark: this.addInfo.remark
          };
          this.$axios
            .post("prod-api/backend/box/info/create", paramForm)
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
    indexSelect(value) {
      this.addInfo.boxUnitPrice = value.boxUnitPrice;
      this.addInfo.boxStandard = value.boxStandard;
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