import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIndividualStore = defineStore('individual', () => {
  // 存个体户 ID
  // 初始化时从 localStorage 读取
  const individualId = ref<string | null>(localStorage.getItem('individualId'));

  // 设置 ID
  const setIndividualId = (id: string) => {
    individualId.value = id;
    localStorage.setItem('individualId', id);
  };

  // 清空 ID
  const clearIndividualId = () => {
    individualId.value = null;
    localStorage.removeItem('individualId');
  };

  return {
    individualId,
    setIndividualId,
    clearIndividualId
  };
});
