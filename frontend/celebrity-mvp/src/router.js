import { createRouter, createWebHistory } from 'vue-router'
import CelebrityList from './pages/CelebrityList.vue'
import CelebrityDetail from './pages/CelebrityDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: CelebrityList },
    { path: '/celebrity/:id', name: 'detail', component: CelebrityDetail, props: true },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
