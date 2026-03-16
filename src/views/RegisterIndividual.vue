<template>
  <div>
    <div v-if="corporationId" :class="{ 'status-page-wrap': individualId && status }">
      <!-- 表单区域 -->
      <div
        v-if="
          (!individualId || Number(corporationId) === 892) &&
          (!status || status === 'approved')
        "
        class="layout"
      >
        <van-form
          v-if="Number(corporationId) === 892 && !status"
          @submit="onSubmitPre"
          class="form-wrapper"
        >
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
              v-model="dealer_name"
              name="dealer_name"
              label="车商名称"
              placeholder="请输入车商名称"
              :rules="[
                {
                  required: is_car === '1' ? true : false,
                  message: '车商名称不能为空'
                }
              ]"
            />
          </van-cell-group>
          <div class="submit-bar">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>

        <van-form
          v-if="Number(corporationId) !== 892 || status === 'approved'"
          @submit="onSubmit"
          class="form-wrapper"
        >
          <van-divider>基本信息</van-divider>
          <van-cell-group inset>
            <van-field
              v-model="name"
              name="name"
              label="姓名"
              placeholder="请输入姓名"
              :disabled="status === 'approved'"
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
                {
                  validator: validateCardNumber,
                  message: '请输入正确的银行卡号'
                }
              ]"
            />
            <van-field
              name="is_car"
              label="是否为车商"
              :rules="[{ required: true, message: '是否为车商不能为空' }]"
            >
              <template #input>
                <van-radio-group v-model="is_car" direction="horizontal">
                  <van-radio name="1">是</van-radio>
                  <van-radio name="2">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-if="is_car === '1'"
              v-model="dealer_name"
              name="dealer_name"
              label="车商名称"
              placeholder="请输入车商名称"
              :rules="[
                {
                  required: is_car === '1' ? true : false,
                  message: '车商名称不能为空'
                }
              ]"
            />
            <van-field
              v-if="is_car === '1'"
              v-model="car_identification"
              name="car_identification"
              label="业务类型"
              :rules="[
                {
                  required: is_car === '1' ? true : false,
                  message: '业务类型不能为空'
                }
              ]"
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
          <IdCardUploadSection
            v-model:face-upload-id="faceUploadId"
            v-model:back-upload-id="backUploadId"
            v-model:id-face-list="id_face"
            v-model:id-back-list="id_back"
          />
          <div class="id-tips-text">
            拍摄时确保身份证 边框完整，照片清晰，亮度均匀
          </div>
          <div class="id-tips">
            <van-image height="60" :src="idTip1">
              <van-icon name="success" color="green" />标准拍摄
            </van-image>
            <van-image height="60" :src="idTip2">
              <van-icon name="cross" color="red" />照片缺失
            </van-image>
            <van-image height="60" :src="idTip3">
              <van-icon name="cross" color="red" />照片模糊
            </van-image>
            <van-image height="60" :src="idTip4">
              <van-icon name="cross" color="red" />照片反光
            </van-image>
          </div>

          <van-divider>其他信息</van-divider>
          <OtherInfoPicker
            v-model:education="education"
            v-model:political="political"
            v-model:occupation="occupation"
          />

          <div class="submit-bar">
            <van-button round block type="primary" native-type="submit">
              提交个体户签约
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 状态页 -->
      <StatusDisplay
        v-else-if="individualId && status"
        :status="status ?? ''"
        :status-text="statusText ?? ''"
        :username="username ?? ''"
        @resubmit="resubmit"
        @refresh="throttledFetchStatus"
      />

      <!-- 空状态 -->
      <van-empty v-else description="您的注册状态为空，请联系管理员" />
    </div>

    <!-- 无商户参数：身份证号查询个体户信息 -->
    <div v-else class="layout id-card-query-wrap">
      <van-cell-group inset>
        <van-field
          v-model="idCardQuery"
          name="id_card"
          label="身份证号"
          placeholder="请输入身份证号查询个体户信息"
          clearable
          :rules="[
            { required: true, message: '请输入身份证号' },
            { validator: validateIdCard, message: '请输入正确的身份证号' }
          ]"
        />
      </van-cell-group>
      <div class="submit-bar">
        <van-button
          round
          block
          type="primary"
          :loading="queryByIdCardLoading"
          :disabled="!idCardQuery.trim()"
          @click="onQueryByIdCard"
        >
          查询
        </van-button>
      </div>
      <p class="query-tip">
        未携带商户链接时，可通过身份证号查询您的个体户签约信息。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, closeToast } from 'vant';
