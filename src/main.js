import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-107900580-1',
  checkDuplicatedScript: true
})


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
      this.keyword = selectedOption.route
      this.$emit('chosen-select', selectedOption.fares)
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


var vm = new Vue({
  el: '#app',
  render: h => h(App)
})
