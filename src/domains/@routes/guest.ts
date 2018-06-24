import { Digits } from '../digits';
import { Login } from '../login';
import { Start } from '../start';

export const routes = [
  {
    component: Login,
    exact: true,
    path: '/',
  },
  {
    component: Digits,
    path: '/digits',
  },
  {
    component: Start,
    path: '/start/:identifier',
  },
];