import request from '@/utils/request';
import device from '@/utils/device';

const tenantId = device.clientId;

// 获取菜单列表
export async function queryMenuList(params: object) {
  return request(`/agencyUrl/api-user/menus/findAlls?tenantId=${tenantId}`,
    {
      method: 'GET',
      params,
    },
  );
}

// 新增或者修改菜单
export async function updateMenu(params: object) {
  return request('/agencyUrl/api-user/menus/saveOrUpdate',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除菜单
export async function deleteMenu(params: any) {
  return request(`/agencyUrl/api-user/menus/${params.id}`,
    {
      method: 'DELETE',
    },
  );
}

// 获取下拉菜单
export async function findOnesMenu() {
  return request(`/agencyUrl/api-user/menus/findOnes?tenantId=${tenantId}`,
    {
      method: 'GET',
    },
  );
}
