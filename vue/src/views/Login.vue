<template>
  <div class="login">
    <div class="container">
      <h1>请登录</h1>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="60px"
      >
        <el-form-item prop="user" label="账户">
          <el-input v-model="form.user" placeholder="请输入账户名" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="agree" label-width="22px">
          <el-checkbox size="large" v-model="form.agree">
            我已同意隐私条款和服务条款
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button size="large" type="primary" @click="doLogin">点击登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";

const userStore = useUserStore();

// 1. 准备表单对象
const form = ref({
  user: "000000",
  password: "000000",
  agree: true,
});

// 2. 准备规则对象
const rules = {
  user: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 14, message: "密码长度为6-14个字符", trigger: "blur" },
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        // 自定义校验逻辑
        // 勾选就通过 不勾选就不通过
        if (value) {
          callback();
        } else {
          callback(new Error("请勾选协议"));
        }
      },
    },
  ],
};

const formRef = ref(null);
const router = useRouter();
// 登录
const doLogin = () => {
  const { user, password } = form.value;
  // 调用实例方法
  formRef.value.validate(async (valid) => {
    // valid: 所有表单都通过校验  才为true
    // 以valid做为判断条件 如果通过校验才执行登录逻辑
    if (valid) {
      // TODO LOGIN
      await userStore.getUserInfo({ user, password });
      // 1. 提示用户
      ElMessage({ type: "success", message: "登录成功" });
      // 2. 跳转首页
      router.replace({ path: "/home" });
    }
  });
};
</script>

<style scoped lang="scss">
.login {
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
    min-width: 320px;
    max-width: 320px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid white;
    border-radius: 10px;
    padding: 20px;

    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-family: "楷体", "微软雅黑";
    }

    .button-group {
      text-align: center;
    }

    :deep().el-form-item__label,
    :deep().el-checkbox__label {
      color: white;
    }
  }
}
</style>
