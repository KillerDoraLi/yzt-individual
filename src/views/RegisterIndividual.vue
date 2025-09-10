<template>
  <div>
    <div v-if="!individualId" class="layout">
      <van-form @submit="onSubmit" class="form-wrapper">
        <van-divider>基本信息</van-divider>
        <van-cell-group inset>
          <van-field
            v-model="name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[
              { required: true, message: '姓名不能为空' },
              { validator: validateName, message: '请输入至少2个字符的姓名' }
            ]"
          />
          <van-field
            v-model="identification_number"
            name="identification_number"
            label="身份证号"
            placeholder="请输入身份证号"
            :rules="[
              { required: true, message: '身份证号不能为空' },
              { validator: validateIdCard, message: '请输入正确的身份证号' }
            ]"
          />
          <van-field
            v-model="phone_number"
            name="phone_number"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '手机号不能为空' },
              { validator: validatePhone, message: '请输入正确的手机号' }
            ]"
          />
        </van-cell-group>
        <van-divider>证件上传</van-divider>
        <van-cell-group inset>
          <van-field
            name="faceUploadId"
            label="身份证正面"
            :rules="[{ required: true, message: '请上传身份证正面' }]"
          >
            <template #input>
              <van-uploader
                v-model="id_face"
                :after-read="afterReadFace"
                :max-count="1"
                reupload
                :preview-size="80"
              />
            </template>
          </van-field>
          <van-field
            name="backUploadId"
            label="身份证反面"
            :rules="[{ required: true, message: '请上传身份证反面' }]"
          >
            <template #input>
              <van-uploader
                v-model="id_back"
                :after-read="afterReadBack"
                :max-count="1"
                reupload
                :preview-size="80"
              />
            </template>
          </van-field>
        </van-cell-group>

        <van-divider>其他信息</van-divider>
        <van-cell-group inset>
          <van-field
            v-model="education"
            is-link
            readonly
            label="学历"
            placeholder="点击选择学历"
            @click="openPicker('education')"
          />
          <van-field
            v-model="political"
            is-link
            readonly
            label="政治面貌"
            placeholder="点击选择政治面貌"
            @click="openPicker('political')"
          />
          <van-field
            v-model="occupation"
            is-link
            readonly
            label="职业"
            placeholder="点击选择职业"
            @click="openPicker('occupation')"
          />
        </van-cell-group>
        <div class="submit-bar">
          <van-button round block type="primary" native-type="submit">
            提交个体户签约
          </van-button>
        </div>
      </van-form>
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

    <div v-if="individualId && status" class="status-page">
      <van-empty>
        <div slot="description">
          <p style="text-align: center; font-size: 13px; color: #666">
            {{ `您的个体户签约状态为：${statusText}` }}
          </p>
          <p v-if="status === 'failed'" style="font-size: 14px">
            <van-highlight
              :keywords="[errorMessage]"
              :source-string="`错误信息：${errorMessage}`"
            />
          </p>
        </div>
        <div>
          <template v-if="status === 'failed'">
            <p style="text-align: center; font-size: 13px; color: #666">
              若信息无误，请重新提交；若信息有误，请修改后重新提交
            </p>
            <div style="display: flex; justify-content: center">
              <van-button
                type="primary"
                style="margin-right: 12px"
                size="small"
                @click="resubmit"
              >
                重新提交
              </van-button>
              <!-- <van-button style="margin-left: 12px" size="small" @click="edit">
              修改信息
            </van-button> -->
            </div>
          </template>
          <van-button
            v-if="status !== 'completed'"
            type="primary"
            plain
            style="width: 160px; display: block; margin: 40px auto"
            @click="throttledFetchStatus"
          >
            刷新状态
          </van-button>
        </div>
      </van-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import {
  showToast,
  showLoadingToast,
  closeToast,
  showSuccessToast,
  showFailToast
} from 'vant';

import {
  uploadFile,
  registerIndividual,
  getIndividualStatus,
  retry
} from '@/api';
import { useIndividualStore } from '@/store/individual';
import { throttle } from 'lodash-es';
import 'vant/lib/toast/style';

const store = useIndividualStore();

// 个体户id
const individualId = store.individualId;

// 表单字段
const name = ref('');
const identification_number = ref('');
const phone_number = ref('');
const education = ref('');
const political = ref('');
const occupation = ref('');

const id_face = ref<any[]>([]);
const id_back = ref<any[]>([]);

// 上传后端返回的文件 ID
const faceUploadId = ref('');
const backUploadId = ref('');

// Picker 状态
const showPicker = ref(false);
const pickerValue = ref([]);
const currentColumns = ref<any[]>([]);
let currentField: 'education' | 'political' | 'occupation' | null = null;
const status = ref<
  'submitted' | 'signing' | 'completed' | 'failed' | 'cancelled' | ''
>('');

const errorMessage = ref('');

// 状态文字映射
const statusMap: Record<typeof status.value, string> = {
  submitted: '已提交',
  signing: '签约中',
  completed: '已完成',
  failed: '签约失败',
  cancelled: '已取消',
  '': ''
};

