import request from '@/utils/request';

// 获取应用列表
export async function queryApplicationList(params: object) {
  return request('/agencyUrl/api-uaa/clients/list',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 新增或者修改应用信息
export async function updateApplication(params: object) {
  return request('/agencyUrl/api-uaa/clients/saveOrUpdate',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除应用
export async function deleteApplication(params: any) {
  return request(`/agencyUrl/api-uaa/clients/${params.id}`,
    {
      method: 'DELETE',
    },
  );
}

// 获取下拉应用
export async function findAllApplicationName() {
  return request('/agencyUrl/api-uaa/clients/all',
    {
      method: 'GET',
    },
  );
}
