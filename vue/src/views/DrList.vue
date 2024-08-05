<template>
  <div class="body">
    <div class="container">
      <Header
        ref="headerRef"
        page="drList"
        @initData="handleInitData"
        @download="handleDownload"
        @filterDrList="handleFilterDrList"
      />
      <main>
        <div class="dr-list">
          <div class="main">
            <!-- new-dr -->
            <div class="item-box" v-for="(item, index) in drList" :key="item.id">
              <div class="item-header">
                <div class="title">
                  <div class="ac-no">{{ item.acNum }}</div>
                  <div class="status red" v-if="item.status == '待处理'">
                    <el-icon>
                      <Flag />
                    </el-icon>
                    {{ item.status }}
                  </div>
                  <div class="status blue" v-if="item.status == '处理中'">
                    <el-icon>
                      <Flag />
                    </el-icon>
                    {{ item.processorName }}{{ item.status }}
                  </div>
                  <div class="status orange" v-if="item.status == '草稿'">
                    <el-icon>
                      <Flag />
                    </el-icon>
                    {{ item.reporterName }} 暂存
                  </div>
                  <div class="status green" v-if="item.status == '已处理'">
                    <el-icon>
                      <Flag />
                    </el-icon>
                    {{ item.tempSaveByName }}{{ item.status }} {{ item.cardNum }}
                  </div>
                </div>
                <div class="info">
                  <div class="qtr-node">
                    <span>1/4节点：{{ item.quarterNode }}</span>
                  </div>
                  <div class="item-id">
                    {{ pageSize * (currentPage - 1) + index + 1 }} / {{ total }} # (ID :
                    {{ item.id }})
                  </div>
                </div>
              </div>
              <div class="item-content">
                <div class="row between">
                  <!--  缺陷描述 -->
                  <div class="flex1">
                    缺陷描述（
                    <span class="reporter">{{ item.reporterName }}</span>
                    {{ timeFormat(item.reportTime, true) }}）
                  </div>
                  <div class="text-right">
                    <el-button-group>
                      <el-button
                        size="small"
                        type="success"
                        round
                        @click="handleCopy(item.defectFullDesc)"
                        >复制</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        round
                        @click="translateTextFun(item)"
                        >翻译</el-button
                      >
                    </el-button-group>
                  </div>
                </div>

                <div class="defect-desc">
                  <span> {{ item.defectFullDesc }} </span>
                  <span v-if="item.partLoc"> 位置： {{ item.partLoc }} </span>
                  <span v-if="item.partFIN"> FIN： {{ item.partFIN }} </span>
                  <span v-if="item.partQty">
                    数量：{{ item.partQty }} {{ item.partUnit }}
                  </span>
                  <span v-if="item.WIP"> WIP：{{ item.WIP }} </span>
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
                    <el-image
                      :preview-teleported="true"
                      :src="show_pic"
                      fit="cover"
                      :preview-src-list="getPicList(item.pic)"
                    />
                    <span>（共{{ getPicList(item.pic).length }}张）</span>
                  </div>
                  <div class="gtp-info"></div>
                </div>
                <div class="dr-handle-box" v-show="item.showHandleBox">
                  <el-form ref="handleFormRef" label-width="auto" :label-position="'top'">
                    <el-row>
                      <!-- 处理措施 -->
                      <el-col :span="15">
                        <el-form-item label="处理措施" required>
                          <el-select
                            v-model="item.method"
                            allow-create
                            filterable
                            clearable
                            placeholder="请选择处理措施"
                          >
                            <el-option
                              v-for="item in methodOptions"
                              :key="item.id"
                              :label="item.label"
                              :value="item.label"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <!-- 开出工卡卡号 -->
                      <el-col :span="9" v-show="item.method === '开卡处理'">
                        <el-form-item label="开出工卡卡号" required>
                          <el-input
                            v-model="item.cardNum"
                            clearable
                            placeholder="开出工卡卡号"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <!-- 备注 -->
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input
                            v-model="item.remarkPro"
                            clearable
                            placeholder="备注"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <!-- 参考资料 -->
                      <el-col :span="24">
                        <el-form-item label="参考资料">
                          <el-input
                            v-model="item.referTo"
                            clearable
                            placeholder="参考资料"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <!-- 航材件号 -->
                      <el-col :span="24">
                        <el-form-item label="航材件号">
                          <el-input
                            v-model="item.partNo"
                            clearable
                            placeholder="航材件号"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div class="handle-btns">
                      <el-button-group size="small" v-if="item.status == '处理中'">
                        <el-button type="info" @click="exitEditDr(item)"
                          >退出处理</el-button
                        >
                        <el-button type="warning" @click="saveAndExitDr(item)"
                          >暂存并退出</el-button
                        >
                        <el-button type="success" @click="saveDr(item)">保存</el-button>
                        <el-button type="primary" @click="submitDr(item)"
                          >完成并提交</el-button
                        >
                      </el-button-group>

                      <!-- 已处理 -->
                      <el-button
                        size="small"
                        type="warning"
                        @click="item.showHandleBox = false"
                        v-if="item.status == '已处理'"
                        >放弃修改</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="submitDr(item)"
                        v-if="item.status == '已处理'"
                        >完成修改</el-button
                      >
                    </div>
                  </el-form>
                </div>
              </div>
              <!-- 更多 -->
              <div class="item-footer" v-show="!item.showHandleBox">
                <div class="pointer show-info-btn">
                  <el-button
                    @click="item.showMoreInfo = true"
                    v-show="!item.showMoreInfo"
                    type="primary"
                    text
                    size="small"
                  >
                    更多 &nbsp;
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <el-button
                    @click="item.showMoreInfo = false"
                    v-show="item.showMoreInfo"
                    type="primary"
                    text
                    size="small"
                    >收起 &nbsp;
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                  </el-button>
                </div>
                <div class="opt-btns">
                  <!-- 草稿 -->
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteDr(item)"
                    v-if="
                      (item.reporterNum == userStore.userInfo.user && (item.status == '草稿' )) 
                    "
                    >删除</el-button
                  >
                  <el-button
                    size="small"
                    type="warning"
                    @click="editDr(item)"
                    v-if="
                      item.reporterNum == userStore.userInfo.user && (item.status == '草稿')
                    "
                    >修改</el-button
                  >

                  <!-- 待处理 -->
                  <el-button-group
                    size="small"
                    v-if="
                      item.reporterNum == userStore.userInfo.user &&
                      item.status == '待处理'
                    "
                  >
                    <el-button type="info" @click="withdrawDr(item)">撤回</el-button>
                    <el-button type="danger" @click="deleteDr(item)">删除</el-button>
                    <el-button type="warning" @click="editDr(item)">修改</el-button>
                  </el-button-group>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteDr(item)"
                    v-if="
                      (item.reporterNum == userStore.userInfo.user && (item.status == '草稿' || item.status == '待处理')) || (userStore.userInfo.role.indexOf('1') != -1 )
                    "
                    >删除</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="processorDr(item)"
                    v-show="
                      item.status == '待处理' &&
                      userStore.userInfo.role.indexOf('1') != -1
                    "
                    >我来处理</el-button
                  >

                  <!-- 处理中 -->
                  <el-button
                    type="warning"
                    size="small"
                    @click="exitEditDr(item)"
                    v-show="
                      item.status == '处理中' &&
                      item.processorNum == userStore.userInfo.user
                    "
                    >退出处理</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="item.showHandleBox = true"
                    v-show="
                      item.status == '处理中' &&
                      item.processorNum == userStore.userInfo.user
                    "
                    >继续处理</el-button
                  >

                  <!-- 已处理 -->
                  <el-button
                    type="warning"
                    size="small"
                    @click="item.showHandleBox = true"
                    v-show="
                      item.status == '已处理' &&
                      item.processorNum == userStore.userInfo.user
                    "
                    >修改备注信息</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div class="footer-container">
          <div class="tag-group">
            <el-tag
              size="small"
              v-show="drArguments.reporterNum"
              type="primary"
              closable
              @close="deleteTag('reporterNum')"
              >{{ drArguments.reporterNum }}</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.processorNum"
              type="primary"
              closable
              @close="deleteTag('processorNum')"
              >{{ drArguments.processorNum }}</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.drid"
              type="primary"
              closable
              @close="deleteTag('drid')"
              >id:{{ drArguments.drid }}</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.ac"
              type="primary"
              closable
              @close="deleteTag('ac')"
              >{{ drArguments.ac }}</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.dftdsc"
              type="primary"
              closable
              @close="deleteTag('dftdsc')"
              >描述:{{ drArguments.dftdsc }}</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.pending"
              type="primary"
              closable
              @close="deleteTag('pending')"
              >待处理</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.proing"
              type="primary"
              closable
              @close="deleteTag('proing')"
              >处理中</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.proed"
              type="primary"
              closable
              @close="deleteTag('proed')"
              >已处理</el-tag
            >
            <el-tag
              size="small"
              v-show="drArguments.draft"
              type="primary"
              closable
              @close="deleteTag('draft')"
              >暂存</el-tag
            >
          </div>
          <el-button class="filt-btn" @click="drawer = true" circle>
            <el-icon>
              <Search />
            </el-icon>
          </el-button>
        </div>
      </footer>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="currentPageChange"
          background
          layout="prev, pager, next"
          :total="total"
          :hide-on-single-page="true"
        />
      </div>
    </div>

    <!-- 抽屉 -->
    <el-drawer
      v-model="drawer"
      :with-header="false"
      :size="windowWidth >= 900 ? 500 : '100%'"
    >
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
                <el-select
                  v-model="form.acNum"
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
                <el-checkbox
                  v-model="form.pending"
                  :true-value="1"
                  :false-value="0"
                  label="待处理"
                  size="small"
                />
                <el-checkbox
                  v-model="form.draft"
                  :true-value="1"
                  :false-value="0"
                  label="草稿"
                  size="small"
                />
                <el-checkbox
                  v-model="form.proing"
                  :true-value="1"
                  :false-value="0"
                  label="处理中"
                  size="small"
                />
                <el-checkbox
                  v-model="form.proed"
                  :true-value="1"
                  :false-value="0"
                  label="已处理"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 报告提交时间起始 -->
            <el-col :span="12">
              <el-form-item label="提交时间：从" prop="periodFrom">
                <el-date-picker
                  v-model="form.periodFrom"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <!-- 报告提交时间结束 -->
            <el-col :span="12">
              <el-form-item label="至" prop="periodTo">
                <el-date-picker
                  v-model="form.periodTo"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 不限时间 -->
            <el-col :span="24">
              <el-checkbox
                v-model="form.ds"
                :true-value="1"
                :false-value="0"
                label="不限时间（默认只显示近30天的报告）"
                size="small"
              />
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
import { drListAPI, drDownAPI, drFormAPI } from "@/apis/index";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { translateText, getPicList, downloadExcel, timeFormat } from "@/utils/function";
import clipBoard from "vue-clipboard3";
let { toClipboard } = clipBoard(); // 一键复制
import show_pic from "@/assets/images/show_pic.jpg";
import { methodOptions } from "@/data/data.ts";

