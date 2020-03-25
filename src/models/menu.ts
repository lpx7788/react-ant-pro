import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryMenuList, updateMenu, deleteMenu, findOnesMenu } from '@/services/Menu';
import { notification } from 'antd';

export interface MenuModelState {
  menuList?:Record<string, any>;
  onesmenuList?:Record<string, any>;
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {
    fetchMenuListDatas: Effect;
    updateMenuRequest: Effect;
    deleteMenuRequest: Effect;
    findOnesMenuRequest: Effect;
  };
  reducers: {
    getMenuListCallback: Reducer<MenuModelState>;
    getOnesMenuCallback: Reducer<MenuModelState>;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',
  state: {
    menuList: {},
    onesmenuList: {},
  },

  effects: {
    // 获取菜单
    *fetchMenuListDatas(_, { call, put }) {
      const response = yield call(queryMenuList, _.payload);
      if (response) {
        yield put({
          type: 'getMenuListCallback',
          payload: response,
        });
      }
    },

    // 新增或者修改菜单
    *updateMenuRequest(_, { call, put }) {
      const response = yield call(updateMenu, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === 0) {
          _.callback(response); // 返回结果
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 删除菜单
    *deleteMenuRequest(_, { call, put }) {
      const response = yield call(deleteMenu, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === 0) {
          _.callback(response); // 返回结果
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 第一级菜单
    *findOnesMenuRequest(_, { call, put }) {
      const response = yield call(findOnesMenu, _.payload);
      if (response) {
        yield put({
          type: 'getOnesMenuCallback',
          payload: response,
        });
      }
    },

  },

  reducers: {
    // 菜单列表返回
    getMenuListCallback(state, action) {
      return {
        ...state,
        menuList: action.payload || {},
      };
    },

    // 一级菜单返回
    getOnesMenuCallback(state, action) {
      return {
        ...state,
        onesmenuList: action.payload || {},
      };
    },
  },
};

export default MenuModel;
