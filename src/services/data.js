import { stringify } from 'qs';
import request from '@/utils/request';

// 全部制造单位列表
export async function queryFactoryList(params) {
  return request('/db/qrcode/admin/factory/list_factory_account', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 全部产品列表
export async function queryProductList(params) {
  return request('/mock/admin/productCommon/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 全部制造单位产品分组列表
export async function queryFactoryProductGroup(params) {
  return request(`/mock/admin/product/listMap?${stringify(params)}`);
}

// 单位管理 表格列表
export async function queryEntManageList(params) {
  return request('/db/qrcode/admin/factory/list', {
    method: 'POST',
    body: params,
  });
}
// 单位管理 修改页面初始化信息
export async function queryEntInfo(params) {
  return request('/db/qrcode/admin/factory/form', {
    method: 'POST',
    body: params,
  });
}
// 单位管理 保存单位信息
export async function querySaveEntInfo(params) {
  return request('/db/qrcode/admin/factory/save', {
    method: 'POST',
    body: params,
  });
}

// 单位管理 检查单位名称或代码是否已存在
export async function checkEntCodeUnique(params) {
  return request('/db/qrcode/admin/factory/notExist', {
    method: 'POST',
    body: params,
  });
}

// 单位管理 注销单位信息
export async function queryDeleteEnt(params) {
  return request('/db/qrcode/admin/factory/delete', {
    method: 'POST',
    body: params,
  });
}

// 单位账号 表格列表
export async function queryEntAccountList(params) {
  return request(`/mock/admin/factory/list_factory_account?${stringify(params)}`);
}

// 物料查询 表格列表
export async function queryGoodsSearchList(params) {
  return request(`/mock/admin/productionApply/listForAudit?${stringify(params)}`);
}

// 账号管理 表格列表
export async function queryAccountList(params) {
  return request(`/mock/admin/user/list?${stringify(params)}`);
}

// 数据字典 表格列表
export async function queryDataBaseList(params) {
  return request(`/mock/admin/productCommon/listMap?${stringify(params)}`);
}

// 二维码物料 表格列表
export async function queryQrSuppliesList(params) {
  return request('/db/qrcode/admin/productionApply/listForAudit', {
    method: 'POST',
    body: params,
  });
}

// 物料生成 表格列表
export async function querySuppliesMakeList(params) {
  return request(`/mock/admin/productionApply/list_for_download?${stringify(params)}`);
}

// 生产统计 表格列表
export async function queryProdStatList(params) {
  return request('/mock/admin/factory/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