const userStore = useUserStore();
const router = useRouter();
const drawer = ref(false); // 抽屉
const handleFormRef = ref(null);
const headerRef = ref(null);

// const handleForm = reactive({
//   method: "", // 处理措施
//   remark: "", // 备注
//   referTo: "", // 参考资料
//   partNo: "", // 航材件号
// });

// 分页
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);

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
  pending: 1, // 报告状态 待处理
  proing: 1, // 报告状态 处理中
  proed: "", // 报告状态 已处理
  draft: "", // 报告状态 草稿
  periodFrom: "", // 报告提交时间起始
  periodTo: "", // 报告提交时间结束
  ds: 1, // 不限时间
  partNo: "", // 航材件号
  refTo: "", // 参考资料
  cardNum: "", // 开卡卡号
  pic: "", // 有图片
});

let drArguments = reactive({ ...form });

// 提交表单
const submitForm = () => {
  currentPage.value = 1;
  let page = { ...form };
  getDrList(page);
};

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) {
    return;
  }
  formEl.resetFields();
  form.pending = "";
  form.draft = "";
  form.proing = "";
  form.proed = "";
  form.ds = "";
};

// 获取报告列表
let drList = ref([]);
const getDrList = async (page = drArguments) => {
  page.user = userStore.userInfo.user;
  page.role = userStore.userInfo.role;
  page.page = currentPage.value;
  page.pageSize = pageSize.value;

  drArguments = { ...page };
  const res = await drListAPI(page);
  drList.value = res.result.list;
  total.value = res.result.total;

  if (drawer.value) {
    drawer.value = false;
  }
};

