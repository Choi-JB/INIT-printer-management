import {
  createRouter,
  /*createWebHistory,*/ createMemoryHistory,
} from "vue-router";

// 연결할 각 컴포넌트 import (src/views폴더 아래 컴포넌트들 생성해둠)
import DashboardPage from "../views/DashboardPage";
import PurchasePage from "../views/PurchasePage";
import ReleasePage from "../views/ReleasePage";

import SettingPage from "../views/SettingPage";
import HistoryPage from "../views/HistoryPage";

import InventoryPage from "../views/InventoryPage";
import ProductDataPage from "../views/ProductDataPage";
import ClientDataPage from "../views/ClientDataPage";
import ContractDataPage from "../views/ContractDataPage";

// 라우터 설계
const routes = [
  { path: "/", component: DashboardPage }, //기본 첫 페이지
  { path: "/dashboard", component: DashboardPage },
  { path: "/purchase", component: PurchasePage },
  { path: "/release", component: ReleasePage },

  { path: "/setting", component: SettingPage },
  { path: "/history", component: HistoryPage },

  { path: "/inventory", component: InventoryPage },
  { path: "/product", component: ProductDataPage },
  { path: "/client", component: ClientDataPage },
  { path: "/contract", component: ContractDataPage },
];

// 라우터 생성
const router = createRouter({
  //history: createWebHistory(),
  history: createMemoryHistory(process.env.BASE_URL),
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

// 라우터 추출 (main.js에서 import)
export { router };
