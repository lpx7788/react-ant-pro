import { Reducer } from 'redux';
import { Effect } from 'dva';
import { loginUser, getCurrentUserMessage, getCurrentMenusMessage } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { notification } from 'antd';
// import { getPageQuery } from '@/utils/utils';

export interface LoginModelState {
  menuData?:{};
  userData?:{};
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelTypes {
  namespace: string;
  state: LoginModelState;
  effects: {
    getToken: Effect;
    getuserDatas: Effect;
    getMenuDatas: Effect;
  };
  reducers: {
    saveUserData: Reducer<LoginModelState>;
    saveMenuData: Reducer<LoginModelState>;
  };
}

const Model: LoginModelTypes = {
  namespace: 'login',
  state: {
    userData: {},
    menuData: {},
  },

  effects: {
    *getToken(_, { call, put }) {
      // 登录
      const response = yield call(loginUser, _.payload);
      if (response) {
        if (response.errorCode === 0) {
          _.callback(response); // 返回结果
        } else {
          notification.error({
            message: response.msg,
          });
        }
      }
    },
    *getuserDatas(_, { call, put }) {
      // 登录
      const response = yield call(getCurrentUserMessage, _.payload);
      if (response) {
        if (response.errorCode === 0) {
          // 存储用户信息
          localStorage.setItem('userData', JSON.stringify(response))
          setAuthority(response.returnObject.roles)
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
     }
    },
    *getMenuDatas(_, { call, put }) {
      // 登录
      const response = yield call(getCurrentMenusMessage, _.payload);
      if (response) {
      if (response.errorCode === 0) {
          yield put({
            type: 'saveMenuData',
            payload: response,
          });
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },
  },

  reducers: {
    saveUserData(state:any, action:any) {
      return { ...state, userData: action.payload.returnObject || [] };
    },
    saveMenuData(state:any, action:any) {
      return { ...state, menuData: action.payload.returnObject || [] };
    },
  },
};

export default Model;
