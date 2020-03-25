import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryCarouselList, arouselListDelete, arouselListMove, arouselListAdd, arouselListEdit } from '@/services/carousel';
import { notification } from 'antd';

export interface CarouselModelState {
  carouselList?:Record<string, any>;
  mobileCarouselList?:Record<string, any>;
}

export interface CarouselModelType {
  namespace: 'carousel';
  state: CarouselModelState;
  effects: {
    carouselListRequest: Effect;
    deleteCarouselRequest: Effect;
    moveCarouselRequest: Effect;
    addCarouselRequest: Effect;
    editCarouselRequest: Effect;
  };
  reducers: {
    getCarouselListCallback: Reducer<CarouselModelState>;
    getMobileCarouselListCallback: Reducer<CarouselModelState>;
  };
}

const CarouselModel: CarouselModelType = {
  namespace: 'carousel',
  state: {
    carouselList: {},
    mobileCarouselList: {},
  },

  effects: {
    // 获取轮播图
    *carouselListRequest(_, { call, put }) {
      const response = yield call(queryCarouselList, _.payload);
      // 电脑端
      if (_.payload.type === 2) {
        if (response) {
          yield put({
            type: 'getCarouselListCallback',
            payload: response,
          });
        }
      }
      // 手机端
      else if (_.payload.type === 1) {
        if (response) {
          yield put({
            type: 'getMobileCarouselListCallback',
            payload: response,
          });
        }
      }
    },

    // 删除
    *deleteCarouselRequest(_, { call, put }) {
      const response = yield call(arouselListDelete, _.payload);
      if (response.errorCode === '0000') {
        _.callback(response);
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

     // 上移、下移
     *moveCarouselRequest(_, { call, put }) {
      const response = yield call(arouselListMove, _.payload);
      if (response.errorCode === '0000') {
        _.callback(response);
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

     // 增加
     *addCarouselRequest(_, { call, put }) {
      const response = yield call(arouselListAdd, _.payload);
      if (response.errorCode === '0000') {
        _.callback(response);
      } else {
        notification.error({
          message: response.errorMsg,
        });
      }
    },

    // 编辑
     *editCarouselRequest(_, { call, put }) {
      const response = yield call(arouselListEdit, _.payload);
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

    // web輪播列表返回
    getCarouselListCallback(state, action) {
      return {
        ...state,
        carouselList: action.payload || {},
      };
    },

    // 手機輪播列表返回
    getMobileCarouselListCallback(state, action) {
      return {
        ...state,
        mobileCarouselList: action.payload || {},
      };
    },
  },
};

export default CarouselModel;
