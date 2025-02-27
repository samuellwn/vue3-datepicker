<template>
  <picker-popup
    headingClickable
    :columnCount="3"
    :items="months"
    :leftDisabled="leftDisabled"
    :rightDisabled="rightDisabled"
    @left="previousPage"
    @right="nextPage"
    @heading="$emit('back')"
    @elementClick="$emit('select', $event)"
  >
    <template #heading>{{ heading }}</template>
  </picker-popup>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect, PropType } from 'vue'
import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  getMonth,
  getYear,
  subYears,
  addYears,
  format,
  isSameMonth,
  isBefore,
  isAfter,
  isSameYear,
  startOfMonth,
  endOfMonth,
  isValid,
} from 'date-fns'
import { isEnabled } from './util'
import PickerPopup from './PickerPopup.vue'
import { formatWithOptions } from 'date-fns/fp'

export default defineComponent({
  components: {
    PickerPopup,
  },
  emits: {
    'update:pageDate': (date: Date) => isValid(date),
    select: (date: Date) => isValid(date),
    back: () => true,
  },
  props: {
    /**
     * Currently selected date, needed for highlighting
     */
    selected: {
      type: Date as PropType<Date>,
      required: false,
    },
    pageDate: {
      type: Date as PropType<Date>,
      required: true,
    },
    format: {
      type: String,
      required: false,
      default: 'LLL',
    },
    locale: {
      type: Object as PropType<Locale>,
      required: false,
    },
    lowerLimit: {
      type: Date as PropType<Date>,
      required: false,
    },
    upperLimit: {
      type: Date as PropType<Date>,
      required: false,
    },
    weekdays: {
      type: Array as PropType<Array<0 | 1 | 2 | 3 | 4 | 5 | 6>>,
      required: false,
    },
  },
  setup(props, { emit }) {
    const from = computed(() => startOfYear(props.pageDate))
    const to = computed(() => endOfYear(props.pageDate))

    const format = computed(() =>
      formatWithOptions({
        locale: props.locale,
      })(props.format)
    )

    const months = computed(() =>
      eachMonthOfInterval({
        start: from.value,
        end: to.value,
      }).map((value) => ({
        value,
        display: format.value(value),
        key: format.value(value),
        selected: props.selected && isSameMonth(props.selected, value),
        disabled: !isEnabled(value, props.lowerLimit, props.upperLimit, props.weekdays),
      }))
    )

    const heading = computed(() => getYear(from.value))

    const leftDisabled = computed(
      () =>
        props.lowerLimit &&
        (isSameYear(props.lowerLimit, props.pageDate) ||
          isBefore(props.pageDate, props.lowerLimit))
    )
    const rightDisabled = computed(
      () =>
        props.upperLimit &&
        (isSameYear(props.upperLimit, props.pageDate) ||
          isAfter(props.pageDate, props.upperLimit))
    )

    const previousPage = () =>
      emit('update:pageDate', subYears(props.pageDate, 1))
    const nextPage = () => emit('update:pageDate', addYears(props.pageDate, 1))

    return {
      months,
      heading,
      leftDisabled,
      rightDisabled,
      previousPage,
      nextPage,
    }
  },
})
</script>
