import request from '@utils/request';

export function uploadFile(data: any) {
  return request({
    url: '/upload',
    method: 'post',
    data
  });
}
