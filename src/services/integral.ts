import request from '@/utils/request';

export async function queryIntegralList(params: object) {
  return request('/agencyUrl/v1.1/company/queryIntegralList', {
    method: 'POST',
    data: params,
  });
}

export async function addRewardIntegral(params: object) {
  return request('/agencyUrl/v1.1/company/addRewardIntegral', {
    method: 'POST',
    data: params,
  });
}

export async function deleteIntegral(params: object) {
  return request('/agencyUrl/v1.1/company/deleteIntegral', {
    method: 'POST',
    data: params,
  });
}

export async function queryIntegralOrderList(params: object) {
  return request('/agencyUrl/v1.1/integralorder/queryIntegralOrderList', {
    method: 'POST',
    data: params,
  });
}

export async function updateIntegralOrder(params: object) {
  return request('/agencyUrl/v1.1/integralorder/updateIntegralOrder', {
    method: 'POST',
    data: params,
  });
}

export async function refuseIntegralOrder(params: object) {
  return request('/agencyUrl/v1.1/integralorder/refuseIntegralOrder', {
    method: 'POST',
    data: params,
  });
}

export async function queryCashingCommodityList(params: object) {
  return request('/agencyUrl/v1.1/cashingcommodity/queryCashingCommodityList', {
    method: 'POST',
    data: params,
  });
}

export async function deleteCashingCommodity(params: object) {
  return request('/agencyUrl/v1.1/cashingcommodity/deleteCashingCommodity', {
    method: 'POST',
    data: params,
  });
}

export async function joinCashingCommodity(params: object) {
  return request('/agencyUrl/v1.1/cashingcommodity/join', {
    method: 'POST',
    data: params,
  });
}

export async function queryGuidePriceList(params: object) {
  return request('/agencyUrl/v1.1/guideprice/queryGuidePriceList', {
    method: 'POST',
    data: params,
  });
}

export async function stopGuidePriceList(params: object) {
  return request('/agencyUrl/v1.1/guideprice/stopGuidePriceList', {
    method: 'POST',
    data: params,
  });
}

export async function addGuidePrice(params: object) {
  return request('/agencyUrl/v1.1/guideprice/addGuidePrice', {
    method: 'POST',
    data: params,
  });
}

export async function queryIntegralDetailList(params: object) {
  return request('/agencyUrl/v1.1/integraldetail/queryIntegralDetailList', {
    method: 'POST',
    data: params,
  });
}

export async function queryIntegralAddRecordList(params: object) {
  return request('/agencyUrl/v1.1/integra/record/queryIntegraRecordList', {
    method: 'POST',
    data: params,
  });
}

export async function queryUserIntegral(params: object) {
  return request('/agencyUrl/v1.1/integra/record/queryUserIntegral', {
    method: 'POST',
    data: params,
  });
}

export async function addUserIntegral(params: object) {
  return request('/agencyUrl/v1.1/integra/record/addUserIntegral', {
    method: 'POST',
    data: params,
  });
}

export async function queryIntegralUsers(params: object) {
  return request('/agencyUrl/v1.1//user/queryUserList', {
    method: 'POST',
    data: params,
  });
}
