<template>
    <q-input
        autofocus
        :model-value="professor"
        @update:model-value="$emit('update:professor', $event)"
        label="Nome Professor"
        id="turma-professor"
        nome="turmaProfessor"
        filled
        clearable
        :rules="[val => !!val || 'Campo obrigatório']"
        ref="professorInput"
        v-select-all
    />
</template>

<script setup>
import { ref } from 'vue';
import { selectAllDirective } from 'src/directives/selectAll';

const vSelectAll = selectAllDirective;

defineProps({
    professor: {
        type: String,
        required: true
    }
});

const professorInput = ref(null);

defineEmits(['update:professor']);

</script>
