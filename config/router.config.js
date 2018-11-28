export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/cockpit',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/cockpit', redirect: '/cockpit/home' },
      { path: '/cockpit/home', component: './Cockpit/Home' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/cockpit' },
      {
        path: '/entManage',
        name: '单位管理',
        component: './EntManage/Home',
      },
      // forms
      {
        path: '/entAccount',
        name: '单位账号',
        component: './EntAccount/Home',
      },
      // list
      {
        path: '/goodsSearch',
        name: '物料查询',
        component: './GoodsSearch/Home',
      },
      {
        path: '/prodStat',
        name: '生产统计',
        component: './ProdStat/Home',
      },
      {
        path: '/accountManage',
        name: '账号管理',
        component: './AccountManage/Home',
      },
      {
        path: '/database',
        name: '数据字典',
        component: './Database/Home',
      },
      {
        path: '/scanStat',
        name: '扫码统计',
        component: './ScanStat/Home',
      },
      {
        path: '/entProduct',
        name: '单位产品',
        component: './EntProduct/Home',
      },
      {
        path: '/qrSupplies',
        name: '二维码物料',
        component: './QrSupplies/Home',
      },
      {
        path: '/suppliesMake',
        name: '物料生成',
        component: './SuppliesMake/Home',
      },
      {
        path: '/cockpit/home',
        name: '驾驶舱',
      },
      {
        component: '404',
      },
    ],
  },
];
