import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryHomeList } from '@/services/home';


export interface HomeModelState {
  HomeDataList?: Record<string, any>[];
}

export interface HomeModelType {
  namespace: 'home';
  state: HomeModelState;
  effects: {
    fetchDatas: Effect;
  };
  reducers: {
    getCallback: Reducer<HomeModelState>;

  };
}

const homeModel: HomeModelType = {
  namespace: 'home',
  state: {
    HomeDataList: [],
  },

  effects: {
    *fetchDatas(_, { call, put }) {
      const response = yield call(queryHomeList, _.payload);
      if (response) {
        yield put({
          type: 'getCallback',
          payload: response,
        });
      }
    },
  },

  reducers: {
    getCallback(state, action) {
        return {
          ...state,
        HomeDataList: action.payload.returnObject,
        };
    },
  },
};

export default homeModel;
