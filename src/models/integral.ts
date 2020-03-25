import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  queryIntegralList,
  addRewardIntegral,
  deleteIntegral,
  queryIntegralOrderList,
  updateIntegralOrder,
  refuseIntegralOrder,
  queryCashingCommodityList,
  deleteCashingCommodity,
  joinCashingCommodity,
  queryGuidePriceList,
  stopGuidePriceList,
  addGuidePrice,
  queryIntegralDetailList,
  queryIntegralAddRecordList,
  queryUserIntegral,
  addUserIntegral,
  queryIntegralUsers,
} from '@/services/integral';

export interface IntegralModelState {
  integralList?: Record<string, any>[];
  integralOrders?: Record<string, any>[];
  exchangeSetList?: Record<string, any>[];
  guidePriceList?: Record<string, any>[];
  integralDetailList?: Record<string, any>[];
  integralAddRecordList?: Record<string, any>[];
}

export interface IntegralModelType {
  namespace: 'integral';
  state: IntegralModelState;
  effects: {
    queryIntegralList: Effect;
    addRewardIntegral: Effect;
    deleteIntegral: Effect;
    queryIntegralOrderList: Effect;
    updateIntegralOrder: Effect;
    refuseIntegralOrder: Effect;
    queryCashingCommodityList: Effect;
    deleteCashingCommodity: Effect;
    joinCashingCommodity: Effect;
    queryGuidePriceList: Effect;
    stopGuidePriceList: Effect;
    addGuidePrice: Effect;
    queryIntegralDetailList: Effect;
    queryIntegralAddRecordList: Effect;
    queryUserIntegral: Effect;
    addUserIntegral: Effect;
    queryIntegralUsers: Effect;
  };
  reducers: {
    queryIntegralList_cb: Reducer<IntegralModelState>;
    queryIntegralOrderList_cb: Reducer<IntegralModelState>;
    queryCashingCommodityList_cb: Reducer<IntegralModelState>;
    queryGuidePriceList_cb: Reducer<IntegralModelState>;
    queryIntegralDetailList_cb: Reducer<IntegralModelState>;
    queryIntegralAddRecordList_cb: Reducer<IntegralModelState>;
    queryIntegralUsers_cb: Reducer<IntegralModelState>;
  };
}

const IntegralModel: IntegralModelType = {
  namespace: 'integral',
  state: {
    integralList: [],
    integralOrders: [],
    exchangeSetList: [],
    guidePriceList: [],
    integralDetailList: [],
    integralAddRecordList: [],
    integralUserList: [],
  },

  effects: {
    *queryIntegralList(_, { call, put }) {
      const response = yield call(queryIntegralList, _.payload);
      if (response) {
        yield put({
          type: 'queryIntegralList_cb',
          payload: response,
        });
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *addRewardIntegral(_, { call, put }) {
      const response = yield call(addRewardIntegral, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *deleteIntegral(_, { call, put }) {
      const response = yield call(deleteIntegral, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryIntegralOrderList(_, { call, put }) {
      const response = yield call(queryIntegralOrderList, _.payload);
      if (response) {
        yield put({
          type: 'queryIntegralOrderList_cb',
          payload: response,
        });
      }
    },
    *refuseIntegralOrder(_, { call, put }) {
      const response = yield call(refuseIntegralOrder, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *updateIntegralOrder(_, { call, put }) {
      const response = yield call(updateIntegralOrder, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryCashingCommodityList(_, { call, put }) {
      const response = yield call(queryCashingCommodityList, _.payload);
      if (response) {
        yield put({
          type: 'queryCashingCommodityList_cb',
          payload: response,
        });
      }
    },
    *deleteCashingCommodity(_, { call, put }) {
      const response = yield call(deleteCashingCommodity, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *joinCashingCommodity(_, { call, put }) {
      const response = yield call(joinCashingCommodity, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryGuidePriceList(_, { call, put }) {
      const response = yield call(queryGuidePriceList, _.payload);
      if (response) {
        yield put({
          type: 'queryGuidePriceList_cb',
          payload: response,
        });
      }
    },
    *stopGuidePriceList(_, { call, put }) {
      const response = yield call(stopGuidePriceList, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *addGuidePrice(_, { call, put }) {
      const response = yield call(addGuidePrice, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryIntegralDetailList(_, { call, put }) {
      const response = yield call(queryIntegralDetailList, _.payload);
      if (response) {
        yield put({
          type: 'queryIntegralDetailList_cb',
          payload: response,
        });
      }
    },
    *queryIntegralAddRecordList(_, { call, put }) {
      const response = yield call(queryIntegralAddRecordList, _.payload);
      if (response) {
        yield put({
          type: 'queryIntegralAddRecordList_cb',
          payload: response,
        });
      }
    },
    *queryUserIntegral(_, { call, put }) {
      const response = yield call(queryUserIntegral, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *addUserIntegral(_, { call, put }) {
      const response = yield call(addUserIntegral, _.payload);
      if (response) {
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryIntegralUsers(_, { call, put }) {
      const response = yield call(queryIntegralUsers, _.payload);
      if (response) {
        yield put({
          type: 'queryIntegralUsers_cb',
          payload: response,
        });
      }
    },
  },

  reducers: {
    queryIntegralList_cb(state, action) {
      return {
        ...state,
      };
    },
    queryIntegralOrderList_cb(state, action) {
      return {
        ...state,
        integralOrders: action.payload,
      };
    },
    queryCashingCommodityList_cb(state, action) {
      return {
        ...state,
        exchangeSetList: action.payload.returnObject,
      };
    },
    queryGuidePriceList_cb(state, action) {
      return {
        ...state,
        guidePriceList: action.payload.returnObject,
      };
    },
    queryIntegralDetailList_cb(state, action) {
      return {
        ...state,
        integralDetailList: action.payload.returnObject,
      };
    },
    queryIntegralAddRecordList_cb(state, action) {
      return {
        ...state,
        integralAddRecordList: action.payload.returnObject,
      };
    },
    queryIntegralUsers_cb(state, action) {
      return {
        ...state,
        integralUserList: action.payload.returnObject,
      };
    },
  },
};

export default IntegralModel;
