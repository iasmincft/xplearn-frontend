<template>
  <q-page class="q-pa-lg column no-wrap">

    <div class="text-h5 q-pt-lg q-mb-md col-shrink">Ranking</div>

    <div class="row justify-end items-center q-mr-xl q-mb-md">
      <RankingFilter
        v-model="selectedFilter"
        :options="filterOptions"
      />
    </div>

    <div v-if="rankingStore.loading || loadingTurmas" class="row justify-center q-pa-md">
      <q-spinner color="primary" size="3em" />
    </div>

    <q-table
      v-else
      class="sticky-header-table"
      :rows="formattedRows"
      :columns="rankingColumns"
      row-key="id"
      flat
      dark
      hide-bottom
      card-class="bg-dark-page q-mx-xl"
      separator="none"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :pagination="{ rowsPerPage: 0 }"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="openStudentDetails(props.row)"
          >

          <q-td key="pos" :props="props" style="width: 80px; min-width: 80px;">
            <q-chip
              dense
              :color="props.row.chipColor"
              :text-color="props.row.chipColor === 'transparent' ? 'white' : 'dark'"
              class="text-weight-bold"
            >
              {{ props.row.pos }}
            </q-chip>
          </q-td>

          <q-td key="aluno" :props="props">
            {{ props.row.aluno }}
          </q-td>

          <q-td key="nivel" :props="props" class="text-right">
            Lv. {{ props.row.nivel }} <span class="text-caption text-grey-5">({{ props.row.xp }} XP)</span>
          </q-td>

        </q-tr>
      </template>

    </q-table>

    <div v-if="!rankingStore.loading && rankingStore.items.length === 0" class="text-center text-grey q-mt-md">
      Nenhum aluno no ranking ainda.
    </div>

    <q-dialog v-model="showDetailsDialog">
      <view-aluno-ranking :student="selectedStudent" />
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRankingStore } from 'src/stores/rankingStore'
import { useTurmaStore } from 'src/stores/turmaStore'
import viewAlunoRanking from 'src/components/alunoRanking/viewAlunoRanking.vue'
import RankingFilter from 'src/components/alunoRanking/RankingFilter.vue'

const rankingStore = useRankingStore()
const turmaStore = useTurmaStore()

const showDetailsDialog = ref(false)
const selectedStudent = ref(null)
const selectedFilter = ref('geral')
const loadingTurmas = ref(false)

const rankingColumns = [
  { name: 'pos', align: 'left', label: 'POS.', field: 'pos', style: 'width: 80px; min-width: 80px' },
  { name: 'aluno', align: 'left', label: 'ALUNO', field: 'aluno' },
  { name: 'nivel', align: 'right', label: 'NÍVEL (XP)', field: 'nivel' },
]

const filterOptions = computed(() => {
  const options = [
    { label: 'Ranking Geral', value: 'geral' }
  ]

  if (turmaStore.minhasTurmas && turmaStore.minhasTurmas.length > 0) {
    turmaStore.minhasTurmas.forEach(turma => {
      options.push({
        label: turma.nome || `Turma ${turma.id}`,
        value: turma.id
      })
    })
  }

  return options
})

const getChipColor = (index) => {
  switch (index) {
    case 0: return 'amber-6'
    case 1: return 'grey-5'
    case 2: return 'brown-5'
    default: return 'transparent'
  }
}

const formattedRows = computed(() => {
  if (!rankingStore.items) return []

  let filteredItems = rankingStore.items

  if (selectedFilter.value !== 'geral') {
    const turmaSelecionada = turmaStore.items.find(t => t.id === selectedFilter.value)

    if (turmaSelecionada && turmaSelecionada.alunos) {
      const alunosIdsDaTurma = new Set(turmaSelecionada.alunos.map(a => a.id))

      filteredItems = filteredItems.filter(item => {
        const itemId = item.id || item.matricula
        return alunosIdsDaTurma.has(itemId)
      })
    } else {

      filteredItems = []
    }
  }

  return filteredItems.map((item, index) => {
    return {
      id: item.id || item.matricula,
      pos: `${index + 1}º`,
      aluno: item.nome,
      nivel: item.nivel,
      xp: item.xp,
      chipColor: getChipColor(index),
      avatar: item.avatar || null,
      badges: item.badges || []
    }
  })
})

onMounted(async () => {
  loadingTurmas.value = true
  await Promise.all ([
    rankingStore.fetchRanking(),
    turmaStore.fetchTurmas()
  ])
  loadingTurmas.value = false
})

const openStudentDetails = (row) => {
  selectedStudent.value = row
  showDetailsDialog.value = true
  }

</script>

<style lang="sass">
.sticky-header-table
  height: 530px
  max-height: calc(100vh - 200px)

  &::-webkit-scrollbar
    width: 8px
    height: 8px

  &::-webkit-scrollbar-track
    background: transparent

  &::-webkit-scrollbar-thumb
    background: #027be3
    border-radius: 9px
    opacity: 0.2

  /* Remove padding padrão do rodapé do Quasar */
  .q-table__bottom
    padding: 0
    border-top: none

  .q-table__top,
  thead tr:first-child th
    background-color: #162646

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  .q-table__middle
    max-height: inherit
</style>
