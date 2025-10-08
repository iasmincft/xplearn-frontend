<template>
    <q-page>
        <q-item class="q-list-bordered">
            <q-card class="bg-dark-page text-white"  flat>
                <q-card-section> {{turma.nome}} </q-card-section>
                <q-card-section> {{turma.professor}} </q-card-section>
            </q-card>
        </q-item>
    </q-page>
</template>

<script setup>
defineProps({
    turma: {
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
    transition: border-radius 0.3s ease-in-out;
}
</style>