const statusText = computed(() => statusMap[status.value]);

// 选项数据
const edu_columns = [
  { text: '小学', value: 'PRIMARY_SCHOOL' },
  { text: '初中', value: 'MIDDLE_SCHOOL' },
  { text: '高中', value: 'HIGH_SCHOOL' },
  { text: '大专', value: 'COLLEGE' },
  { text: '本科', value: 'BACHELOR' },
  { text: '硕士', value: 'MASTER' },
  { text: '博士', value: 'DOCTORATE' }
];
const political_columns = [
  { text: '群众', value: 'MASSES' },
  { text: '党员', value: 'PARTY_MEMBER' },
  { text: '团员', value: 'LEAGUE_MEMBER' },
  { text: '其他', value: 'OTHER' }
];
const occupational_columns = [
  { text: '学生', value: 'STUDENT' },
  { text: '工人', value: 'WORKER' },
  { text: '农民', value: 'FARMER' },
  { text: '教师', value: 'TEACHER' },
  { text: '医生', value: 'DOCTOR' },
  { text: '其他', value: 'OTHER' }
];

// 打开选择器
const openPicker = (field: 'education' | 'political' | 'occupation') => {
  currentField = field;
  if (field === 'education') currentColumns.value = edu_columns;
  if (field === 'political') currentColumns.value = political_columns;
  if (field === 'occupation') currentColumns.value = occupational_columns;
  showPicker.value = true;
};

// Picker 确认
const onConfirm = ({ selectedValues, selectedOptions }) => {
  if (currentField === 'education') {
    education.value = selectedOptions[0]?.text;
  } else if (currentField === 'political') {
    political.value = selectedOptions[0]?.text;
  } else if (currentField === 'occupation') {
    occupation.value = selectedOptions[0]?.text;
  }
  pickerValue.value = selectedValues;
  showPicker.value = false;
};

// 上传正面
const afterReadFace = async (fileItem: { file: File }) => {
  if (!fileItem.file) return;
  try {
    showLoadingToast({ message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('resource_type', 'register');
    const res = await uploadFile(formData);
    closeToast();
    faceUploadId.value = res.id;
    showSuccessToast('身份证正面上传成功');
  } catch {
    closeToast();
    showFailToast('上传失败');
  }
};

// 上传反面
const afterReadBack = async (fileItem: { file: File }) => {
  if (!fileItem.file) return;
  try {
    showLoadingToast({ message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('resource_type', 'register');
    const res = await uploadFile(formData);
    closeToast();
    backUploadId.value = res.id;
    showSuccessToast('身份证反面上传成功');
  } catch {
    closeToast();
    showFailToast('上传失败');
  }
};

// ✅ 表单校验方法
const validateName = (val: string) => val && val.length >= 2;
const validatePhone = (val: string) => /^1[3-9]\d{9}$/.test(val); // 中国大陆手机号
const validateIdCard = (val: string) =>
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(
    val
  );

// 提交表单
const onSubmit = () => {
  const payload = {
    name: name.value,
    identification_number: identification_number.value,
    phone_number: phone_number.value,
    id_card_front_id: faceUploadId.value,
    id_card_back_id: backUploadId.value,
    education: education.value,
    political: political.value,
    occupation: occupation.value,
    corporation_id: 1
  };
  showLoadingToast({
    message: '提交中...',
    forbidClick: false
  });
  registerIndividual(payload)
    .then((res) => {
      store.setIndividualId(res.data.id);
    })
    .finally(() => {
      closeToast();
    });
};

// 刷新状态
const fetchStatus = async () => {
  if (!store.individualId) {
    showFailToast('请提交个体户信息');
    return;
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: false
  });

  try {
    const res = await getIndividualStatus(store.individualId);
    status.value = res.data.status;
    errorMessage.value = res.data.error_message || '8888';
    if (status.value === 'signing') {
      window.location.href = res.data.signing_url;
    }
  } catch {
    showToast('查询失败，请稍后重试');
  } finally {
    closeToast();
  }
};

const throttledFetchStatus = throttle(fetchStatus, 5000, { trailing: false });
// 重新提交
const resubmit = () => {
  showLoadingToast({
    message: '重新提交中...',
    forbidClick: false
  });
  if (!store.individualId) {
    showFailToast('');
    return;
  }
  retry(store.individualId)
    .then(() => {
      showSuccessToast('重新提交成功');
      throttledFetchStatus();
    })
    .finally(() => {
      closeToast();
    });
};

// 修改信息
const edit = () => {
  showToast('跳转到修改信息页面');
  // 这里可以用 router.push('/edit')
};

onMounted(() => {
  if (store.individualId) {
    throttledFetchStatus();
  }
});
</script>
<style scoped>
.layout {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 80px; /* 给底部按钮留空间 */
}

.form-wrapper {
  padding: 12px 0;
}

.van-divider {
  color: #666;
  font-size: 14px;
  margin: 12px 0;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: #fff;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.06);
}

.status-page {
  padding: 12px;
  background-color: #f5f6fa;
  min-height: 100vh;
}
</style>
