import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIndividualStore = defineStore('individual', () => {
  // 存个体户 ID
  // 初始化时从 localStorage 读取
  const individualId = ref<string | null>(localStorage.getItem('individualId'));

  const completedAt = ref<string | null | ''>(
    localStorage.getItem('completedAt')
  );
  const status = ref<string | null | ''>(
    localStorage.getItem('individualStatus')
  );
  // 设置 ID
  const setIndividualId = (id: string) => {
    individualId.value = id;
    localStorage.setItem('individualId', id);
  };

  const setCompletedAt = (time: string) => {
    completedAt.value = time;
    localStorage.setItem('completedAt', time);
  };

  const setStatus = (statusValue: string) => {
    status.value = statusValue;
    localStorage.setItem('individualStatus', statusValue);
  };

  // 清空 ID
  const clearIndividualId = () => {
    individualId.value = null;
    localStorage.removeItem('individualId');
  };

  const clearStatus = () => {
    status.value = null;
    localStorage.removeItem('individualStatus');
  };

  const clearCompletedAt = () => {
    completedAt.value = null;
    localStorage.removeItem('completedAt');
  };

  return {
    individualId,
    setIndividualId,
    clearIndividualId,
    completedAt,
    setCompletedAt,
    clearCompletedAt,
    status,
    setStatus,
    clearStatus
  };
});
