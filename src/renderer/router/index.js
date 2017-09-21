import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
