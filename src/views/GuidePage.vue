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
        :src="pdfUrl"
        class="guide-iframe"
        :title="pageTitle"
      />
      <p v-else class="guide-error">指引文件加载失败</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

const onBack = () => {
  router.back();
};
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: #f5f6fa;
}
.guide-body {
  padding: 0;
  height: calc(100vh - 46px);
}
.guide-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
.guide-error {
  padding: 24px;
  text-align: center;
  color: #969799;
}
</style>
