<template>
    <q-page v-if="turma" class="q-pa-xl">
        <q-btn to="/turmas" icon="chevron_left" flat round dense />

        <div class="row q-pl-xl">
            <div class="text-h5 text-bold col">{{ turma.nome }}</div>
            <div class="text-h5 col">Professor: {{ turma.professor }}</div>
        </div>

        <div class="row q-pl-xl">
            <div class="col-12 row items-center justify-between q-pt-lg q-mb-md">
                <div class="text-h5">Atividades</div>
                <q-btn
                  color="primary"
                  icon="add_task"
                  label="Adicionar atividade"
                  @click="console.log('Botão adicionar clicado')"
                />
            </div>

            <div v-if="atividades && atividades.length > 0" class="col-12">
                <AtividadeLista
                    :atividades="atividades"
                    @editar-atividade="abrirModalEdicao"
                />
            </div>

            <div v-else class="col-12 text-grey q-pa-md">
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

        <q-dialog v-model="showEditarAtividade">
            <EditarAtividade
                ref="editarAtividadeRef"
                :hide-turma="true"
                @close="showEditarAtividade = false"
            />
        </q-dialog>

    </q-page>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';
import { useAtividadesStore } from 'src/stores/atividadesStore';

import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';
import ListaAlunos from 'src/components/turmas/componentes/ListaAunos.vue';
import EditarAtividade from 'src/components/atividades/Modal/EditarAtividade.vue';

const route = useRoute();
const turmaStore = useTurmaStore();
const atividadesStore = useAtividadesStore();
const turmaId = Number(route.params.id);

const showEditarAtividade = ref(false);
const editarAtividadeRef = ref(null);

const turma = computed(() => turmaStore.getTurmaById(turmaId));

const alunosDaTurma = computed(() => {
    return turma.value?.alunos || [];
});

const atividades = computed(() => {
  return atividadesStore.atividadesPorTurma(turmaId);
});

function abrirModalEdicao(atividade) {
  console.log('Recebido pedido de edição para:', atividade);

  showEditarAtividade.value = true;

  nextTick(() => {
    if (editarAtividadeRef.value) {
      console.log('Modal encontrado, abrindo formulário...');
      editarAtividadeRef.value.open(atividade);
    } else {
      console.error('ERRO: Modal de edição não foi encontrado. Verifique o ref="editarAtividadeRef"');
    }
  });
}

onMounted(async () => {
  if (turmaStore.items.length === 0) {
      await turmaStore.fetchTurmas();
  }
  await atividadesStore.fetchAtividades();
});
</script>
