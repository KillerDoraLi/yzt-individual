<template>
  <div class="status-page">
    <!-- 时间轴状态展示；completed 时也展示，全部步骤为已完成 -->
    <div v-if="showTimeline" class="timeline-wrap">
      <div class="timeline-title">
        签约进度
        <span v-if="status === 'completed'" class="timeline-title-done">（以下步骤已全部完成）</span>
      </div>
      <div class="timeline">
        <div
          v-for="(step, index) in timelineSteps"
          :key="step.key"
          class="timeline-item"
          :class="{
            'timeline-item--current': step.key === status,
            'timeline-item--done': currentStepIndex > index,
            'timeline-item--pending': currentStepIndex < index
          }"
        >
          <div class="timeline-dot">
            <span v-if="currentStepIndex > index" class="timeline-dot-check">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div v-if="index < timelineSteps.length - 1" class="timeline-line" />
          <div class="timeline-content">{{ step.label }}</div>
        </div>
      </div>
    </div>

    <div class="status-content">
      <p v-if="!showTimeline && status !== 'completed'" class="status-text">
        {{ `您的个体户签约状态为：${statusText}` }}
      </p>
      <p v-if="status === 'approved'" class="status-text">
        您的信息已提交审核，审核结果于24小时后更新，届时请刷新该界面或再次扫码进入该界面进行后续操作。
      </p>
      <p v-if="status === 'submitted'" class="hint-text">
        您的信息已提交成功，系统将自动为您跳转至工商登记页面。若 30 秒内未跳转，请点击下方【刷新状态】按钮手动刷新。
      </p>
      <p v-if="status === 'first_signing' || status === 'second_signing'" class="hint-text">
        <van-highlight
          unhighlight-class="highlight-text-normal"
          :keywords="['', '19065163814']"
          source-string="系统将在 30s 后跳转到签约页面，请您耐心等待～  若无法跳转请点击【刷新状态】按钮手动刷新或致电 19065163814 联系管理员。"
        />
      </p>
      <template v-if="status === 'wait_alipay_realname'">
        <p class="hint-text">
          您当前处于工商验证环节，请按以下指引完成支付宝实名认证操作。
        </p>
        <van-button
          type="primary"
          class="guide-btn"
          @click="goToAlipayGuide"
        >
          查看指引
        </van-button>
      </template>
      <template v-if="status === 'tax_registration'">
        <p class="hint-text">
          您当前处于税务登记环节，请按以下指引完成税务登记操作。
        </p>
        <van-button
          type="primary"
          class="guide-btn"
          @click="goToTaxGuide"
        >
          查看指引
        </van-button>
      </template>
      <p v-if="status === 'completed'" class="success-text">
        <van-highlight
          unhighlight-class="highlight-text-normal"
          :keywords="['电子营业执照', '19065163814']"
          :source-string="`尊敬的${username}，您好！您提交的注册申请已完成，可前往个人实名登记的微信/支付宝查询“电子营业执照”小程序查看详细信息。如有需要可致电 19065163814，感谢您的支持！`"
        />
      </p>

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
              @click="$emit('resubmit')"
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
          @click="$emit('refresh')"
        >
          刷新状态
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { STATUS_MAP, STATUS_TIMELINE_ORDER } from '@/constants/registerIndividual';

const props = defineProps<{
  status: string;
  statusText: string;
  username: string;
}>();

const router = useRouter();

defineEmits<{
  resubmit: [];
  refresh: [];
}>();

const goToAlipayGuide = () => {
  router.push({ name: 'AlipayGuide' });
};
const goToTaxGuide = () => {
  router.push({ name: 'TaxRegistrationGuide' });
};

const showTimeline = computed(
  () =>
    STATUS_TIMELINE_ORDER.includes(props.status) || props.status === 'completed'
);

const timelineSteps = computed(() =>
  STATUS_TIMELINE_ORDER.map((key) => ({
    key,
    label: STATUS_MAP[key] ?? key
  }))
);

/** 当前步骤下标；completed 时设为长度，使时间轴全部显示为已完成 */
const currentStepIndex = computed(() =>
  props.status === 'completed'
    ? STATUS_TIMELINE_ORDER.length
    : STATUS_TIMELINE_ORDER.indexOf(props.status)
);
</script>

<style scoped>
.status-page {
  padding: 60px 12px 0;
  background-color: #f5f6fa;
  height: calc(100vh - 60px);
}
.status-content {
  padding: 16px;
}

/* 时间轴 */
.timeline-wrap {
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  margin-left: 12px;
  margin-right: 12px;
}
.timeline-title {
  font-size: 15px;
  color: #323233;
  font-weight: 500;
  margin-bottom: 16px;
  padding-left: 20px;
}
.timeline-title-done {
  font-size: 13px;
  font-weight: 400;
  color: #07c160;
  margin-left: 4px;
}
.timeline {
  position: relative;
}
.timeline-item {
  position: relative;
  padding-left: 28px;
  padding-bottom: 20px;
  min-height: 36px;
}
.timeline-item:last-child {
  padding-bottom: 0;
}
.timeline-dot {
  position: absolute;
  left: 0;
  top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcdee0;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #dcdee0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #969799;
}
.timeline-line {
  position: absolute;
  left: 9px;
  top: 24px;
  bottom: -20px;
  width: 2px;
  background: #ebedf0;
}
/* 已完成：点与连线为绿色，对号白色 */
.timeline-item--done .timeline-dot {
  background: #07c160;
  box-shadow: 0 0 0 1px #07c160;
  color: #fff;
}
.timeline-dot-check {
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}
.timeline-item--done .timeline-line {
  background: #07c160;
}
/* 当前：点与文字蓝色加粗，数字白色 */
.timeline-item--current .timeline-dot {
  background: #1989fa;
  box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.3);
  width: 22px;
  height: 22px;
  top: 0;
  left: -1px;
  font-size: 12px;
  color: #fff;
}
.timeline-item--current .timeline-line {
  background: #ebedf0;
}
.timeline-item--current .timeline-content {
  color: #1989fa;
  font-weight: 700;
  font-size: 15px;
}
/* 未完成：点为灰色，数字灰色，文字为绿色 */
.timeline-item--pending .timeline-dot {
  background: #dcdee0;
  box-shadow: 0 0 0 1px #dcdee0;
  color: #969799;
}
.timeline-item--pending .timeline-content {
  color: #07c160;
  font-size: 14px;
}
.timeline-content {
  font-size: 14px;
  color: #323233;
  line-height: 1.5;
}

.status-text {
  text-align: center;
  font-size: 13px;
  color: #666;
}
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
.guide-btn {
  display: block;
  margin: 16px auto;
  min-width: 160px;
}
.highlight-text-normal {
  color: #666;
  line-height: 1.6;
}
</style>
