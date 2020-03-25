import request from '@/utils/request';

export async function categoryTreeQuery(params:object) {
  return request('/agencyUrl_aio/category/tree', {
    method: 'POST',
    data: params,
  });
}

export async function queryIntegralCategory(params:object) {
  return request('/agencyUrl_aio/businessFollowUp/queryIntegralCategory', {
    method: 'POST',
    data: params,
  });
}
