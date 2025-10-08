<template>
  <q-page class="q-pa-xl column no-wrap">
    
    <TurmaItem 
      v-for="turma in turmaStore.items"
      :key="turma.id"
      :turma="turma"
    />
  </q-page>
</template>

<script setup>
import TurmaItem from 'src/components/Turmas/TurmaItem.vue';
import { useTurmaStore } from 'src/stores/turmaStore';

const turmaStore = useTurmaStore();
</script>
