import {
  queryEntManageList,
  queryEntInfo,
  querySaveEntInfo,
  checkEntCodeUnique,
  queryDeleteEnt,
} from '@/services/data';

export default {
  namespace: 'entManage',

  state: {
    listData: {
      records: [],
    },
    page: 1,
    rows: 10,
    entInfo: {},
    checkCodeMsg: '',
    visible: false,
    addVisible: false,
    loginName: '',
    code: '',
    name: '',
    deleteEntMsg: '',
  },

  effects: {
    // 获取表格列表
    *getList({ payload }, { call, put, select }) {
      const { page, rows } = yield select(state => state.entManage);
      const response = yield call(queryEntManageList, {
        // _search: false,
        // nd: new Date().getTime(),
        // sidx: 'update_time',
        // sord: 'desc',
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
    // 获取某一个单位信息
    *getEntInfo({ payload }, { call, put }) {
      const response = yield call(queryEntInfo, payload);
      if (response) {
        yield put({
          type: 'changeState',
          payload: { entInfo: response.body.data },
        });
      }
    },
    // 保存修改单位信息
    *saveEntInfo({ payload }, { call, put }) {
      const response = yield call(querySaveEntInfo, payload);
      if (response) {
        yield put({
          type: 'changeState',
          payload: { saveEntInfoMsg: response.errcode },
        });
      }
    },
    // 验证某个用户名是否存在
    *checkCode({ payload }, { call, put }) {
      const response = yield call(checkEntCodeUnique, payload);
      if (parseInt(response.status) === 1) {
        yield put({
          type: 'changeState',
          payload: { checkCodeMsg: response.message },
        });
      } else {
        yield put({
          type: 'changeState',
          payload: { checkCodeMsg: 'no' },
        });
      }
    },
    // 注销单位
    *deleteEnt({ payload }, { call, put }) {
      const response = yield call(queryDeleteEnt, payload);
      if (response) {
        yield put({
          type: 'changeState',
          payload: { deleteEntMsg: response.errcode },
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
