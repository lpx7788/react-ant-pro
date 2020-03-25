import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryApplicationList, updateApplication, deleteApplication, findAllApplicationName } from '@/services/application'
import { notification } from 'antd';

export interface ApplicationModelState {
  applicationList?: Record<string, any>;
  allApplicationList?: Record<string, any>;
}

export interface ApplicationModelType {
  namespace: 'application';
  state: ApplicationModelState;
  effects: {
    applicationListDatasRequest: Effect;
    updateApplicationRequest: Effect;
    deleteApplicationRequest: Effect;
    findAllApplicationNameRequest: Effect;
  };
  reducers: {
    applicationListCallback: Reducer<ApplicationModelState>;
    allApplicationNameCallback: Reducer<ApplicationModelState>;
  };
}

const ApplicationModel: ApplicationModelType = {
  namespace: 'application',
  state: {
    applicationList: {},
    allApplicationList: {},
  },

  effects: {

    // 获取应用列表
    *applicationListDatasRequest(_, { call, put }) {
      const response = yield call(queryApplicationList, _.payload);
      if (response) {
        yield put({
          type: 'applicationListCallback',
          payload: response,
        });
      }
    },

    // 新增或者编辑
    *updateApplicationRequest(_, { call, put }) {
      const response = yield call(updateApplication, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === 0) {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 删除应用
    *deleteApplicationRequest(_, { call, put }) {
      const response = yield call(deleteApplication, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === 0) {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 获取应用下拉列表
    *findAllApplicationNameRequest(_, { call, put }) {
      const response = yield call(findAllApplicationName, _.payload);
      if (response) {
        yield put({
          type: 'allApplicationNameCallback',
          payload: response,
        });
      }
    },
  },

  reducers: {
    // 应用列表返回
    applicationListCallback(state, action) {
      return {
        ...state,
        applicationList: action.payload.returnObject || {},
      };
    },

    // 应用名称下拉列表
    allApplicationNameCallback(state, action) {
      return {
        ...state,
        allApplicationList: action.payload || {},
      };
    },
  },
};

export default ApplicationModel;
