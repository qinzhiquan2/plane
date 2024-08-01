<template>
  <div class="body">
    <div class="container">
      <Header page="drForm" @initData="handleInitData" />
      <main>
        <div class="main">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            :label-position="'top'"
          >
            <el-row class="from-title">
              <!-- 标题：飞机缺陷报告 -->
              <el-col :span="10"><span class="title">飞机缺陷报告</span></el-col>
              <!-- 完整缺陷 选择框 -->
              <el-col :span="14" class="isFull">
                <el-checkbox v-model="ruleForm.isFullDesc" label="完整缺陷描述方式填写" />
              </el-col>
            </el-row>
            <el-row>
              <!-- 飞机号 -->
              <el-col :span="12">
                <el-form-item class="acNum-form" label="飞机号" required prop="acNum">
                  <div class="qtn" v-show="ruleForm.quarterNode">
                    1/4节点: {{ ruleForm.quarterNode }}
                  </div>
                  <el-select
                    v-model="ruleForm.acNum"
                    @change="acNumChange"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择飞机号"
                  >
                    <el-option
                      v-for="item in acNumOptions"
                      :key="item.id"
                      :label="item.lineValue"
                      :value="item.lineValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 相关工卡 -->
              <el-col :span="12">
                <el-form-item label="相关工卡" required prop="relatedCard">
                  <el-input
                    v-model="ruleForm.relatedCard"
                    clearable
                    placeholder="相关工卡的序号或完整卡号"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 主区域 -->
              <el-col :span="12">
                <el-form-item label="主区域">
                  <el-select
                    v-model="ruleForm.mainZone"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择主区域"
                  >
                    <el-option
                      v-for="item in mainZoneOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 子区域 -->
              <el-col :span="12">
                <el-form-item label="子区域">
                  <el-input
                    v-model="ruleForm.subZone"
                    clearable
                    placeholder="如：1号门区域，FR80等"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 主部件 -->
              <el-col :span="12">
                <el-form-item label="主部件">
                  <el-select
                    v-model="ruleForm.mainPart"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择主部件"
                  >
                    <el-option
                      v-for="item in mainPartOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 子部件 -->
              <el-col :span="12" v-show="ruleForm.mainPart">
                <el-form-item label="子部件">
                  <el-select
                    v-model="ruleForm.subPart"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择子部件"
                  >
                    <el-option
                      v-for="item in getSubPartOptions()"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 缺陷描述 -->
              <el-col :span="24">
                <el-form-item label="缺陷描述" required prop="defectDesc">
                  <el-select
                    v-model="ruleForm.defectDesc"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择缺陷描述"
                  >
                    <el-option
                      v-for="item in defectDescOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 详细位置 -->
              <el-col :span="12">
                <el-form-item label="详细位置">
                  <el-input
                    v-model="ruleForm.partLoc"
                    clearable
                    placeholder="座位号之类的"
                  />
                </el-form-item>
              </el-col>
              <!-- FIN/设备号/盖板号 -->
              <el-col :span="12">
                <el-form-item label="FIN/设备号/盖板号">
                  <el-input
                    v-model="ruleForm.partFIN"
                    clearable
                    placeholder="座位号之类的"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 数量 -->
              <el-col :span="12">
                <el-form-item label="数量">
                  <el-input v-model="ruleForm.partQty" clearable placeholder="数量" />
                </el-form-item>
              </el-col>
              <!-- 单位 -->
              <el-col :span="6">
                <el-form-item label="单位">
                  <el-input v-model="ruleForm.partUnit" clearable placeholder="单位" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- WIP号 -->
              <el-col :span="24">
                <el-form-item label="WIP号">
                  <el-input v-model="ruleForm.wipNum" clearable placeholder="WIP号" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 建议处理方案 -->
              <el-col :span="12">
                <el-form-item label="建议处理方案">
                  <el-select
                    v-model="ruleForm.suggestion"
                    allow-create
                    filterable
                    clearable
                    placeholder="请选择处理方案"
                  >
                    <el-option
                      v-for="item in suggestionOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 备注 -->
              <el-col :span="6">
                <el-form-item label="备注">
                  <el-input
                    v-model="ruleForm.remark"
                    clearable
                    placeholder="提供件号等有用信息以加快处理"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 上传照片 -->
            <el-row id="picUploadBox">
              <input
                type="file"
                accept="image/*"
                id="pics"
                ref="pics"
                hidefocus=""
                multiple="multiple"
                style="display: none"
                @change="uploadPics"
              />
              <div id="imgs">
                <div class="img" v-for="(item, index) in ruleForm.pic" :key="index">
                  <div class="delete-btn" @click="deletePic(index)">
                    <el-icon><Delete /></el-icon>
                  </div>
                  <el-image
                    :src="item"
                    :preview-src-list="ruleForm.pic"
                    :initial-index="index"
                    fit="cover"
                  />
                </div>
              </div>
              <div id="imgIcon" @click="picsClick()" v-show="ruleForm.pic.length < 2">
                <el-icon><CirclePlus /></el-icon>
                <br />
                最多可传2张
                <br />
                单张不超10M
              </div>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="button-group">
                  <el-button
                    size="small"
                    type="primary"
                    @click="submitForm(ruleFormRef, '待处理')"
                    >提交</el-button
                  >
                  <el-button
                    size="small"
                    type="success"
                    @click="submitForm(ruleFormRef, '草稿')"
                    >保存草稿</el-button
                  >
                  <el-button size="small" type="warning" @click="resetForm(ruleFormRef)"
                    >重置</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </main>
      <footer>
        <div class="fullDescBox">完整描述：{{ getFullDesc() }}</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Header from "@/components/Header.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  mainZoneOptions,
  mainPartOptions,
  defectDescOptions,
  suggestionOptions,
} from "@/data/data.ts";
import { drFormAPI, drInfoAPI } from "@/apis/index";
import { getTimeStr, getPicList } from "@/utils/function";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const queryId = ref(route.query.id ?? "");

