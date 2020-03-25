import request from '@/utils/request';

export async function companyJoinQuery(params: object) {
  return request('/agencyUrl/v1.0/company/query', {
    method: 'POST',
    data: params,
  });
}

export async function companyUserQuery(params: object) {
  return request('/agencyUrl/v1.0/user/company/query', {
    method: 'POST',
    data: params,
  });
}

export async function companyDetailQuery(params: object) {
  return request('/agencyUrl/v1.0/company/detail', {
    method: 'POST',
    data: params,
  });
}

export async function companyExamine(params: object) {
  return request('/agencyUrl_aio/company/examine/admin', {
    method: 'POST',
    data: params,
  });
}

export async function companyDetailEdit(params: object) {
  return request('/agencyUrl/v1.0/company/edit', {
    method: 'POST',
    data: params,
  });
}

export async function companyJoin(params: object) { // 添加企业
  return request('/agencyUrl/v1.0/company/join', {
    method: 'POST',
    data: params,
  });
}

export async function queryCustomers(params: object) { // 客户列表
  return request('/agencyUrl/v1.1/company/customers', {
    method: 'POST',
    data: params,
  });
}

export async function querySuppliers(params: object) { // 供应商列表
  return request('/agencyUrl/v1.1/company/suppliers', {
    method: 'POST',
    data: params,
  });
}

export async function queryCompanyStaffs(params: object) { // 供应商列表
  return request('/agencyUrl/v1.0/user/company/queryUserCompany', {
    method: 'POST',
    data: params,
  });
}
