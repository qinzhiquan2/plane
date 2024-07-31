<template>
  <div class="body">
    <div class="container">
      <Header page="drList" @initData="handleInitData" @download="handleDownload" @filterDrList="handleFilterDrList" />
      <main>
        <div class="dr-list">
          <div class="main">
            <div class="new-dr item-box" v-for="item in drList" :key="item.id">
              <div class="item-header">
                <div class="title">
                  <div class="ac-no">{{ item.acNum }}</div>
                  <div class="status red">
                    <el-icon>
                      <Flag />
                    </el-icon>
                    {{ item.status }}
                  </div>
                </div>
                <div class="info">
                  <div class="qtr-node">
                    <span>1/4节点：{{ item.quarterNode }}</span>
                  </div>
                  <div class="item-id">1/1437# (ID : {{ item.id }})</div>
                </div>
              </div>
              <div class="item-content">
                <div class="row between">
                  <!--  缺陷描述 -->
                  <div class="flex1">
                    缺陷描述（
                    <span class="reporter">{{ item.reporterName }}</span>
                    {{ item.reportTime }}）：
                  </div>
                  <div class="text-right">
                    <el-button-group>
                      <el-button size="small" type="success" round
                        @click="handleCopy(item.defectFullDesc)">复制</el-button>
                      <el-button size="small" type="primary" round @click="translateTextFun(item)">翻译</el-button>
                    </el-button-group>
                  </div>
                </div>

                <div class="defect-desc">
                  {{ item.defectFullDesc }}
                </div>
                <div class="row translation-row" v-if="item.translationResult">
                  <div class="label">翻译：</div>
                  <div class="translation-result">
                    &nbsp; {{ item.translationResult }}
                  </div>
                </div>

                <div class="more-info" v-show="item.showMoreInfo">
                  <div class="row">
                    <div class="label">相关工卡：</div>
                    <div class="value">{{ item.relatedCard }}</div>
                  </div>
                  <div class="row">
                    <div class="label">备注：</div>
                    <div class="value">{{ item.remark }}</div>
                  </div>
                  <div class="row" v-if="item.pic">
                    <div class="label" style="display: flex; align-items: end">
                      相关图片：
                    </div>
                    <el-image :preview-teleported="true" :src="show_pic" fit="cover"
                      :preview-src-list="getPicList(item.pic)" />
                    <span>（共2张）</span>
                  </div>
                  <div class="gtp-info"></div>
                </div>
              </div>
              <div class="item-footer">
                <div class="pointer show-info-btn">
                  <el-button @click="item.showMoreInfo = true" v-show="!item.showMoreInfo" type="primary" text
                    size="small">
                    更多 &nbsp; <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <el-button @click="item.showMoreInfo = false" v-show="item.showMoreInfo" type="primary" text
                    size="small">收起 &nbsp; <el-icon>
                      <ArrowUp />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div class="footer-container">
          <el-tag closable type="primary">Tag 1</el-tag>
          <el-button class="filt-btn" @click="drawer = true" circle>
            <el-icon>
              <Search />
            </el-icon>
          </el-button>
        </div>
      </footer>
    </div>

    <!-- 抽屉 -->
    <el-drawer v-model="drawer" :with-header="false" :size="windowWidth >= 900 ? 500 : '100%'">
      <div class="filter-content">
        <el-form ref="formRef" :model="form" label-width="auto" :label-position="'top'">
          <el-row>
            <!-- 报告ID号 -->
            <el-col :span="12">
              <el-form-item label="报告ID号" prop="drid">
                <el-input v-model="form.drid" clearable placeholder="多个ID用逗号隔开" />
              </el-form-item>
            </el-col>
            <!-- 飞机号 -->
            <el-col :span="12">
              <el-form-item label="飞机号" prop="acNum">
                <el-select v-model="form.acNum" allow-create filterable clearable placeholder="请选择飞机号">
                  <el-option v-for="item in acNumOptions" :key="item.id" :label="item.lineValue"
                    :value="item.lineValue" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 缺陷描述 -->
            <el-col :span="24">
              <el-form-item label="缺陷描述" prop="dftdsc">
                <el-input v-model="form.dftdsc" clearable placeholder="缺陷描述" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 提交人姓名 -->
            <el-col :span="12">
              <el-form-item label="提交人：姓名" prop="rptrna">
                <el-input v-model="form.rptrna" clearable placeholder="提交人姓名" />
              </el-form-item>
            </el-col>
            <!-- 提交人员工号 -->
            <el-col :span="12">
              <el-form-item label="或员工号" prop="rptrnu">
                <el-input v-model="form.rptrnu" clearable placeholder="提交人员工号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 处理人姓名 -->
            <el-col :span="12">
              <el-form-item label="处理人：姓名" prop="prorna">
                <el-input v-model="form.prorna" clearable placeholder="处理人姓名" />
              </el-form-item>
            </el-col>
            <!-- 提交人员工号 -->
            <el-col :span="12">
              <el-form-item label="或员工号" prop="prornu">
                <el-input v-model="form.prornu" clearable placeholder="处理人员工号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 状态 -->
            <el-col :span="24">
              <el-form-item label="报告状态">
                <el-checkbox v-model="form.pending" :true-value="1" :false-value="0" label="待处理" size="small" />
                <el-checkbox v-model="form.temppro" :true-value="1" :false-value="0" label="草稿" size="small" />
                <el-checkbox v-model="form.proing" :true-value="1" :false-value="0" label="处理中" size="small" />
                <el-checkbox v-model="form.proed" :true-value="1" :false-value="0" label="已处理" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 报告提交时间起始 -->
            <el-col :span="12">
              <el-form-item label="提交时间：从" prop="periodFrom">
                <el-date-picker v-model="form.periodFrom" type="date" placeholder="选择日期" size="small" />
              </el-form-item>
            </el-col>
            <!-- 报告提交时间结束 -->
            <el-col :span="12">
              <el-form-item label="至" prop="periodTo">
                <el-date-picker v-model="form.periodTo" type="date" placeholder="选择日期" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 不限时间 -->
            <el-col :span="24">
              <el-checkbox v-model="form.ds" label="不限时间（默认只显示近30天的报告）" size="small" />
            </el-col>
          </el-row>
          <el-row>
            <!-- 航材件号 -->
            <el-col :span="24">
              <el-form-item label="航材件号" prop="partNo">
                <el-input v-model="form.partNo" clearable placeholder="航材件号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 参考资料 -->
            <el-col :span="24">
              <el-form-item label="参考资料" prop="refTo">
                <el-input v-model="form.refTo" clearable placeholder="参考资料" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 开卡卡号 -->
            <el-col :span="12">
              <el-form-item label="开卡卡号" prop="cardNum">
                <el-input v-model="form.cardNum" clearable placeholder="开卡卡号" />
              </el-form-item>
            </el-col>
            <!-- 有图片 -->
            <el-col :span="12">
              <el-form-item label="其他条件" prop="pic">
                <el-checkbox v-model="form.pic" label="有图片" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="filter-footer">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="info" @click="resetForm(formRef)">清空</el-button>
          <el-button type="primary" @click="submitForm()">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import Header from "@/components/Header.vue";
