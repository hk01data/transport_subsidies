<template>
  <div>

    <header class="row">
      <div class="col-xs-12">
        <p class="main-logo pull-left">
          <a href="https://hk01.com/">
            <img class="logo-hk01news" src="assets/img/hk01news-logo.png" alt="01新聞">
          </a>
        </p>
        <h2 class="text-center">補貼你有計</h2>
        <p class="text-muted text-center"><small>交通補貼措施（2018年更新）</small></p>
      </div>
    </header>



    <fieldset class="form-group">
      <div class="row">
        <div class="col-xs-12">
          <label for="two-way">
          <span v-if="two_way">來回程相同</span>
          <span v-if="!two_way">來回程不同</span>
          <span>：</span>
          </label>
          <input id="two-way" type="checkbox" v-model="two_way" v-on:change="chg_return">
        </div>
      </div>

      <div class="jrn-cont">
      <div class="jrn-track">
        <div v-for="(value, key) in rows">
          <div class="jrn">

            <div class="row">
              <div class="col-xs-12">
                <p class="hint bg-info">第{{ key+1 }}程：你乘搭交通工具是...</p>
              </div>
              <div class="col-xs-12 col-sm-8">
                <div class="a__option col-xs-6">
                  <input type="radio" :id="'mtr' + key" value="mtr" v-model="value.travel_method" v-on:change="chg_method($event, value)">
                  <label :class="{'active': 'mtr' === value.travel_method}" :for="'mtr' + key">港鐵</label>
                </div>

                <div class="a__option col-xs-6">
                  <input type="radio" :id="'bus' + key" value="bus" v-model="value.travel_method" v-on:change="chg_method($event, value)">
                  <label :class="{'active': 'bus' === value.travel_method}" :for="'bus' + key">巴士/專線小巴</label>
                </div>

                <div class="a__option col-xs-6">
                  <input type="radio" :id="'monthly' + key" value="monthly" v-model="value.travel_method" v-on:change="chg_method($event, value)">
                  <label :class="{'active': 'monthly' === value.travel_method}" :for="'monthly' + key">月票</label>
                </div>

                <div class="a__option col-xs-6">
                  <input type="radio" :id="'other' + key" value="other" v-model="value.travel_method" v-on:change="chg_method($event, value)">
                  <label :class="{'active': 'other' === value.travel_method}" :for="'other' + key">其他，包括紅色小巴、邨巴、街渡等</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-xs-12">
                <p class="hint bg-info">第{{ key+1 }}程：{{ headline2(value) }}</p>
              </div>
            </div>

            <div class="mtr-section" v-if="'mtr' == value.travel_method">
              <div class="row">
                <div class="col-xs-12 col-sm-4">
                  <p><small>按港鐵站計算車費：</small></p>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-6">
                  <label for="mtr_line_from" class="">起點路線</label>
                  <p>
                  <select id="mtr_line_from" v-model="value.mtr_line_from" v-on:change="chg_line_from($event, value)">
                    <option v-for="option in mtr_lines_from()" v-bind:value="option.ld">
                      {{ option.ln }}
                    </option>
                  </select>
                  </p>
                </div>


                <div class="col-xs-6">
                  <label for="mtr_stn_from" class="">起點車站</label>
                  <p>
                  <select id="mtr_stn_from" v-model="value.mtr_stn_from" v-on:change="chg_stn_from($event, value)">
                    <option v-for="option in mtr_stns_from(value)" v-bind:value="option.sd">
                      {{ option.sn }}
                    </option>
                  </select>
                  </p>
                </div>
              </div>


              <div class="row">
                <div class="col-xs-6">
                  <label for="mtr_line_to" class="">終點路線</label>
                  <p>
                  <select id="mtr_line_to" v-model="value.mtr_line_to" v-on:change="chg_line_to($event, value)">
                    <option v-for="option in mtr_lines_to()" v-bind:value="option.ld">
                      {{ option.ln }}
                    </option>
                  </select>
                  </p>
                </div>


                <div class="col-xs-6">
                  <label for="mtr_stn_to" class="">終點車站</label>
                  <p>
                  <select id="mtr_stn_to" v-model="value.mtr_stn_to" v-on:change="chg_stn_to($event, value)">
                    <option v-for="option in mtr_stns_to(value)" v-bind:value="option.sd">
                      {{ option.sn }}
                    </option>
                  </select>
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12 col-sm-4">
                  <p class="">來回票價*： <strong>$ {{ mtr_fee(value) * 2 }}</strong> <small>（單程 $ {{ mtr_fee(value) }}）</small></p>
                  <p class=""></p>
                </div>
              </div>
            </div>


            <div class="bus-section" v-if="'bus' == value.travel_method">
              <div class="row">
                <div class="col-xs-12">
                  <autocomplete-input :options="bus_fares" @select="onOptionSelect" @chosen-select="pick1(value, $event)" @keyword-input="clear_bus_pay">
                    <template slot="item" scope="option">
                      <article class="media">
                        <figure class="media-left" :class="{
                          'red': '九巴' === option.optr.toLowerCase(),
                          'orange': '新巴' === option.optr.toLowerCase(),
                          'purple': '城巴' === option.optr.toLowerCase(),
                          'green': 'minibus' === option.type.toLowerCase()
                        }">
                          <p class="image is-64x64">
                            <span class="br-route">{{ option.title }}</span><br>
                            <small class="text-muted">{{ option.optr }}</small>
                          </p>
                        </figure>
                        <p class="row text-muted">
                        <span class="">{{ option.description }}</span>
                        </p>
                        <!--
                        <img :src="option.thumbnail">
                        {{ formatPrice(option.fullfares).replace("$ ", "$") }}
                        <br> {{ option.thumbnail }} - {{ option.optr }}
                        -->
                      </article>
                    </template>
                  </autocomplete-input>
                  <ul>
                    <li v-for="(frs, index) in value.bus_fare_options">
                      <a class="br-fare" :class="{'active' : value.bus_fare_options[index].active === 1}" href="javascript:void(0);" :key="frs.dest"
                          @click="pick2(value, {'fare': frs.fare, 'index': index, 'dest': frs.dest, 'frs': frs})">
                        <span class="br-fare-fee">${{ frs.fare }}</span> {{ frs.dest }}
                      </a>
                    </li>
                  </ul>

                  <p class="">來回票價*： <strong>$ {{ bus_fee(value) * 2 }}</strong> <small>（單程 $ {{ bus_fee(value) }}）</small></p>

                </div>
              </div>
            </div>


            <div class="monthly-section" v-if="'monthly' == value.travel_method">
              <div class="row">
                <div class="col-xs-7 col-sm-5">
                  <label for="duty_expense_30" class="lbl-vc text-right">月費（＄）</label>
                </div>
                <div class="col-xs-5 col-sm-7">
                  <p><input id="duty_expense_30" class="form-control" type="number" step="0.1" placeholder="請輸入金額" min="0" max="600000" v-model="value.duty_expense_30" v-on:change="chg_monthly($event, value)"></p>
                </div>
              </div>

              <div class="row">

              </div>
            </div>


            <div class="non-mtr-section" v-if="'other' == value.travel_method">
              <div class="row">
                <div class="col-xs-7 col-sm-5">
                  <label for="duty_expense" class="lbl-vc text-right">去程車費（＄）</label>
                </div>
                <div class="col-xs-5 col-sm-7">
                  <p><input id="duty_expense" class="form-control" type="number" step="0.1" placeholder="請輸入金額" min="0" max="600000" v-model="value.duty_expense" v-on:change="chg_other($event, value)"></p>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12 col-sm-4 xpad">
                  <p class="">來回車費： $ {{ value.duty_expense * 2 }}<small>（單程： $ {{ value.duty_expense * 1 }}）</small></p>
                </div>
              </div>
            </div>

            <div class="action-btns">
              <button class="btn btn-primary btn-xs" @click="addRow(key)">新增行程</button>
              <button class="btn btn-danger btn-xs" @click="removeRow(key)">刪除這項</button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="duty-day-section">
        <div class="row">
          <div class="col-xs-12">
            <p class="hint bg-info">3. 每月平均上班日數（0 - 30）：<strong>{{ duty_days }}日</strong></p>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-6 col-sm-push-3 slider-cont">
            <label for="duty_days" class="access text-right">日數</label>
            <p><vue-slider id="duty_days" v-model="duty_days" v-bind:max="s_max" v-bind:min="s_min" v-bind:tooltip="s_tooltip" v-on:drag-end="chg_dutyday"></vue-slider></p>
          </div>
        </div>
      </div>



      <div class="holiday-day-section">
        <div class="row">
          <div class="col-xs-12">
            <p class="hint bg-info">4. 假日交通費</p>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-7 col-sm-5">
            <label for="holiday_expense" class="lbl-vc">每天交通費用（$）</label>
          </div>
          <div class="col-xs-5 col-sm-7">
            <p><input id="holiday_expense" class="form-control" type="number" step="0.1" placeholder="請輸入金額" min="0" max="600000" v-model="holiday_expense" v-on:change="chg_holiday"></p>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-4 xpad">
            <p class="">{{ holiday_days * 1 }}日假期總交通費： $ {{ holiday_days * holiday_expense }}</p>
          </div>
        </div>
      </div>

      <div class="row result">
        <div class="col-xs-12 text-center">
          <h4>每月交通總開支：{{ formatPrice(total_fare) }}</h4>
          <h2>估計可獲補貼：{{ formatPrice(back_pay) }}</h2>
        </div>
      </div>
    </fieldset>

    <footer>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <!--
            <p><a href="https://carrielamgov.hk01.com/section/%E6%96%BD%E6%94%BF%E8%BF%BD%E8%B9%A4" title="追蹤特首其他施政承諾" class="ext-link" target="_blank">追蹤特首其他施政承諾</a></p>
            -->
            <hr>
            <p>資料來源：<br>政府資料一線通、運輸署、港鐵公司、相關專營巴士公司網頁</p>
            <p class="text-muted"><small>補貼金額僅供參考。車資以成人單程八達通計算，未包括港鐵八達通車費97折優惠。機場快線車費不計算即日來回優惠。每月日數假設為30天。</small></p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import axios from 'axios';
