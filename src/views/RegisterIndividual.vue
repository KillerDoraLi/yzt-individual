<template>
  <div>
    <!-- 表单区域 -->
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
              { validator: validateIdCard, message: '请输入正确的身份证号' },
              { validator: validateIdCardAge, message: '仅限18-60岁用户注册' }
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
          <van-field
            v-model="card_number"
            name="card_number"
            label="银行卡号"
            placeholder="请输入银行卡号"
            :rules="[
              { required: true, message: '银行卡号不能为空' },
              { validator: validateCardNumber, message: '请输入正确的银行卡号' }
            ]"
          />
          <van-field
            v-model="dealer_name"
            name="dealer_name"
            label="车商名称"
            placeholder="请输入车商名称"
            :rules="[{ required: true, message: '车商名称不能为空' }]"
          />
          <van-field
            name="car_identification"
            label="业务类型"
            :rules="[{ required: true, message: '业务类型不能为空' }]"
          >
            <template #input>
              <van-radio-group
                v-model="car_identification"
                direction="horizontal"
              >
                <van-radio name="1">新车</van-radio>
                <van-radio name="2">二手车</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-cell-group>

        <van-divider>证件上传</van-divider>
        <van-cell-group inset>
          <van-field
            name="faceUploadId"
            label="身份证人像面"
            :rules="[{ required: true, message: '请上传身份证人像面' }]"
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
            label="身份证国徽面"
            :rules="[{ required: true, message: '请上传身份证国徽面' }]"
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

      <!-- Picker -->
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

    <!-- 状态页 -->
    <div v-else-if="individualId && status" class="status-page">
      <van-empty :image="emptyImg" :image-size="[140, 100]">
        <div slot="description">
          <p v-if="status !== 'completed'" class="status-text">
            {{ `您的个体户签约状态为：${statusText}` }}
          </p>
          <p class="hint-text">
            <van-highlight
              v-if="status === 'first_signing' || status === 'second_signing'"
              unhighlight-class="highlight-text-normal"
              :keywords="['', '19065163814']"
              source-string="系统将在 30s 后跳转到签约页面，请您耐心等待～  若无法跳转请点击【刷新状态】按钮手动刷新或致电 19065163814 联系管理员。"
            />
          </p>
          <p v-if="status === 'failed' && errorMessage" class="error-text">
            <van-highlight
              unhighlight-class="highlight-text-normal"
              :keywords="[errorMessage]"
              :source-string="`错误信息：${errorMessage}`"
            />
          </p>
          <!-- <van-button
            v-if="status === 'failed'"
            type="primary"
            plain
            class="refresh-btn"
            @click="clearData"
          >
            重新填写
          </van-button> -->
          <p v-if="status === 'completed'" class="success-text">
            <van-highlight
              unhighlight-class="highlight-text-normal"
              :keywords="['电子营业执照', '19065163814']"
              :source-string="`尊敬的${username}，您好！您提交的注册申请已完成，可前往个人实名登记的微信/支付宝查询“电子营业执照”小程序查看详细信息。如有需要可致电 19065163814，感谢您的支持！`"
            />
          </p>
        </div>

        <div>
          <template v-if="status === 'failed'">
            <p class="tip-text">
              若信息无误，请重新提交；若信息有误，请致电 19065163814 咨询。
            </p>
            <div class="btn-group">
              <van-button
                type="primary"
                style="margin-right: 12px"
                size="small"
                @click="resubmit"
              >
                重新提交
              </van-button>
            </div>
          </template>
          <van-button
            v-if="status !== 'completed'"
            type="primary"
            plain
            class="refresh-btn"
            @click="throttledFetchStatus"
          >
            刷新状态
          </van-button>
        </div>
      </van-empty>
    </div>

    <!-- 空状态 -->
    <van-empty v-else description="您的注册状态为空，请联系管理员" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { showToast, closeToast } from 'vant';
import { throttle } from 'lodash-es';
import {
  uploadFile,
  registerIndividual,
  getIndividualStatus,
  retry
} from '@/api';
import { useIndividualStore } from '@/store/individual';
import emptyImg from '@/assets/empty.png';

/* -------------------- Store -------------------- */
const store = useIndividualStore();
const individualId = computed(() => store.individualId);
const completedAt = computed(() => store.completedAt);

