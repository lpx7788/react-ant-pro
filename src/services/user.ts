import request from '@/utils/request';

export async function queryUserDetail(params:object): Promise<any> {
  return request('/agencyUrl/v1.0/user/company/detail', {
    method: 'POST',
    data: params,
  });
}

export async function editUserDetail(params:object): Promise<any> {
  return request('/agencyUrl/v1.0/user/company/editUser', {
    method: 'POST',
    data: params,
  });
}

export async function queryRegisterPhone(params:object): Promise<any> { // 已注册手机号
  return request('/agencyUrl/v1.0/company/registerPhone', {
    method: 'POST',
    data: params,
  });
}

// 获取用户列表
export async function getUserList(params:object) {
  return request('/agencyUrl/api-user/users', {
    method: 'POST',
    data: params,
  });
}

// 获取用户角色类表
export async function getUserRoles() {
  return request('/agencyUrl/api-user/roles', {
    method: 'GET',
  });
}

// 新增或者修改用户
export async function UpdateUser(params:object) {
  return request('/agencyUrl/api-user/users/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

// 删除用户
export async function deleteUser(params:any) {
  return request(`/agencyUrl/api-user/users/${params.id}`, {
    method: 'DELETE',
  });
}

// 用户重置密码
export async function resetUserPassword(params:object) {
  return request('/agencyUrl/api-user/users/password', {
    method: 'PUT',
    params,
  });
}
