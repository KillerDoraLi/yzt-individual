/** 个体户注册表单校验 */

export const validateName = (val: string) => val && val.length >= 2;

export const validatePhone = (val: string) => /^1[3-9]\d{9}$/.test(val);

export const validateIdCard = (val: string) =>
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(
    val
  );

/** 身份证年龄校验（18~60岁） */
export function validateIdCardAge(idCard: string): boolean {
  let birthStr = '';
  if (/^\d{15}$/.test(idCard)) {
    birthStr = '19' + idCard.slice(6, 12);
  } else if (/^\d{17}[\dXx]$/.test(idCard)) {
    birthStr = idCard.slice(6, 14);
  } else {
    return false;
  }
  const year = parseInt(birthStr.slice(0, 4), 10);
  const month = parseInt(birthStr.slice(4, 6), 10) - 1;
  const day = parseInt(birthStr.slice(6, 8), 10);
  const birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month ||
    (today.getMonth() === month && today.getDate() < day)
  ) {
    age--;
  }
  return age >= 18 && age <= 60;
}

export const validateCardNumber = (val: string) => /^\d{16,19}$/.test(val);
