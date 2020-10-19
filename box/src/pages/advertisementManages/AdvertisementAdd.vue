<template>
  <div class="advertisementDialog">
    <el-dialog title :visible.sync="dialogAdd" width="400px" :close-on-click-modal="true">
      <el-form
        :model="addInfo"
        :rules="rules"
        ref="addInfo"
        label-width="100px"
        label-position="right"
        :inline="true"
      >
        <el-form-item label="广告标题" prop="title" label-width="110px">
          <el-input v-model="addInfo.title" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告内容" prop="content" label-width="110px">
          <el-input v-model="addInfo.content" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="奖励积分" prop="points" label-width="110px">
          <el-input v-model="addInfo.points" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-upload
          ref="uploads"
          :action="uploadUrl"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-form-item label="序号" prop="sortNo" label-width="110px">
          <el-input v-model="addInfo.sortNo" maxlength="40" clearable></el-input>
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
      uploadUrl: "prod-api/common/upload",
      addInfo: {
        title: "",
        content: "",
        points: "",
        imgUrl: "",
        sortNo: ""
      },
      rules: {
        title: [
          {
            required: true,
            trigger: "blur",
            message: "请正确的标题",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            trigger: "blur",
            message: "请正确的标题",
            trigger: "blur"
          }
        ],
        points: [
          {
            required: true,
            trigger: "blur",
            message: "请正确的标题",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    cancelDialog() {
      this.dialogAdd = false;
    },
    beforeAvatarUpload(file) {
      console.log(file);
      var msg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const jpgs = msg === "jpg";
      const pngs = msg === "png";
      const isb2m = file.size / 1024 / 1024 < 10;
      if (!jpgs && !pngs) {
        this.$message({
          message: "请上传jpg或png格式的图片！",
          type: "error"
        });
        setTimeout(() => this.$refs.uploads.clearFiles(), 1000);
        this.dialogVisible = false;
      } else if (!isb2m) {
        this.$message({
          message: "上传图片大小不能超过10M！",
          type: "error"
        });
      } else {
        let fd = new FormData();
        fd.append("file", file);
        this.$axios({
          method: "post",
          url: this.uploadUrl,
          data: fd
        }).then(res => {
          if (200 == res.data.code) {
            this.dialogImageUrl = res.data.fileName;
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
    },
    addSure() {
      this.$refs["addInfo"].validate(valid => {
        if (valid) {
          let paramForm = {
            title: this.addInfo.title,
            content: this.addInfo.content,
            points: this.addInfo.points,
            imgUrl: this.dialogImageUrl,
            sortNo: this.addInfo.sortNo
          };
          this.$axios
            .post("prod-api/backend/advertisement/create", paramForm)
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
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>