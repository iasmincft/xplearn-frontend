<template>
    <q-item>
        <q-item-section>
            <q-icon color="primary" name="list" />
        </q-item-section>
        <q-item-section>
            <div class="column">
                <div class="text-h6">{{ atividade.titulo }}</div>
                <div class="text-subtitle2 text-grey-5">Entrega: {{ atividade.data }}</div>
            </div>
        </q-item-section>
        <q-item-section>
            <q-btn flat dense color="primary" label="Ver" />
        </q-item-section>
    </q-item>

</template>
<script>

</script>


<style>

</style>