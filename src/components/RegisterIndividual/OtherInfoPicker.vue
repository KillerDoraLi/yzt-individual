<template>
  <div>
    <van-cell-group inset>
      <van-field
        :model-value="education"
        is-link
        readonly
        label="学历"
        placeholder="点击选择学历"
        @click="openPicker('education')"
        @update:model-value="$emit('update:education', $event)"
      />
      <van-field
        :model-value="political"
        is-link
        readonly
        label="政治面貌"
        placeholder="点击选择政治面貌"
        @click="openPicker('political')"
        @update:model-value="$emit('update:political', $event)"
      />
      <van-field
        :model-value="occupation"
        is-link
        readonly
        label="职业"
        placeholder="点击选择职业"
        @click="openPicker('occupation')"
        @update:model-value="$emit('update:occupation', $event)"
      />
    </van-cell-group>
    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="currentColumns"
        :model-value="pickerValue"
        title="请选择"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  EDU_COLUMNS,
  POLITICAL_COLUMNS,
  OCCUPATIONAL_COLUMNS
} from '@/constants/registerIndividual';

const props = defineProps<{
  education: string;
  political: string;
  occupation: string;
}>();

const emit = defineEmits<{
  'update:education': [value: string];
  'update:political': [value: string];
  'update:occupation': [value: string];
}>();

type PickerOption = { text: string; value: string };
const showPicker = ref(false);
const pickerValue = ref<(string | number)[]>([]);
const currentColumns = ref<PickerOption[]>([]);
let currentField: 'education' | 'political' | 'occupation' | null = null;

const columnsMap: Record<string, PickerOption[]> = {
  education: EDU_COLUMNS,
  political: POLITICAL_COLUMNS,
  occupation: OCCUPATIONAL_COLUMNS
};

const openPicker = (field: 'education' | 'political' | 'occupation') => {
  currentField = field;
  currentColumns.value = columnsMap[field];
  showPicker.value = true;
};

const onConfirm = ({ selectedValues, selectedOptions }: { selectedValues: (string | number)[]; selectedOptions: { text: string }[] }) => {
  if (currentField === 'education') emit('update:education', selectedOptions[0]?.text ?? '');
  if (currentField === 'political') emit('update:political', selectedOptions[0]?.text ?? '');
  if (currentField === 'occupation') emit('update:occupation', selectedOptions[0]?.text ?? '');
  pickerValue.value = selectedValues;
  showPicker.value = false;
};
</script>
