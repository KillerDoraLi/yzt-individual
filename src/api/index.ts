import request from '@/utils/request';

export function uploadFile(data: FormData) {
  return request.post('/upload/image', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// 注册个体户
export function registerIndividual(data: any) {
  return request.post('/individual_contractor/register', data);
}

// 更新个体户
export function updateIndividual(id: string, data: any) {
  return request.post(`/individual_contractor/${id}/update`, data);
}

// 获取个体户状态
export function getIndividualStatus(id: string) {
  return request.get(`/individual_contractor/${id}/status`);
}

// 提交签约
export function sign(
  id: string,
  data: {
    redirect_url: string;
  }
) {
  return request.post(`/individual_contractor/${id}/submit_signing`, data);
}

// 失败重试
export function retry(id: string) {
  return request.post(`/individual_contractor/${id}/retry`);
}
