import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

const init = () => {
  new Vue({
    store,
    render: h => h(App),
  }).$mount('#datacue-app');
};

if (document.ready) {
  document.ready(init);
} else {
  init();
}
