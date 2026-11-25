import { createRouter, createWebHistory } from 'vue-router'
import PlatformsPage from './pages/PlatformsPage.vue'
import GoodsPage from './pages/GoodsPage.vue'
import CelebritiesPage from './pages/CelebritiesPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/platforms' },
    { path: '/platforms', name: 'platforms', component: PlatformsPage },
    { path: '/goods', name: 'goods', component: GoodsPage },
    { path: '/celebrities', name: 'celebrities', component: CelebritiesPage },
  ],
})
