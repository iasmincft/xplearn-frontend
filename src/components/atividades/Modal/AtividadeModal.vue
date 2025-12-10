<template>
    <q-card>
        <ModalHeader @close="closeModal">{{ isEditing ? 'Editar Atividade' : 'Nova Atividade' }}</ModalHeader>

        <q-card-section class="q-pa-md">
            <q-form @submit.prevent="saveAtividade" class="q-gutter-md" ref="formRef">

                <ModalNomeAti v-model:nome="localAtividade.nome" />

                <ModalDescricao v-model:descricao="localAtividade.descricao" />

                <div class="row q-gutter-md">
                    <div class="col">
                        <ModalNotaMax v-model:notaMax="localAtividade.nota_max" />
                    </div>
                    <div class="col">
                        <ModalPontos v-model:pontos="localAtividade.pontos" />
                    </div>
                </div>

                <div v-if="!hideTurma">
                    <ModalTurmaSelect v-model:turmaId="localAtividade.turma_id_fk" />
                </div>

                <ModalBadgeSelect v-model:badgeId="localAtividade.badge_id_fk" />

                <ModalData v-model:data="localAtividade.data_entrega" @open-date-picker="setDefaultDate" />

                <ModalButtons :is-dirty="isDirty" />

            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import ModalHeader from './Shared/ModalHeader.vue';
import ModalNomeAti from './Shared/ModalNomeAti.vue';
import ModalData from './Shared/ModalData.vue';
import ModalDescricao from './Shared/ModalDescricao.vue';
import ModalNotaMax from './Shared/ModalNotaMax.vue';
import ModalPontos from './Shared/ModalPontos.vue';
import ModalTurmaSelect from './Shared/ModalTurmaSelect.vue';
import ModalBadgeSelect from './Shared/ModalBadgeSelect.vue';
import ModalButtons from './Shared/ModalButtons.vue';

const props = defineProps({
  atividade: {
    type: Object,
    required: true
  },
  hideTurma: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save-atividade']);

const $q = useQuasar();
const formRef = ref(null);
const localAtividade = reactive({
  id: null,
  nome: '',
  descricao: null,
  nota_max: null,
  pontos: null,
  turma_id_fk: null,
  badge_id_fk: null,
  data_entrega: '',
});

const isDirty = ref(false);

const isEditing = computed(() => !!props.atividade && !!props.atividade.id);

function converterDataParaISO(dataStr) {
    if (!dataStr) return null;
    if (dataStr.includes('T') || dataStr.includes('Z')) return dataStr;
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        const dataISO = new Date(`${ano}-${mes}-${dia}T23:59:59`);
        return dataISO.toISOString();
    }
    return dataStr;
}

function converterISOparaData(dataISO) {
    if (!dataISO) return '';
    try {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch {
        return dataISO;
    }
}

watch(() => props.atividade, (newVal) => {
    if (newVal) {
        // Tenta pegar o ID da FK ou do objeto aninhado
        const turmaId = newVal.turma_id_fk || (newVal.turma ? newVal.turma.id : null);
        const badgeId = newVal.badge_id_fk || (newVal.badge ? newVal.badge.id : null);

        Object.assign(localAtividade, {
            id: newVal.id,
            nome: newVal.nome || '',
            descricao: newVal.descricao || null,
            nota_max: newVal.nota_max || null,
            pontos: newVal.pontos || null,
            turma_id_fk: turmaId,
            badge_id_fk: badgeId,
            data_entrega: converterISOparaData(newVal.data_entrega),
        });
        isDirty.value = false;
    } else {
        Object.assign(localAtividade, {
            id: null,
            nome: '',
            descricao: null,
            nota_max: null,
            pontos: null,
            turma_id_fk: null,
            badge_id_fk: null,
            data_entrega: '',
        });
        isDirty.value = false;
    }
}, { immediate: true });

watch(localAtividade, (newVal) => {
    if (props.atividade) {
        const originalAtividade = { ...props.atividade };
        const originalDataFormatada = converterISOparaData(originalAtividade.data_entrega);

        const originalTurmaId = originalAtividade.turma_id_fk || (originalAtividade.turma?.id);
        const originalBadgeId = originalAtividade.badge_id_fk || (originalAtividade.badge?.id);

        const atividadeComparavel = {
            id: originalAtividade.id,
            nome: originalAtividade.nome,
            descricao: originalAtividade.descricao,
            nota_max: originalAtividade.nota_max,
            pontos: originalAtividade.pontos,
            turma_id_fk: originalTurmaId,
            badge_id_fk: originalBadgeId,
            data_entrega: originalDataFormatada
        };

        const currentValClean = {
            id: newVal.id,
            nome: newVal.nome,
            descricao: newVal.descricao,
            nota_max: newVal.nota_max,
            pontos: newVal.pontos,
            turma_id_fk: newVal.turma_id_fk,
            badge_id_fk: newVal.badge_id_fk,
            data_entrega: newVal.data_entrega
        };

        isDirty.value = JSON.stringify(currentValClean) !== JSON.stringify(atividadeComparavel);
    } else {
        isDirty.value = !!(newVal.nome && newVal.nota_max && newVal.pontos);
    }
}, { deep: true });

function saveAtividade() {
    formRef.value.validate().then((success) => {
        if (success) {

            // CORREÇÃO 2: Conversão segura de dados para evitar NaN
            const atividadeParaSalvar = {
                id: localAtividade.id,
                nome: localAtividade.nome,
                descricao: localAtividade.descricao || null,
                nota_max: localAtividade.nota_max ? Number.parseFloat(localAtividade.nota_max) : null,
                pontos: localAtividade.pontos ? Number.parseInt(localAtividade.pontos, 10) : null,

                // Evita NaN se estiver vazio
                turma_id_fk: localAtividade.turma_id_fk ? Number.parseInt(localAtividade.turma_id_fk, 10) : null,
                badge_id_fk: localAtividade.badge_id_fk ? Number.parseInt(localAtividade.badge_id_fk, 10) : null,

                data_entrega: converterDataParaISO(localAtividade.data_entrega),
            };

            emit('save-atividade', atividadeParaSalvar);

        } else {
            $q.notify({
                message: 'Preencha todos os campos obrigatórios.',
                color: 'negative',
                icon: 'warning',
            });
        }
    });
}

function setDefaultDate() {
    if (!localAtividade.data_entrega) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        localAtividade.data_entrega = `${day}/${month}/${year}`;
    }
}

const closeModal = () => {
    if (isDirty.value) {
        $q.dialog({
            title: 'Descartar alterações?',
            message: 'Você fez alterações. Deseja fechar sem salvar?',
            ok: { push: true, color: 'positive' },
            cancel: { color: 'negative', push: true },
            persistent: true,
        }).onOk(() => {
            emit('close');
        }).onCancel(() => {});
    } else {
        emit('close');
    }
};
</script>
