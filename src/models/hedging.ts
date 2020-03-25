import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getAutoHedgeAccount, getAutoHedgeeditStatus, editPassword, getPreAddressList, deleteFrontAddress, getFuturesCompanyList, newPreAddress } from '@/services/hedging';

export interface HedgingModelState {
  HedgingAccountList?:Record<string, any>;
  preAddressList?:Record<string, any>;
  futuresCompanyList?:Record<string, any>[];
  editPasswordCallBackCode?:string;
  HedgingStatusCallBackCode?:string;
}

export interface HedgingModelType {
  namespace: 'hedging';
  state: HedgingModelState;
  effects: {
    fetchHedgingAccountDatas: Effect;
    fetchHedgingStatusDatas: Effect;
    fetchEditPassword: Effect;
    fetchPreAddressList: Effect;
    fetchDeleteFrontAddress: Effect;
    fetchFuturesCompanyList: Effect;
    fetchNewPreAddress: Effect;
  };
  reducers: {
    getacountListCallback: Reducer<HedgingModelState>;
    getStatusCallback: Reducer<HedgingModelState>;
    getPasswordCallback: Reducer<HedgingModelState>;
    getPreAddressListback: Reducer<HedgingModelState>;
    getDeleteback: Reducer<HedgingModelState>;
    getFuturesCompanyListBack: Reducer<HedgingModelState>;
    saveNewPreAddress: Reducer<HedgingModelState>;
  };
}

const hedgingModel: HedgingModelType = {
  namespace: 'hedging',
  state: {
    HedgingAccountList: {},
    preAddressList: {},
    futuresCompanyList: [],
    editPasswordCallBackCode: '',
  },

  effects: {

    // 获取套保列表
    *fetchHedgingAccountDatas(_, { call, put }) {
      const response = yield call(getAutoHedgeAccount, _.payload);
      if (response) {
        yield put({
          type: 'getacountListCallback',
          payload: response,
        });
      }
    },

    // 修改账户状态（恢复使用，停止使用）
    *fetchHedgingStatusDatas(_, { call, put }) {
      const response = yield call(getAutoHedgeeditStatus, _.payload);
      if (response) {
        yield put({
          type: 'getStatusCallback',
          payload: response,
        });
      }
    },

    // 修改账户密码
    *fetchEditPassword(_, { call, put }) {
      const response = yield call(editPassword, _.payload);
      if (response) {
        yield put({
          type: 'getPasswordCallback',
          payload: response,
        });
      }
    },

    // 获取前置地址
    *fetchPreAddressList(_, { call, put }) {
      const response = yield call(getPreAddressList, _.payload);
      if (response) {
        yield put({
          type: 'getPreAddressListback',
          payload: response,
        });
      }
    },

    // 删除前置地址
    *fetchDeleteFrontAddress(_, { call, put }) {
      const response = yield call(deleteFrontAddress, _.payload);
      if (response) {
        yield put({
          type: 'getDeleteback',
          payload: response,
        });
      }
      if (_.callback && typeof _.callback === 'function') {
        _.callback(response);
      }
    },

    // 获取期货公司
    *fetchFuturesCompanyList(_, { call, put }) {
      const response = yield call(getFuturesCompanyList, _.payload);
      if (response) {
        yield put({
          type: 'getFuturesCompanyListBack',
          payload: response,
        });
      }
    },

    // 新增前置地址
    *fetchNewPreAddress(_, { call, put }) {
      const response = yield call(newPreAddress, _.payload);
      if (response) {
        yield put({
          type: 'saveNewPreAddress',
          payload: response,
        });
      }
      if (_.callback && typeof _.callback === 'function') {
        _.callback(response);
      }
    },

  },

  reducers: {
    getacountListCallback(state, action) {
        return {
          ...state,
          HedgingAccountList: action.payload.returnObject,
        };
    },
    getStatusCallback(state, action) {
        return {
          ...state,
          HedgingStatusCallBackCode: action.payload.errorCode,
        };
    },
    getPasswordCallback(state, action) {
        return {
          ...state,
          editPasswordCallBackCode: action.payload.errorCode,
        };
    },
    getPreAddressListback(state, action) {
        return {
          ...state,
          preAddressList: action.payload.returnObject,
        };
    },
    getDeleteback(state, action) {
        return {
          ...state,
          // deleteCallBackCode: action.payload.errorCode,
        };
    },
    getFuturesCompanyListBack(state, action) {
        return {
          ...state,
          futuresCompanyList: action.payload.returnObject,
        };
    },
    saveNewPreAddress(state, action) {
        return {
          ...state,
          // saveNewPreAddressCode: action.payload.errorCode,
        };
    },
  },
};

export default hedgingModel
