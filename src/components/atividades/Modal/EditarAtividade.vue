<template>
    <AtividadeModal :atividade="editarAtividade" @close="$emit('close')" @save-atividade="updateAtividade"></AtividadeModal>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeModal from './AtividadeModal.vue';

const atividadesStore = useAtividadesStore();
const $q = useQuasar();
const editarAtividade = ref(null);
const emit = defineEmits(['close']);

async function updateAtividade(atividade) {
    try {
        await atividadesStore.updateAtividade(atividade);
        $q.notify({
            message: 'Atividade atualizada com sucesso!',
            color: 'positive',
            icon: 'check'
        });
        emit('close');
    } catch (error) {
        $q.notify({
            message: 'Erro ao atualizar atividade: ' + (error.message || 'Erro desconhecido'),
            color: 'negative',
            icon: 'error'
        });
    }
}

const open = (atividade) => {
    editarAtividade.value = atividade;
};

defineExpose({ open });
</script>