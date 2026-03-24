<template>
  <div class="smartsheet-page">
    <div class="smartsheet-card hint-card">
      <div class="hint-title">填写方式</div>

      <section class="way-section">
        <p class="way-item">1. 扫码进入页面填写</p>
        <img
          src="@/assets/smartsheet/info_sheet.png"
          alt="信息系统的综合技术信息收集"
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
            :href="infoSheetLink"
            target="_blank"
            rel="noopener noreferrer"
            class="link-url"
          >{{ infoSheetLink }}</a>
        </div>
      </section>
    </div>

    <div class="smartsheet-card video-tip-card">
      <div class="hint-title video-tip-title">拍摄视频提示</div>
      <p class="video-tip-text">
        录制视频时请参照下图双手持身份证置于胸前，保持证件信息清晰可见，勿用手指遮挡证件上的文字与照片。
      </p>
      <img
        src="@/assets/smartsheet/id_show.png"
        alt="身份证信息清晰可见的持证照示范"
        class="id-show-img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';

const infoSheetLink = ref(
  'https://doc.weixin.qq.com/smartsheet/form/1_wpangjCgAAh6q7Ir5bIu1IbDV1aIR0lA_c7b339'
);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(infoSheetLink.value);
    showToast({ type: 'success', message: '已复制到剪贴板' });
  } catch {
    showToast({ type: 'fail', message: '复制失败，请手动复制' });
  }
};
</script>

<style scoped>
/* 固定一屏高度 + 内部滚动，避免华为等机型顶部被挡、整页划不动 */
.smartsheet-page {
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: 16px;
  padding-top: calc(env(safe-area-inset-top, 0px) + 56px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
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
.video-tip-card {
  padding: 20px;
}
.video-tip-title {
  margin-bottom: 12px;
}
.video-tip-text {
  margin: 0 0 16px;
  font-size: 15px;
  color: #646566;
  line-height: 1.65;
}
.id-show-img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
