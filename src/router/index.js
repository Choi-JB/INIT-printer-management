import { createRouter, createWebHistory } from 'vue-router'

// 연결할 각 컴포넌트 import (src/views폴더 아래 컴포넌트들 생성해둠)
import FirstView from '../views/FirstView'
import SecondView from '../views/SecondView'
import ThirdView from '../views/ThirdView'

import DashboardPage from '../views/DashboardPage'
import PurchasePage from '../views/PurchasePage'
import ReleasePage from '../views/ReleasePage'
import SalePage from '../views/SalePage'
import SettingPage from '../views/SettingPage'


// 라우터 설계
const routes = [
    { path: '/1', component:FirstView},
    { path: '/2', component:SecondView},
    { path: '/3', component:ThirdView},
    { path: '/dashboard', component:DashboardPage},
    { path: '/purchase', component:PurchasePage},
    { path: '/release', component:ReleasePage},
    { path: '/sale', component:SalePage},
    { path: '/setting', component:SettingPage},
]

// 라우터 생성
const router = createRouter({
    history: createWebHistory(),
    routes
});

// 라우터 추출 (main.js에서 import)
export {router}