<template>
  <q-input filled :model-value="notaMax" @update:model-value="$emit('update:notaMax', $event)" label="Nota Máxima"
    id="nota_max" name="nota_max" type="number" min="0" step="0.1"
    :rules="[val => (val !== null && val !== '' && val >= 0) || 'Campo obrigatório']" clearable />
</template>

<script setup>
defineProps({
  notaMax: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:notaMax']);
</script>
