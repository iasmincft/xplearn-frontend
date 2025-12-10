<template>
    <q-card>
        <ModalHeader @close="closeModal">{{ isEditing ? 'Editar Turma' : 'Nova Turma' }}</ModalHeader>

        <q-card-section class="q-pa-md">
            <q-form @submit.prevent="saveTurma" class="q-gutter-md" ref="formRef">

                <ModalNome v-model:nome="localTurma.nome" />

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
import ModalButtons from './Shared/ModalButtons.vue';

const props = defineProps({
    turma: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['close', 'save-turma']);
const $q = useQuasar();
const formRef = ref(null);
const localTurma = reactive({
    nome: ''
});

const isDirty = ref(false);

const isEditing = computed(() => !!props.turma);

watch(() => props.turma, (newVal) => {
    if (newVal) {
        localTurma.nome = newVal.nome || newVal.name || '';
        isDirty.value = false;
    } else {
        Object.assign(localTurma, {
            nome: '',
        });
    }
}, { immediate: true });

watch(localTurma, (newVal) => {
    if (props.turma) {
        const originalTurma = { ...props.turma };
        isDirty.value = newVal.nome !== originalTurma.nome;
    } else {
        isDirty.value = !!newVal.nome;
    }
}, { deep: true });

function saveTurma() {
    formRef.value.validate().then((success) => {
        if (success) {
            emit('save-turma', { ...localTurma });
            emit('close');
        } else {
            $q.notify({
                message: 'A turma precisa ter um nome.',
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
            message: 'Você fez alterações. Deseja fechar sem salvar?',
            ok: {
                push: true,
                color: 'positive',
                label: 'Sim'
            },
            cancel: {
                color: 'negative',
                push: true,
                label: 'Não'
            },
            persistent: true,
        }).onOk(() => {
            emit('close');
        });
    } else {
        emit('close');
    }
};

</script>

<style scoped></style>
