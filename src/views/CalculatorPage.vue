<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import {
  calculateAfterTaxSalary,
  CalculatorInput
} from '@/utils/taxCalculator';
import { generateDisplayData } from '@/utils/displayFormatter';

// 响应式数据
const calculationMode = ref<'uniform' | 'custom'>('uniform');
const selectedMonths = ref<number[]>([]);
const uniformSalary = ref<number>(0);
const customSalaries = ref<Record<number, number>>({});
const calculationResult = ref(null);

// 月份选项
const monthOptions = [
  { label: '1月', value: 1 },
  { label: '2月', value: 2 },
  { label: '3月', value: 3 },
  { label: '4月', value: 4 },
  { label: '5月', value: 5 },
  { label: '6月', value: 6 },
  { label: '7月', value: 7 },
  { label: '8月', value: 8 },
  { label: '9月', value: 9 },
  { label: '10月', value: 10 },
  { label: '11月', value: 11 },
  { label: '12月', value: 12 }
];

// 监听计算模式切换，清空数据
watch(calculationMode, () => {
  selectedMonths.value = [];
  // 清空收入数据
  uniformSalary.value = 0;
  customSalaries.value = {};
  // 清空计算结果
  calculationResult.value = null;
});

// 监听选中月份变化，初始化自定义收入
watch(
  selectedMonths,
  (newMonths) => {
    newMonths.forEach((month) => {
      if (!customSalaries.value[month]) {
        customSalaries.value[month] = 0;
      }
    });
    // 删除未选中月份的数据
    Object.keys(customSalaries.value).forEach((month) => {
      if (!newMonths.includes(Number(month))) {
        delete customSalaries.value[Number(month)];
      }
    });
  },
  { immediate: true }
);

// 全选/反选功能
const isAllMonthsSelected = computed(() => selectedMonths.value.length === 12);

