<template>
  <van-cell-group inset>
    <van-field
      name="faceUploadId"
      label="身份证人像面"
      :rules="[{ required: true, message: '请上传身份证人像面' }]"
    >
      <template #input>
        <van-uploader
          :model-value="faceList"
          :after-read="afterReadFace"
          :max-count="1"
          reupload
          :preview-size="80"
          @update:model-value="$emit('update:idFaceList', $event)"
        />
      </template>
    </van-field>
    <van-field
      name="backUploadId"
      label="身份证国徽面"
      :rules="[{ required: true, message: '请上传身份证国徽面' }]"
    >
      <template #input>
        <van-uploader
          :model-value="backList"
          :after-read="afterReadBack"
          :max-count="1"
          reupload
          :preview-size="80"
          @update:model-value="$emit('update:idBackList', $event)"
        />
      </template>
    </van-field>
  </van-cell-group>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { showToast, closeToast } from 'vant';
import type { UploaderFileListItem } from 'vant';
import { uploadFile } from '@/api';

const props = defineProps<{
  faceUploadId: string;
  backUploadId: string;
  idFaceList: unknown[];
  idBackList: unknown[];
}>();

const faceList = computed(() => (props.idFaceList || []) as UploaderFileListItem[]);
const backList = computed(() => (props.idBackList || []) as UploaderFileListItem[]);

const emit = defineEmits<{
  'update:faceUploadId': [value: string];
  'update:backUploadId': [value: string];
  'update:idFaceList': [value: unknown[]];
  'update:idBackList': [value: unknown[]];
}>();

const MAX_SIZE = 2 * 1024 * 1024;

const getFile = (item: unknown): File | undefined =>
  Array.isArray(item) ? (item[0] as { file?: File })?.file : (item as { file?: File })?.file;

const afterReadFace = async (item: unknown) => {
  const file = getFile(item);
  if (!file) return;
  if (file.size > MAX_SIZE) {
    showToast({ type: 'fail', message: '文件大小不能超过2MB', duration: 5000 });
    emit('update:faceUploadId', '');
    emit('update:idFaceList', []);
    return;
  }
  try {
    showToast({ type: 'loading', message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', 'register');
    const res = (await uploadFile(formData)) as { id?: string; data?: { id?: string } };
    closeToast();
    emit('update:faceUploadId', res?.id ?? res?.data?.id ?? '');
    showToast({
      message: '身份证正面上传成功',
      duration: 1000,
      type: 'success'
    });
  } catch {
    showToast({ type: 'fail', message: '上传失败', duration: 5000 });
    emit('update:faceUploadId', '');
    emit('update:idFaceList', []);
  }
};

const afterReadBack = async (item: unknown) => {
  const file = getFile(item);
  if (!file) return;
  if (file.size > MAX_SIZE) {
    showToast({ type: 'fail', message: '文件大小不能超过2MB', duration: 5000 });
    emit('update:backUploadId', '');
    emit('update:idBackList', []);
    return;
  }
  try {
    showToast({ type: 'loading', message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', 'register');
    const res = (await uploadFile(formData)) as { id?: string; data?: { id?: string } };
    closeToast();
    emit('update:backUploadId', res?.id ?? res?.data?.id ?? '');
    showToast({
      type: 'success',
      message: '身份证反面上传成功',
      duration: 2000
    });
  } catch {
    showToast({ type: 'fail', message: '上传失败', duration: 5000 });
    emit('update:backUploadId', '');
    emit('update:idBackList', []);
    closeToast();
  }
};
</script>