/* -------------------- 表单字段 -------------------- */
const name = ref('');
const identification_number = ref('');
const phone_number = ref('');
const card_number = ref('');
const education = ref('');
const political = ref('');
const occupation = ref('');
const id_face = ref<unknown[]>([]);
const id_back = ref<unknown[]>([]);
const faceUploadId = ref('');
const backUploadId = ref('');
const dealer_name = ref('');
const car_identification = ref('');

/* -------------------- Picker -------------------- */
const showPicker = ref(false);
const pickerValue = ref([]);
const currentColumns = ref<unknown[]>([]);
let currentField: 'education' | 'political' | 'occupation' | null = null;

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

const openPicker = (field: 'education' | 'political' | 'occupation') => {
  currentField = field;
  if (field === 'education') currentColumns.value = edu_columns;
  if (field === 'political') currentColumns.value = political_columns;
  if (field === 'occupation') currentColumns.value = occupational_columns;
  showPicker.value = true;
};
const onConfirm = ({ selectedValues, selectedOptions }: any) => {
  if (currentField === 'education') education.value = selectedOptions[0]?.text;
  if (currentField === 'political') political.value = selectedOptions[0]?.text;
  if (currentField === 'occupation')
    occupation.value = selectedOptions[0]?.text;
  pickerValue.value = selectedValues;
  showPicker.value = false;
};

/* -------------------- 上传逻辑 -------------------- */
const afterReadFace = async (fileItem: { file: File }) => {
  if (!fileItem.file) return;
  if (fileItem.file.size > 2 * 1024 * 1024) {
    showToast({ type: 'fail', message: '文件大小不能超过2MB', duration: 5000 });
    faceUploadId.value = '';
    id_face.value = [];
    return;
  }
  try {
    showToast({ type: 'loading', message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('resource_type', 'register');
    const res = await uploadFile(formData);
    closeToast();
    faceUploadId.value = res.id;
    showToast({
      message: '身份证正面上传成功',
      duration: 1000,
      type: 'success'
    });
  } catch {
    showToast({ type: 'fail', message: '上传失败', duration: 5000 });
    faceUploadId.value = '';
    id_face.value = [];
  }
};
const afterReadBack = async (fileItem: { file: File }) => {
  if (!fileItem.file) return;
  if (fileItem.file.size > 2 * 1024 * 1024) {
    showToast({ type: 'fail', message: '文件大小不能超过2MB', duration: 5000 });
    backUploadId.value = '';
    id_back.value = [];
    return;
  }
  try {
    showToast({ type: 'loading', message: '上传中...', forbidClick: true });
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('resource_type', 'register');
    const res = await uploadFile(formData);
    closeToast();
    backUploadId.value = res.id;
    showToast({
      type: 'success',
      message: '身份证反面上传成功',
      duration: 2000
    });
  } catch {
    showToast({ type: 'fail', message: '上传失败', duration: 5000 });
    backUploadId.value = '';
    id_back.value = [];
    closeToast();
  }
};

/* -------------------- 表单校验 -------------------- */
const validateName = (val: string) => val && val.length >= 2;
const validatePhone = (val: string) => /^1[3-9]\d{9}$/.test(val);
const validateIdCard = (val: string) =>
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(
    val
  );
// 身份证年龄校验（18~60岁）
const validateIdCardAge = (idCard: string): boolean => {
  let birthStr = '';

  if (/^\d{15}$/.test(idCard)) {
    // 15位，取7-12位，前加"19"
    birthStr = '19' + idCard.slice(6, 12);
  } else if (/^\d{17}[\dXx]$/.test(idCard)) {
    // 18位，取7-14位
    birthStr = idCard.slice(6, 14);
  } else {
    return false;
  }

  const year = parseInt(birthStr.slice(0, 4), 10);
  const month = parseInt(birthStr.slice(4, 6), 10) - 1; // JS 月份从0开始
  const day = parseInt(birthStr.slice(6, 8), 10);

  const birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) {
    return false;
  }

  // 计算年龄
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month ||
    (today.getMonth() === month && today.getDate() < day)
  ) {
    age--;
  }

  if (age < 18 || age > 60) {
    return false;
  }

  return true;
};

const validateCardNumber = (val: string) => /^\d{16,19}$/.test(val);

/* -------------------- 状态管理 -------------------- */
// const status = ref<
//   | 'submitted'
//   | 'first_signing'
//   | 'business_registration'
//   | 'tax_registration'
//   | 'second_signing'
//   | 'completed'
//   | 'failed'
//   | 'cancelled'
//   | 'pending'
//   | ''
// >('');

