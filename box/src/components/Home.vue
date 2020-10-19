<template>
  <div class="wrapper">
    <v-sidebar></v-sidebar>
    <div class="content-box">
      <v-head></v-head>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import vHead from "./Header";
import vSidebar from "./SideBar";
export default {
  name: "home",
  components: {
    vHead,
    vSidebar
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 82%;
  height: 100%;
  margin: 10px;
  display: block;
  position: absolute;
  left: 220px;
  top: 60px;
  bottom: 0;
}
</style>