// 表单属性
const ruleFormRef = ref();
const ruleForm = reactive({
  isFullDesc: false, // 完整缺陷描述方式填写
  acNum: "", // 飞机号
  quarterNode: "", // 1/4节点
  relatedCard: "", // 相关工卡
  mainZone: "", // 主区域
  subZone: "", // 子区域
  mainPart: "", // 主部件
  subPart: "", // 子部件
  defectDesc: "", // 缺陷描述
  partLoc: "", // 详细位置
  partFIN: "", // FIN/设备号/盖板号
  partQty: "", // 数量
  partUnit: "EA", // 单位
  wipNum: "", // WIP号
  suggestion: "", // 建议处理方案
  remark: "", // 备注
  pic: [], // 图片
});

const initPage = async () => {
  if (queryId.value) {
    let page = {
      id: queryId.value,
      user: userStore.userInfo.user,
    };
    let res = await drInfoAPI(page);

    if (!res.success) {
      setTimeout(() => {
        router.replace({ path: "/drlist" });
      }, 1000);
    } else {
      if (res.result.pic) {
        res.result.pic = getPicList(res.result.pic);
      } else {
        res.result.pic = [];
      }
      for (const key in ruleForm) {
        ruleForm[key] = res.result[key];
      }
    }
  }
};
initPage();

const acNumOptions = ref([]); // 飞机号列表
// 飞机号改变
const acNumChange = (value) => {
  if (value) {
    let item = acNumOptions.value.find((item) => item.lineValue === value);
    if (item) {
      ruleForm.quarterNode = item.lineQtn;
    }
  }
};

// 表单校验规则
const rules = reactive({
  acNum: [{ required: true, message: "请输入飞机号", trigger: "change" }], // 飞机号
  relatedCard: [{ required: true, message: "请输入相关工卡", trigger: "blur" }], // 相关工卡
  defectDesc: [{ required: true, message: "请输入缺陷描述", trigger: "change" }], // 缺陷描述
});

// 获取子部件下拉选项
const getSubPartOptions = () => {
  let result = [];
  if (ruleForm.mainPart) {
    return mainPartOptions.find((item) => item.label === ruleForm.mainPart).subPart;
  }
  return result;
};

// 图片列表
const pics = ref(null);
// 点击上传照片图标
const picsClick = () => {
  pics.value.click();
};
// 读取照片
const uploadPics = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    ruleForm.pic.push(event.target.result);
  };
  reader.readAsDataURL(file);
};
// 删除照片
const deletePic = (index) => {
  ruleForm.pic.splice(index, 1);
};

