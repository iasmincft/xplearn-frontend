<template>
  <div>
    <AtividadeItem v-for="atividade in atividades" :key="atividade.id" :atividade="atividade" :hide-turma="hideTurma"
      @view-atividade="handleViewAtividade" @editar-atividade="$emit('editar-atividade', $event)"
      @deletar-atividade="$emit('deletar-atividade', $event)" />
  </div>
</template>

<script setup>
import AtividadeItem from './AtividadeItem.vue';

defineProps({
  atividades: {
    type: Array,
    required: true
  },
  hideTurma: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-atividade', 'editar-atividade', 'deletar-atividade'])

function handleViewAtividade(event) {
  emit('view-atividade', event)
}
</script>
