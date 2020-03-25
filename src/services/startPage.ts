import request from '@/utils/request';

// 广告图
export async function queryAdvertisementList(params: object) {
  return request('/agencyUrl/v1.1/advertising/queryAdvertisingList',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除
export async function deleteAdvertisementList(params: object) {
  return request('/agencyUrl/v1.1/advertising/deleteAdvertising',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 添加
export async function AddAdvertisementList(params: object) {
  return request('/agencyUrl/v1.1/advertising/add',
    {
      method: 'POST',
      data: params,
    },
  );
}
