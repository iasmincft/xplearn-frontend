<template>
    <TurmaModal @close="$emit('close')" @save-turma="addTurma"></TurmaModal>
</template>

<script setup>
import { ref } from 'vue';
import { useTurmaStore } from 'src/stores/turmaStore'
import TurmaModal from './TurmaModal.vue';

const turmaStore = useTurmaStore();
const dialogVisible = ref(true);
const emit = defineEmits(['close']);

function addTurma(turma) {
    turmaStore.addTurma(turma);
    emit('close');
}

const open = () => {
    dialogVisible.value = false;
};

defineExpose({ open });
</script>