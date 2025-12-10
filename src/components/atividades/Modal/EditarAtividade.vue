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

    if (props.hideTurma && editarAtividade.value?.turma) {

        if (!dadosDoFormulario.turma_id_fk) {
            dadosDoFormulario.turma_id_fk = editarAtividade.value.turma.id;
        }

        if (!dadosDoFormulario.turma) {
            dadosDoFormulario.turma = editarAtividade.value.turma;
        }
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
        $q.notify({
            message: 'Erro ao atualizar: ' + (error.message || 'Verifique o console'),
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
