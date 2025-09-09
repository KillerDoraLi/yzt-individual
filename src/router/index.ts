// index.ts
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/components/layout.vue'),
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterIndividual.vue'),
        meta: {
          title: '注册'
        }
      },
      {
        path: '/update/:id',
        name: 'Update',
        component: () => import('@/views/UpdatePage.vue'),
        meta: {
          title: '编辑'
        }
      }
    ]
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
