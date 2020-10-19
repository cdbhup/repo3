<template>
  <div class="detialDialog">
    <el-dialog width="420px" title :visible.sync="dialog" :close-on-click-modal="true">
      <el-form
        :model="detialdata"
        label-width="100px"
        :rules="rules"
        ref="detialdata"
        :inline="true"
        label-position="right"
      >
        <div v-if="show">
          <el-form-item label="空箱上门下单时间" prop="userCode" label-width="110px">
            <el-input v-model="list.emptyBoxOrderTime" readonly maxlength="40" clearable></el-input>
          </el-form-item>

          <el-form-item label="空箱上门姓名" prop="sex" label-width="110px">
            <el-input v-model="list.emptyBoxCallName" readonly maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="空箱上门电话" prop="phone" label-width="110px">
            <el-input v-model="list.emptyBoxCallPhone" readonly maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="空箱上门地址" prop="idCard" label-width="110px">
            <el-input v-model="list.emptyBoxCallAddress" readonly maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="空箱上门时间" prop="idCard" label-width="110px">
            <el-input v-model="list.emptyBoxCallTime" readonly maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="空箱上门时段" prop="idCard" label-width="110px">
            <el-input v-model="list.emptyBoxCallInterval" readonly maxlength="40" clearable></el-input>
          </el-form-item>
        </div>
        <div v-if="show3">
          <el-form-item label="重箱提取下单时间" v-if="show" prop="userName" label-width="110px">
            <el-input v-model="list.heavyBoxOrderTime" maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="重箱提取姓名" prop="idCard" label-width="110px">
            <el-input v-model="list.heavyBoxCallName" maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="重箱提取电话" prop="idCard" label-width="110px">
            <el-input v-model="list.heavyBoxCallPhone" maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="重箱提取地址" prop="idCard" label-width="110px">
            <el-input v-model="list.heavyBoxCallAddress" maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="重箱提取时间" prop="idCard" label-width="110px">
            <el-input v-model="list.heavyBoxCallTime" maxlength="40" clearable></el-input>
          </el-form-item>
          <el-form-item label="重箱提取时段" prop="idCard" label-width="110px">
            <el-input v-model="list.heavyBoxCallInterval" maxlength="40" clearable></el-input>
          </el-form-item>
        </div>
        <el-form-item label="客户名称" prop="idCard" label-width="110px">
          <el-input v-model="list.nickName" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="箱子编号" prop="idCard" label-width="110px" :show-overflow-tooltip="true">
          <el-input v-model="list.boxId" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="箱子规格" prop="idCard" label-width="110px" :show-overflow-tooltip="true">
          <el-input v-model="list.boxStandard" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="箱子积分单价"
          prop="idCard"
          label-width="110px"
          :show-overflow-tooltip="true"
        >
          <el-input v-model="list.boxUnitPrice" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="租赁时长" prop="idCard" label-width="110px">
          <el-input v-model="list.leaseDuration" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="实付积分" prop="idCard" label-width="110px">
          <el-input v-model="list.totalPrice" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="idCard" label-width="110px">
          <el-input v-model="list.status" maxlength="40" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "entdetial",
  data() {
    return {
      dialog: false,
      show3: false,
      show: true,
      id: "",
      list: [],
      detialdata: {
        userCode: "",
        userName: "",
        idCard: "",
        phone: "",
        sex: ""
      },

      rules: {
        userName: [
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
        phone: [
          {
            required: true,
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            trigger: "blur",
            message: "请输入正确的手机号"
          }
        ],
        role: [
          {
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    openDialog(flag, val) {
      this.dialog = flag;
      this.$nextTick(() => {
        this.$refs.detialdata.resetFields();
        this.detaildata = val;
        this.id = val.id;
        console.log(this.id);
        let paramForm = {
          id: this.id
        };
        this.$axios
          .get("prod-api/backend/order/info/" + paramForm.id, paramForm)
          .then(res => {
            if (200 == res.data.code) {
              this.list = res.data.data;
              if (
                this.list.status == 1 ||
                this.list.status == 2 ||
                this.list.status == 3 ||
                this.list.status == 4 ||
                this.list.status == 5
              ) {
                this.show = true;
                this.show3 = false;
              } else if (
                this.list.status == 6 ||
                this.list.status == 7 ||
                this.list.status == 8 ||
                this.list.status == 9 ||
                this.list.status == 10
              ) {
                this.show3 = true;
                this.show = false;
              }

              console.log(this.list);
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
      });
    },
    cancelDialog() {
      this.dialog = false;
      this.show3 = false;
      this.show = false;
    },
    getData() {}
  }
};
</script>