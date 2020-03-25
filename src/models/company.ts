import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  companyJoinQuery,
  companyUserQuery,
  companyDetailQuery,
  companyExamine,
  companyDetailEdit,
  companyJoin,
  queryCustomers,
  querySuppliers,
  queryCompanyStaffs,
} from '@/services/company';

export interface CompanyModelState {
  companyJoinData?: object;
  companyUsers?: object;
  companyDetail?: object;
}

export interface CompanyModelType {
  namespace: 'company';
  state: CompanyModelState;
  effects: {
    companyJoinQuery: Effect;
    companyUserQuery: Effect;
    companyDetailQuery: Effect;
    companyExamine: Effect;
    companyDetailEdit: Effect;
    companyJoin: Effect;
    queryCustomers: Effect;
    querySuppliers: Effect;
    queryCompanyStaffs: Effect;
  };
  reducers: {
    companyJoinQuery_Callback: Reducer<CompanyModelState>;
    companyUserQuery_Callback: Reducer<CompanyModelState>;
    companyDetailQuery_Callback: Reducer<CompanyModelState>;
    companyExamine_Callback: Reducer<CompanyModelState>;
    companyDetailEdit_Callback: Reducer<CompanyModelState>;
  };
}

const companyModel: CompanyModelType = {
  namespace: 'company',

  state: {
    companyJoinData: [],
    companyUsers: [],
  },

  effects: {
    *companyJoinQuery(_, { call, put }) {
      const response = yield call(companyJoinQuery, _.payload);
      if (response) {
        yield put({
          type: 'companyJoinQuery_Callback',
          payload: response,
        });
      }
    },
    *companyUserQuery(_, { call, put }) {
      const response = yield call(companyUserQuery, _.payload);
      if (response) {
        yield put({
          type: 'companyUserQuery_Callback',
          payload: response,
        });
      }
    },
    *companyDetailQuery(_, { call, put }) {
      const response = yield call(companyDetailQuery, _.payload);
      if (response) {
        yield put({
          type: 'companyDetailQuery_Callback',
          payload: response,
        });
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *companyExamine(_, { call, put }) {
      const response = yield call(companyExamine, _.payload);
      if (response) {
        yield put({
          type: 'companyExamine_Callback',
          payload: response,
        });
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *companyDetailEdit(_, { call, put }) {
      const response = yield call(companyDetailEdit, _.payload);
      if (response) {
        yield put({
          type: 'companyDetailEdit_Callback',
          payload: response,
        });
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *companyJoin(_, { call, put }) {
      const response = yield call(companyJoin, _.payload);
      if (response) {
        yield put({
          type: 'companyJoin_Callback',
          payload: response,
        });
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryCustomers(_, { call, put }) {
      const response = yield call(queryCustomers, _.payload);
      if (response) {
        yield put({
          type: 'queryCustomers_Callback',
          payload: response,
        })
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *querySuppliers(_, { call, put }) {
      const response = yield call(querySuppliers, _.payload);
      if (response) {
        yield put({
          type: 'querySuppliers_Callback',
          payload: response,
        })
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
    *queryCompanyStaffs(_, { call, put }) {
      const response = yield call(queryCompanyStaffs, _.payload);
      if (response) {
        yield put({
          type: 'queryCompanyStaffs_Callback',
          payload: response,
        })
        if (_.callback && typeof _.callback === 'function') {
          _.callback(response);
        }
      }
    },
  },

  reducers: {
    companyJoinQuery_Callback(state, action) {
      return {
        ...state,
        companyJoinData: action.payload.returnObject || {},
      };
    },
    companyUserQuery_Callback(state, action) {
      return {
        ...state,
        companyUsers: action.payload.returnObject || {},
      };
    },
    companyDetailQuery_Callback(state, action) {
      return {
        ...state,
        companyDetail: action.payload.returnObject || {},
      };
    },
    companyExamine_Callback(state, action) {
      return {
        ...state,
        // company: action.payload.returnObject || {},
      };
    },
    companyDetailEdit_Callback(state, action) {
      return {
        ...state,
        // company: action.payload.returnObject || {},
      };
    },
  },
};

export default companyModel;
