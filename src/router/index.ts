// index.ts
import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/components/Layout.vue'),
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
