import request from '@/utils/request';

export async function queryHomeList(params: object) {
  return request('/agencyUrl/v1.0/app/count?timestamp=1572845944439',
    {
      method: 'POST',
      data: params,
    },
  );
}
