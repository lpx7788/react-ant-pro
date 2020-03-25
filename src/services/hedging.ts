import request from '@/utils/request';

// 获取套保账户列表
export async function getAutoHedgeAccount(params: object) {
  return request('/agencyUrl/v1.1/company/autoHedge/query',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 修改账户状态 （停止使用，恢复使用）
export async function getAutoHedgeeditStatus(params: object) {
  return request('/agencyUrl/v1.1/company/autoHedge/editStatus',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 修改套保账户密码
export async function editPassword(params: object) {
  return request('/agencyUrl/v1.1/company/autoHedge/editPassword',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 修改套保账户密码
export async function getPreAddressList(params: object) {
  return request('/agencyUrl/v1.2/PreAddressManagement/queryPreAddressList',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除前置地址
export async function deleteFrontAddress(params: object) {
  return request('/agencyUrl/v1.2/PreAddressManagement/deletePreAddress',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 期货公司列表
export async function getFuturesCompanyList(params: object) {
  return request('/agencyUrl_aio/autoHedge/futuresCompanyList',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 期货公司列表
export async function newPreAddress(params: object) {
  return request('/agencyUrl/v1.2/PreAddressManagement/savePreAddress',
    {
      method: 'POST',
      data: params,
    },
  );
}
