<template>
    <AtividadeModal
        v-if="editarAtividade"
        :key="editarAtividade.id"
        :atividade="editarAtividade"
        @close="$emit('close')"
        @save-atividade="handleUpdate"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeModal from './AtividadeModal.vue';

const props = defineProps({
    hideTurma: {
        type: Boolean,
        default: false
    }
});

const atividadesStore = useAtividadesStore();
const $q = useQuasar();
const editarAtividade = ref(null);
const emit = defineEmits(['close']);

async function handleUpdate(dadosDoFormulario) {

    if (!dadosDoFormulario.id && editarAtividade.value?.id) {
        dadosDoFormulario.id = editarAtividade.value.id;
    }

    if (dadosDoFormulario.turma && typeof dadosDoFormulario.turma === 'object') {
        dadosDoFormulario.turma_id_fk = dadosDoFormulario.turma.id;
    }

    if (dadosDoFormulario.badge && typeof dadosDoFormulario.badge === 'object') {
        dadosDoFormulario.badge_id = dadosDoFormulario.badge.id;
    }
    if (props.hideTurma && editarAtividade.value?.turma) {
        if (!dadosDoFormulario.turma_id_fk) {
            dadosDoFormulario.turma_id_fk = editarAtividade.value.turma.id;
        }
        // ...
    }

    try {
        await atividadesStore.updateAtividade(dadosDoFormulario);

        $q.notify({
            message: 'Atividade atualizada com sucesso!',
            color: 'positive',
            icon: 'check'
        });
        emit('close');
    } catch (error) {
        console.error('Erro no update:', error);
        console.log('Detalhes do erro:', error.response?.data);

        $q.notify({
            message: 'Erro ao atualizar: ' + (error.response?.data?.detail || error.message || 'Erro desconhecido'),
            color: 'negative',
            icon: 'error'
        });
    }
}

const open = (atividade) => {
    editarAtividade.value = JSON.parse(JSON.stringify(atividade));
};

defineExpose({ open });
</script>
