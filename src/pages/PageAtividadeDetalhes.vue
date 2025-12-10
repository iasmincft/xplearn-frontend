<template>
  <q-page class="q-pa-xl">
    <div v-if="loading" class="flex flex-center" style="min-height: 400px">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="atividade">
      <!-- Cabeçalho -->
      <div class="row items-center q-mb-lg">
        <q-btn flat round icon="arrow_back" color="white" @click="$router.back()" class="q-mr-md" />
        <div class="col">
          <div class="text-h4 text-white q-mb-xs">{{ atividade.nome }}</div>
          <div class="text-body2 text-grey-5">
            {{ atividade.turma?.nome || 'Sem turma' }}
          </div>
        </div>
      </div>

      <!-- Detalhes da Atividade -->
      <q-card class="bg-dark q-mb-lg">
        <q-card-section>
          <div class="text-h6 text-white q-mb-md">Detalhes da Atividade</div>

          <div class="row q-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-5">Descrição</div>
              <div class="text-body1 text-white">{{ atividade.descricao || 'Sem descrição' }}</div>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-5">Pontos</div>
              <div class="text-body1 text-white">{{ atividade.pontos }} XP</div>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-5">Nota Máxima</div>
              <div class="text-body1 text-white">{{ atividade.nota_max }}</div>
            </div>
          </div>

          <div class="row q-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-5">Data de Entrega</div>
              <div class="text-body1 text-white">
                {{ formatDate(atividade.data_entrega) }}
              </div>
            </div>

            <div class="col-12 col-md-6" v-if="atividade.badge">
              <div class="text-caption text-grey-5">Badge</div>
              <div class="row items-center q-gutter-sm">
                <q-img v-if="atividade.badge.caminho_foto" :src="getBadgeSrc(atividade.badge)" width="40px"
                  height="40px" style="border-radius: 4px;" />
                <span class="text-body1 text-white">{{ atividade.badge.nome }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Lista de Alunos -->
      <q-card class="bg-dark">
        <q-card-section>
          <div class="text-h6 text-white q-mb-md">Alunos da Turma</div>

          <q-list v-if="alunos && alunos.length > 0" separator class="bg-dark">
            <q-item v-for="aluno in alunos" :key="aluno.matricula" class="q-pa-md">
              <q-item-section avatar>
                <q-avatar v-if="aluno.avatar?.caminho_foto" size="48px">
                  <q-img :src="getAvatarSrc(aluno.avatar)" />
                </q-avatar>
                <q-avatar v-else size="48px" color="grey-8">
                  <q-icon name="person" color="grey-5" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-white text-body1">
                  {{ aluno.nome }}
                </q-item-label>
                <q-item-label caption class="text-grey-5">
                  {{ aluno.nickname || aluno.matricula }}
                </q-item-label>
              </q-item-section>

              <q-item-section side class="row items-center q-gutter-md">
                <div v-if="aluno.fez_atividade" class="col-auto">
                  <q-input
                    v-model="aluno.nota"
                    type="number"
                    label="Nota"
                    dense
                    outlined
                    dark
                    color="primary"
                    style="width: 100px"
                    :min="0"
                    :max="atividade?.nota_max || 10"
                    :rules="[
                      val => val >= 0 || 'Nota não pode ser menor que 0',
                      val => val <= (atividade?.nota_max || 10) || `Nota não pode ser maior que ${atividade?.nota_max || 10}`
                    ]"
                    @blur="atualizarNotaAluno(aluno)"
                    @keyup.enter="atualizarNotaAluno(aluno)"
                  >
                    <template v-slot:append>
                      <q-icon name="edit" size="xs" />
                    </template>
                  </q-input>
                </div>
                <q-checkbox
                  :model-value="aluno.fez_atividade"
                  @update:model-value="toggleAlunoFezAtividade(aluno)"
                  color="primary"
                  size="md"
                >
                  <q-tooltip>
                    {{ aluno.fez_atividade ? 'Marcar como não fez' : 'Marcar como fez' }}
                  </q-tooltip>
                </q-checkbox>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center q-pa-lg">
            <div class="text-grey-5">Nenhum aluno encontrado nesta turma</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="flex flex-center column" style="min-height: 400px">
      <q-icon name="error_outline" size="4em" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-white q-mb-sm">Atividade não encontrada</div>
      <q-btn flat color="primary" label="Voltar" @click="$router.back()" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  getAtividadeById,
  getAlunosAtividade,
  marcarAlunoFezAtividade,
  desmarcarAlunoFezAtividade,
  atualizarNotaAluno as atualizarNotaAlunoService
} from 'src/services/atividadesService'
import { api } from 'src/boot/axios'

