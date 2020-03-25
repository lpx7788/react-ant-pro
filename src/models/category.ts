import { Effect } from 'dva';
import { Reducer } from 'redux';
import { categoryTreeQuery, queryIntegralCategory } from '@/services/category';

export interface CategoryModelState {
    categoryTree?: object[];
}

export interface categoryModelType {
    namespace: 'category';
    state: CategoryModelState;
    effects: {
        categoryTreeQuery: Effect;
        queryIntegralCategory: Effect;
    };
    reducers: {
        categoryTreeQuery_Callback: Reducer<CategoryModelState>;
    };
}

const categoryModel: categoryModelType = {
    namespace: 'category',

    state: {
        categoryTree: [],
    },

    effects: {
        *categoryTreeQuery(_, { call, put }) {
            const response = yield call(categoryTreeQuery, _.payload);
            if (response) {
                yield put({
                    type: 'categoryJoinQuery_Callback',
                    payload: response,
                });
                if (_.callback && typeof _.callback === 'function') {
                    _.callback(response);
                }
            }
        },
        *queryIntegralCategory(_, { call, put }) {
            const response = yield call(queryIntegralCategory, _.payload);
            if (response) {
                if (_.callback && typeof _.callback === 'function') {
                    _.callback(response);
                }
            }
        },
    },

    reducers: {
        categoryTreeQuery_Callback(state, action) {
            return {
                ...state,
                categoryTree: action.payload.returnObject || {},
            };
        },
    },
};

export default categoryModel