import { registerIndividual, registerPre, getIndividualByIDCard } from '@/api';
import { useIndividualStore } from '@/store/individual';
import { decodeId, encodeId } from '@/utils/encode';
import idTip1 from '@/assets/id-tip-1.png';
import idTip2 from '@/assets/id-tip-2.png';
import idTip3 from '@/assets/id-tip-3.png';
import idTip4 from '@/assets/id-tip-4.png';
import {
  validateName,
  validatePhone,
  validateIdCard,
  validateIdCardAge,
  validateCardNumber
} from '@/utils/registerValidators';
import { useIndividualStatus } from '@/composables/useIndividualStatus';
import IdCardUploadSection from '@/components/RegisterIndividual/IdCardUploadSection.vue';
import OtherInfoPicker from '@/components/RegisterIndividual/OtherInfoPicker.vue';
import StatusDisplay from '@/components/RegisterIndividual/StatusDisplay.vue';

const store = useIndividualStore();
const route = useRoute();
const router = useRouter();

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
const is_car = ref('');
const corporationId = ref('');

/* -------------------- 无商户参数时按身份证查询 -------------------- */
const idCardQuery = ref('');
const queryByIdCardLoading = ref(false);

const onQueryByIdCard = () => {
  const raw = idCardQuery.value.trim();
  if (!raw) {
    showToast('请输入身份证号');
    return;
  }
  if (!validateIdCard(raw)) {
    showToast('请输入正确的身份证号');
    return;
  }
  queryByIdCardLoading.value = true;
  getIndividualByIDCard(raw)
    .then(
      (res: { data?: { id?: string; corporation_id?: number | string } }) => {
        const id = res?.data?.id;
        if (!id) {
          showToast('未查询到该身份证对应的个体户信息');
          return;
        }
        store.setIndividualId(String(id));
        const corpId =
          res?.data?.corporation_id != null
            ? String(res.data.corporation_id)
            : '1';
        corporationId.value = corpId;
        // 将 corporation_id 带到 URL 参数（与进入带商户链接时一致）
        router.replace({
          path: route.path,
          query: { ...route.query, corporationId: encodeId(corpId) }
        });
        showToast('查询成功');
        fetchStatus();
      }
    )
    .catch(() => {
      showToast('未查询到该身份证对应的个体户信息');
    })
    .finally(() => {
      queryByIdCardLoading.value = false;
    });
};

/* -------------------- 状态逻辑（composable） -------------------- */
const {
  individualId,
  status,
  statusText,
  username,
  fetchStatus,
  throttledFetchStatus,
  resubmit
} = useIndividualStatus(name);

/* -------------------- 提交 -------------------- */
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
    corporation_id: corporationId.value ? Number(corporationId.value) : 1,
    dealer_name: dealer_name.value,
    car_identification: car_identification.value
  };
  showToast({ type: 'loading', message: '提交中...', forbidClick: false });
  registerIndividual(payload)
    .then((res) => {
      store.setIndividualId(res.data.id);
      showToast('个体户信息提交成功');
      fetchStatus();
    })
    .finally(() => closeToast());
};

const onSubmitPre = () => {
  if (!corporationId.value) {
    showToast('您的链接有误，请联系系统管理员');
    return;
  }
  registerPre({
    name: name.value,
    identification_number: identification_number.value,
    phone_number: phone_number.value,
    dealer_name: dealer_name.value,
    corporation_id: Number(corporationId.value)
  })
    .then((res) => {
      store.setIndividualId(res.data.id);
      showToast('个体户信息提交成功');
      fetchStatus();
    })
    .finally(() => closeToast());
};

/* -------------------- 生命周期 -------------------- */
onMounted(() => {
  const completedAtQuery = route.query.completedAt;
  const individualIdQuery = route.query.individualId;
  const corporationIdQuery = route.query.corporationId;
  if (individualIdQuery) {
    store.setIndividualId(individualIdQuery as string);
    store.clearCompletedAt();
  } else if (completedAtQuery) {
    store.setCompletedAt(completedAtQuery as string);
  } else {
    store.clearStatus();
    store.clearCompletedAt();
  }
  if (store.individualId) {
    fetchStatus();
  }
  if (corporationIdQuery) {
    corporationId.value = decodeId(corporationIdQuery as string) || '1';
  }
});
</script>

<style scoped>
/* 状态页时铺满视口并延伸到底部安全区，避免手机底部白边 */
.status-page-wrap {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #f5f6fa;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
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
.id-card-query-wrap {
  padding: 24px 0;
  padding-top: calc(env(safe-area-inset-top, 0px) + 88px);
  min-height: 100vh;
  box-sizing: border-box;
}
.query-tip {
  margin: 16px 16px 0;
  font-size: 12px;
  color: #969799;
  line-height: 1.5;
}
.id-tips {
  display: flex;
  justify-content: space-between;
  margin: 0 12px 24px;
  font-size: 12px;
  text-align: center;
}
.id-tips-text {
  margin: 12px 12px 6px;
  font-size: 14px;
  color: #444;
}
</style>
