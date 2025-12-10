<template>
    <q-card-section class="row">
        <div class="text-h6 text-primary"><slot></slot></div>
        <q-space />
        <q-btn
            flat
            round
            dense
            color="primary"
            icon="close" 
            @click="$emit('close')"
        />
    </q-card-section>
</template>

<script setup>
defineEmits(['close']);
</script>