// 提交表单或者保存草稿
const submitForm = async (formEl, status) => {
  if (!formEl) return;
  let isPass = true
  if (status == "待处理") {
    await formEl.validate(async (valid, fields) => {
      if (!valid) {
        ElMessage.warning("请检查表单信息");
        isPass = false
        return false;
      }
    });
  } else if (status == "草稿") {
    if (!ruleForm.acNum) {
      ElMessage.warning("请选择飞机号");
      isPass = false
      return false;
    }
  }
  if(!isPass){
    return
  }
  let form = { ...ruleForm };
  if (queryId.value) {
    form.id = queryId.value;
  }
  form.reporterName = userStore.userInfo.name; // 报告人
  form.reporterNum = userStore.userInfo.user; // 报告人工号
  form.reportTime = getTimeStr(new Date(), false); // 报告时间
  form.status = status; // 状态
  form.defectFullDesc = getFullDesc(); // 完整描述
  form.pics = form.pic; // 完整描述
  delete form.pic;
  for (let i = 0; i < form.pics.length; i++) {
    form.pics[i] = form.pics[i].replace(/http:\/\/localhost:3000/g, "");
  }

  const res = await drFormAPI(form);
  if (res.success) {
    ElMessage.success("提交成功");
    resetForm(ruleFormRef.value);
    ruleForm.pic = [];

    setTimeout(() => {
      router.replace({ path: "/drlist" });
    }, 1000);
  } else {
    ElMessage.error("提交失败");
  }
};

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 完整描述：
const getFullDesc = () => {
  return `${ruleForm.mainZone}${ruleForm.subZone}${ruleForm.mainPart}${ruleForm.subPart}${ruleForm.defectDesc}，数量：${ruleForm.partQty} ${ruleForm.partUnit}`;
};

const handleInitData = (drInitData) => {
  acNumOptions.value = drInitData.lines;
};
</script>

<style scoped lang="scss">
.body {
  min-height: 100vh;
  width: 100vw;
  font-size: 12px;
  // background-color: #ccc;
  background-image: url("@/assets/images/form-bg.jpg");
  background-size: cover;
  background-position: 50%;
  background-attachment: fixed;
  display: flex;
  justify-content: center;

  .container {
    width: 900px;
    position: relative;
  }

  main {
    padding: 40px 5px;

    .main {
      padding: 10px 6px;
      margin: 0 auto;
      box-sizing: border-box;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
      background-color: hsla(0, 0%, 100%, 0.17);
      margin-bottom: 20px;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);

      .el-form {
        width: 100%;
        padding: 0 10px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.3);

        .el-row {
          margin: 0;
          .el-col {
            padding: 0 5px;
          }
        }
        .from-title {
          border-bottom: 1px solid rgb(204, 204, 204);
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
        // 上传照片
        #picUploadBox {
          display: flex;
          padding-bottom: 4px;

          #imgs {
            display: flex;
            .img {
              position: relative;
              width: 70px;
              height: 70px;
              border: 1px solid #ddd;
              margin-right: 5px;
              padding: 1px;
              .delete-btn {
                position: absolute;
                background: #fff;
                width: 24px;
                height: 24px;
                line-height: 24px;
                right: 0;
                top: 0;
                text-align: center;
                border-radius: 0 0 0 16px;
                font-size: 1.2em;
                padding: 0 0 0 4px;
                color: red;
                z-index: 1;
              }
              .el-image {
                width: 100%;
                height: 100%;
              }
            }
          }
          #imgIcon {
            width: 70px;
            height: 70px;
            display: inline-block;
            text-align: center;
            background: url(../img/photo_icon.e8bedd7b.jpg) no-repeat 50%;
            opacity: 0.7;
            padding-top: 4px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            font-size: 10px;
            line-height: 16px;
            text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.8);
            vertical-align: top;
          }
          .picUploadBtnBox {
            text-align: center;
            display: inline-block;
            flex: 1;
            font-size: 13px;
            #picUploadTips {
              padding: 10px 0;
            }
          }
        }

        // 按钮组
        .button-group {
          text-align: center;
          margin: 20px 0;
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
        color: #606266;
        margin-bottom: 0;
      }
    }
  }
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  .fullDescBox {
    width: 900px;
    background-color: rgba(198, 226, 255);
    padding: 5px 10px;
  }
}

@media (max-width: 900px) {
  .header-container,
  .footer-container {
    width: 100%;
  }
}
</style>
