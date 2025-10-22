// utils/encode.js
export function encodeId(id: number | string) {
  // 转成字符串后 Base64 编码
  return btoa(String(id));
}

export function decodeId(code: string) {
  try {
    return atob(code);
  } catch {
    return null;
  }
}
