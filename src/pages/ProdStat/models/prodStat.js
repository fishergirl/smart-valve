import { queryProdStatList } from '@/services/data';

export default {
  namespace: 'prodStat',

  state: {
    listData: {},
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取表格列表
    *getProdStatList({ payload }, { call, put, select }) {
      const {page, rows} = yield select(state => state.prodStat);
      const response = yield call(queryProdStatList, {
        // _search: false,
        // nd: new Date().getTime(),
        sidx: 'update_time',
        sord: 'desc',
        // page,
        // rows,
        // ...payload,
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
