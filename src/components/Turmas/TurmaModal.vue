<template>
    <q-card>
        <ModalHeader @close="closeModal">{{ isEditing ? 'Editar Turma' : 'Nova Turma' }}</ModalHeader>

        <q-card-section class="q-pa-md">
            <q-form @submit.prevent="saveTurma" class="q-gutter-md" ref="formRef">

                <ModalNome v-model:nome="localTurma.name" />

                <ModalProf v-model:professor="localTurma.professor"/>

                <ModalButtons :is-dirty="isDirty" />

            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import ModalHeader from './Shared/ModalHeader.vue';
import ModalNome from './Shared/ModalNome.vue';
import ModalProf from './Shared/ModalProf.vue';
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
const localTurma = reactive({
    name: '',
    professor: '',
    descricao: '',
    completed: false,
});

const isDirty = ref(false);

const isEditing = computed(() => !!props.atividade);

watch(() => props.atividade, (newVal) => {
    if (newVal) {
        Object.assign(localTurma, newVal);
        isDirty.value = false;
    } else {
        // Reset para uma nova tarefa
        Object.assign(localTurma, {
            name: '',
            professor: '',
            descricao: '',
            completed: false,
        });
    }
}, { immediate: true });

watch(localTurma, (newVal) => {
    if (props.atividade) {
        const originalTurma = { ...props.atividade };
        isDirty.value = JSON.stringify(newVal) !== JSON.stringify(originalTurma);
    } else {
        // Para novas tarefas, verifica se o nome foi preenchido
        isDirty.value = !!newVal.name;
    }
}, { deep: true });

function saveTurma() {
    formRef.value.validate().then((success) => {
        if (success) {
            emit('save-atividade', { ...localTurma });
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

watch(
    () => localTurma.professor,
    (newVal) => {
        if (!newVal) {
            localTurma.descricao = '';
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