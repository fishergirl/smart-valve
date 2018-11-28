import { queryFactoryList, queryProductList, queryFactoryProductGroup } from '@/services/data';
import { getFactorys, getProducts, group } from '../utils/utils';

export default {
  namespace: 'basic',

  state: {
    factoryList: [],
    productList: [],
    factoryProductGroup: [],
    page: 1,
    rows: 10,
  },

  effects: {
    // 获取全部制造单位列表
    *getFactoryList(_, { call, put }) {
      const response = yield call(queryFactoryList);
      if (response) {
        const data = getFactorys(response.body.data.records);
        yield put({
          type: 'changeState',
          payload: { factoryList: data },
        });
      }
    },
    // 获取全部产品列表
    *getProductList(_, { call, put }) {
      const response = yield call(queryProductList, {
        sidx: 'update_time',
        sord: 'desc',
      });
      if (response) {
        const data = getProducts(response.records);
        yield put({
          type: 'changeState',
          payload: { productList: data },
        });
      }
    },
    // 获取全部制造单位产品列表并按制造单位分组
    *getFactoryProductGroup({ payload }, { call, put, select }) {
      const { page, rows } = yield select(state => state.basic);
      const response = yield call(queryFactoryProductGroup, {
        sidx: 'factoryName desc, update_time',
        sord: 'desc',
        _search: false,
        nd: new Date().getTime(),
        page,
        rows,
        ...payload,
      });
      if (response) {
        const data = group(response.data.records);
        yield put({
          type: 'changeState',
          payload: { factoryProductGroup: data },
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
