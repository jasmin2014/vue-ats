import Main from '../../components/layout/Main.vue'
import error from './error';
import org from './org';
import asset from './asset';
import operation from './operation';
import finance from './finance';

export default [
  {
    path: '/',
    name: 'Home',
    redirect: '/org',
    component: Main,
    meta: {
      title: '链上资产端',
      show: true
    },
    children: [
      error,
      org,
      asset,
      operation,
      finance
    ]
  },
  {
    path: '*',
    redirect: '/error/404'
  }
];
