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

const logout = () => {
  // 退出登录业务逻辑实现
  // 1.清除用户信息 触发action
  userStore.clearUserInfo();

  ElMessage.success("退出成功");
  setTimeout(() => {
    // 2.跳转到登录页
    router.push("/login");
  }, 1000);
};

const replaceUrl = (path, query) => {
  router.replace({ path,query  });
};
</script>


<template>
  <header>
        <div class="header-container">
          <div class="header-left">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button size="small">
                  {{ userStore.userInfo.user }} &nbsp;
                  <el-icon>
                    <arrow-down />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>我的报告</el-dropdown-item>
                  <el-dropdown-item>我处理的</el-dropdown-item>
                  <el-dropdown-item @click="logout()">注销登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-badge class="backlog" :value="12" :offset="[0, 7]">
              <el-button size="small" type="warning">待办</el-button>
            </el-badge>
          </div>
          <div class="header-right">
            <el-tooltip content="刷新" placement="bottom">
              <el-button size="small" circle
                ><el-icon><Refresh /></el-icon
              ></el-button>
            </el-tooltip>
            <el-tooltip content="下载" placement="bottom">
              <el-button size="small" circle
                ><el-icon><Download /></el-icon
              ></el-button>
            </el-tooltip>
            <el-tooltip content="重置" placement="bottom">
              <el-button @click="replaceUrl('/drlist', {id: 12})" size="small" circle
                ><el-icon><Tickets /></el-icon
              ></el-button>
            </el-tooltip>
            <el-tooltip content="新增" placement="bottom">
              <el-button @click="replaceUrl('/drform', {id: 12})" size="small" circle
                ><el-icon><Plus /></el-icon
              ></el-button>
            </el-tooltip>
          </div>
        </div>
      </header>
</template>


<style lang="scss">
 header {
    position: fixed;
    width: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0 0 4px 4px;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;

    .header-container {
      width: 900px;
      background-color: rgb(198, 226, 255);
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 30px;
      padding: 0 10px;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;

      .header-left {
        display: flex;
        align-items: center;
        button {
          padding: 3px 6px;
        }
        // 待办
        .backlog {
          margin-left: 10px;
        }
      }
      .header-right {
        color: white;
      }
    }
  }
</style>