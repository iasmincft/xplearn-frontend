<template>
  <q-page class="q-pa-lg column no-wrap">
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
  </q-page>
</template>

<script setup>

import { ref } from 'vue'


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
</script>
