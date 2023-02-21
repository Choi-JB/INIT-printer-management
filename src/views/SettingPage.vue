<template lang="">
   <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="one">제품 관리</v-tab>
      <v-tab value="two">거래처 관리</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <v-container>


          </v-container>
        </v-window-item>

        <v-window-item value="two">
          Two
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    data: () => ({
        tab: null,
    }),
}
</script>
<style lang="">
    
</style>