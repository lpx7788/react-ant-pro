import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryAdvertisementList, deleteAdvertisementList, AddAdvertisementList } from '@/services/startPage';
import { notification } from 'antd';

export interface AdvertisementModelState {
  advertisementList?:Record<string, any>;
}
export interface AdvertisementModelType {
  namespace: 'advertisement';
  state: AdvertisementModelState;
  effects: {
    advertisementListRequest: Effect;
    deleteAdvertisementRequest: Effect;
    addAdvertisementRequest: Effect;

  };
  reducers: {
    getAdvertisementListCallback: Reducer<AdvertisementModelState>;
  };
}

const AdvertisementModel: AdvertisementModelType = {
  namespace: 'advertisement',
  state: {
    advertisementList: {},
  },

  effects: {
    // 获取广告图
    *advertisementListRequest(_, { call, put }) {
      const response = yield call(queryAdvertisementList, _.payload);
        if (response) {
          yield put({
            type: 'getAdvertisementListCallback',
            payload: response,
          });
       }
    },

    // 删除
    *deleteAdvertisementRequest(_, { call, put }) {
      const response = yield call(deleteAdvertisementList, _.payload);
      if (response.errorCode === '0000') {
        _.callback(response);
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

     // 增加
     *addAdvertisementRequest(_, { call, put }) {
      const response = yield call(AddAdvertisementList, _.payload);
      if (response.errorCode === '0000') {
        _.callback(response);
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },
  },

  reducers: {

    getAdvertisementListCallback(state, action) {
      return {
        ...state,
        advertisementList: action.payload || {},
      };
    },
  },
};

export default AdvertisementModel;
