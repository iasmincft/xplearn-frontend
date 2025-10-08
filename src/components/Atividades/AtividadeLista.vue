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
      @ver="$emit('ver', $event)"
      @editar="$emit('editar', $event)"
      @deletar="$emit('deletar', $event)"
      @concluir="$emit('concluir', $event)"
      @ver-submissoes="$emit('verSubmissoes', $event)"
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

defineEmits(['ver', 'editar', 'deletar', 'concluir', 'verSubmissoes'])
</script>