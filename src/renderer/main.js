import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import electron from '@/electron';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  electron,
  template: '<App/>',
}).$mount('#app');
