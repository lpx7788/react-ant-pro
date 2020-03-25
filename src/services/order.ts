import request from '@/utils/request';

// 订单列表
export async function queryOrderList(params: object) {
  return request('/agencyUrl/v1.0/order/query',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 买家卖家公司
export async function queryCompanyList(params: object) {
  return request('/agencyUrl/v1.0/company/getCompanyList',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 订单详情
export async function queryOrderDetail(params: object) {
  return request('/agencyUrl/v1.0/order/detail',
    {
      method: 'POST',
      data: params,
    },
  );
}
