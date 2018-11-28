import { queryAccountList } from '@/services/data';

export default {
  namespace: 'accountManage',

  state: {
    listData: {},
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取表格列表
    *getAccountList({ payload }, { call, put, select }) {
      const {page, rows} = yield select(state => state.accountManage);
      const response = yield call(queryAccountList, {
        _search: false,
        nd: new Date().getTime(),
        sidx: 'update_time',
        sord: 'desc',
        roleId: [2,4],
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
