<template>
    <q-input 
        filled 
        :model-value="descricao" 
        @update:model-value="$emit('update:descricao', $event)" 
        label="Descrição" 
        id="descricao"
        name="descricao"
        > 
    
    </q-input>
</template>

<script setup>
defineProps({
    descricao: {
        type: String,
        default: ''
    },
    showTimeField: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:descricao']);
</script>