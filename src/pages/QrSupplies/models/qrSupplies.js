import { queryQrSuppliesList } from '@/services/data';

export default {
  namespace: 'qrSupplies',

  state: {
    listData: {
      records: [],
    },
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取表格列表
    *getQrSuppliesList({ payload }, { call, put, select }) {
      const { page, rows } = yield select(state => state.qrSupplies);
      const response = yield call(queryQrSuppliesList, {
        page,
        rows,
        ...payload,
      });
      if (response) {
        yield put({
          type: 'changeState',
          payload: { listData: response },
        });
      }
    },
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
