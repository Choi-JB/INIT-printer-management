<template>
  <v-app>
    <!-- header 부분 -->
    <v-app-bar :elevation="5" name="app-bar" class="justify-center" color="grey-lighten-4">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>INIT 임대 관리</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <!-- 좌측 메뉴 nav bar -->
    <v-navigation-drawer permanent>
      <v-list density="compact" nav>
        <div v-for="(a, i) in menu" :key="i">
          <router-link :to="menu[i].link">
            <v-list-item :prepend-icon="menu[i].icon" :title="menu[i].name" :value="menu[i].title" />
          </router-link>
          <v-divider></v-divider>
        </div>

        <v-list-group value="Data">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="데이터 관리" prepend-icon="mdi-cog"></v-list-item>
          </template>

          <div v-for="([title, icon, link], i) in dataSettings" :key="i">
            <router-link :to="link">
              <v-list-item :title="title" :prepend-icon="icon" :value="title">
              </v-list-item>
            </router-link>
          </div>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <!-- 메인 화면 -->
    <v-main>
      <v-fade-transition>
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",

  components: {},

  data: () => ({
    menu: [
      {
        //좌측 메뉴 목록
        name: "통계",
        link: "./dashboard",
        title: "dashboard",
        icon: "mdi-view-dashboard",
      },
      {
        name: "매입 - 입고",
        link: "./purchase",
        title: "purchase",
        icon: "mdi-cart",
      },
      {
        name: "출고 - 부품 교체 - 판매",
        link: "./release",
        title: "release",
        icon: "mdi-printer",
      },
      // {
      //   name: "판매",
      //   link: "./sale",
      //   title: "sale",
      //   icon: "mdi-cash",
      // },
      {
        name: "사무실 재고",
        link: "./inventory",
        title: "inventory",
        icon: "mdi-warehouse",
      },
      {
        name: "기록",
        link: "./history",
        title: "history",
        icon: "mdi-history",
      },
      // {
      //   name: "데이터 관리",
      //   link: "./setting",
      //   title: "setting",
      //   icon: "mdi-cog",
      // },
      // {
      //   name: "test page",
      //   link: "./input",
      //   title: "input",
      //   icon: "mdi-cog",
      // }
    ],

    dataSettings: [
      ['제품 정보', '', "./product"],
      ['거래처 정보', '', "./client"],
      ['임대 계약 정보', '', '/contract']
    ]
    // icon :
  }),
};
</script>

<style>
a {
  text-decoration: none;
  color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
