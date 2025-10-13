<template>
    <AtividadeModal :atividade="editarAtividade" @close="$emit('close')" @save-atividade="updateAtividade"></AtividadeModal>
</template>

<script setup>
import { ref } from 'vue';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeModal from './AtividadeModal.vue';

const atividadesStore = useAtividadesStore();
const dialogVisible = ref(false);
const editarAtividade = ref(null);
const emit = defineEmits(['close']);


function updateAtividade(atividade) {
    atividadesStore.updateAtividade(atividade);
    emit('close');
}

const open = (atividade) => {
    editarAtividade.value = atividade;
    dialogVisible.value = true;
};

defineExpose({ open });
</script>