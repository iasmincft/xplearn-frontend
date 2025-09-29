<template>
  <q-page class="q-ma-xl">
    <q-tabs v-model="tabAtividades" dense class="text-grey" active-color="white" indicator-color="white"
      align="justify">
      <q-tab name="pendentes" label="Pendentes" />
      <q-tab name="concluidas" label="Concluídas" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tabAtividades" animated class="bg-transparent">
      <q-tab-panel name="pendentes">
        <q-list separator>
          <q-item v-for="(atividade, id) in atividadesPendentes" :key="id" v-ripple clickable
            @click="atividadesStore.alternarConcluida(id)" :class="{ 'bg-grey-9': atividade.concluida }">
            <q-item-section avatar>
              <q-icon color="primary" name="assignment" />
            </q-item-section>

            <q-item-section>
              <q-item-label :class="{ 'text-strike': atividade.concluida }">{{ atividade.titulo }}</q-item-label>
              <q-item-label caption class="text-grey-5">Entrega: {{ atividade.data }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat dense color="primary" label="Ver" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="concluidas">
        <q-list separator>
          <q-item v-for="(atividade, id) in atividadesConcluidas" :key="id" v-ripple clickable
            @click="atividadesStore.alternarConcluida(id)">
            <q-item-section avatar>
              <q-icon color="green" name="check_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-strike">{{ atividade.titulo }}</q-item-label>
              <q-item-label caption class="text-grey-5">Entrega: {{ atividade.data }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="Object.keys(atividadesConcluidas).length === 0" class="text-center text-grey">Nenhuma atividade
          concluída ainda.</div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useAtividadesStore } from 'src/stores/atividades.js'

const atividadesStore = useAtividadesStore()
const tabAtividades = ref('pendentes')

const atividadesPendentes = computed(() => {
  const pendentes = {}
  for (const id in atividadesStore.atividades) {
    if (!atividadesStore.atividades[id].concluida) {
      pendentes[id] = atividadesStore.atividades[id]
    }
  }
  return pendentes
})

const atividadesConcluidas = computed(() => {
  const concluidas = {}
  for (const id in atividadesStore.atividades) {
    if (atividadesStore.atividades[id].concluida) {
      concluidas[id] = atividadesStore.atividades[id]
    }
  }
  return concluidas
})
</script>