<template>
    <q-page v-if="turma" class="q-pa-xl">
        <q-btn
            to="/turmas"
            icon="chevron_left"
            flat
            round
            dense
        />
        <div class="row q-pl-xl">
            <div class="text-h5 text-bold col">{{ turma.nome }}</div>
            <div class="text-h5 col">Professor: {{ turma.professor }}</div>
        </div>
        <div class="row q-pl-xl">
            <div class="text-h5 q-pt-lg q-mb-md col-shrink">Atividades</div>
            
        </div>
        <div class="row q-pl-xl">
            <div class="text-h5 q-pt-lg q-mb-md col-shrink">Alunos</div>
        </div>

    </q-page>

</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';

const route = useRoute();
const turmaStore = useTurmaStore();

const turmaId = Number(route.params.id);

const turma = computed(() => turmaStore.getTurmaById(turmaId));

</script>