const status = computed(() => store.status);
const errorMessage = ref('');
const username = ref('');
const hasRedirected = ref(false);

const statusMap: Record<string, string> = {
  submitted: '已提交',
  first_signing: '信息登记中',
  second_signing: '二次签约中',
  business_registration: '工商登记中',
  tax_registration: '税务登记中',
  completed: '已完成',
  failed: '签约失败',
  cancelled: '已取消',
  pending: '处理中',
  '': ''
};
const statusText = computed(() => status.value && statusMap[status.value]);

/* 定时刷新逻辑 */
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

/* 查询状态 */
const fetchStatus = async () => {
  if (!store.individualId) {
    store.clearCompletedAt();
    hasRedirected.value = false;
    showToast({ type: 'fail', message: '请提交个体户信息', duration: 2000 });
    return;
  }
  showToast({ type: 'loading', message: '加载中...', forbidClick: false });
  try {
    const res = await getIndividualStatus(store.individualId);
    // status.value = 'first_signing';
    if (status.value !== res.data.status) {
      store.clearCompletedAt();
      hasRedirected.value = false;
    }
    store.setStatus(res.data.status);
    username.value = res.data.name;
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
    hasRedirected.value = false;
  } finally {
    // closeToast();
  }
};
const throttledFetchStatus = throttle(fetchStatus, 3000, { trailing: false });

/* 重新提交 */
const resubmit = () => {
  if (!store.individualId) {
    store.clearCompletedAt();
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

/* -------------------- 提交表单 -------------------- */
const onSubmit = () => {
  const payload = {
    name: name.value,
    identification_number: identification_number.value,
    phone_number: phone_number.value,
    card_number: card_number.value,
    id_card_front_id: faceUploadId.value,
    id_card_back_id: backUploadId.value,
    education: education.value,
    political: political.value,
    occupation: occupation.value,
    corporation_id: 1,
    dealer_name: dealer_name.value,
    car_identification: car_identification.value
  };
  console.log(payload);
  showToast({ type: 'loading', message: '提交中...', forbidClick: false });
  registerIndividual(payload)
    .then((res) => {
      console.log(res);
      store.setIndividualId(res.data.id);
      showToast('个体户信息提交成功');
      fetchStatus();
    })
    .finally(() => closeToast());
};
const clearData = () => {
  name.value = '';
  identification_number.value = '';
  phone_number.value = '';
  card_number.value = '';
  faceUploadId.value = '';
  backUploadId.value = '';
  education.value = '';
  political.value = '';
  occupation.value = '';
  id_back.value = [];
  id_face.value = [];
  faceUploadId.value = '';
  backUploadId.value = '';
  store.clearCompletedAt();
  store.clearIndividualId();
  store.clearStatus();
  hasRedirected.value = false;
};
/* -------------------- 生命周期 -------------------- */
const route = useRoute();
onMounted(() => {
  const completedAtQuery = route.query.completedAt;
  const individualIdQuery = route.query.individualId;
  console.log('onMounted', individualIdQuery);
  if (individualIdQuery) {
    store.setIndividualId(individualIdQuery as string);
    store.clearCompletedAt();
    hasRedirected.value = false;
  } else if (completedAtQuery) {
    store.setCompletedAt(completedAtQuery as string);
  } else {
    store.clearCompletedAt();
    hasRedirected.value = false;
  }
  if (store.individualId) {
    fetchStatus();
  }
});
onUnmounted(() => {
  console.log('onUnmounted');
  clearAutoRefresh();
});
</script>

<style scoped>
.layout {
  background-color: #f7f8fa;
  min-height: 100vh;
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
  margin: 24px 12px 0;
}
.status-page {
  padding: 60px 12px 0;
  background-color: #f5f6fa;
  height: calc(100vh - 60px);
}
.status-text {
  text-align: center;
  font-size: 13px;
  color: #666;
}
.error-text,
.hint-text,
.success-text {
  font-size: 14px;
  text-indent: 2em;
  line-height: 1.6;
}
.tip-text {
  text-align: center;
  font-size: 13px;
  color: #666;
}
.btn-group {
  display: flex;
  justify-content: center;
}
.refresh-btn {
  width: 160px;
  display: block;
  margin: 40px auto;
}
.highlight-text-normal {
  color: #666;
  line-height: 1.6;
}
</style>
