<template>
  <div class="guide-page">
    <van-nav-bar
      :title="pageTitle"
      left-arrow
      fixed
      placeholder
      @click-left="onBack"
    />
    <div class="guide-body">
      <iframe
        v-if="pdfUrl"
        :src="iframePdfUrl"
        class="guide-iframe"
        :title="pageTitle"
      />
      <p v-else class="guide-error">指引文件加载失败</p>
    </div>
    <div v-if="pdfUrl" class="guide-open-new">
      <van-button block type="primary" class="guide-open-btn" @click="downloadToPhone">
        下载到手机
      </van-button>
      <van-button block type="primary" plain class="guide-open-btn-secondary" @click="openInNewTab">
        在新窗口打开完整指引
      </van-button>
      <p class="guide-open-tip">手机端建议下载或在新窗口打开以查看全部页面</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, closeToast } from 'vant';

const route = useRoute();
const router = useRouter();

const guideConfig = computed(() => {
  const name = route.name as string;
  let title = '工商验证指引';
  let pdf = '';
  try {
    if (name === 'TaxRegistrationGuide') {
      title = '税务登记指引';
      pdf = new URL('../assets/guide/tax_registration.pdf', import.meta.url).href;
    } else {
      pdf = new URL('../assets/guide/alipay_guide.pdf', import.meta.url).href;
    }
  } catch {
    pdf = '';
  }
  return { title, pdf };
});

const pageTitle = computed(() => guideConfig.value.title);

const pdfUrl = computed(() => guideConfig.value.pdf);

/** 供 iframe 使用的 URL，加上 #view=FitH 便于浏览器内完整纵向滚动查看多页 */
const iframePdfUrl = computed(() => {
  const url = pdfUrl.value;
  if (!url) return '';
  return url.includes('#') ? url : `${url}#view=FitH&toolbar=0`;
});

const onBack = () => {
  // 指引页仅从注册/状态页进入，点击返回统一回到注册页，避免在部分浏览器/WebView 中 router.back() 无效导致无法返回
  router.replace('/individual/register');
};

const openInNewTab = () => {
  if (pdfUrl.value) {
    window.open(pdfUrl.value, '_blank', 'noopener,noreferrer');
  }
};

/** 下载 PDF 到手机：先拉取为 blob 再触发下载；部分浏览器会直接打开，可提示用户通过分享保存 */
const downloadToPhone = async () => {
  const url = pdfUrl.value;
  if (!url) return;
  const filename = `${pageTitle.value}.pdf`;
  showToast({ type: 'loading', message: '准备下载...', forbidClick: true });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('下载失败');
    const blob = await res.blob();
    closeToast();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    showToast({ type: 'success', message: '已开始下载' });
  } catch {
    closeToast();
    showToast({
      type: 'fail',
      message: '下载失败，请点击「在新窗口打开」后通过分享保存'
    });
  }
};
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: #f5f6fa;
}
.guide-body {
  padding: 12px;
  box-sizing: border-box;
}
.guide-iframe {
  width: 100%;
  max-width: 100%;
  height: 60vh;
  max-height: 480px;
  border: none;
  display: block;
  border-radius: 8px;
  background: #fff;
}
.guide-error {
  padding: 24px;
  text-align: center;
  color: #969799;
}
.guide-open-new {
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  background: #f5f6fa;
}
.guide-open-btn {
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}
.guide-open-btn-secondary {
  margin-top: 12px;
  font-size: 15px;
  height: 44px;
  border-radius: 22px;
}
.guide-open-tip {
  margin: 12px 0 0;
  font-size: 12px;
  color: #969799;
  line-height: 1.5;
}
</style>
