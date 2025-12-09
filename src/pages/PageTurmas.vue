<template>
  <q-page class="q-pa-xl column no-wrap">

    <TurmaItem
      v-for="turma in turmaStore.minhasTurmas"
      :key="turma.id"
      :turma="turma"
    />

    <div v-if="!turmaStore.loading && turmaStore.minhasTurmas.length === 0" class="text-grey q-mt-md">
      Nenhuma turma encontrada para você.
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[50, 50]"
      v-if="userStore.isProfessor"
    >
      <q-btn
        fab
        icon="add"
        color="accent"
        @click="showAddTurma = true"
      />
    </q-page-sticky>

    <q-dialog v-model="showAddTurma">
      <AddTurma @close="showAddTurma = false" />
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';
import { useUserStore } from 'src/stores/userStore';
import TurmaItem from 'src/components/turmas/TurmaItem.vue';
import AddTurma from 'src/components/turmas/AddTurma.vue';

const turmaStore = useTurmaStore();
const userStore = useUserStore();
const showAddTurma = ref(false);

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await turmaStore.fetchTurmas();

  if (route.query.nova === 'true') {
    showAddTurma.value = true;

    router.replace({ path: '/turmas', query: {} });
  }

});
</script>
