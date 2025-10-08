<template>
  <q-page class="q-pa-xl column no-wrap" >
    
    <!-- Cabeçalho com botão de criar (apenas professor) -->
    <div class="row items-center q-mb-md">
      <q-tabs 
        v-model="tabAtividades" 
        class="col"
        align="justify" 
        indicator-color="grey-3" 
        active-color="white" 
      >
        <q-tab name="pendentes" label="Pendentes" />
        <q-tab name="concluidas" label="Concluídas" />
      </q-tabs>
      
      <!-- Botão criar atividade - Apenas Professor -->
      <q-btn
        v-if="permissions.can.criarAtividade.value"
        unelevated
        color="primary"
        icon="add"
        label="Nova Atividade"
        @click="handleCriarAtividade"
        class="q-ml-md"
      />
    </div>

    <div class="col relative-position">
      <q-tab-panels
        v-model="tabAtividades"
        animated
        class="bg-transparent absolute-full"
      >
        <q-tab-panel name="pendentes" class="q-pa-none">
          <q-scroll-area class="fit q-pa-md">
            <AtividadeLista
              v-if="atividadesStore.atividadesPendentes.length > 0"
              :atividades="atividadesStore.atividadesPendentes"
              @ver="handleVerAtividade"
              @editar="handleEditarAtividade"
              @deletar="handleDeletarAtividade"
              @concluir="handleConcluirAtividade"
              @ver-submissoes="handleVerSubmissoes"
            />
            <div v-else class="fit flex flex-center text-center column">
              <q-icon name="assignment" size="64px" color="grey-7" />
              <div class="text-grey-5 q-mt-md">Nenhuma atividade pendente.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="concluidas" class="q-pa-none">
          <q-scroll-area class="fit q-pa-md">
            <AtividadeLista
              v-if="atividadesStore.atividadesCompletas.length > 0"
              :atividades="atividadesStore.atividadesCompletas"
              @ver="handleVerAtividade"
              @editar="handleEditarAtividade"
              @deletar="handleDeletarAtividade"
              @concluir="handleConcluirAtividade"
              @ver-submissoes="handleVerSubmissoes"
            />
            <div v-else class="fit flex flex-center text-center column">
              <q-icon name="task_alt" size="64px" color="grey-7" />
              <div class="text-grey-5 q-mt-md">Nenhuma atividade concluída.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import { usePermissions } from 'src/composables/usePermissions';
import AtividadeLista from 'src/components/Atividades/AtividadeLista.vue';

const tabAtividades = ref('pendentes');
const route = useRoute();
const atividadesStore = useAtividadesStore();
const permissions = usePermissions();
const $q = useQuasar();

onMounted(() => {
  if (route.query.tab) {
    tabAtividades.value = route.query.tab;
  }
});

// Handler: Ver atividade
const handleVerAtividade = (atividade) => {
  $q.dialog({
    title: atividade.titulo,
    message: `
      <div class="q-pa-md">
        <p><strong>Data:</strong> ${atividade.data}</p>
        <p><strong>Descrição:</strong> ${atividade.descricao || 'Sem descrição'}</p>
        <p><strong>Valor:</strong> ${atividade.valor || 0} XP</p>
        <p><strong>Status:</strong> ${atividade.concluida ? 'Concluída' : 'Pendente'}</p>
      </div>
    `,
    html: true,
    ok: {
      label: 'Fechar',
      color: 'primary'
    }
  });
};

// Handler: Editar atividade (Professor)
const handleEditarAtividade = (atividade) => {
  // TODO: Abrir dialog/modal de edição
  $q.notify({
    type: 'info',
    message: `Editando: ${atividade.titulo}`,
    caption: 'Esta funcionalidade será implementada em breve'
  });
};

// Handler: Deletar atividade (Professor)
const handleDeletarAtividade = (atividade) => {
  // TODO: Implementar remoção no store
  $q.notify({
    type: 'negative',
    message: `Atividade "${atividade.titulo}" deletada`,
    icon: 'delete'
  });
};

// Handler: Concluir atividade (Aluno)
const handleConcluirAtividade = (atividadeId) => {
  atividadesStore.alternarConcluida(atividadeId);
  $q.notify({
    type: 'positive',
    message: 'Status da atividade atualizado',
    icon: 'check_circle'
  });
};

// Handler: Ver submissões (Professor)
const handleVerSubmissoes = (atividade) => {
  // TODO: Navegar para página de submissões
  $q.notify({
    type: 'info',
    message: `Visualizando submissões de: ${atividade.titulo}`,
    caption: 'Esta funcionalidade será implementada em breve'
  });
};

// Handler: Criar nova atividade (Professor)
const handleCriarAtividade = () => {
  // TODO: Abrir dialog/modal de criação
  $q.notify({
    type: 'info',
    message: 'Criar nova atividade',
    caption: 'Esta funcionalidade será implementada em breve'
  });
};
</script>