import { drListAPI, drDownAPI } from "@/apis/index";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { ElMessage, subMenuProps } from "element-plus";
import { translateText, getPicList, downloadExcel, getTimeStr } from "@/utils/function";
import clipBoard from "vue-clipboard3";
let { toClipboard } = clipBoard(); // 一键复制
import show_pic from "@/assets/images/show_pic.jpg";

const userStore = useUserStore();
const router = useRouter();
const drawer = ref(false); // 抽屉

let acNumOptions = ref([]); // 飞机号列表

// 表单
const formRef = ref();
const form = reactive({
  drid: "", // 报告id
  ac: "", // 飞机号
  dftdsc: "", // 缺陷描述
  rptrna: "", // 报告人姓名
  rptrnu: "", // 报告人员工号
  prorna: "", // 处理人姓名
  prornu: "", // 处理人员工号
  pending: "", // 报告状态 待处理
  temppro: "", // 报告状态 草稿
  proing: "", // 报告状态 处理中
  proed: "", // 报告状态 已处理
  draft: "", // 报告状态 草稿
  periodFrom: "", // 报告提交时间起始
  periodTo: "", // 报告提交时间结束
  ds: "", // 不限时间
  partNo: "", // 航材件号
  refTo: "", // 参考资料
  cardNum: "", // 开卡卡号
  pic: "", // 有图片
});

let drArguments = reactive({})

// 提交表单
const submitForm = () => {
  let page = {...form}
  getDrList(page)
}

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) {
    return;
  }
  formEl.resetFields();
  form.pending = "";
  form.temppro = "";
  form.proing = "";
  form.proed = "";
  form.ds = "";
};


// 获取报告列表
let drList = ref([]);
const getDrList = async (page = drArguments) => {
  drArguments = { ...page }
  // page.user = userStore.userInfo.user;
  page.role = userStore.userInfo.role;
  const res = await drListAPI(page);
  drList.value = res.result;

  if (drawer.value) {
    drawer.value = false;
  }
};

// 获取报告列表参数
const initDrList = () => {
  let page = { ...form };
  page.pending = 1 // 待处理
  page.proing = 1 // 处理中

  getDrList(page)
}
initDrList();

// 复制缺陷描述
const handleCopy = async (text) => {
  try {
    await toClipboard(text);
    ElMessage({
      message: "复制成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: e,
      type: "error",
    });
  }
};

