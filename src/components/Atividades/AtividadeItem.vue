<template>
  <q-expansion-item
    class="q-list-bordered"
    header-class="q-pa-lg"
  >

    <template v-slot:header>
      
      <q-item-section avatar>
        <q-icon color="primary" name="assignment" class="text-h5" />
      </q-item-section>
      
      <q-item-section>
        <q-item-label>{{ atividade.titulo }}</q-item-label>
        <q-item-label caption class="text-grey-5">Entrega: {{ atividade.data }}</q-item-label>
      </q-item-section>

      <!-- Ações baseadas em permissões -->
      <q-item-section side>
        <div class="row q-gutter-sm">
          
          <!-- Botão Ver - Todos podem ver -->
          <q-btn
            v-if="permissions.can.visualizarAtividade.value"
            flat
            round
            dense
            color="primary"
            icon="visibility"
            @click.stop="handleVer"
          >
            <q-tooltip>Ver detalhes</q-tooltip>
          </q-btn>

          <!-- Botão Editar - Apenas Professor -->
          <q-btn
            v-if="permissions.can.editarAtividade.value"
            flat
            round
            dense
            color="warning"
            icon="edit"
            @click.stop="handleEditar"
          >
            <q-tooltip>Editar atividade</q-tooltip>
          </q-btn>

          <!-- Botão Deletar - Apenas Professor -->
          <q-btn
            v-if="permissions.can.deletarAtividade.value"
            flat
            round
            dense
            color="negative"
            icon="delete"
            @click.stop="handleDeletar"
          >
            <q-tooltip>Deletar atividade</q-tooltip>
          </q-btn>

          <!-- Checkbox Concluir - Apenas Aluno -->
          <q-checkbox
            v-if="permissions.can.concluirAtividade.value"
            :model-value="atividade.concluida"
            @update:model-value="handleConcluir"
            @click.stop
            color="positive"
            size="md"
          >
            <q-tooltip>Marcar como concluída</q-tooltip>
          </q-checkbox>

        </div>
      </q-item-section>

      </template>

    <q-card class="bg-dark-page text-white q-pl-md" flat>

    <q-card-section>
      <div class="text-subtitle2 text-grey-5">Descrição</div>
      <div class="q-mt-sm">
        {{ atividade.descricao || 'Sem descrição disponível.' }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row items-center q-gutter-md">

        <div class="col-auto">
          <div class="text-grey-5">Valor:</div>
          <div class="text-weight-bold">{{ atividade.valor || '0' }} XP</div>
        </div>

        <q-separator vertical />

        <div class="col-auto">
          <div class="text-grey-5">Prêmio:</div>
          <div class="text-weight-bold">{{ atividade.premio || 'Nenhum' }}</div>
        </div>

        <q-separator vertical />

        <div class="col-auto">
          <div class="text-grey-5">Badge:</div>
          <div class="text-weight-bold">{{ atividade.badge || 'Nenhum' }}</div>
        </div>

      </div>
    </q-card-section>

    <!-- Ações no rodapé (apenas para professor) -->
    <q-card-actions v-if="permissions.isProfessor.value" align="right" class="q-px-md q-pb-md">
      <q-btn
        flat
        color="primary"
        label="Ver Submissões"
        icon-right="arrow_forward"
        @click="handleVerSubmissoes"
      />
    </q-card-actions>

  </q-card>

  </q-expansion-item>
</template>

<script setup>
import { usePermissions } from 'src/composables/usePermissions'
import { useQuasar } from 'quasar'

const props = defineProps({
  atividade: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['ver', 'editar', 'deletar', 'concluir', 'ver-submissoes'])

const permissions = usePermissions()
const $q = useQuasar()

// Handlers para as ações
const handleVer = () => {
  emit('ver', props.atividade)
}

const handleEditar = () => {
  emit('editar', props.atividade)
}

const handleDeletar = () => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja deletar a atividade "${props.atividade.titulo}"?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'Deletar',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    emit('deletar', props.atividade)
  })
}

const handleConcluir = () => {
  emit('concluir', props.atividade.id)
}

const handleVerSubmissoes = () => {
  emit('ver-submissoes', props.atividade)
}
</script>

<style lang="scss">
.q-list-bordered {
  background-color: $dark-page;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: border-radius 0.3s ease-in-out;
}


</style>