import * as TrackEvent from './trackEvent_tester.js'
require('../assets/sass/style.scss');
const _ = require('lodash/core');

let mtr_lines = [
 {
   "ld": 1,
   "ln": "港島線"
 },
 {
   "ld": 2,
   "ln": "南港島線"
 },
 {
   "ld": 3,
   "ln": "觀塘線"
 },
 {
   "ld": 4,
   "ln": "荃灣線"
 },
 {
   "ld": 5,
   "ln": "將軍澳線"
 },
 {
   "ld": 6,
   "ln": "東涌線及迪士尼線"
 },
 {
   "ld": 7,
   "ln": "東鐵線"
 },
 {
   "ld": 8,
   "ln": "馬鞍山線"
 },
 {
   "ld": 9,
   "ln": "西鐵線"
 },
 {
   "ld": 10,
   "ln": "機場快線"
 }
];
let mtr_stns = [
 {
   "sd": 83,
   "sn": "堅尼地城",
   "ld": 1
 },
 {
   "sd": 82,
   "sn": "香港大學",
   "ld": 1
 },
 {
   "sd": 81,
   "sn": "西營盤",
   "ld": 1
 },
 {
   "sd": 26,
   "sn": "上環",
   "ld": 1
 },
 {
   "sd": 1,
   "sn": "中環",
   "ld": 1
 },
 {
   "sd": 2,
   "sn": "金鐘",
   "ld": 1
 },
 {
   "sd": 27,
   "sn": "灣仔",
   "ld": 1
 },
 {
   "sd": 28,
   "sn": "銅鑼灣",
   "ld": 1
 },
 {
   "sd": 29,
   "sn": "天后",
   "ld": 1
 },
 {
   "sd": 30,
   "sn": "炮台山",
   "ld": 1
 },
 {
   "sd": 31,
   "sn": "北角",
   "ld": 1
 },
 {
   "sd": 32,
   "sn": "鰂魚涌",
   "ld": 1
 },
 {
   "sd": 33,
   "sn": "太古",
   "ld": 1
 },
 {
   "sd": 34,
   "sn": "西灣河",
   "ld": 1
 },
 {
   "sd": 35,
   "sn": "筲箕灣",
   "ld": 1
 },
 {
   "sd": 36,
   "sn": "杏花邨",
   "ld": 1
 },
 {
   "sd": 37,
   "sn": "柴灣",
   "ld": 1
 },
 {
   "sd": 2,
   "sn": "金鐘",
   "ld": 2
 },
 {
   "sd": 86,
   "sn": "海洋公園",
   "ld": 2
 },
 {
   "sd": 87,
   "sn": "黃竹坑",
   "ld": 2
 },
 {
   "sd": 88,
   "sn": "利東",
   "ld": 2
 },
 {
   "sd": 89,
   "sn": "海怡半島",
   "ld": 2
 },
 {
   "sd": 85,
   "sn": "黃埔",
   "ld": 3
 },
 {
   "sd": 84,
   "sn": "何文田",
   "ld": 3
 },
 {
   "sd": 5,
   "sn": "油麻地",
   "ld": 3
 },
 {
   "sd": 6,
   "sn": "旺角",
   "ld": 3
 },
 {
   "sd": 16,
   "sn": "太子",
   "ld": 3
 },
 {
   "sd": 7,
   "sn": "石硤尾",
   "ld": 3
 },
 {
   "sd": 8,
   "sn": "九龍塘",
   "ld": 3
 },
 {
   "sd": 9,
   "sn": "樂富",
   "ld": 3
 },
 {
   "sd": 10,
   "sn": "黃大仙",
   "ld": 3
 },
 {
   "sd": 11,
   "sn": "鑽石山",
   "ld": 3
 },
 {
   "sd": 12,
   "sn": "彩虹",
   "ld": 3
 },
 {
   "sd": 13,
   "sn": "九龍灣",
   "ld": 3
 },
 {
   "sd": 14,
   "sn": "牛頭角",
   "ld": 3
 },
 {
   "sd": 15,
   "sn": "觀塘",
   "ld": 3
 },
 {
   "sd": 38,
   "sn": "藍田",
   "ld": 3
 },
 {
   "sd": 48,
   "sn": "油塘",
   "ld": 3
 },
 {
   "sd": 49,
   "sn": "調景嶺",
   "ld": 3
 },
 {
   "sd": 1,
   "sn": "中環",
   "ld": 4
 },
 {
   "sd": 2,
   "sn": "金鐘",
   "ld": 4
 },
 {
   "sd": 3,
   "sn": "尖沙咀",
   "ld": 4
 },
 {
   "sd": 4,
   "sn": "佐敦",
   "ld": 4
 },
 {
   "sd": 5,
   "sn": "油麻地",
   "ld": 4
 },
 {
   "sd": 6,
   "sn": "旺角",
   "ld": 4
 },
 {
   "sd": 16,
   "sn": "太子",
   "ld": 4
 },
 {
   "sd": 17,
   "sn": "深水埗",
   "ld": 4
 },
 {
   "sd": 18,
   "sn": "長沙灣",
   "ld": 4
 },
 {
   "sd": 19,
   "sn": "茘枝角",
   "ld": 4
 },
 {
   "sd": 20,
   "sn": "美孚",
   "ld": 4
 },
 {
   "sd": 21,
   "sn": "茘景",
   "ld": 4
 },
 {
   "sd": 22,
   "sn": "葵芳",
   "ld": 4
 },
 {
   "sd": 23,
   "sn": "葵興",
   "ld": 4
 },
 {
   "sd": 24,
   "sn": "大窩口",
   "ld": 4
 },
 {
   "sd": 25,
   "sn": "荃灣",
   "ld": 4
 },
 {
   "sd": 31,
   "sn": "北角",
   "ld": 5
 },
 {
   "sd": 32,
   "sn": "鰂魚涌",
   "ld": 5
 },
 {
   "sd": 48,
   "sn": "油塘",
   "ld": 5
 },
 {
   "sd": 49,
   "sn": "調景嶺",
   "ld": 5
 },
 {
   "sd": 50,
   "sn": "將軍澳",
   "ld": 5
 },
 {
   "sd": 51,
   "sn": "坑口",
   "ld": 5
 },
 {
   "sd": 52,
   "sn": "寶琳",
   "ld": 5
 },
 {
   "sd": 57,
   "sn": "康城",
   "ld": 5
 },
 {
   "sd": 39,
   "sn": "香港",
   "ld": 6
 },
 {
   "sd": 40,
   "sn": "九龍",
   "ld": 6
 },
 {
   "sd": 41,
   "sn": "奧運",
   "ld": 6
 },
 {
   "sd": 53,
   "sn": "南昌",
   "ld": 6
 },
 {
   "sd": 21,
   "sn": "茘景",
   "ld": 6
 },
 {
   "sd": 42,
   "sn": "青衣",
   "ld": 6
 },
 {
   "sd": 43,
   "sn": "東涌",
   "ld": 6
 },
 {
   "sd": 54,
   "sn": "欣澳",
   "ld": 6
 },
 {
   "sd": 55,
   "sn": "迪士尼",
   "ld": 6
 },
 {
   "sd": 64,
   "sn": "紅磡",
   "ld": 7
 },
 {
   "sd": 65,
   "sn": "旺角東",
   "ld": 7
 },
 {
   "sd": 8,
   "sn": "九龍塘",
   "ld": 7
 },
 {
   "sd": 67,
   "sn": "大圍",
   "ld": 7
 },
 {
   "sd": 68,
   "sn": "沙田",
   "ld": 7
 },
 {
   "sd": 69,
   "sn": "火炭",
   "ld": 7
 },
 {
   "sd": 70,
   "sn": "馬場",
   "ld": 7
 },
 {
   "sd": 71,
   "sn": "大學",
   "ld": 7
 },
 {
   "sd": 72,
   "sn": "大埔墟",
   "ld": 7
 },
 {
   "sd": 73,
   "sn": "太和",
   "ld": 7
 },
 {
   "sd": 74,
   "sn": "粉嶺",
   "ld": 7
 },
 {
   "sd": 75,
   "sn": "上水",
   "ld": 7
 },
 {
   "sd": 78,
   "sn": "落馬洲",
   "ld": 7
 },
 {
   "sd": 76,
   "sn": "羅湖",
   "ld": 7
 },
 {
   "sd": 67,
   "sn": "大圍",
   "ld": 8
 },
 {
   "sd": 96,
   "sn": "車公廟",
   "ld": 8
 },
 {
   "sd": 97,
   "sn": "沙田圍",
   "ld": 8
 },
 {
   "sd": 98,
   "sn": "第一城",
   "ld": 8
 },
 {
   "sd": 99,
   "sn": "石門",
   "ld": 8
 },
 {
   "sd": 100,
   "sn": "大水坑",
   "ld": 8
 },
 {
   "sd": 101,
   "sn": "恆安",
   "ld": 8
 },
 {
   "sd": 102,
   "sn": "馬鞍山",
   "ld": 8
 },
 {
   "sd": 103,
   "sn": "烏溪沙",
   "ld": 8
 },
 {
   "sd": 64,
   "sn": "紅磡",
   "ld": 9
 },
 {
   "sd": 80,
   "sn": "尖東",
   "ld": 9
 },
 {
   "sd": 111,
   "sn": "柯士甸",
   "ld": 9
 },
 {
   "sd": 53,
   "sn": "南昌",
   "ld": 9
 },
 {
   "sd": 20,
   "sn": "美孚",
   "ld": 9
 },
 {
   "sd": 114,
   "sn": "荃灣西",
   "ld": 9
 },
 {
   "sd": 115,
   "sn": "錦上路",
   "ld": 9
 },
 {
   "sd": 116,
   "sn": "元朗",
   "ld": 9
 },
 {
   "sd": 117,
   "sn": "朗屏",
   "ld": 9
 },
 {
   "sd": 118,
   "sn": "天水圍",
   "ld": 9
 },
 {
   "sd": 119,
   "sn": "兆康",
   "ld": 9
 },
 {
   "sd": 120,
   "sn": "屯門",
   "ld": 9
 },
 {
   "sd": 44,
   "sn": "香港",
   "ld": 10
 },
 {
   "sd": 45,
   "sn": "九龍",
   "ld": 10
 },
 {
   "sd": 46,
   "sn": "青衣",
   "ld": 10
 },
 {
   "sd": 47,
   "sn": "機場",
   "ld": 10
 },
 {
   "sd": 56,
   "sn": "博覽館",
   "ld": 10
 }
];

