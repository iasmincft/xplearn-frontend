<template>
  <q-page class="q-pa-xl column no-wrap">
    <q-tabs v-model="tabAtividades" align="justify" indicator-color="grey-3" active-color="white">
      <q-tab name="pendentes" label="Pendentes" />
      <q-tab name="concluidas" label="Concluídas" />
    </q-tabs>

    <div class="col relative-position q-mt-md">
      <q-tab-panels v-model="tabAtividades" animated class="bg-transparent absolute-full">
        <q-tab-panel name="pendentes" class="q-pa-none">
          <q-scroll-area class="fit q-pa-md">
            <AtividadeLista v-if="atividadesStore.atividadesPendentes && atividadesStore.atividadesPendentes.length > 0"
              :atividades="atividadesStore.atividadesPendentes" @editar-atividade="abrirModalEdicao"
              @deletar-atividade="promptToDelete" />
            <div v-else class="fit flex flex-center text-center column">
              <div class="text-grey-5 q-mt-md">Nada por aqui.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="concluidas" class="q-pa-none">
          <q-scroll-area class="fit q-pa-md">
            <AtividadeLista v-if="atividadesStore.atividadesVencidas && atividadesStore.atividadesVencidas.length > 0"
              :atividades="atividadesStore.atividadesVencidas" @editar-atividade="abrirModalEdicao"
              @deletar-atividade="promptToDelete" />
            <div v-else class="fit flex flex-center text-center column">
              <div class="text-grey-5 q-mt-md">Nada por aqui.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="showAddAtividade">
      <AddAtividade @close="showAddAtividade = false" />
    </q-dialog>

    <q-dialog v-model="showEditarAtividade">
      <EditarAtividade ref="editarAtividadeRef" @close="showEditarAtividade = false" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted, ref, nextTick } from 'vue';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import { useTurmaStore } from 'src/stores/turmaStore';
import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';
import AddAtividade from 'src/components/atividades/Modal/AddAtividade.vue';
import EditarAtividade from 'src/components/atividades/Modal/EditarAtividade.vue';
const tabAtividades = ref('pendentes');
const atividadesStore = useAtividadesStore();
const turmaStore = useTurmaStore();
const $q = useQuasar();
const showAddAtividade = ref(false);
const showEditarAtividade = ref(false);
const editarAtividadeRef = ref(null);

onMounted(async () => {
  await Promise.all([
    atividadesStore.fetchAtividades(),
    turmaStore.fetchTurmas()
  ]);
});

const promptToDelete = (atividade) => {
  const id = atividade?.id || atividade

  $q.dialog({
    title: 'Confirme para deletar',
    message: `Tem certeza que deseja deletar a atividade "${atividade?.nome || 'esta atividade'}"?`,
    ok: {
      push: true,
      color: 'positive',
      label: 'Deletar'
    },
    cancel: {
      color: 'negative',
      push: true,
      label: 'Cancelar'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await atividadesStore.deleteAtividade(id);
      $q.notify({
        message: 'Atividade deletada com sucesso!',
        color: 'positive',
        icon: 'check'
      });
    } catch (e) {
      $q.notify({
        message: 'Falha ao deletar a atividade. ' + (e.message || ''),
        color: 'negative',
        icon: 'error'
      });
    }
  }).onCancel(() => {
    // Não precisa notificar quando cancela
  });
};

function abrirModalEdicao(atividade) {
  showEditarAtividade.value = true;
  nextTick(() => {
    if (editarAtividadeRef.value) {
      editarAtividadeRef.value.open(atividade);
    }
  });
}
</script>