const toggleAllMonths = () => {
  if (isAllMonthsSelected.value) {
    selectedMonths.value = [];
  } else {
    selectedMonths.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
};

// 执行计算
const calculate = () => {
  if (selectedMonths.value.length === 0) {
    message.warning('请选择至少一个月份');
    return;
  }

  if (
    calculationMode.value === 'uniform' &&
    (!uniformSalary.value || uniformSalary.value <= 0)
  ) {
    message.warning('请输入有效的税前收入');
    return;
  }

  if (calculationMode.value === 'custom') {
    const hasInvalidSalary = selectedMonths.value.some(
      (month) =>
        !customSalaries.value[month] || customSalaries.value[month] <= 0
    );
    if (hasInvalidSalary) {
      message.warning('请为所有选中月份输入有效的税前收入');
      return;
    }
  }

  const input: CalculatorInput = {
    mode: calculationMode.value,
    selectedMonths: selectedMonths.value,
    uniformSalary:
      calculationMode.value === 'uniform' ? uniformSalary.value : undefined,
    customSalaries:
      calculationMode.value === 'custom' ? customSalaries.value : undefined
  };

  const result = calculateAfterTaxSalary(input);
  calculationResult.value = generateDisplayData(result);
};

// 重置功能
const reset = () => {
  selectedMonths.value = [];
  uniformSalary.value = 0;
  customSalaries.value = {};
  calculationResult.value = null;
};
</script>

<template>
  <div class="tax-calculator">
    <a-card title="平台劳务个税计算器" class="input-card" :bordered="false">
      <a-row :gutter="[24, 24]">
        <!-- 输入区域 -->
        <a-col :xs="24" :lg="12">
          <!-- 计算方式选择 -->
          <div class="form-item">
            <div class="title-parts">
              <a-typography-title :level="4">计算方式</a-typography-title>
              <a-tabs
                v-model:activeKey="calculationMode"
                size="small"
                :tabBarStyle="{ borderBottom: 'none' }"
              >
                <a-tab-pane key="uniform" tab="统一金额" />
                <a-tab-pane key="custom" tab="自定义金额" />
              </a-tabs>
            </div>

            <!-- 收入输入 -->
            <div class="form-item">
              <!-- 统一金额模式 -->
              <div v-if="calculationMode === 'uniform'" class="salary-input">
                <a-input-number
                  v-model:value="uniformSalary"
                  :min="0"
                  :max="10000000"
                  :precision="2"
                  placeholder="请输入税前收入"
                  style="width: 100%"
                  :formatter="
                    (value) =>
                      `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  "
                  :parser="(value) => value!.replace(/¥\s?|(,*)/g, '')"
                />
              </div>

              <!-- 自定义金额模式 -->
              <div v-else class="custom-salaries">
                <a-row :gutter="[12, 12]">
                  <a-col
                    v-for="month in selectedMonths.sort((a, b) => a - b)"
                    :key="month"
                    :xs="12"
                    :sm="12"
                    :md="8"
                  >
                    <div class="custom-salary-item">
                      <a-typography-text>{{ month }}月</a-typography-text>
                      <a-input-number
                        v-model:value="customSalaries[month]"
                        :min="0"
                        :max="10000000"
                        :precision="2"
                        placeholder="税前收入"
                        style="width: 100%"
                        :formatter="
                          (value) =>
                            `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        "
                        :parser="(value) => value!.replace(/¥\s?|(,*)/g, '')"
                      />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>

          <!-- 月份选择 -->
          <div class="form-item">
            <div class="month-selector-header">
              <a-typography-title :level="4">选择月份</a-typography-title>
              <a-button
                type="link"
                @click="toggleAllMonths"
                class="select-all-btn"
              >
                {{ isAllMonthsSelected ? '取消全选' : '全选' }}
              </a-button>
            </div>
            <div class="month-buttons">
              <button
                v-for="month in monthOptions"
                :key="month.value"
                type="button"
                class="month-btn"
                :class="{ selected: selectedMonths.includes(month.value) }"
                @click="
                  selectedMonths.includes(month.value)
                    ? selectedMonths.splice(
                        selectedMonths.indexOf(month.value),
                        1
                      )
                    : selectedMonths.push(month.value)
                "
              >
                {{ month.label }}
              </button>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :lg="12">
          <block v-if="calculationResult">
            <!-- 汇总信息 -->
            <div class="summary-section">
              <a-typography-title :level="5">计算结果</a-typography-title>
              <div class="summary-row">
                <div>税前总收入：</div>

                <div>{{ calculationResult.summary.totalPreTaxSalary }}</div>
              </div>
              <div class="summary-row">
                <div>预扣个税：</div>

                <div>{{ calculationResult.summary.totalTax }}</div>
              </div>
              <div class="summary-row">
                <div>税后总收入：</div>

                <div>{{ calculationResult.summary.totalAfterTaxSalary }}</div>
              </div>
            </div>

            <!-- 月度明细卡片 -->
            <div class="detail-section">
              <a-row :gutter="[12, 12]">
                <a-col
                  v-for="monthData in calculationResult.months"
                  :key="monthData.month"
                  :xs="24"
                  :sm="8"
                  :md="8"
                >
                  <div class="month-card">
                    <div class="month-header">
                      <span class="month-title">{{ monthData.monthName }}</span>
                      <span class="tax-rate">{{ monthData.taxRate }}</span>
                    </div>
                    <div class="month-details">
                      <div class="detail-row">
                        <span class="detail-label">税前收入</span>
                        <span class="detail-value">{{
                          monthData.preTaxSalary
                        }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">预扣个税</span>
                        <span class="detail-value tax-amount">{{
                          monthData.currentMonthTax
                        }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">税后收入</span>
                        <span class="detail-value after-tax-amount">{{
                          monthData.afterTaxSalary
                        }}</span>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </block>

          <!-- 空状态 -->
          <block v-else class="empty-result">
            <div class="empty-content">
              <a-typography-title :level="4" type="secondary"
                >等待计算</a-typography-title
              >
              <a-typography-text type="secondary"
                >请输入收入信息并点击"计算税后收入"按钮</a-typography-text
              >
            </div>
          </block>
        </a-col>
      </a-row>
    </a-card>

    <!-- 固定在底部的操作按钮 -->
    <div class="fixed-actions">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-button block @click="reset">重置</a-button>
        </a-col>
        <a-col :span="12">
          <a-button block type="primary" @click="calculate"
            >计算税后收入</a-button
          >
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped lang="less">
.tax-calculator {
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
  min-height: 100vh;
  .input-card {
    height: fit-content;
    display: flex;
    flex-direction: column;

    .ant-card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }

  .result-card {
    height: fit-content;

    .ant-card-body {
      padding: 24px;
    }
  }

  .form-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .month-selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .select-all-btn {
      padding: 0;
      height: auto;
      color: #3165ff;
    }
  }

  .month-buttons {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px 16px;
    margin-bottom: 8px;
    .month-btn {
      background: #f5f5f5;
      border: none;
      border-radius: 24px;
      padding: 6px 0;
      font-size: 12px;
      color: #888;
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
      font-weight: 500;
    }
    .month-btn.selected {
      background: #e6f7ff;
      color: #1890ff;
    }
    .month-btn:active {
      background: #bae7ff;
    }
  }

  .salary-input {
    .ant-input-number {
      font-size: 16px;
    }
  }

  .custom-salaries {
    .custom-salary-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .ant-typography {
        font-weight: 500;
      }
    }
  }

  .fixed-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 24px calc(16px + env(safe-area-inset-bottom)) 24px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .ant-btn {
      min-width: 100px;
      height: 40px;
      font-size: 16px;
    }

    .ant-btn-primary {
      background: #1890ff;
      border-color: #1890ff;

      &:hover {
        background: #40a9ff;
        border-color: #40a9ff;
      }
    }
  }

  .empty-result {
    .empty-content {
      text-align: center;
      padding: 60px 20px;

      .ant-typography-title {
        margin-bottom: 12px;
      }
    }
  }

  .summary-section {
    margin-bottom: 16px;
    padding: 16px;
    background: #eff6ff;
    border-radius: 6px;
    border: 1px solid #1890ff;

    .summary-row {
      background-color: #ffffff;
      padding: 16px 16px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .summary-row:last-child {
      padding-bottom: 16px;
    }
  }

  .detail-section {
    .month-card {
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
      height: 100%;

      .month-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .month-title {
          color: #262626;
        }
      }

      .month-details {
        padding: 0px 16px 16px;

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            color: #8c8c8c;
            font-size: 14px;
          }

          .detail-value {
            color: #262626;
            font-size: 14px;
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .month-buttons {
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

.title-parts {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .ant-radio-group {
    .ant-radio-button-wrapper {
      padding: 4px 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  :deep(.ant-tabs) {
    .ant-tabs-nav {
      margin-bottom: 0;

      .ant-tabs-nav-wrap {
        .ant-tabs-nav-list {
          .ant-tabs-tab {
            border-bottom: 2px solid transparent;
            font-size: 12px;
            padding-bottom: 2px;

            &.ant-tabs-tab-active {
              border-bottom-color: #1890ff;
            }
          }
        }
      }

      &::before {
        display: none;
      }
    }
  }
}
</style>
