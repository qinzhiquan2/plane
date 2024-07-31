<template>
  <div class="home">
    <div class="container nav-box">
      <div class="nav-item .bgBlue" @click="goDrList()">
        <el-icon size="3rem"><Tickets /></el-icon>
        <span>缺陷报告</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
const router = useRouter();

if (!userStore.userInfo.user) {
  ElMessage.info("用户未登录，跳转到登录页");
  setTimeout(() => {
    router.push("/login");
  }, 1000);
}
const goDrList = () => {
  if (userStore.userInfo.user) {
    if (userStore.userInfo.role.indexOf('管理员') != -1) {
      router.push("/drlist"); // 管理员
    } else {
      router.push("/drform"); // 普通员工
    }
  } else {
    ElMessage.info("用户未登录，跳转到登录页");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }
  // window.open('/drlist', '_blank')
};
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background-image: url("@/assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .container {
    .nav-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff;
      width: 100px;
      height: 100px;
      border-radius: 50px;
      text-align: center;
      padding-top: 10px;
      color: #fff;
      line-height: 6px;
      box-sizing: border-box;
      cursor: pointer;
      text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
      opacity: 0.7;
      background-color: #0074e8;
      transition: all 0.3s;
      &:hover {
        opacity: 1;
        color: orange;
        border: 1px solid orange;
      }
    }
    span {
      line-height: 30px;
      font-size: 12px;
    }
  }
}

@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
