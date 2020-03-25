import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryUserDetail, editUserDetail, queryRegisterPhone, getUserList, getUserRoles, UpdateUser, resetUserPassword, deleteUser } from '@/services/user';
import { notification } from 'antd';

export interface UserModelState {
  userData?: any;
  userDetail?: any;
  registerPhone?: any[]
  userList?: any[]
  userRolesList?: Record<string, any>
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    queryUserDetail: Effect;
    editUserDetail: Effect;
    queryRegisterPhone: Effect;
    queryUserList: Effect;
    queryUserRoles: Effect;
    UpdateUserRequest: Effect;
    ResetUserPwd: Effect;
    deleteUserRequest: Effect;
  };
  reducers: {
    queryUserDetail_call: Reducer<UserModelState>;
    editUserDetail_call: Reducer<UserModelState>;
    queryRegisterPhone_call: Reducer<UserModelState>;
    saveUserList: Reducer<UserModelState>;
    saveUserRoles: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    userData: {},
    registerPhone: [],
    userList: [],
    userRolesList: {},
  },

  effects: {
    *queryUserDetail(_, { call, put }) {
      const response = yield call(queryUserDetail, _.payload);
      if (response) {
        yield put({
          type: 'queryUserDetail_call',
          payload: response,
        });
      }
    },
    *editUserDetail(_, { call, put }) {
      const response = yield call(editUserDetail, _.payload);
      if (response) {
        yield put({
          type: 'editUserDetail_call',
          payload: response,
        })
      }
      if (_.callback && typeof _.callback === 'function') {
        _.callback(response);
      }
    },
    *queryRegisterPhone(_, { call, put }) {
      const response = yield call(queryRegisterPhone, _.payload);
      if (response) {
        yield put({
          type: 'queryRegisterPhone_call',
          payload: response,
        })
      }
    },

    // 获取用户列表
    *queryUserList(_, { call, put }) {
      const response = yield call(getUserList, _.payload);
      if (response) {
        yield put({
          type: 'saveUserList',
          payload: response,
        })
      }
    },

    // 获取角色列表
    *queryUserRoles(_, { call, put }) {
      const response = yield call(getUserRoles);
      if (response) {
        yield put({
          type: 'saveUserRoles',
          payload: response,
        })
      }
    },

    // 新增或者修改用户
    *UpdateUserRequest(_, { call, put }) {
      const response = yield call(UpdateUser, _.payload);
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

    // 新增或者修改用户
    *ResetUserPwd(_, { call, put }) {
      const response = yield call(resetUserPassword, _.payload);
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
    // 删除用户
    *deleteUserRequest(_, { call, put }) {
      const response = yield call(deleteUser, _.payload);
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
  },

  reducers: {
    queryUserDetail_call(state, action) {
      return {
        ...state,
        userData: action.payload.returnObject || {},
      };
    },
    editUserDetail_call(state, { payload }) {
      return {
        ...state,
        userDetail: payload,
      };
    },
    queryRegisterPhone_call(state, { payload }) {
      return {
        ...state,
        registerPhone: payload.returnObject || {},
      };
    },
    saveUserList(state, { payload }) {
      return {
        ...state,
        userList: payload.returnObject ? payload.returnObject : [],
      };
    },
    saveUserRoles(state, { payload }) {
      return {
        ...state,
        userRolesList: payload || {},
      };
    },
  },
};

export default UserModel;
