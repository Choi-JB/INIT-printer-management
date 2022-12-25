<template>
  <v-app>
    <v-app-bar>
      title
    </v-app-bar>
    <v-navigation-drawer>
      <v-list>
        <router-link to="/1">first</router-link>
      </v-list>
      <v-list>
        <router-link to="/2">second</router-link>
      </v-list>
      <v-list>
        <router-link to="/3">third</router-link>
      </v-list>
    </v-navigation-drawer>
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
    //
  }),
}
</script>