getDrList();

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
  // 调用函数处理并下载
  downloadExcel(res.result.url, res.result.fileName);
};

// 待办、草稿
const handleFilterDrList = async (data) => {
  currentPage.value = 1;
  let page = {
    role: userStore.userInfo.role,
  };
  switch (data.status) {
    case "待办":
      page.pending = 1;
      page.proing = 1;
      break;
    case "草稿":
      page.draft = 1;
      break;
    case "我的报告":
      page.reporterNum = userStore.userInfo.user;
      break;
    case "我处理的":
      page.processorNum = userStore.userInfo.user;
      break;
  }

  getDrList(page);
};

// 删除标签
const deleteTag = (attribute) => {
  form[attribute] = "";
  console.log(form);
  getDrList({ ...form });
};

// 分页变化
const currentPageChange = (val) => {
  currentPage.value = val;
  getDrList({ ...drArguments });
};

// 撤回
const withdrawDr = async (item) => {
  ElMessageBox.confirm("确定要把报告撤回（转为草稿）吗?", "操作确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let page = { ...item };
      page.status = "草稿";
      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "撤回成功",
      });
      getDrList({ ...drArguments });
      headerRef.value.drInit();
    })
    .catch(() => {});
};

// 删除
const deleteDr = async (item) => {
  ElMessageBox.confirm("缺陷报告删除后将不能被恢复，确定要删除吗?", "操作确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let page = { ...item };
      page.status = "已删除";
      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getDrList({ ...drArguments });
      headerRef.value.drInit();
    })
    .catch(() => {});
};

