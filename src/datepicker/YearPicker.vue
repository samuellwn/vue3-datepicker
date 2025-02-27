<template>
  <picker-popup
    :columnCount="3"
    :leftDisabled="leftDisabled"
    :rightDisabled="rightDisabled"
    :items="years"
    @left="previousPage"
    @right="nextPage"
    @elementClick="$emit('select', $event)"
  >
    <template #heading>{{ heading }}</template>
  </picker-popup>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect, PropType } from 'vue'
import {
  startOfDecade,
  endOfDecade,
  eachYearOfInterval,
  getYear,
  subYears,
  addYears,
  isAfter,
  isBefore,
  getDecade,
  isValid,
} from 'date-fns'
import { isEnabled } from './util'
import PickerPopup from './PickerPopup.vue'

export default defineComponent({
  components: {
    PickerPopup,
  },
  emits: {
    'update:pageDate': (date: Date) => isValid(date),
    select: (date: Date) => isValid(date),
  },
  props: {
    selected: {
      type: Date as PropType<Date>,
      required: false,
    },
    pageDate: {
      type: Date as PropType<Date>,
      required: true,
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
    const from = computed(() => startOfDecade(props.pageDate))
    const to = computed(() => endOfDecade(props.pageDate))

    const years = computed(() =>
      eachYearOfInterval({
        start: from.value,
        end: to.value,
      }).map((value) => ({
        value,
        key: String(getYear(value)),
        display: getYear(value),
        selected: props.selected && getYear(value) === getYear(props.selected),
        disabled: !isEnabled(value, props.lowerLimit, props.upperLimit, props.weekdays),
      }))
    )

    const heading = computed(() => {
      const start = getYear(from.value)
      const end = getYear(to.value)

      return `${start} - ${end}`
    })

    const leftDisabled = computed(
      () =>
        props.lowerLimit &&
        (getDecade(props.lowerLimit) === getDecade(props.pageDate) ||
          isBefore(props.pageDate, props.lowerLimit))
    )
    const rightDisabled = computed(
      () =>
        props.upperLimit &&
        (getDecade(props.upperLimit) === getDecade(props.pageDate) ||
          isAfter(props.pageDate, props.upperLimit))
    )

    const previousPage = () =>
      emit('update:pageDate', subYears(props.pageDate, 10))
    const nextPage = () => emit('update:pageDate', addYears(props.pageDate, 10))

    return {
      years,
      heading,
      leftDisabled,
      rightDisabled,
      previousPage,
      nextPage,
    }
  },
})
</script>
