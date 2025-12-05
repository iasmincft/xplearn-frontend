<template>
  <transition-group
    appear
    leave-active-class="animated zoomOut"
    tag="div"
  >
    <AtividadeItem
      v-for="atividade in atividades"
      :key="atividade.id"
      :atividade="atividade"
      @editar-atividade="$emit('editar-atividade', $event)"
      @deletar-atividade="$emit('deletar-atividade', $event)"
    />
  </transition-group>
</template>

<script setup>
import AtividadeItem from './AtividadeItem.vue';

defineProps({
  atividades: {
    type: Array,
    required: true
  }
})

defineEmits(['editar-atividade', 'deletar-atividade'])
</script>
