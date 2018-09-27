import Vue from 'vue'
import App from './App.vue'
// import VueAnalytics, { onAnalyticsReady } from 'vue-analytics'
// import * as TrackEvent from './trackEvent.js'

/* 
// Use VueAnalytics
var useProd = window.location.hostname.indexOf('hk01.com') !== -1
var gaArr = []

var testGA = 'UA-67838455-2' // o
var big = 'UA-XXXX-4' // big
var hk01GA = useProd ? 'UA-70981149-1' : 'UA-70981149-9' // hk01

var piwikEP = useProd ? 'https://track.hk01.com/v1web/piwik.php' : 'https://track.hktester.com/v1web/piwik.php' // hk01

if (useProd) {
  gaArr = [big, hk01GA]
} else {
  gaArr = [testGA, hk01GA]
}

Vue.use(VueAnalytics, {
  id: gaArr,
  piwikEndpoint: piwikEP,
  piwikSiteId: 6,
  fields: {
    userId: TrackEvent.getAnonymousId()
  },
  set: [ // https://github.com/MatteoGabriele/vue-analytics/blob/59668ab4e5c8ec38b903c8df138d8a9dab4b00e8/docs/set.md
    // Our Team PREVIOUS Article https://www.hk01.com/%E6%B8%AF%E8%81%9E/163141/-%E9%A0%90%E7%AE%97%E6%A1%882018-01%E8%A8%88%E7%A8%85%E6%A9%9F-%E9%99%B3%E8%8C%82%E6%B3%A2%E6%B8%9B%E7%A8%85%E5%B9%AB%E4%BD%A0%E6%85%B3%E5%B9%BE%E5%A4%9A-%E5%8D%B3%E5%88%BB%E5%85%A5%E5%9A%9F%E8%A8%88%E8%A8%88-
    { field: 'dimension1', value: '\u856d\u8f1d\u6d69, \u7c21\u6d69\u5fb7, \u6881\u9038\u98a8' },
    { field: 'dimension2', value: '\u793E\u6703\u65B0\u805E' },
    { field: 'dimension3', value: '\u793E\u6703\u65B0\u805E' },
    { field: 'dimension5', value: '0000' },

    { field: 'dimension6', value: (false) ? 'Member' : 'Anonymous' },
    { field: 'dimension8', value: TrackEvent.getAnonymousId() }
  ],
  checkDuplicatedScript: true,
  autoTracking: {
    pageviewOnLoad: true,
    page: true,
    screenview: true,
    pageviewTemplate (route) {
      return {
        page: '/港聞/0000/page_V01=',
        title: document.title + ' - 交通津貼補貼你有計| 香港01', // OK
        location: 'https://www.hk01.com/pid_V01=' + window.location.href
      }
    }
  }
})
*/

Vue.config.productionTip = false

Vue.component('autocomplete-input', {
  template: `<div class="autocomplete-input">
  <p class="control has-icon has-icon-right">
    <input v-model="keyword" class="input is-large" placeholder="輸入路線號碼..." @input="onInput($event.target.value)" @keyup.esc="isOpen = false" @focus="toTop($event.target)" @blur="isOpen = false" @keydown.down="moveDown" @keydown.up="moveUp" @keydown.enter="select">
    <i class="fa fa-angle-down"></i>
  </p>
  <ul v-show="isOpen" class="options-list">
    <li v-for="(option, index) in fOptions" :class="{
        'highlighted': index === highlightedPosition
      }" @mouseenter="highlightedPosition = index" @mousedown="select">
      <slot name="item" :title="option.route" :description="option.fares[0]['dest']" :fullfares="option.fares[0]['fare']" :type="option.type" :optr="option.optr"></slot>
    </li>
  </ul>
  </div>`,
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      highlightedPosition: 0,
      keyword: ''
    }
  },
  computed: {
    fOptions() {
      const re = new RegExp("^" + this.keyword, 'i')
      return this.options
        .filter(o => o.route.match(re))
        .sort((a, b) => {
          let diff = a.route.replace(/[a-zA-Z]/g,"").length - b.route.replace(/[a-zA-Z]/g,"").length;
          return (0 == diff) ? ((a.route.toString() > b.route.toString()) ?  1 : -1) : diff
        })
    }
  },
  methods: {
    onInput(value) {
      this.highlightedPosition = 0
      this.isOpen = !!value
      document.querySelectorAll('.options-list')[0].scrollTop = 0
      this.$emit('keyword-input', !!value)
    },
    moveDown() {
      if (!this.isOpen) {
        return
      }
      this.highlightedPosition =
        (this.highlightedPosition + 1) % this.fOptions.length
    },
    moveUp() {
      if (!this.isOpen) {
        return
      }
      this.highlightedPosition = this.highlightedPosition - 1 < 0 ? this.fOptions.length - 1 : this.highlightedPosition - 1
    },
    select() {
      const selectedOption = this.fOptions[this.highlightedPosition]
      this.$emit('select', selectedOption)
      this.isOpen = false
      if (selectedOption) {
        this.keyword = selectedOption.route | ""
        this.$emit('chosen-select', {f: selectedOption.fares, r:this.keyword, o:selectedOption.optr})
      } else {
        this.keyword = ""
      }
    },
    toTop (target) {
      let target_top = document.querySelectorAll('.bus-section')[0].offsetTop - 40;

      document.querySelectorAll('html')[0].scrollTop = target_top;
      document.querySelectorAll('body')[0].scrollTop = target_top;
      if ('' != this.keyword) {
        this.isOpen = true
      }
    }
  }
})

/*
// Use VueAnalytics
var vm = new Vue({
  render: h => h(App)
})

onAnalyticsReady().then(() => {
  vm.$mount('#app')
})
*/

var vm = new Vue({
  el: '#app',
  render: h => h(App)
})
