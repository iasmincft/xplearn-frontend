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
                  @click="showAdicionarAtividade = true"
                />
            </div>

            <div v-if="atividades && atividades.length > 0" class="col-12">
                <AtividadeLista
                    :atividades="atividades"
                    :hide-turma="true"
                    @editar-atividade="abrirModalEdicao"
                    @deletar-atividade="confirmarExclusao"
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
              @click="showAdicionarAluno = true" 
            />
          </div>

          <div class="col-12">
              <ListaAlunos 
                :alunos="alunosDaTurma" 
                @remover-aluno="handleRemoverAluno"
              />
          </div>
        </div>

        <q-dialog v-model="showAdicionarAtividade">
            <AddAtividade 
                :turma-id="turmaId"
                @close="showAdicionarAtividade = false"
            />
        </q-dialog>
        <q-dialog v-model="showEditarAtividade">
            <EditarAtividade
                ref="editarAtividadeRef"
                :hide-turma="true"
                @close="showEditarAtividade = false"
            />
        </q-dialog>

        <q-dialog v-model="showAdicionarAluno">
            <AddAlunoTurma
                :turma-id="turmaId"
                :alunos-atuais="alunosDaTurma"
                @close="showAdicionarAluno = false"
                @alunos-adicionados="atualizarTurma"
            />
        </q-dialog>

    </q-page>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import { useQuasar } from 'quasar';
import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';
import ListaAlunos from 'src/components/turmas/componentes/ListaAunos.vue';
import AddAtividade from 'src/components/atividades/Modal/AddAtividade.vue';
import EditarAtividade from 'src/components/atividades/Modal/EditarAtividade.vue';
import AddAlunoTurma from 'src/components/turmas/modal/AddAlunoTurma.vue'; 

const route = useRoute();
const turmaStore = useTurmaStore();
const atividadesStore = useAtividadesStore();
const turmaId = Number(route.params.id);
const $q = useQuasar();

const showAdicionarAtividade = ref(false);
const showEditarAtividade = ref(false);
const showAdicionarAluno = ref(false);

const editarAtividadeRef = ref(null);

const turma = computed(() => turmaStore.getTurmaById(turmaId));

const alunosDaTurma = computed(() => {
    return turma.value?.alunos || [];
});

const atividades = computed(() => {
  return atividadesStore.atividadesPorTurma(turmaId);
});

async function atualizarTurma() {
    await turmaStore.fetchTurmas(); 
}

// --- FUNÇÃO CORRIGIDA ABAIXO ---
async function handleRemoverAluno(matricula) {
  try {
    // Removemos $q.loading para evitar erro se o plugin não estiver ativo
    await turmaStore.removerAluno(turmaId, matricula);
    
    $q.notify({
      message: 'Aluno removido com sucesso!',
      color: 'positive',
      icon: 'check'
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      message: 'Erro ao remover aluno: ' + (error.response?.data?.detail || error.message),
      color: 'negative',
      icon: 'warning'
    });
  } 
}

function abrirModalEdicao(atividade) {
  showEditarAtividade.value = true;
  nextTick(() => {
    if (editarAtividadeRef.value) {
      editarAtividadeRef.value.open(atividade);
    }
  });
}

function confirmarExclusao(atividade) {
  $q.dialog({
    title: 'Excluir Atividade',
    message: `Tem certeza que deseja excluir a atividade "${atividade.nome}"?`,
    cancel: true,
    persistent: true,
    ok: {
        label: 'Excluir',
        color: 'negative'
    }
  }).onOk(async () => {
    try {
        await atividadesStore.deleteAtividade(atividade.id); 
        $q.notify({
            message: 'Atividade excluída com sucesso',
            color: 'positive',
            icon: 'delete'
        });
    } catch (error) {
        $q.notify({
            message: 'Erro ao excluir: ' + (error.message || 'Erro desconhecido'),
            color: 'negative',
            icon: 'warning'
        });
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