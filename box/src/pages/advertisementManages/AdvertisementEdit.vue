<template>
  <div class="advertisementDialog">
    <el-dialog width="400px" title :visible.sync="dialogEdit" :close-on-click-modal="true">
      <el-form
        :model="editInfo"
        label-width="100px"
        :rules="rules"
        ref="editInfo"
        :inline="true"
        label-position="right"
      >
        <el-form-item label="广告id" prop="id" label-width="110px">
          <el-input v-model="editInfo.id" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告标题" prop="title" label-width="110px">
          <el-input v-model="editInfo.title" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告内容" prop="content" label-width="110px">
          <el-input v-model="editInfo.content" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="奖励积分" prop="points" label-width="110px">
          <el-input v-model="editInfo.points" maxlength="40" clearable></el-input>
        </el-form-item>

        <el-form-item label="原图片地址" prop="imgUrl">
          <img :src="editInfo.imgUrl" min-width="70" height="70" alt />
        </el-form-item>
        <el-form-item label="修改图片地址" prop="imgUrl">
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
        </el-form-item>
        <el-form-item label="序号" prop="sortNo" label-width="110px">
          <el-input v-model="editInfo.sortNo" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version" label-width="110px">
          <el-input v-model="editInfo.version" maxlength="40" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取消</el-button>
        <el-button type="primary" @click="addSure('editInfo')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "editData",
  data() {
    return {
      dialogImageUrl: "",
      uploadUrl: "prod-api/common/upload",
      dialogEdit: false,
      editInfo: {
        title: "",
        content: "",
        points: "",
        imgUrl: "",
        sortNo: "",
        id: "",
        version: ""
      },

      rules: {}
    };
  },
  mounted() {},
  methods: {
    openDialog(flag, val) {
      this.dialogEdit = flag;

      this.$nextTick(() => {
        this.$refs.editInfo.resetFields();
        this.editInfo = val;
        //this.editInfo.imgUrl = val[0].imgUrl;
      });
    },
    cancelDialog() {
      this.dialogEdit = false;
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
      this.$refs["editInfo"].validate(valid => {
        if (valid) {
          let paramForm = {
            id: this.editInfo.id,
            title: this.editInfo.title,
            content: this.editInfo.content,
            points: this.editInfo.points,
            imgUrl: this.dialogImageUrl,
            sortNo: this.editInfo.sortNo,
            version: this.editInfo.version
          };
          this.$axios
            .put("prod-api/backend/advertisement/update", paramForm)
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