<template>
    <AtividadeModal @close="$emit('close')" @save-atividade="addAtividade"></AtividadeModal>
</template>

<script setup>
import { ref } from 'vue';
import { useAtividadesStore } from 'src/stores/atividadesStore'
import AtividadeModal from './AtividadeModal.vue';

const atividadesStore = useAtividadesStore();
const dialogVisible = ref(true);
const emit = defineEmits(['close']);

function addAtividade(atividade) {
    atividadesStore.addAtividade(atividade);
    emit('close');
}

const open = () => {
    dialogVisible.value = false;
};

defineExpose({ open });
</script>