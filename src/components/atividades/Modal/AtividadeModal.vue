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

                <ModalTurmaSelect v-model:turmaId="localAtividade.turma_id_fk" />

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
        default: null,
    },
});

const emit = defineEmits(['close', 'save-atividade']);

const $q = useQuasar();
const formRef = ref(null);
const localAtividade = reactive({
    nome: '',
    descricao: null,
    nota_max: null,
    pontos: null,
    turma_id_fk: null,
    badge_id_fk: null,
    data_entrega: '',
});

const isDirty = ref(false);

const isEditing = computed(() => !!props.atividade);

// Função para converter data DD/MM/YYYY para ISO datetime
function converterDataParaISO(dataStr) {
    if (!dataStr) return null;

    // Se já estiver no formato ISO, retorna
    if (dataStr.includes('T') || dataStr.includes('Z')) {
        return dataStr;
    }

    // Converte DD/MM/YYYY para ISO
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        // Cria data com hora 23:59:59 para data de entrega
        const dataISO = new Date(`${ano}-${mes}-${dia}T23:59:59`);
        return dataISO.toISOString();
    }

    return dataStr;
}

// Função para converter ISO datetime para DD/MM/YYYY
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
        // Mapeia os campos da atividade para o formulário
        Object.assign(localAtividade, {
            id: newVal.id,
            nome: newVal.nome || '',
            descricao: newVal.descricao || null,
            nota_max: newVal.nota_max || null,
            pontos: newVal.pontos || null,
            turma_id_fk: newVal.turma_id_fk || null,
            badge_id_fk: newVal.badge_id_fk || null,
            data_entrega: converterISOparaData(newVal.data_entrega),
        });
        isDirty.value = false;
    } else {
        // Reset para uma nova atividade
        Object.assign(localAtividade, {
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
        const atividadeComparavel = {
            ...originalAtividade,
            data_entrega: originalDataFormatada
        };
        isDirty.value = JSON.stringify(newVal) !== JSON.stringify(atividadeComparavel);
    } else {
        // Para novas atividades, verifica se os campos obrigatórios foram preenchidos
        isDirty.value = !!(newVal.nome && newVal.nota_max !== null && newVal.pontos !== null &&
            newVal.turma_id_fk !== null && newVal.badge_id_fk !== null && newVal.data_entrega);
    }
}, { deep: true });

function saveAtividade() {
    formRef.value.validate().then((success) => {
        if (success) {
            // Prepara os dados para enviar ao backend
            const atividadeParaSalvar = {
                nome: localAtividade.nome,
                descricao: localAtividade.descricao || null,
                nota_max: Number.parseFloat(localAtividade.nota_max),
                pontos: Number.parseInt(localAtividade.pontos, 10),
                turma_id_fk: Number.parseInt(localAtividade.turma_id_fk, 10),
                badge_id_fk: Number.parseInt(localAtividade.badge_id_fk, 10),
                data_entrega: converterDataParaISO(localAtividade.data_entrega),
            };

            // Se estiver editando, adiciona o ID
            if (isEditing.value && props.atividade.id) {
                atividadeParaSalvar.id = props.atividade.id;
            }

            emit('save-atividade', atividadeParaSalvar);
            emit('close');
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
            ok: {
                push: true,
                color: 'positive'
            },
            cancel: {
                color: 'negative',
                push: true
            },
            persistent: true,
        }).onOk(() => {
            emit('close');
        }).onCancel(() => {
            // O usuário cancelou, não faz nada
        });
    } else {
        emit('close');
    }
};

</script>