const route = useRoute()
const $q = useQuasar()

const atividade = ref(null)
const alunos = ref([])
const loading = ref(true)

const BASE_URL_AXIOS = api.defaults.baseURL

onMounted(async () => {
  const atividadeId = route.params.id
  if (!atividadeId) {
    loading.value = false
    return
  }

  try {
    await Promise.all([
      carregarAtividade(atividadeId),
      carregarAlunos(atividadeId)
    ])
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    const errorMessage = error?.response?.data?.detail || error?.message || 'Erro desconhecido'
    console.error('Detalhes do erro:', error.response?.data)
    $q.notify({
      message: `Erro ao carregar dados da atividade: ${errorMessage}`,
      color: 'negative',
      icon: 'error',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
})

async function carregarAtividade(id) {
  try {
    atividade.value = await getAtividadeById(id)
  } catch (error) {
    console.error('Erro ao carregar atividade:', error)
    console.error('Response:', error.response?.data)
    throw error
  }
}

async function carregarAlunos(id) {
  try {
    const response = await getAlunosAtividade(id)
    alunos.value = response.alunos || []
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
    console.error('Response:', error.response?.data)
    throw error
  }
}

async function toggleAlunoFezAtividade(aluno) {
  const atividadeId = route.params.id
  const estavaMarcado = aluno.fez_atividade

  try {
    if (estavaMarcado) {
      // Desmarcar - remove o registro (e a nota)
      await desmarcarAlunoFezAtividade(atividadeId, aluno.matricula)
      aluno.fez_atividade = false
      aluno.nota = null
      $q.notify({
        message: `${aluno.nome} desmarcado da atividade`,
        color: 'info',
        icon: 'info',
        position: 'top'
      })
    } else {
      // Marcar - cria registro com nota "0"
      await marcarAlunoFezAtividade(atividadeId, aluno.matricula, '0')
      aluno.fez_atividade = true
      aluno.nota = '0'
      $q.notify({
        message: `${aluno.nome} marcado como tendo feito a atividade`,
        color: 'positive',
        icon: 'check',
        position: 'top'
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar status do aluno:', error)
    $q.notify({
      message: 'Erro ao atualizar status do aluno',
      color: 'negative',
      icon: 'error'
    })
    // Reverter mudança visual em caso de erro
    aluno.fez_atividade = estavaMarcado
  }
}

async function atualizarNotaAluno(aluno) {
  const atividadeId = route.params.id
  const notaAnterior = aluno.nota

  try {
    // Converte para número e valida
    const notaNum = parseFloat(aluno.nota) || 0
    const notaMax = parseFloat(atividade.value?.nota_max) || 10
    
    // Validação no frontend
    if (notaNum < 0) {
      aluno.nota = notaAnterior
      $q.notify({
        message: 'A nota não pode ser menor que 0',
        color: 'negative',
        icon: 'error',
        position: 'top'
      })
      return
    }
    
    if (notaNum > notaMax) {
      aluno.nota = notaAnterior
      $q.notify({
        message: `A nota não pode ser maior que ${notaMax}`,
        color: 'negative',
        icon: 'error',
        position: 'top'
      })
      return
    }
    
    const nota = String(notaNum)
    
    await atualizarNotaAlunoService(atividadeId, aluno.matricula, nota)
    
    $q.notify({
      message: `Nota de ${aluno.nome} atualizada para ${nota}`,
      color: 'positive',
      icon: 'check',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('Erro ao atualizar nota do aluno:', error)
    // Reverter valor em caso de erro
    aluno.nota = notaAnterior
    const errorMessage = error?.response?.data?.detail || error?.message || 'Erro ao atualizar nota do aluno'
    $q.notify({
      message: errorMessage,
      color: 'negative',
      icon: 'error'
    })
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Não definida'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getBadgeSrc(badge) {
  if (!badge || !badge.caminho_foto) return ''

  const pathDoBanco = badge.caminho_foto

  if (pathDoBanco.startsWith('http')) return pathDoBanco

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`

  return `${baseUrl}/static${path}`
}

function getAvatarSrc(avatar) {
  if (!avatar || !avatar.caminho_foto) return ''

  const pathDoBanco = avatar.caminho_foto

  if (pathDoBanco.startsWith('http')) return pathDoBanco

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`

  return `${baseUrl}/static${path}`
}
</script>

