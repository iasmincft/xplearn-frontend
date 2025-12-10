<template>
    <AtividadeModal :atividade="null" @close="$emit('close')" @save-atividade="addAtividade"></AtividadeModal>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useAtividadesStore } from 'src/stores/atividadesStore'
import AtividadeModal from './AtividadeModal.vue';

const props = defineProps({
    turmaId: {
        type: [Number, String],
        default: null
    }
});

const atividadesStore = useAtividadesStore();
const $q = useQuasar();
const emit = defineEmits(['close']);

async function addAtividade(atividade) {

    if (props.turmaId) {
        atividade.turma_id_fk = Number(props.turmaId);
    }
    
    try {
        await atividadesStore.addAtividade(atividade);
        $q.notify({
            message: 'Atividade criada com sucesso!',
            color: 'positive',
            icon: 'check'
        });
        emit('close');
    } catch (error) {
        $q.notify({
            message: 'Erro ao criar atividade: ' + (error.message || 'Erro desconhecido'),
            color: 'negative',
            icon: 'error'
        });
    }
}
</script>
