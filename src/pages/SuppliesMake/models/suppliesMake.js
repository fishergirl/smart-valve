import { querySuppliesMakeList } from '@/services/data';

export default {
  namespace: 'suppliesMake',

  state: {
    listData: {},
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取表格列表
    *getSuppliesMakeList({ payload }, { call, put, select }) {
      const {page, rows} = yield select(state => state.suppliesMake);
      const response = yield call(querySuppliesMakeList, {
        _search: false,
        nd: new Date().getTime(),
        sidx: 'update_time',
        sord: 'desc',
        page,
        rows,
        ...payload,
      });
      if (response) {
        yield put({
          type: 'changeState',
          payload: {listData: response},
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
