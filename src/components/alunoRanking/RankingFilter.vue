<template>
  <div style="min-width: 200px">
    <q-select
      outlined
      dense
      dark
      color="primary"
      v-model="model"
      :options="options"
      option-label="label"
      option-value="value"
      label="Filtrar Ranking"
      emit-value
      map-options
      bg-color="dark-page"
    >
      <template v-slot:prepend>
        <q-icon name="filter_list" />
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 'geral'
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
