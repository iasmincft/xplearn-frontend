<template>
    <q-input 
        dense 
        outlined 
        v-model="matricula" 
        label="Matrícula*" 
        type="text" 
        class="q-pb-sm"
        :rules="[
            val => !!val || 'A matrícula é obrigatória',
            val => /^\d+$/.test(val) || 'A matrícula deve conter apenas números',
            val => validaTipoUsuario(val) || 'Matrícula com número de dígitos inválido (7 ou 12)'
        ]"
        >
        <template v-slot:prepend>
            <q-icon name="check" />
        </template>
    </q-input>
</template>

<script setup>
import { ref } from 'vue';

const matricula = ref('');

const validaTipoUsuario = (valor) => {
    const length = String(valor).length;
    // A matrícula é válida se tiver 7 ou 12 dígitos.
    if (length === 7 || length === 12) {
        return true;
    }
    return false;
};
defineExpose({
    matricula,
    validaTipoUsuario
});
</script>