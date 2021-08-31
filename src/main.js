import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueGlobalVariable from "vue-global-var";
import User from './model/User';
import Toast from 'vue-easy-toast'
import CKEditor from '@ckeditor/ckeditor5-vue2';
// import {SpecialCharacters} from "@ckeditor/ckeditor5-special-characters";



Vue.use( CKEditor );
Vue.config.productionTip = false


window.$ = window.jQuery = require('jquery');
Vue.use(Toast);

Vue.use(VueGlobalVariable, {
  globals: {
    $user: new User("user1")
  }
});


export const eventBus = new Vue ({
  methods:{
    signedIn: function () {
      this.$root.$emit('signedIn')
      this.$emit('signedIn');
    }

  },

  store,
  vuetify,

  data:function(){
    return {
      authenticated:false

    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
