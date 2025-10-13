<template>
    <q-card>
        <ModalHeader @close="closeModal">{{ isEditing ? 'Editar Atividade' : 'Nova Atividade' }}</ModalHeader>

        <q-card-section class="q-pa-md">
            <q-form @submit.prevent="saveAtividade" class="q-gutter-md" ref="formRef">

                <ModalNomeAti v-model:nome="localAtividade.name" />

                <ModalData v-model:data="localAtividade.data" @open-date-picker="setDefaultDate" />

                <ModalDescricao v-model:descricao="localAtividade.descricao" />

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
import ModalButtons from './Shared/ModalButtons.vue';

const props = defineProps({
    atividade: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['close', 'salvar']);

const $q = useQuasar();
const formRef = ref(null);
const localAtividade = reactive({
    name: '',
    data: '',
    descricao: '',
    completed: false,
});

const isDirty = ref(false);

const isEditing = computed(() => !!props.atividade);

watch(() => props.atividade, (newVal) => {
    if (newVal) {
        Object.assign(localAtividade, newVal);
        isDirty.value = false;
    } else {
        // Reset para uma nova tarefa
        Object.assign(localAtividade, {
            name: '',
            data: '',
            descricao: '',
            completed: false,
        });
    }
}, { immediate: true });

watch(localAtividade, (newVal) => {
    if (props.atividade) {
        const originalAtividade = { ...props.atividade };
        isDirty.value = JSON.stringify(newVal) !== JSON.stringify(originalAtividade);
    } else {
        // Para novas tarefas, verifica se o nome foi preenchido
        isDirty.value = !!newVal.name;
    }
}, { deep: true });

function saveAtividade() {
    formRef.value.validate().then((success) => {
        if (success) {
            emit('save-atividade', { ...localAtividade });
            emit('close');
        } else {
            $q.notify({
                message: 'Não pode salvar sem um nome.',
                color: 'negative',
                icon: 'warning',
            });
        }
    });
}

function setDefaultDate() {
    if (!localAtividade.data) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        localAtividade.data = `${day}/${month}/${year}`;
    }
}

watch(
    () => localAtividade.data,
    (newVal) => {
        if (!newVal) {
            localAtividade.descricao = '';
        }
    }
);

const closeModal = () => {
    if (isDirty.value) {
        $q.dialog({
            title: 'Descartar alterações?',
            message: 'Você fez alterações. Deseja fechar sem?',
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

<style scoped></style>