// 翻译
const translateTextFun = async (item) => {
  const res = await translateText(item.defectFullDesc);
  item.translationResult = res;
};

const windowWidth = ref(0);

onMounted(() => {
  // 获取窗口宽度
  windowWidth.value = window.innerWidth;

  // 添加事件监听，监听窗口大小变化
  window.addEventListener("resize", updateWindowWidth);
});

// 组件销毁前移除事件监听
onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// 接收飞机号列表数据
const handleInitData = (drInitData) => {
  acNumOptions.value = drInitData.lines;
};
// 下载
const handleDownload = async () => {
  let page = { ...form };
  page.user = userStore.userInfo.user;
  page.role = userStore.userInfo.role;
  const res = await drDownAPI(page);
  console.log(res)
  // 调用函数处理并下载  
  downloadExcel(res.result.url, res.result.fileName);
};

// 待办、草稿
const handleFilterDrList = async (data) => {
  let page = {
    role: userStore.userInfo.role,
  }
  switch (data.status) {
    case '待办':
      page.pending = 1
      break;
    case '草稿':
      page.draft = 1
      break
    case '我的报告':
      page.reporterNum = userStore.userInfo.user
      break
    case '我处理的':
      page.processorNum = userStore.userInfo.user
      break
  }

  const res = await drListAPI(page);
  drList.value = res.result;
}
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
    background-color: hsla(0, 0%, 100%, 0.17);
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

    .dr-list {
      .main {
        padding: 60px 6px 40px;
        margin: 0 auto;
        width: 100%;
        max-width: 900px;

        .item-box {
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
          //   background-color: hsla(0, 0%, 100%, 0.4);
          margin-bottom: 20px;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);

          .item-header {
            padding: 6px 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);

            .title {
              display: flex;

              .ac-no {
                font-size: 1.2em;
                font-weight: 600;
                cursor: pointer;
              }

              .status {
                flex: 1;
                text-align: right;
              }
            }

            .info {
              font-size: 0.9em;
              display: flex;

              .item-id {
                flex: 1;
                text-align: right;
              }
            }
          }

          .item-content {
            padding: 2px 8px;

            .between {
              display: flex;
              justify-content: space-between;
            }

            .label {
              white-space: nowrap;
            }

            .row {
              display: flex;

              .reporter {
                cursor: pointer;
              }
            }

            .el-button-group {
              display: flex;
            }

            .defect-desc {
              word-break: break-all;
              font-size: 1.1em;
              padding: 2px;
              border: 1px dashed rgba(0, 0, 0, 0.08);
              margin: 4px 0;
              border-radius: 4px;
              min-height: 40px;
            }

            .translation-row {
              .translation-result {
                position: relative;
                word-break: break-all;
              }

              .translation-result:before {
                content: "(仅供参考)";
                display: inline-block;
                color: red;
              }
            }

            .more-info {
              line-height: 1.9em;
              overflow: hidden;

              .value {
                word-break: break-all;
              }

              .gtp-info {
                border-top: 1px dashed #ccc;
              }
            }
          }

          .item-footer {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding: 2px 0;
            display: flex;
            line-height: 24px;

            .show-info-btn {
              display: flex;
              align-items: end;
              color: #444 !important;

              button {
                margin: 0;
              }
            }
          }
        }

        .new-dr {
          border: 1px dashed #6657a6;
          position: relative;
        }

        .new-dr:before {
          position: absolute;
          content: "NEW";
          font-size: 46px;
          color: rgba(102, 87, 166, 0.25);
          top: 27px;
          left: 220px;
          transform: rotate(-35deg);
          font-weight: 600;
        }
      }
    }
  }
}

footer {
  width: 100%;
  position: fixed;
  width: 100%;
  z-index: 10;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;

  .footer-container {
    width: 900px;
    height: 32px;
    background-color: rgb(198, 226, 255);
    // overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 10px;
    position: relative;

    .filt-btn {
      position: absolute;
      top: -12px;
      right: 0;
      z-index: 10;
    }
  }
}

.filter-content {
  // padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  // height: 100vh;
  // overflow: auto;

  .el-form {
    flex: 1;

    .el-row {
      margin: 0;

      .el-col {
        padding: 0 5px;
      }
    }
  }

  .filter-footer {
    width: 70%;
    margin: auto;
    display: flex;
    justify-content: space-around;
  }
}

.red {
  color: #e90d0d;
}

.flex1 {
  flex: 1;
}

.text-right {
  text-align: right;
}

.pointer {
  cursor: pointer;
}

:deep().el-drawer__body {
  padding: 10px !important;
}

:deep().el-form-item {
  color: #606266;
  margin-bottom: 6px;
}

@media (max-width: 900px) {

  .header-container,
  .footer-container {
    width: 100%;
  }
}
</style>
