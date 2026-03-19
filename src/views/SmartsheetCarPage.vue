<template>
  <div class="smartsheet-page">
    <div class="smartsheet-card hint-card">
      <div class="hint-title">填写方式</div>

      <section class="way-section">
        <p class="way-item">1. 扫码进入页面填写</p>
        <img
          src="@/assets/smartsheet/car_sheet.png"
          alt="车辆经营租赁业务的推广"
          class="sheet-img"
        />
      </section>

      <section class="way-section">
        <p class="way-item">2. 复制下方链接，在微信中打开</p>
        <div class="link-block">
          <div class="link-row">
            <span class="link-label">链接</span>
            <span class="copy-icon" title="点击复制" aria-label="复制" @click.stop="copyLink">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </span>
          </div>
          <a
            :href="carSheetLink"
            target="_blank"
            rel="noopener noreferrer"
            class="link-url"
          >{{ carSheetLink }}</a>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';

const carSheetLink = ref(
  'https://doc.weixin.qq.com/smartsheet/form/1_wpangjCgAAh6q7Ir5bIu1IbDV1aIR0lA_d43a87'
);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(carSheetLink.value);
    showToast({ type: 'success', message: '已复制到剪贴板' });
  } catch {
    showToast({ type: 'fail', message: '复制失败，请手动复制' });
  }
};
</script>

<style scoped>
.smartsheet-page {
  min-height: 100vh;
  padding: 16px;
  padding-top: calc(env(safe-area-inset-top, 0px) + 24px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  box-sizing: border-box;
  background: linear-gradient(180deg, #f0f2f5 0%, #f5f6fa 100%);
}
.smartsheet-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.hint-card {
  margin-bottom: 20px;
  padding: 20px;
}
.hint-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 3px solid #1989fa;
}
.way-section {
  margin-bottom: 24px;
}
.way-section:last-child {
  margin-bottom: 0;
}
.way-item {
  margin: 0 0 12px;
  font-size: 15px;
  color: #323233;
  font-weight: 500;
}
.sheet-img {
  display: block;
  width: 100%;
  max-width: 260px;
  height: auto;
  margin: 0 auto;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.link-block {
  padding: 12px 14px;
  background: #f7f8fa;
  border-radius: 8px;
  transition: background 0.2s;
}
.copy-icon {
  cursor: pointer;
}
.copy-icon:active {
  opacity: 0.7;
}
.link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.link-label {
  font-size: 15px;
  color: #969799;
}
.link-url {
  display: block;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #1989fa;
  word-break: break-all;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.link-url:hover {
  color: #0d7de0;
}
.copy-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1989fa;
}
.copy-icon svg {
  display: block;
}
</style>
