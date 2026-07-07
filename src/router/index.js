import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/table',
    name: 'table',
    component: () => import('../views/MultiplicationTable.vue')
  },
  {
    path: '/unit',
    name: 'unit',
    component: () => import('../views/UnitList.vue')
  },
  {
    path: '/unit/:n',
    name: 'unit-detail',
    component: () => import('../views/UnitDetail.vue')
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('../views/Practice.vue')
  },
  {
    path: '/badges',
    name: 'badges',
    component: () => import('../views/Badges.vue')
  },
  {
    path: '/wrong-book',
    name: 'wrong-book',
    component: () => import('../views/WrongBook.vue')
  },
  {
    path: '/parent',
    name: 'parent',
    component: () => import('../views/Parent.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
