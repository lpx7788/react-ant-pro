import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryInformationList,
        queryEditorList,
        queryInformationSourseList,
        queryDeleteInformationList,
        informationListToTop,
        informationListDisplay,
        informationRelease,
        informationEdit,
      } from '@/services/information';
import { notification } from 'antd';

export interface InformationModelState {
  informationList?:Record<string, any>;
  editorList?:any[];
  sourseList?:any[];
}

export interface InformationModelType {
  namespace: 'information';
  state: InformationModelState;
  effects: {
    getInformationListRequest: Effect;
    getEditorListRequest: Effect;
    getSourseListRequest: Effect;
    informationListToTopRequest: Effect;
    deleteInformationRequest: Effect;
    informationListDisplayRequest: Effect;
    informationReleaseRequest: Effect;
    informationEditRequest: Effect;
  };
  reducers: {
    getInformationListCallback: Reducer<InformationModelState>;
    getEditorListCallback: Reducer<InformationModelState>;
    getSourseListCallback: Reducer<InformationModelState>;
  };
}

const InformationModel: InformationModelType = {
  namespace: 'information',
  state: {
    informationList: {},
    editorList: [],
    sourseList: [],
  },

  effects: {
    // 获取资讯列表
    *getInformationListRequest(_, { call, put }) {
      const response = yield call(queryInformationList, _.payload);
      if (response) {
        yield put({
          type: 'getInformationListCallback',
          payload: response,
        });
      }
    },

    // 获取编辑者列表
    *getEditorListRequest(_, { call, put }) {
      const response = yield call(queryEditorList, _.payload);
      if (response) {
        yield put({
          type: 'getEditorListCallback',
          payload: response,
        });
      }
    },

    // 资源来源列表
    *getSourseListRequest(_, { call, put }) {
      const response = yield call(queryInformationSourseList, _.payload);
      if (response) {
        yield put({
          type: 'getSourseListCallback',
          payload: response,
        });
      }
    },

    // 删除资讯
    *deleteInformationRequest(_, { call, put }) {
      const response = yield call(queryDeleteInformationList, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === '0000') {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 置顶该资讯
    *informationListToTopRequest(_, { call, put }) {
      const response = yield call(informationListToTop, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === '0000') {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 显示或者隐藏该资讯
    *informationListDisplayRequest(_, { call, put }) {
      const response = yield call(informationListDisplay, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === '0000') {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 发布资讯
    *informationReleaseRequest(_, { call, put }) {
      const response = yield call(informationRelease, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === '0000') {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

    // 编辑资讯
    *informationEditRequest(_, { call, put }) {
      const response = yield call(informationEdit, _.payload);
      if (response) {
        if (response.errorCode && response.errorCode === '0000') {
          _.callback(response);
        } else {
          notification.error({
            message: response.errorMsg,
          });
        }
      }
    },

  },

  reducers: {
    // 资讯菜单列表
    getInformationListCallback(state, action) {
      return {
        ...state,
        informationList: action.payload.returnObject || {},
      };
    },

    // 编辑者列表
    getEditorListCallback(state, action) {
      return {
        ...state,
        editorList: action.payload.returnObject || [],
      };
    },
    // 编辑者列表
    getSourseListCallback(state, action) {
      return {
        ...state,
        sourseList: action.payload.returnObject || [],
      };
    },
  },
};

export default InformationModel;
