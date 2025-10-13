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
      @toggle-atividade="$emit('toggleAtividade', $event)"
      @editar-atividade ="$emit('editar-atividade', $event)"
      @deletar-atividade="promptToDelete" 
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

defineEmits(['toggleAtividade', 'editar-atividade'])
</script>