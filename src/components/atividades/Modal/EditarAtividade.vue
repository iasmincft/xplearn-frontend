<template>
    <AtividadeModal
        v-if="editarAtividade"
        :key="editarAtividade.id"
        :atividade="editarAtividade"
        :hide-turma="hideTurma"
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
    console.log('Dados recebidos do formulário:', dadosDoFormulario);

    // 1. GARANTIA DE ID: Se o formulário não enviou ID, pegamos do original
    if (!dadosDoFormulario.id && editarAtividade.value?.id) {
        dadosDoFormulario.id = editarAtividade.value.id;
    }

    // 2. GARANTIA DA TURMA (Correção do Erro):
    // Se estamos escondendo a turma, o formulário pode ter enviado o ID zerado ou NaN.
    // Vamos restaurar o ID da turma original e o Objeto Turma original.
    if (props.hideTurma && editarAtividade.value?.turma) {

        // Garante que o ID da FK seja enviado corretamente
        if (!dadosDoFormulario.turma_id_fk) {
            dadosDoFormulario.turma_id_fk = editarAtividade.value.turma.id;
        }

        // Garante que o Objeto Turma vá junto (para a lista não quebrar visualmente após editar)
        if (!dadosDoFormulario.turma) {
            dadosDoFormulario.turma = editarAtividade.value.turma;
        }
    }

    try {
        console.log('Enviando payload FINAL para o Store:', dadosDoFormulario);

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
    // Clona profundo para garantir que temos os dados originais preservados
    editarAtividade.value = JSON.parse(JSON.stringify(atividade));
};

defineExpose({ open });
</script>
