import request from '@/utils/request';
import device from '@/utils/device';

const tenantId = device.clientId;
// 获取角色列表
export async function queryRoleList(params: object) {
  return request('/agencyUrl/api-user/roles/list',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 新增或者修改角色
export async function updateRole(params: object) {
  return request('/agencyUrl/api-user/roles/saveOrUpdate',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除角色
export async function deleteRole(params: any) {
  return request(`/agencyUrl/api-user/roles/${params.id}`,
    {
      method: 'DELETE',
    },
  );
}

// 权限分配修改提交
export async function rolePermission (params: object) {
  return request('/agencyUrl/api-user/menus/granted',
    {
      method: 'POST',
      data: params,
    },
  );
}
// 获取对应的权限
export async function permissionMenuTree (params: any) {
  return request(`/agencyUrl/api-user/menus/${params.roleId}/menus?tenantId=${tenantId}`,
    {
      method: 'GET',
    },
  );
}
