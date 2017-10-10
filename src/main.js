import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-107900580-1',
  checkDuplicatedScript: true
})

var vm = new Vue({
  el: '#app',
  render: h => h(App)
})
