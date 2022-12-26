<template>
  <v-app>
      <!-- header 부분 -->
      <v-app-bar :elevation="5" name="app-bar" class="justify-center" color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>임대 통계 프로그렘(가제)</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <!-- 좌측 메뉴 nav bar -->
    <v-navigation-drawer floating permanent>
      <v-list density="compact" nav>

        <div v-for="(a, i) in menu" :key="i">
          <router-link :to="menu[i].link">
            <v-list-item :prepend-icon="menu[i].icon" :title="menu[i].name" :value="menu[i].title" />
          </router-link>
        </div>

      </v-list>
    </v-navigation-drawer>

    <!-- 메인 화면 -->
    <v-main>
        <router-view />
    </v-main>

  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {

  },

  data: () => ({
    
      menu: [{    //좌측 메뉴 목록
        name: '통계 / 현황',
        link: './dashboard',
        title: 'dashboard',
        icon: 'mdi-view-dashboard'
      }, {
        name: '임대 / 출고',
        link: './release',
        title: 'release',
        icon: 'mdi-printer'
      }, {
        name: '매입',
        link: './purchase',
        title: 'purchase',
        icon: 'mdi-cart'
      }, {
        name: '판매',
        link: './sale',
        title: 'sale',
        icon: 'mdi-cash'
      }, {
        name: '관리 설정',
        link: './settings',
        title: 'settings',
        icon: 'mdi-cog'
      }
      ]


  
  }),
}
</script>

<style>
a {
  text-decoration: none;
  color: black;
}
</style>
