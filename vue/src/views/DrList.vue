<template>
  <div class="body">
    <div class="container">
      <Header />
      <main>
        <div class="dr-list">
          <div class="main">
            <div class="new-dr item-box">
              <div class="item-header">
                <div class="title">
                  <div class="ac-no">A6-EDV</div>
                  <div class="status red">
                    <el-icon><Flag /></el-icon>
                    待处理
                  </div>
                </div>
                <div class="info">
                  <div class="qtr-node">
                    <span>1/4节点：2024-08-05 12:00</span>
                  </div>
                  <div class="item-id">1/1437# (ID:16945)</div>
                </div>
              </div>
              <div class="item-content">
                <div class="row">
                  <div>
                    缺陷描述（
                    <span class="reporter">张晋珲</span>
                    24-07-19 08:50）：
                  </div>
                  <div class="flex1 text-right">
                    <el-button-group>
                      <el-button size="small" type="success" round>复制</el-button>
                      <el-button size="small" type="primary" round>翻译</el-button>
                    </el-button-group>
                  </div>
                </div>

                <div class="defect-desc">
                  客舱SA浴室控制组件格栅连接垫片缺失，数量：5EA
                </div>
                <div class="row translation-row">
                  <div class="label">翻译：</div>
                  <div class="translation-result">
                    THE LOWER INSTALLATION SEAT OF THE FRONT DOOR FRAME OF DOOR NO. 5 ON
                    THE LEFT IS DAMAGED, QUANTITY: 1EA
                  </div>
                </div>

                <div class="more-info">
                  <div class="row">
                    <div class="label">相关工卡：</div>
                    <div class="value">N/A</div>
                  </div>
                  <div class="row">
                    <div class="label">备注：</div>
                    <div class="value">对应的安装螺丝加领15ea</div>
                  </div>
                  <div class="row">
                    <div class="label" style="display: flex; align-items: end">
                      相关图片：
                    </div>
                    <el-image
                      style="width: 95px; height: 22px; border-radius: 4px"
                      :src="show_pic"
                      :preview-src-list="[show_pic]"
                    />
                    <span>（共2张）</span>
                  </div>
                  <div class="gtp-info"></div>
                </div>
              </div>
              <div class="item-footer">
                <div class="pointer show-info-btn">
                  <el-button type="primary" text size="small">
                    更多<el-icon><ArrowDown /></el-icon>
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
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

import show_pic from "@/assets/images/show_pic.jpg";

const userStore = useUserStore();
const router = useRouter();


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

            .label {
              white-space: nowrap;
            }

            .row {
              display: flex;

              .reporter {
                cursor: pointer;
              }
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
            padding: 2px 8px;
            display: flex;
            line-height: 24px;

            .show-info-btn {
              display: flex;
              align-items: end;
              color: #444 !important;
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
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 10px;
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

@media (max-width: 900px) {
  .header-container,
  .footer-container {
    width: 100%;
  }
}
</style>
