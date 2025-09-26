// index.ts
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/layout.vue'),
    redirect: '/individual/register',
    children: [
      // {
      //   path: '/',
      //   name: 'Home',
      //   component: () => import('@/views/HomePage.vue'),
      //   meta: {
      //     title: '首页'
      //   }
      // },
      {
        path: '/individual/register',
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
      },
      {
        path: '/tax-calculator',
        name: 'TaxCalculator',
        component: () => import('@/views/CalculatorPage.vue'),
        meta: {
          title: '个税计算器'
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
