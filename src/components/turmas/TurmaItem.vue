<template>
    <q-card class="bg-dark-page text-white q-mb-md q-pl-lg q-pr-sm turma-card row" flat>
        
            <q-card-section class="col-gutter-md col">
                <div class="text-bold text-h6">{{ turma.nome }}</div>
                <div class="text-grey-5 q-pl-md">{{ turma.professor }}</div>
            </q-card-section>
            <q-card-actions >
                <q-btn 
                    flat 
                    color="primary" 
                    label="Acessar Turma" 
                    :to="`/turma/${turma.id}`"
                />
            </q-card-actions>
        
    </q-card>
</template>

<script setup>
defineProps({
    turma: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.turma-card {
    border-radius: 8px;
    border-left: 5px solid $primary;
    transition: transform 0.2s ease-in-out;
}

.turma-card:hover {
    transform: translateX(3px);
}
</style>
