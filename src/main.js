import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import firebase from "firebase";

Vue.config.productionTip = false

const app = new Vue({
  router,
  vuetify,
  render: h => h(App)
});

firebase.auth().onAuthStateChanged(()=>{
  app.$mount('#app')
});
