<template>
  <q-input filled :model-value="pontos" @update:model-value="$emit('update:pontos', $event)" label="Pontos XP"
    id="pontos" name="pontos" type="number" min="0"
    :rules="[val => (val !== null && val !== '' && val >= 0) || 'Campo obrigatório']" clearable />
</template>

<script setup>
defineProps({
  pontos: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:pontos']);
</script>
