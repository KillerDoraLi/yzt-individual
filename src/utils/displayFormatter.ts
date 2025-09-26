import {
  formatCurrency,
  getMonthName,
  MonthData,
  MonthDisplay,
  CalculatorResult,
  SummaryDisplay
} from './taxCalculator';

/**
 * 获取适用税率描述
 */
function getTaxRateDescription(taxableIncome: number): string {
  if (taxableIncome <= 0) return '0%';
  if (taxableIncome <= 36000) return '3%';
  if (taxableIncome <= 144000) return '10%';
  if (taxableIncome <= 300000) return '20%';
  if (taxableIncome <= 420000) return '25%';
  if (taxableIncome <= 660000) return '30%';
  if (taxableIncome <= 960000) return '35%';
  return '45%';
}

/**
 * 格式化月份数据用于展示
 */
export function formatMonthDisplay(monthData: MonthData): MonthDisplay {
  return {
    month: monthData.month,
    monthName: getMonthName(monthData.month),
    preTaxSalary: formatCurrency(monthData.preTaxSalary),
    currentMonthTax: formatCurrency(monthData.currentMonthTax),
    afterTaxSalary: formatCurrency(monthData.afterTaxSalary),
    taxRate: getTaxRateDescription(monthData.taxableIncome)
  };
}

/**
 * 格式化计算结果汇总用于展示
 */
export function formatSummaryDisplay(result: CalculatorResult): SummaryDisplay {
  const totalMonths = result.monthlyData.length;
  const averageMonthlyTax = totalMonths > 0 ? result.totalTax / totalMonths : 0;
  const effectiveTaxRate =
    result.totalPreTaxSalary > 0
      ? (result.totalTax / result.totalPreTaxSalary) * 100
      : 0;

  return {
    totalMonths,
    totalPreTaxSalary: formatCurrency(result.totalPreTaxSalary),
    totalTax: formatCurrency(result.totalTax),
    totalAfterTaxSalary: formatCurrency(result.totalAfterTaxSalary),
    averageMonthlyTax: formatCurrency(averageMonthlyTax),
    effectiveTaxRate: `${effectiveTaxRate.toFixed(2)}%`
  };
}

/**
 * 生成计算结果的完整展示数据
 */
export function generateDisplayData(result: CalculatorResult) {
  return {
    months: result.monthlyData.map(formatMonthDisplay),
    summary: formatSummaryDisplay(result)
  };
}
