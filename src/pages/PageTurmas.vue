<template>
  <q-page class="q-pa-xl column no-wrap">
    
    <TurmaItem 
      v-for="turma in turmaStore.items"
      :key="turma.id"
      :turma="turma"
    />

    <q-page-sticky position="bottom-right" :offset="[50, 50]" v-if="userStore.isProfessor">
      <q-btn 
        fab 
        icon="add" 
        color="accent"
        @click="showAddTurma = true"
        />
    </q-page-sticky>
    
    <q-dialog v-model="showAddTurma">
      <AddTurma @close="showAddTurma = false"/>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { useTurmaStore } from 'src/stores/turmaStore';
import { useUserStore } from 'src/stores/userStore';
import TurmaItem from 'src/components/Turmas/TurmaItem.vue';
import AddTurma from 'src/components/Turmas/AddTurma.vue';
import { ref } from 'vue';

const turmaStore = useTurmaStore();
const userStore = useUserStore();
const showAddTurma = ref(false);
</script>
