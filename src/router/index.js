import { createRouter, createWebHistory } from 'vue-router'

// 연결할 각 컴포넌트 import (src/views폴더 아래 컴포넌트들 생성해둠)
import DashboardPage from '../views/DashboardPage'
import PurchasePage from '../views/PurchasePage'
import ReleasePage from '../views/ReleasePage'
import SalePage from '../views/SalePage'
import SettingPage from '../views/SettingPage'
import HistoryPage from '../views/HistoryPage'
import Input from '../views/InputPage'

// 라우터 설계
const routes = [
    { path: '/dashboard', component:DashboardPage},
    { path: '/purchase', component:PurchasePage},
    { path: '/release', component:ReleasePage},
    { path: '/sale', component:SalePage},
    { path: '/setting', component:SettingPage},
    { path: '/history', component:HistoryPage},
    { path: '/input', component:Input}
]

// 라우터 생성
const router = createRouter({
    history: createWebHistory(),
    routes
});

// 라우터 추출 (main.js에서 import)
export {router}