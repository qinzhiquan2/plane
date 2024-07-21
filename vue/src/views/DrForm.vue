<template>
  <div class="body">
    <div class="container">
      <Header />
      <main>
        <div class="main">
          <el-form :model="drForm" label-width="auto" :label-position="'top'">
            <el-row class="from-title">
              <!-- 标题：飞机缺陷报告 -->
              <el-col :span="10"><span class="title">飞机缺陷报告</span></el-col>
              <!-- 完整缺陷 选择框 -->
              <el-col :span="14" class="isFull">
                <el-checkbox v-model="isFull" label="完整缺陷描述方式填写" />
              </el-col>
            </el-row>
            <el-row>
              <!-- 飞机号 -->
              <el-col :span="12">
                <el-form-item class="acNum-form" label="飞机号" required>
                  <div class="qtn">1/4节点:2024-08-05 12:00</div>
                  <el-select
                    v-model="drForm.acNum"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择飞机号"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 相关工卡 -->
              <el-col :span="12">
                <el-form-item class="acNum-form" label="相关工卡" required>
                  <el-input
                    v-model="drForm.relatedCard"
                    clearable
                    placeholder="相关工卡的序号或完整卡号"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 主区域 -->
              <el-col :span="12">
                <el-form-item label="主区域" required>
                  <el-select
                    v-model="drForm.acNum"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择飞机号"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 相关工卡 -->
              <el-col :span="12">
                <el-form-item class="acNum-form" label="相关工卡" required>
                  <el-input
                    v-model="drForm.relatedCard"
                    clearable
                    placeholder="相关工卡的序号或完整卡号"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </main>
      <footer></footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Header from "@/components/Header.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

import show_pic from "@/assets/images/show_pic.jpg";

const userStore = useUserStore();
const router = useRouter();

const isFull = ref(false);

const drForm = reactive({
  acNum: "", // 飞机号
  relatedCard: "", // 相关工卡
});

const rules = {
  acNum: [{ required: true, message: "请输入飞机号", trigger: "blur" }],
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
</script>

<style scoped lang="scss">
.body {
  min-height: 100vh;
  width: 100vw;
  font-size: 12px;
  //   background-color: #ccc;
  background-image: url("@/assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;

  .container {
    width: 900px;
    position: relative;
  }

  main {
    padding: 12px 5px;

    .main {
      padding: 60px 6px 40px;
      margin: 0 auto;
      box-sizing: border-box;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
      background-color: hsla(0, 0%, 100%, 0.17);
      margin-bottom: 20px;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);

      .el-form {
        width: 100%;
        padding: 10px;
        background-color: rgba(255, 255, 255, 1);
        

        .el-row {
          margin: 3px 0;
          .el-col {
            padding: 0 5px;
          }
        }
        .from-title {
          border-bottom: 1px solid rgb(204, 204, 204);
          padding: 12px 0px 4px;
          line-height: 36px;

          .title {
            font-weight: 500;
            padding-left: 20px;
            font-size: 1.2em;
          }
          .isFull {
            padding-top: 4px;
            text-align: right;
          }
        }

        // 飞机号
        .acNum-form {
          position: relative;

          // 1/4节点
          .qtn {
            position: absolute;
            top: -16px;
            right: 0;
            font-size: 10px;
            color: #fff;
            background: #4eb5f2;
            padding: 0 2px;
            line-height: 16px;
            border-radius: 3px;
          }
        }
      }

      :deep().el-form-item__label {
        color: #000;
      }
    }
  }
}

@media (max-width: 900px) {
  .header-container,
  .footer-container {
    width: 100%;
  }
}
</style>
