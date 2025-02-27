<template>
  <div class="v3dp__datepicker">
    <input
      type="text"
      readonly="readonly"
      v-model="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @blur="onBlur"
      @focus="renderView(startingView)"
      @click="renderView(startingView)"
    />
    <year-picker
      v-show="viewShown === 'year'"
      v-model:pageDate="pageDate"
      :selected="modelValue"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      :weekdays="weekdays"
      @select="selectYear"
    />
    <month-picker
      v-show="viewShown === 'month'"
      v-model:pageDate="pageDate"
      :selected="modelValue"
      @select="selectMonth"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      :weekdays="weekdays"
      :format="monthListFormat"
      :headingFormat="monthHeadingFormat"
      :locale="locale"
      @back="viewShown = 'year'"
    />
    <day-picker
      v-show="viewShown === 'day'"
      v-model:pageDate="pageDate"
      :selected="modelValue"
      :weekStartsOn="weekStartsOn"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      :weekdays="weekdays"
      :locale="locale"
      :weekdayFormat="weekdayFormat"
      @select="selectDay"
      @back="viewShown = 'month'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watchEffect, PropType } from 'vue'
import { parse, isValid, setYear, lightFormat } from 'date-fns'
import YearPicker from './YearPicker.vue'
import MonthPicker from './MonthPicker.vue'
import DayPicker from './DayPicker.vue'

export default defineComponent({
  components: {
    YearPicker,
    MonthPicker,
    DayPicker,
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * `v-model` for selected date
     */
    modelValue: {
      type: Date as PropType<Date>,
      required: false,
    },
    /**
     * Upper limit for available dates for picking
     */
    upperLimit: {
      type: Date,
      required: false,
    },
    /**
     * Lower limit for available dates for picking
     */
    lowerLimit: {
      type: Date,
      required: false,
    },
    /**
     * Days of week available for picking. 0 is Sunday, 1 is Monday, etc.
     */
    weekdays: {
      type: Array,
      required: false,
    },
    /**
     * View on which the date picker should open. Can be either `year`, `month`, or `day`
     */
    startingView: {
      type: String as PropType<'year' | 'month' | 'day'>,
      required: false,
      default: 'day',
      validate: (v: unknown) =>
        typeof v === 'string' && ['day', 'month', 'year'].includes(v),
    },
    /**
     * `date-fns`-type formatting for a month view heading
     */
    monthHeadingFormat: {
      type: String,
      required: false,
      default: 'LLLL yyyy',
    },
    /**
     * `date-fns`-type formatting for the month picker view
     */
    monthListFormat: {
      type: String,
      required: false,
      default: 'LLL',
    },
    /**
     * `date-fns`-type formatting for a line of weekdays on day view
     */
    weekdayFormat: {
      type: String,
      required: false,
      default: 'EE',
    },
    /**
     * `date-fns`-type format in which the string in the input should be both
     * parsed and displayed
     */
    inputFormat: {
      type: String,
      required: false,
      default: 'yyyy-MM-dd',
    },
    /**
     * [`date-fns` locale object](https://date-fns.org/v2.16.1/docs/I18n#usage).
     * Used in string formatting (see default `monthHeadingFormat`)
     */
    locale: {
      type: Object as PropType<Locale>,
      required: false,
    },
    /**
     * Day on which the week should start.
     *
     * Number from 0 to 6, where 0 is Sunday and 6 is Saturday.
     * Week starts with a Monday (1) by default
     */
    weekStartsOn: {
      type: Number,
      required: false,
      default: 0,
      validator: (value: any) => [0, 1, 2, 3, 4, 5, 6].includes(value),
    },
    /**
     * Disables datepicker and prevents it's opening
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const viewShown = ref('none' as 'year' | 'month' | 'day' | 'none')
    const pageDate = ref(new Date())

    const input = ref('')
    watchEffect(() => {
      const parsed = parse(input.value, props.inputFormat, new Date())
      if (isValid(parsed)) {
        pageDate.value = parsed
      }
    })

    watchEffect(
      () =>
        (input.value =
          props.modelValue && isValid(props.modelValue)
            ? lightFormat(props.modelValue, props.inputFormat)
            : '')
    )

    const onBlur = () => {
      renderView()
      emit('blur')
    }

    const renderView = (view: typeof viewShown.value = 'none') => {
      if (!props.disabled) viewShown.value = view
    }
    watchEffect(() => {
      if (props.disabled) viewShown.value = 'none'
    })
    const selectYear = (date: Date) => {
      pageDate.value = date
      viewShown.value = 'month'
    }
    const selectMonth = (date: Date) => {
      pageDate.value = date
      viewShown.value = 'day'
    }
    const selectDay = (date: Date) => {
      emit('update:modelValue', date)

      viewShown.value = 'none'
    }

    return {
      input,
      pageDate,
      onBlur,
      renderView,
      selectYear,
      selectMonth,
      selectDay,
      viewShown,
      log: (e: any) => console.log(e),
    }
  },
})
</script>

<style>
.v3dp__datepicker {
  --popout-bg-color: var(--vdp-bg-color, #fff);
  --box-shadow: var(
    --vdp-box-shadow,
    0 4px 10px 0 rgba(128, 144, 160, 0.1),
    0 0 1px 0 rgba(128, 144, 160, 0.81)
  );
  --border-radius: var(--vdp-border-radius, 3px);
  --heading-size: var(--vdp-heading-size, 2.5em); /* 40px for 16px font */
  --heading-weight: var(--vdp-heading-weight, bold);
  --heading-hover-color: var(--vpd-heading-hover-color, #eeeeee);
  --arrow-color: var(--vdp-arrow-color, currentColor);

  --elem-color: var(--vpd-elem-color, currentColor);
  --elem-disabled-color: var(--vpd-disabled-color, #d5d9e0);
  --elem-hover-color: var(--vdp-hover-color, #fff);
  --elem-hover-bg-color: var(--vdp-hover-bg-color, #0baf74);
  --elem-selected-color: var(--vdp-selected-color, #fff);
  --elem-selected-bg-color: var(--vdp-selected-bg-color, #0baf74);

  --elem-font-size: var(--vpd-elem-font-size, 0.8em);
  --elem-border-radius: var(--vdp-elem-border-radius, 3px);

  --divider-color: var(--vpd-divider-color, var(--elem-disabled-color));

  position: relative;
}
</style>
