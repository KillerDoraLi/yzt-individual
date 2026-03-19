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
          title: '平台劳务个税计算器'
        }
      },
      {
        path: '/guide/alipay-realname',
        name: 'AlipayGuide',
        component: () => import('@/views/GuidePage.vue'),
        meta: {
          title: '工商验证指引'
        }
      },
      {
        path: '/guide/tax-registration',
        name: 'TaxRegistrationGuide',
        component: () => import('@/views/GuidePage.vue'),
        meta: {
          title: '税务登记指引'
        }
      },
      {
        path: '/smartsheet/tech-info',
        name: 'SmartsheetTechInfo',
        component: () => import('@/views/SmartsheetInfoPage.vue'),
        meta: {
          title: '信息系统的综合技术信息收集'
        }
      },
      {
        path: '/smartsheet/vehicle-lease',
        name: 'SmartsheetVehicleLease',
        component: () => import('@/views/SmartsheetCarPage.vue'),
        meta: {
          title: '车辆经营租赁业务的推广'
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
