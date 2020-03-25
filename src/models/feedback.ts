import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryFeedbackList } from '@/services/feedback';

export interface FeedbackModelState {
  FeedbackDataList?:Record<string, any>;
}

export interface FeedbackModelType {
  namespace: 'feedback';
  state: FeedbackModelState;
  effects: {
    fetchDatas: Effect;
  };
  reducers: {
    getCallback: Reducer<FeedbackModelState>;
  };
}

const feedbackModel: FeedbackModelType = {
  namespace: 'feedback',
  state: {
    FeedbackDataList: {},
  },

  effects: {
    *fetchDatas(_, { call, put }) {
      const response = yield call(queryFeedbackList, _.payload);
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
          FeedbackDataList: action.payload.returnObject,
        };
    },
  },
};

export default feedbackModel