// 修改
const editDr = async (item) => {
  if (item.status == "草稿") {
    router.replace({ path: "/drform", query: { id: item.id } });
    return;
  }
  ElMessageBox.confirm("该缺陷报告将被转为草稿，确定继续吗?", "操作确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let page = { ...item };
      page.status = "草稿";
      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      headerRef.value.drInit();
      router.replace({ path: "/drform", query: { id: item.id } });
    })
    .catch(() => {});
};

// 我来处理
const processorDr = async (item) => {
  ElMessageBox.confirm(
    "该缺陷报告状态将被设为处理中，其他人将无法对其进行任何操作, 是否继续?",
    "操作确认",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      item.status = "处理中";
      let page = { ...item };

      page.processorName = userStore.userInfo.name;
      page.processorNum = userStore.userInfo.user;
      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      item.showHandleBox = true;
    })
    .catch(() => {});
};

// 退出处理
const exitEditDr = async (item) => {
  ElMessageBox.confirm("确定退出处理吗?", "操作确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      
      item.status = "待处理";
      item.processorName = "";
      item.processorNum = "";
      item.method = "";
      item.cardNum = "";
      item.remarkPro = "";
      item.referTo = "";
      item.partNo = "";
      let page = { ...item };

      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      item.showHandleBox = false;
    })
    .catch(() => {});
};

