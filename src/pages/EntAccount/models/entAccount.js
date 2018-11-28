import { queryEntAccountList } from '@/services/data';

export default {
  namespace: 'entAccount',

  state: {
    listData: {},
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取表格列表
    *getEntAccountList({ payload }, { call, put, select }) {
      const {page, rows} = yield select(state => state.entAccount);
      const response = yield call(queryEntAccountList, {
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
          payload: {listData: response.data},
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
