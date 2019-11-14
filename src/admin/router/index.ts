const appRouterInfo = [
  { name: 'userInfor', meta: { title: '个人信息修改' } },
  { name: 'appshop', meta: { title: '应用市场' } },
  { name: 'compshop', meta: { title: '组件市场' } },
  { name: 'guide', meta: { title: '开发指南' } },
  { name: 'database', meta: { title: '开发指南' } }
];
const myappRouterInfo = [ // myapp
  { name: 'manage', meta: { title: '我的应用管理' } },
  { name: 'appdetail', meta: { title: '应用详情' } },
  { name: 'collect', meta: { title: '我的收藏' } },
  { name: 'share', meta: { title: '我的分享' } }
];
const myCompTouter = [ // mycomp
  { name: 'complist', meta: { title: '组件列表' } },
  { name: 'collect', meta: { title: '收藏组件' } },
  { name: 'share', meta: { title: '分享组件' } },
  { name: 'detail', meta: { title: '组件说明' } }
];
const guideRouterInfo = [ // doc
  { meta: { title: '组件开发说明' }, name: 'comp' },
  { meta: { title: '视图层数据结构说明' }, name: 'data' },
  { meta: { title: '组件控制层开发说明' }, name: 'ctrl' },
  { meta: { title: '自定义组件上传说明' }, name: 'upload' },
  { meta: { title: '设计器插件安装说明' }, name: 'use' },
  { meta: { title: '数据绑定的对接规范' }, name: 'coop' }
];

interface RouteInfo {
  name: string,
  meta: object
}

const routes: any = [
  {
    path: '/admin/',
    name: 'admin',
    meta: {
      title: '应用管理'
    },
    redirect: '/admin/myapp/manage',
    component: () => import('@/admin/pages/index.vue'),
    children: [
      ...getRouterList('app', appRouterInfo), // app
      ...getRouterChildList('myapp', myappRouterInfo), // myapp
      ...getRouterChildList('guide', guideRouterInfo), // guide
      ...getRouterChildList('mycomp', myCompTouter)
    ]
  }
];

function getRouterList(type: string, nameList: object[]): object[] {
  let arr = [];
  for (let item of Array.from(nameList.values())) {
    let obj: RouteInfo = {
      name: '',
      meta: {}
    };
    Object.assign(obj, item);
    arr.push({
      path: obj.name,
      name: `${type}-${obj.name}`,
      meta: obj.meta,
      component: () => import(/* webpackChunkName: "app" */ `@/admin/components/${obj.name}/index.vue`)
    });
  }
  return arr;
}
function getRouterChildList(type: string, nameList: object[]): object[] {
  let arr = [];
  for (let item of Array.from(nameList.values())) {
    let obj: RouteInfo = {
      name: '',
      meta: {}
    };
    Object.assign(obj, item);
    arr.push({
      path: `${type}/${obj.name}`,
      name: `app-${type}-${obj.name}`,
      meta: obj.meta,
      component: () => import(/* webpackChunkName: "app" */ `@/admin/components/${type}/${obj.name}.vue`)
    });
  }
  return arr;
}

export default routes;
