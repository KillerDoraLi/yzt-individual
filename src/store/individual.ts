import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIndividualStore = defineStore('individual', () => {
  // 存个体户 ID
  const individualId = ref<string | null>(null);

  // 设置 ID
  const setIndividualId = (id: string) => {
    individualId.value = id;
  };

  // 清空 ID
  const clearIndividualId = () => {
    individualId.value = null;
  };

  return {
    individualId,
    setIndividualId,
    clearIndividualId
  };
});
