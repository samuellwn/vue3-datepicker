<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <datepicker
      class="picker"
      v-model="selected"
      :locale="locale"
      :upperLimit="to"
      :lowerLimit="from"
      :weekdays="onlyWeekdays ? [1, 2, 3, 4, 5] : [0, 1 , 2, 3, 4, 5, 6]"
    />
  </div>
  <div>
    <datepicker
      class="picker"
      weekday-format="iiiiii"
      month-list-format="LLLL"
      v-model="from"
      :locale="locale"
      placeholder="from"
    />
  </div>
  <div>
    <datepicker class="picker" v-model="to" placeholder="to" />
  </div>
  <div>
    <datepicker
      class="picker"
      v-model="to"
      :locale="locale"
      disabled
      placeholder="disabled"
    />
  </div>
  <div>
    <input id="onlyWeekdays" type="checkbox" v-model="onlyWeekdays" />
    <label for="onlyWeekdays">Only Weekdays</label>
  </div>
</template>

<script>
import Datepicker from './datepicker/Datepicker.vue'
import { defineComponent } from 'vue'
import { ru, enUS } from 'date-fns/locale'

export default defineComponent({
  name: 'App',
  components: {
    Datepicker,
  },
  data() {
    return {
      selected: null,
      from: null,
      to: null,
      onlyWeekdays: false,
    }
  },
  computed: {
    locale: () => enUS,
  },
  watch: {
    selected: (value) => console.log(value),
  },
})
</script>

<style>
.picker {
  color: #3c4a5a;
}
</style>
