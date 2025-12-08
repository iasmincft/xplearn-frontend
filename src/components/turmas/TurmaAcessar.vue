<template>
    <q-page v-if="turma" class="q-pa-xl">
        <q-btn to="/turmas" icon="chevron_left" flat round dense />

        <div class="row q-pl-xl">
            <div class="text-h5 text-bold col">{{ turma.nome }}</div>
            <div class="text-h5 col">Professor: {{ turma.professor }}</div>
        </div>

        <div class="row q-pl-xl">
            <div class="text-h5 q-pt-lg q-mb-md col-12">Atividades</div>
            <div v-if="atividades && atividades.length > 0" class="col-12">
                <AtividadeLista v-if="atividadesStore" :atividades="atividadesStore" />
            </div>
            <div v-else class="text-grey q-pa-md">
                Nenhuma atividade encontrada.
            </div>
        </div>

        <div class="row q-pl-xl q-mt-lg">
          <div class="col-12 row items-center justify-between q-mb-md">
            <div class="text-h5">Alunos Matriculados</div>

            <q-btn
              color="primary"
              icon="person_add"
              label="Adicionar alunos"
            />
          </div>

          <div class="col-12">
              <ListaAlunos :alunos="alunosDaTurma" />
          </div>
        </div>

    </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';
import ListaAlunos from 'src/components/turmas/componentes/ListaAunos.vue';

const route = useRoute();
const turmaStore = useTurmaStore();
const atividadesStore = useAtividadesStore();
const turmaId = Number(route.params.id);

const turma = computed(() => turmaStore.getTurmaById(turmaId));

const alunosDaTurma = computed(() => {
    return turma.value?.alunos || [];
});

const atividades = computed(() => {
  return atividadesStore.atividadesPorTurma(turmaId);
});

onMounted(async () => {
  if (turmaStore.items.length === 0) {
      await turmaStore.fetchTurmas();
  }
  await atividadesStore.fetchAtividades();
});
</script>
