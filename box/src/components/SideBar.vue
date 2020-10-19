<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      @open="handleOpen"
      @close="handleClose"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#04294b"
      text-color="#eee"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/home/usermanages">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>

      <el-menu-item index="/home/customermanages">
        <i class="el-icon-message-solid"></i>
        <span slot="title">客户管理</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-s-cooperation"></i>
          <span>箱子管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/boxmanages">
            <i class="el-icon-s-help"></i>箱子规格
          </el-menu-item>
          <el-menu-item index="/home/boximanages">
            <i class="el-icon-info"></i>箱子信息
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="/home/entmanages">
        <i class="el-icon-s-finance"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="/home/advertisementmanages">
        <i class="el-icon-menu"></i>
        <span slot="title">广告管理</span>
      </el-menu-item>
      <el-menu-item index="/home/suggestmanages">
        <i class="el-icon-s-shop"></i>
        <span slot="title">意见管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapse: false,
      onRoutes: ""
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
    // ,
    // onRoutes() {},
    // collapse() {}
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  overflow-y: scroll;
  //width: 220px;
  //background: #04294b;
  height: 693px;
  //height: 100%;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar > ul {
  height: 100%;
}
</style>