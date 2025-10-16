<template>
    <q-input 
        autofocus 
        :model-value="nome"  
        @update:model-value="$emit('update:nome', $event)"
        label="Nome Atividade" 
        id="atividade-nome"
        nome="atividadeNome"
        filled 
        clearable
        :rules="[val => !!val || 'Campo obrigatório']"
        ref="nomeInput"
        v-select-all
    />
</template>

<script setup>
import { ref } from 'vue';
import { selectAllDirective } from 'src/directives/selectAll';

const vSelectAll = selectAllDirective;

defineProps({
    nome: {
        type: String,
        required: true
    }
});

const nomeInput = ref(null);

defineEmits(['update:nome']);

</script>