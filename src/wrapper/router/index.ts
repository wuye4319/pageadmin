import login from '@/login/router';
import admin from '@/admin/router';

const routes = [
  {
    path: '',
    redirect: 'admin'
  },
  ...login,
  ...admin,
];

export default routes;
