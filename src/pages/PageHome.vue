<template>
  <q-page padding>
    <div class="q-pa-md">

      <q-card rounded class="bg-dark-page q-pa-sm " flat>
        <q-card-section>
          <div class="row items-center">
            <q-avatar size="100px">
              <img src="https://cdn.quasar.dev/img/avatar.png"> </q-avatar>
            <div class="q-ml-lg">
              <div class="text-h4">Jane Doe</div>
              <div class="text-grey-5">@janedoe</div>
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-4">
              <div class="text-subtitle1">Nível X</div>
              <q-linear-progress rounded size="15px" :value="0.75" color="primary" class="q-mt-sm" />
              <div class="text-right text-caption text-grey-5 q-mt-xs">750/1000 XP</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-xl">

        <div class="col-12 col-md-7">
          
          <div class="q-mb-xl">
            <div class="text-h5 q-pt-lg q-mb-md">Atividades</div>
            <q-card rounded class="bg-dark-page" flat >
              <q-list>
                <q-item>
                  <q-chip>
                    Atividades Pendentes:
                    <q-avatar class="align-end" color="secondary" text-color="white">50</q-avatar>
                  </q-chip>
                  <
                  <q-chip>
                    Atividades Pendentes:
                    <q-avatar class="align-end" color="secondary" text-color="white">50</q-avatar>
                  </q-chip>
                </q-item>
              </q-list>
            </q-card>
            
          </div>

          <div>
            <div class="text-h5 q-mb-md">Badges</div>
            <div class="row q-gutter-md">
              <q-avatar v-for="badge in badges" :key="badge.nome" size="90px" :icon="badge.icon" :color="badge.cor" text-color="white" :style="{ opacity: badge.conquistado ? 1 : 0.4 }">
                <q-tooltip>{{ badge.nome }}</q-tooltip>
              </q-avatar>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">

          <div class="text-h5 q-pt-lg q-mb-md">Ranking da Turma</div>
          <q-table
            :rows="rankingRows"
            :columns="rankingColumns"
            row-key="aluno"
            flat
            dark
            card-class="bg-dark"
            hide-header
            hide-bottom
            separator="none"
          >
            <template v-slot:body="props">
              <q-tr :props="props" :class="{ 'bg-primary text-white': props.row.aluno === 'Jane Doe (Voce)' }">
                <q-td key="pos" :props="props">
                  <q-chip dense :color="props.row.chipColor" text-color="dark" class="text-weight-bold">{{ props.row.pos }}</q-chip>
                </q-td>
                <q-td key="aluno" :props="props">{{ props.row.aluno }}</q-td>
                <q-td key="nivel" :props="props">{{ props.row.nivel }}</q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="row justify-end q-mt-md">
            <q-btn flat color="primary" label="Ver Ranking Completo" />
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'


// Dados para a tabela de ranking
const rankingColumns = [
  { name: 'pos', align: 'left', label: 'POS.', field: 'pos' },
  { name: 'aluno', align: 'left', label: 'ALUNO', field: 'aluno' },
  { name: 'nivel', align: 'right', label: 'NÍVEL', field: 'nivel' },
]
const rankingRows = ref([
  { pos: '1º', aluno: 'Ana Maria Silva', nivel: 10, chipColor: 'amber-6' },
  { pos: '2º', aluno: 'João Paulo Santos', nivel: 8, chipColor: 'blue-grey-3' },
  { pos: '3º', aluno: 'Laura Prado', nivel: 6, chipColor: 'deep-orange-4' },
  { pos: '4º', aluno: 'Pedro Toledo', nivel: 4, chipColor: 'transparent' },
  { pos: '10º', aluno: 'Jane Doe (Voce)', nivel: 'X', chipColor: 'transparent' },
])

// Dados para os badges
const badges = ref([
  { nome: 'Mestre dos Algoritmos', icon: 'hub', cor: 'purple-6', conquistado: true },
  { nome: 'Arquiteto de Redes', icon: 'lan', cor: 'indigo-6', conquistado: true },
  { nome: 'Caçador de Bugs', icon: 'bug_report', cor: 'red-6', conquistado: true },
  { nome: 'Mestre do Tempo', icon: 'hourglass_top', cor: 'cyan-6', conquistado: true },
  { nome: 'Iniciante', icon: 'school', cor: 'blue-grey-8', conquistado: false },
])

</script>

<style lang="scss" scoped>
// Adiciona um estilo sutil ao card de atividades
.q-card {
  border-radius: 8px;
}
</style>