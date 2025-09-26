import { Decimal } from 'decimal.js';

/**
 * 税率表配置
 */
const TAX_BRACKETS = [
  { min: 0, max: 36000, rate: 0.03, deduction: 0 },
  { min: 36000, max: 144000, rate: 0.1, deduction: 2520 },
  { min: 144000, max: 300000, rate: 0.2, deduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
  { min: 420000, max: 660000, rate: 0.3, deduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 }
];

/**
 * 月份数据接口
 */
export interface MonthData {
  month: number; // 月份 (1-12)
  preTaxSalary: number; // 税前工资
  accumulatedSalary: number; // 累计税前工资
  taxableIncome: number; // 应纳税所得额
  currentMonthTax: number; // 当月预扣个税
  accumulatedTax: number; // 累计预扣个税
  afterTaxSalary: number; // 税后工资
}

/**
 * 计算输入参数
 */
export interface CalculatorInput {
  mode: 'uniform' | 'custom'; // 计算模式
  selectedMonths: number[]; // 选中的月份数组
  uniformSalary?: number; // 统一金额模式下的工资
  customSalaries?: Record<number, number>; // 自定义模式下各月工资
}

/**
 * 计算结果
 */
export interface CalculatorResult {
  monthlyData: MonthData[]; // 每月详细数据
  totalPreTaxSalary: number; // 总税前工资
  totalTax: number; // 总税额
  totalAfterTaxSalary: number; // 总税后工资
}

/**
 * 税率区间
 */
export interface TaxBracket {
  min: number; // 区间最小值
  max: number; // 区间最大值
  rate: number; // 税率
  deduction: number; // 速算扣除数
}

/**
 * 计算模式
 */
export type CalculationMode = 'uniform' | 'custom';

/**
 * 月份信息展示
 */
export interface MonthDisplay {
  month: number;
  monthName: string;
  preTaxSalary: string; // 格式化后的税前工资
  currentMonthTax: string; // 格式化后的当月税额
  afterTaxSalary: string; // 格式化后的税后工资
  taxRate: string; // 适用税率
}

/**
 * 计算结果汇总展示
 */
export interface SummaryDisplay {
  totalMonths: number; // 总月份数
  totalPreTaxSalary: string; // 格式化后的总税前工资
  totalTax: string; // 格式化后的总税额
  totalAfterTaxSalary: string; // 格式化后的总税后工资
  averageMonthlyTax: string; // 格式化后的平均月税额
  effectiveTaxRate: string; // 有效税率百分比
}

/**
 * 计算累计应纳税额对应的税额
 */
function calculateTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  const income = new Decimal(taxableIncome);
  const bracket = TAX_BRACKETS.find(
    (b) => taxableIncome > b.min && taxableIncome <= b.max
  );

  if (!bracket) {
    const lastBracket = TAX_BRACKETS[TAX_BRACKETS.length - 1];
    const tax = income.mul(lastBracket.rate).sub(lastBracket.deduction);
    return Math.max(0, tax.toDecimalPlaces(2).toNumber());
  }

  const tax = income.mul(bracket.rate).sub(bracket.deduction);
  return Math.max(0, tax.toDecimalPlaces(2).toNumber());
}

/**
 * 核心计算函数
 */
export function calculateAfterTaxSalary(
  input: CalculatorInput
): CalculatorResult {
  const {
    mode,
    selectedMonths,
    uniformSalary = 0,
    customSalaries = {}
  } = input;

  // 对选中的月份进行排序
  const sortedMonths = [...selectedMonths].sort((a, b) => a - b);

  let accumulatedPreTaxSalary = new Decimal(0); // 累计税前工资
  let accumulatedTax = new Decimal(0); // 累计已缴税额
  let monthCount = 0; // 累计月份数

  const monthlyData: MonthData[] = [];

  // 遍历选中的月份进行计算
  for (const month of sortedMonths) {
    monthCount++;

    // 获取当月税前工资
    const preTaxSalary = new Decimal(
      mode === 'uniform' ? uniformSalary : customSalaries[month] || 0
    );

    // 累计税前工资
    accumulatedPreTaxSalary = accumulatedPreTaxSalary.add(preTaxSalary);

    // 计算应纳税所得额
    // 应纳税所得额 = 累计税前工资 * 0.8 - 5000 * 累计月份数
    const taxableIncome = accumulatedPreTaxSalary
      .mul(0.8)
      .sub(new Decimal(5000).mul(monthCount));

    // 计算累计应缴税额
    const totalTax = new Decimal(calculateTax(taxableIncome.toNumber()));

    // 当月应缴税额 = 累计应缴税额 - 已缴税额
    const currentMonthTax = totalTax.sub(accumulatedTax);

    // 更新累计已缴税额
    accumulatedTax = totalTax;

    // 计算税后工资
    const afterTaxSalary = preTaxSalary.sub(currentMonthTax);

    // 保存月份数据
    monthlyData.push({
      month,
      preTaxSalary: preTaxSalary.toDecimalPlaces(2).toNumber(),
      accumulatedSalary: accumulatedPreTaxSalary.toDecimalPlaces(2).toNumber(),
      taxableIncome: Math.max(0, taxableIncome.toDecimalPlaces(2).toNumber()),
      currentMonthTax: Math.max(
        0,
        currentMonthTax.toDecimalPlaces(2).toNumber()
      ),
      accumulatedTax: Math.max(0, accumulatedTax.toDecimalPlaces(2).toNumber()),
      afterTaxSalary: afterTaxSalary.toDecimalPlaces(2).toNumber()
    });
  }

  // 使用 Decimal.js 计算汇总数据
  const totalPreTaxSalary = monthlyData.reduce(
    (sum, m) => sum.add(m.preTaxSalary),
    new Decimal(0)
  );
  const totalTax = monthlyData.reduce(
    (sum, m) => sum.add(m.currentMonthTax),
    new Decimal(0)
  );
  const totalAfterTaxSalary = monthlyData.reduce(
    (sum, m) => sum.add(m.afterTaxSalary),
    new Decimal(0)
  );

  return {
    monthlyData,
    totalPreTaxSalary: totalPreTaxSalary.toDecimalPlaces(2).toNumber(),
    totalTax: totalTax.toDecimalPlaces(2).toNumber(),
    totalAfterTaxSalary: totalAfterTaxSalary.toDecimalPlaces(2).toNumber()
  };
}

/**
 * 格式化金额显示
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * 获取月份名称
 */
export function getMonthName(month: number): string {
  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ];
  return monthNames[month - 1] || '';
}