// 暂存并退出
const saveAndExitDr = async (item) => {
  item.status = '处理中'
  item.processorName = userStore.userInfo.name;
  item.processorNum = userStore.userInfo.user;
  let page = { ...item };
  const res = await drFormAPI(page);
  ElMessage({
    type: "success",
    message: "操作成功",
  });
  item.showHandleBox = false;
};

// 保存
const saveDr = async (item) => {
  item.status = '处理中'
  item.processorName = userStore.userInfo.name;
  item.processorNum = userStore.userInfo.user;
  let page = { ...item };
  const res = await drFormAPI(page);
  ElMessage({
    type: "success",
    message: "操作成功",
  });
};

// 完成并提交
const submitDr = async (item) => {
  if (!item.method) {
    ElMessage({
      type: "warning",
      message: "请选择处理措施",
    });
    return;
  }
  if (item.method == "开卡处理" && !item.cardNum) {
    ElMessage({
      type: "warning",
      message: "请填写卡号",
    });
    return;
  }
  ElMessageBox.confirm("请确认各栏信息的正确填写，确定提交吗？", "操作确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let page = { ...item };
      page.processorName = userStore.userInfo.name;
      page.processorNum = userStore.userInfo.user;

      page.status = "已处理";
      const res = await drFormAPI(page);
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      getDrList({ ...drArguments });
      headerRef.value.drInit();
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.body {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
        padding: 60px 6px 0 6px;
        margin: 0 auto;
        width: 100%;
        max-width: 900px;
        max-height: calc(100vh - 100px);
        overflow: auto;

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
            .dr-handle-box {
              padding-top: 5px;
              border-top: 1px dashed #ccc;
              line-height: 1.9em;

              .handle-btns {
                display: flex;
                justify-content: flex-end;
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
            .opt-btns {
              flex: 1;
              text-align: right;
              margin-right: 3px;
              .el-button-group {
                margin-right: 3px;
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

    .tag-group {
      .el-tag {
        margin: 0 2px;
      }
    }

    .filt-btn {
      position: absolute;
      top: -12px;
      right: 0;
      z-index: 10;
    }
  }
}

// 分页
.pagination {
  position: fixed;
  z-index: 20;
  bottom: 37px;
  text-align: center;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;

  button {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    padding: 8px 12px;
    margin: 0 4px;
    border-radius: 3px;
    color: #ddd;
  }
}

.filter-content {
  // padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  // height: 100vh;
  // overflow: auto;

  .filter-footer {
    width: 70%;
    margin: auto;
    display: flex;
    justify-content: space-around;
  }
}

.el-form {
  flex: 1;

  .el-row {
    margin: 0;

    .el-col {
      padding: 0 5px;
    }
  }
}

.red {
  color: #e90d0d;
}
.blue {
  color: #337ab7;
}
.orange {
  color: #ff9633;
}
.green {
  color: green;
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
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 12px; /* 滚动条宽度 */
}

/* 滚动条滑块样式 */
::-webkit-scrollbar-thumb {
  background-color: darkgrey; /* 滑块颜色 */
  border-radius: 10px; /* 滑块边角圆滑度 */
  border: 2px solid transparent; /* 滑块边框 */
  background-clip: content-box; /* 边框不占据滑块内部空间 */
}

/* 滚动条轨道样式 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 轨道颜色 */
  border-radius: 10px; /* 轨道边角圆滑度 */
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 滑块悬停时的颜色 */
}

@media (max-width: 900px) {
  .header-container,
  .footer-container {
    width: 100%;
  }
}
</style>
