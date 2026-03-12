import type { Ref } from 'vue';
import { computed, ref, watch, onUnmounted } from 'vue';
import { showToast, closeToast } from 'vant';
import { throttle } from 'lodash-es';
import { getIndividualStatus, retry } from '@/api';
import { useIndividualStore } from '@/store/individual';
import { STATUS_MAP } from '@/constants/registerIndividual';

/** 个体户状态查询、自动刷新、重新提交等逻辑 */
export function useIndividualStatus(formNameRef?: Ref<string>) {
  const store = useIndividualStore();
  const individualId = computed(() => store.individualId);
  const completedAt = computed(() => store.completedAt);
  const status = computed(() => store.status);
  const statusText = computed(() => status.value && STATUS_MAP[status.value]);

  const errorMessage = ref('');
  const username = ref('');
  const hasRedirected = ref(false);

  let intervalId: number | null = null;
  let refreshCount = 0;

  const startAutoRefresh = () => {
    if (intervalId) return;
    refreshCount = 0;
    intervalId = window.setInterval(async () => {
      if (refreshCount >= 10) {
        clearAutoRefresh();
        return;
      }
      refreshCount++;
      await fetchStatus();
    }, 10000);
  };

  const clearAutoRefresh = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  watch(status, (newStatus) => {
    if (
      newStatus === 'first_signing' ||
      newStatus === 'second_signing' ||
      newStatus === 'submitted'
    ) {
      startAutoRefresh();
    } else {
      clearAutoRefresh();
    }
  });

  const fetchStatus = async () => {
    if (!store.individualId) {
      store.clearCompletedAt();
      store.clearStatus();
      hasRedirected.value = false;
      showToast({ type: 'fail', message: '请提交个体户信息', duration: 2000 });
      return;
    }
    showToast({ type: 'loading', message: '加载中...', forbidClick: false });
    try {
      const res = await getIndividualStatus(store.individualId);
      if (status.value !== res.data.status) {
        store.clearCompletedAt();
        hasRedirected.value = false;
      }
      store.setStatus(res.data.status);
      username.value = res.data.name;
      if (formNameRef) formNameRef.value = res.data.name ?? '';
      errorMessage.value = res.data.error_message || '';
      if (status.value !== 'first_signing' && status.value !== 'second_signing') {
        store.clearCompletedAt();
        hasRedirected.value = false;
      }
      if (
        (status.value === 'first_signing' || status.value === 'second_signing') &&
        (!res.data.url_refreshing || res.data.url_refreshing === false) &&
        !hasRedirected.value &&
        res.data.signing_url &&
        !completedAt.value
      ) {
        hasRedirected.value = true;
        window.location.href = res.data.signing_url;
      }
      if (res.data.url_refreshing === true) {
        showToast({
          type: 'loading',
          message: '跳转地址刷新中，请10s后重试',
          forbidClick: false,
          duration: 3000
        });
      }
    } catch {
      showToast('查询失败，请稍后重试');
      store.clearIndividualId();
      store.clearCompletedAt();
      store.clearStatus();
      hasRedirected.value = false;
    }
  };

  const throttledFetchStatus = throttle(fetchStatus, 3000, { trailing: false });

  const resubmit = () => {
    if (!store.individualId) {
      store.clearCompletedAt();
      store.clearStatus();
      hasRedirected.value = false;
      return;
    }
    showToast({ type: 'loading', message: '重新提交中...', forbidClick: false });
    retry(store.individualId)
      .then(() => {
        showToast({ type: 'success', message: '重新提交成功' });
        fetchStatus();
      })
      .finally(() => closeToast());
  };

  onUnmounted(() => {
    clearAutoRefresh();
  });

  return {
    individualId,
    completedAt,
    status,
    statusText,
    errorMessage,
    username,
    hasRedirected,
    fetchStatus,
    throttledFetchStatus,
    resubmit,
    clearAutoRefresh
  };
}
