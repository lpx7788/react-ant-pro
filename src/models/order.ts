import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryOrderList, queryCompanyList, queryOrderDetail } from '@/services/order';

export interface OrderState {
  orderList?: Record<string, any>;
  companyList?: Record<string, any>;
  orderDetail?: Record<string, any>;
}

export interface OrderModelType {
  namespace: 'order';
  state: OrderState;
  effects: {
    fetchOrderListDatas: Effect;
    fetchCompanyList: Effect;
    fetchOrderDetail: Effect;
  };
  reducers: {
    getOrderListCallback: Reducer<OrderState>;
    getCompanyListCallback: Reducer<OrderState>;
    getOrderDetailCallback: Reducer<OrderState>;
  };
}

const orderModel: OrderModelType = {
  namespace: 'order',
  state: {
    orderList: {},
    companyList: {},
    orderDetail: {},
  },

  effects: {
    *fetchOrderListDatas(_, { call, put }) {
      const response = yield call(queryOrderList, _.payload);
      if (response) {
        yield put({
          type: 'getOrderListCallback',
          payload: response,
        });
      }
    },

    *fetchCompanyList(_, { call, put }) {
      const response = yield call(queryCompanyList, _.payload);
      if (response) {
        yield put({
          type: 'getCompanyListCallback',
          payload: response,
        });
      }
    },

    // 订单详情
    *fetchOrderDetail(_, { call, put }) {
      const response = yield call(queryOrderDetail, _.payload);
      if (response) {
        yield put({
          type: 'getOrderDetailCallback',
          payload: response,
        });
      }
    },
  },

  reducers: {
    getOrderListCallback(state, action) {
        return {
          ...state,
          orderList: action.payload.returnObject,
        };
    },
    getCompanyListCallback(state, action) {
      return {
        ...state,
        companyList: action.payload.returnObject,
      };
    },
    getOrderDetailCallback(state, action) {
        return {
          ...state,
          orderDetail: action.payload.returnObject,
        };
    },

  },
};

export default orderModel
