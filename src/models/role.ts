import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryRoleList, updateRole, deleteRole, rolePermission, permissionMenuTree } from '@/services/role';
import { notification } from 'antd';

export interface RoleModelState {
  roleList?:Record<string, any>;
  menuPermissionTree?:Record<string, any>;
}

export interface RoleModelType {
  namespace: 'role';
  state: RoleModelState;
  effects: {
    fetchRoleListDatas: Effect;
    updateRoleRequest: Effect;
    deleteRoleRequest: Effect;
    rolePermissionRequest: Effect;
    menuTreeRequest: Effect;
  };
  reducers: {
    getRoleListCallback: Reducer<RoleModelState>;
    getMenuTreeCallback: Reducer<RoleModelState>;
  };
}

const RoleModel: RoleModelType = {
  namespace: 'role',
  state: {
    roleList: {},
    menuPermissionTree: {},
  },

  effects: {
    // 获取角色
    *fetchRoleListDatas(_, { call, put }) {
      const response = yield call(queryRoleList, _.payload);
      if (response) {
        yield put({
          type: 'getRoleListCallback',
          payload: response,
        });
      }
    },

    // 新增或者修改角色
    *updateRoleRequest(_, { call, put }) {
      const response = yield call(updateRole, _.payload);
      if (response.errorCode === 0) {
        _.callback(response); // 返回结果
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

    // 新增或者修改角色
    *deleteRoleRequest(_, { call, put }) {
      const response = yield call(deleteRole, _.payload);
      if (response.errorCode === 0) {
        _.callback(response); // 返回结果
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

    // 权限的分配
    *rolePermissionRequest(_, { call, put }) {
      const response = yield call(rolePermission, _.payload);
      if (response) {
        if (response.errorCode === 0) {
          _.callback(response); // 返回结果
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 允许操作的权限树
    *menuTreeRequest(_, { call, put }) {
      const response = yield call(permissionMenuTree, _.payload);
      if (response) {
        yield put({
          type: 'getMenueTreeCallback',
          payload: response,
        });
      }
    },

  },

  reducers: {
    // 角色列表返回
    getRoleListCallback(state, action) {
      return {
        ...state,
      roleList: action.payload.returnObject || {},
      };
    },
     // 权限树列表
     getMenuTreeCallback(state, action) {
      return {
        ...state,
        menuPermissionTree: action.payload || {},
      };
    },
  },
};

export default RoleModel;