function generateItemID(inIndex) {
  let index = inIndex || 0
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  let randID = s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
  return `${randID}-${Date.now()}-${index}`
}

export default {
  name: 'app',
  components: {
    vueSlider
  },
  data () {
    return {
      event_cate: 'transubcal',
      sheadline2: '去程交通花費是...',
      mtr_fares: [],
      bus_fares: [],
      travel_method: 'bus',
      duty_expense: '',
      duty_expense_30: '',
      duty_days: 21,
      holiday_expense: '',
      holiday_in_count: 1,
      s_max: 30,
      s_min: 0,
      s_tooltip: 'hover',
      mtr_line_from: 3,
      mtr_stn_from: 8,
      mtr_line_to: 1,
      mtr_stn_to: 2,
      bus_pay: 0,
      bus_route: '',
      two_way: true,
      rows: [
        {
          travel_method: 'mtr',
          duty_expense: '',
          duty_expense_30: '',
          mtr_line_from: 3,
          mtr_stn_from: 8,
          mtr_line_to: 1,
          mtr_stn_to: 2,
          bus_fare_options: [],
          bus_pay: 0,
          itemID: generateItemID(0)
        }
      ],
      entrySource: '',
      firstInteraction: 1
    }
  },
  computed: {
    holiday_days () {
      if (this.duty_days < 31) {
        return (30 - this.duty_days)
      } else {
        return '輸入有問題！'
      }
    },
    one_day_fee () {
      let vm = this;
      let the_exp = 0;

      vm.rows.map(function (o) {
        if ('mtr' == o.travel_method) {
          the_exp += parseFloat(vm.mtr_fee(o))
        } else if ('bus' == o.travel_method) {
          the_exp += parseFloat(vm.bus_fee(o))
        } else if ('monthly' == o.travel_method) {
          the_exp += 0
        } else if ('other' == o.travel_method) {
          the_exp += ('' === o.duty_expense) ? 0 : parseFloat(o.duty_expense)
        } else if ('' == the_exp) {
          the_exp += 0
        }
      });

      return the_exp
    },
    total_fare () {
      let vm = this;
      let commu = this.one_day_fee * ((vm.two_way) ? 2 : 1) *this.duty_days
      vm.rows.map(function (o) {
        if ('monthly' == o.travel_method) {
          commu += ('' === o.duty_expense_30) ? 0 : parseFloat(o.duty_expense_30)
        }
      });
      return (commu + this.holiday_expense*this.holiday_days*this.holiday_in_count)
    },
    back_pay () {
      let pay = 0, min_exp = 400, cap = 300, rate = 0.25;
      if (min_exp < this.total_fare) {
        pay = (this.total_fare - min_exp) * rate;
      } else {
        pay = 0;
      }
      if (cap < pay) {
        pay = cap
      }

      return pay;
    }
  },
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(1)
        return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    addRow: function (index) {
      let itemID = generateItemID(index + 1)
      try {
        this.rows.splice(index + 1, 0, {
          travel_method: 'mtr',
          duty_expense: '',
          duty_expense_30: '',
          mtr_line_from: 3,
          mtr_stn_from: 8,
          mtr_line_to: 1,
          mtr_stn_to: 2,
          bus_fare_options: [],
          bus_pay: 0,
          itemID: itemID
        })
        this.fireEvent(this.event_cate + '_' + 'trip', 'click', {
          action: 'add',
          button: index + 1,
          trip_id: itemID
        })
      } catch(e)
      {
        console.log(e);
      }
    },
    removeRow: function (index) {
      if (this.rows.length > 1) {
        let itemID = this.rows[index].itemID
        this.rows.splice(index, 1)
        this.fireEvent(this.event_cate + '_' + 'trip', 'click', {
          action: 'remove',
          button: index,
          trip_id: itemID
        })
      }
    },
    headline2 (self) {
      switch (self.travel_method) {
        case 'bus': return '輸入路線查詢票價'
        break
        case 'monthly': return '輸入月票票價'
        break
        default: return this.sheadline2
      }
    },
    mtr_lines_from () {
      return mtr_lines
    },
    mtr_stns_from (self) {
      return _.filter(mtr_stns, { 'ld': self.mtr_line_from })
    },
    mtr_lines_to () {
      return mtr_lines
    },
    mtr_stns_to (self) {
      return _.filter(mtr_stns, { 'ld': self.mtr_line_to })
    },
    mtr_fee (self) {
      let vm = this;
      let select_jrn = _.filter(vm.mtr_fares, { 'SD': self.mtr_stn_from, 'DD': self.mtr_stn_to })
      if (select_jrn.length == 1) {
        return select_jrn[0]['AD']
      } else {
        return 0
      }
    },
    bus_fee (self) {
      let vm = self;

      return self.bus_pay
    },
    chg_return (e) {
      this.fireEvent(this.event_cate + '_' + 'return_trip', 'click', {return_trip: e.target.checked})
    },
    chg_method (e, self) {
      this.fireEvent(this.event_cate + '_' + 'method', 'click', {type: self.travel_method, trip_id: self.itemID})
    },
    chg_line_from (e, self) {
      let from = _.filter(mtr_lines, { 'ld': self.mtr_line_from })[0].ln
      let to = _.filter(mtr_lines, { 'ld': self.mtr_line_to })[0].ln
      this.fireEvent(this.event_cate + '_' + 'mtr_line', 'select', {from: from, to: to, trip_id: self.itemID})
    },
    chg_stn_from (e, self) {
      let from = _.filter(mtr_stns, { 'sd': self.mtr_stn_from })
      from = from.length ? from[0].sn : 'undefined'
      let to = _.filter(mtr_stns, { 'sd': self.mtr_stn_to })
      to = to.length ? to[0].sn : 'undefined'
      this.fireEvent(this.event_cate + '_' + 'mtr_stn', 'select', {
        from: from,
        to: to,
        trip_id: self.itemID,
        oneway_fare: this.mtr_fee({mtr_stn_from: self.mtr_stn_from, mtr_stn_to: self.mtr_stn_to})
      })
    },
    chg_line_to (e, self) {
      let from = _.filter(mtr_lines, { 'ld': self.mtr_line_from })[0].ln
      let to = _.filter(mtr_lines, { 'ld': self.mtr_line_to })[0].ln
      this.fireEvent(this.event_cate + '_' + 'mtr_line', 'select', {from: from, to: to, trip_id: self.itemID})
    },
    chg_stn_to (e, self) {
      let from = _.filter(mtr_stns, { 'sd': self.mtr_stn_from })
      from = from.length ? from[0].sn : 'undefined'
      let to = _.filter(mtr_stns, { 'sd': self.mtr_stn_to })
      to = to.length ? to[0].sn : 'undefined'
      this.fireEvent(this.event_cate + '_' + 'mtr_stn', 'select', {
        from: from,
        to: to,
        trip_id: self.itemID,
        oneway_fare: this.mtr_fee({mtr_stn_from: self.mtr_stn_from, mtr_stn_to: self.mtr_stn_to})
      })
    },
    chg_monthly (e, self) {
      this.fireEvent(this.event_cate + '_' + 'monthly', 'change', {monthly_value: parseFloat(e.target.value), trip_id: self.itemID})
    },
    chg_other (e, self) {
      this.fireEvent(this.event_cate + '_' + 'other', 'change', {oneway_fare: parseFloat(e.target.value), trip_id: self.itemID})
    },
    chg_dutyday (e) {
      this.fireEvent(this.event_cate + '_' + 'dutyday', 'change', {dutyday: this.duty_days, holiday: 30 - this.duty_days})
    },
    chg_holiday (e) {
      let vm = this
      let holiday_expense = (vm.holiday_expense === '') ? 0 : parseFloat(vm.holiday_expense)
      this.fireEvent(this.event_cate + '_' + 'holiday_expense', 'change', {
        holiday_daily_expense: holiday_expense,
        holiday_total_expenses: (30 - this.duty_days) * holiday_expense})
    },
    onOptionSelect (option) {
      // console.log('Selected option:', option)
    },
    clear_bus_pay (value) {
      this.bus_pay = 0
    },
    pick1 (self, fare) {
      // console.log('Selected faressss:', self, fare, fare.f[0].dest)
      self.bus_fare_options = fare.f
      self.bus_route = fare.r
      self.bus_optr = fare.o
      let bus_map = {
        '九巴': 'kmb',
        '新巴': 'nwfb',
        '城巴': 'ctb',
        '綠色小巴': 'green'
      };
      if (1 === fare.f.length) {
        self.bus_pay = fare.f[0].fare
        self.bus_fare_options[0].active = true
        this.fireEvent(this.event_cate + '_' + 'bus_search', 'search', {
          type: bus_map[fare.o],
          line: self.bus_route,
          route: fare.f[0].dest,
          trip_id: self.itemID,
          oneway_fare: parseFloat(self.bus_pay)
        })
      } else {
        self.bus_pay = 0
        this.fireEvent(this.event_cate + '_' + 'bus_search', 'search', {
          type: bus_map[fare.o],
          line: self.bus_route,
          route: fare.f[0].dest,
          trip_id: self.itemID,
          oneway_fare: 'undefined'
        })
      }
    },
    pick2 (self, in_obj) {
      // console.log('Selected fare:', self, in_obj)
      let newRows = this.rows.slice()
      let fIndex = -1
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].itemID === self.itemID) {
          fIndex = i
        }
      }

      let newThisRow = newRows[fIndex]
      let new_bus_fare_options = self.bus_fare_options
      new_bus_fare_options.map(o => {
        o.active = 0
      })
      new_bus_fare_options[in_obj.index].active = 1
      newThisRow.bus_fare_options = new_bus_fare_options

      newRows[fIndex] = newThisRow
      this.rows = newRows

      self.bus_pay = parseFloat(in_obj.fare)

      let bus_map = {
        '九巴': 'kmb',
        '新巴': 'nwfb',
        '城巴': 'ctb',
        '綠色小巴': 'green'
      };

      this.fireEvent(this.event_cate + '_' + 'bus_search', 'select', {
        type: bus_map[self.bus_optr],
        line: self.bus_route,
        section: in_obj.dest,
        oneway_fare: parseFloat(in_obj.fare),
        trip_id: self.itemID
      })
    },
    detectSource (callback) {
      let linkText = window.location.href
      let article_id = (linkText.match(/utm_source=inline_article/)) ? linkText.match(/utm_source=inline_article_(.*?)(&|$|\?)/)[1] : 'organic'
      this.entrySource = (linkText.match(/#/)) ? linkText.match(/#(.*?)(&|$|\?)/)[1] : 'organic'

      switch (this.entrySource) {
        case 'article':
        case 'base':
        case 'issue':
          break
        default:
          this.entrySource = 'organic'
          // fireArticlePV(removehash(window.location.href))
      }

      if (callback) {
        callback(this.entrySource, article_id)
      }
    },
    // fireEvent (e_c, e_a, e_n) {
    //   // Use VueAnalytics
    //   let vm = this
    //   let holiday_expense = (vm.holiday_expense === '') ? 0 : parseFloat(vm.holiday_expense)

    //   if (vm.firstInteraction === 1 && vm.entrySource !== 'organic' && vm.entrySource !== 'base') {
    //     vm.firstInteraction--
    //     vm.$ga.page({
    //       page: '/#' + vm.entrySource,
    //       title: document.title,
    //       location: window.location.href
    //     })
    //   }
    //   vm.$ga.event(e_c, e_a, {
    //     ...e_n,
    //     anonymous_id: TrackEvent.get
    //   }, 1)
    //   vm.$ga.event(vm.event_cate + '_' + 'result', 'change', {
    //     return_trip: vm.two_way,
    //     trips: vm.rows,
    //     dutyday: vm.duty_days,
    //     holiday: 30 - vm.duty_days,
    //     holiday_daily_expense: holiday_expense,
    //     holiday_total_expenses: (30 - vm.duty_days) * holiday_expense,
    //     total_expense: parseFloat(parseFloat(vm.total_fare).toFixed(1)),
    //     total_subsidy: parseFloat(parseFloat(vm.back_pay).toFixed(1))
    //   }, 1)
    // },
    fireEvent (e_c, e_a, e_n) {
      let vm = this
      let holiday_expense = (vm.holiday_expense === '') ? 0 : parseFloat(vm.holiday_expense)

      if (vm.firstInteraction === 1 && vm.entrySource !== 'organic' && vm.entrySource !== 'base') {
        vm.firstInteraction--
        TrackEvent.fireArticlePV(TrackEvent.removehash(window.location.href))
      }
      let newE_n = e_n
      newE_n['anonymous_id'] = TrackEvent.getAnonymousId()
      newE_n['ts'] = Date.now()

      TrackEvent.fireEvent(e_c, e_a, newE_n, 1)
      TrackEvent.fireEvent(vm.event_cate + '_' + 'result', 'change', {
        return_trip: vm.two_way,
        trip_id: vm.rows.map(o => o.itemID),
        dutyday: vm.duty_days,
        holiday: 30 - vm.duty_days,
        holiday_daily_expense: holiday_expense,
        holiday_total_expenses: (30 - vm.duty_days) * holiday_expense,
        total_expense: parseFloat(parseFloat(vm.total_fare).toFixed(1)),
        total_subsidy: parseFloat(parseFloat(vm.back_pay).toFixed(1)),
        anonymous_id: newE_n['anonymous_id'],
        ts: newE_n['ts']
      }, 1)
    }
  },
  created: function () {
    let vm = this;

    axios.get('assets/fares_mtr.json')
    .then(function (response) {
      vm.mtr_fares = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

    axios.get('assets/all_bus.json')
    .then(function (response) {
      vm.bus_fares = response.data.map((o) => {
        let bus_map = {
          'kmb' : '九巴',
          'nwfb' : '新巴',
          'ctb' : '城巴'
        };
        o.optr = (o.optr.toLowerCase() in bus_map) ? bus_map[o.optr.toLowerCase()] :'綠色小巴'

        return o
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  mounted () {
    let vm = this

    TrackEvent.fireMapPV(TrackEvent.removehash(window.location.href))

    // onAnalyticsReady
    vm.detectSource(function (source, article_id) {
      if (source === 'organic') {
        // // Use VueAnalytics
        // vm.$ga.page({
        //   page: '/',
        //   title: document.title,
        //   location: window.location.href
        // })
        TrackEvent.fireArticlePV(TrackEvent.removehash(window.location.href))
      }
      TrackEvent.fireEvent(vm.event_cate + '_landing', 'view', {
        article_id: article_id,
        source: source,
        anonymous_id: TrackEvent.getAnonymousId(),
        ts: Date.now()
      })
    })
  }
}
</script>

<style>

</style>
