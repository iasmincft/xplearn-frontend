<template>
    <q-item class="q-list-bordered q-pa-lg">
        <q-item-section avatar>
            <q-icon color="primary" name="assignment" class="text-h5 "/>
        </q-item-section>
        <q-item-section >
            <q-item-label>{{ atividade.titulo }}</q-item-label>
            <q-item-label caption class="text-grey-5">Entrega: {{ atividade.data }}</q-item-label>          
        </q-item-section>
        <q-item-section side>
            <q-btn flat dense color="primary" icon="chevron_right" />
        </q-item-section>
    </q-item>

</template>
<script setup>
    defineProps({
    atividade: {
        type: Object,
        required: true
    }
    })
</script>


<style lang="scss">
.q-list-bordered {
    background-color: $dark-page;
    border-radius: 8px;
    margin-bottom: 8px;
}

</style>