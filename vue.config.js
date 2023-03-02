const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  //해당옵션이 없을때 build 시 경로를 못 찾아 빈화면으로 뜸

  devServer: {
    //proxy: "http://localhost:8077",
    proxy: process.env.VUE_APP_BASE_API,
    //publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    //assetsPublicPath: "",
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
