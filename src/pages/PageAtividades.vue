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
            <AtividadeLista 
              v-if="atividadesStore.atividadesPendentes.length > 0"
              :atividades="atividadesStore.atividadesPendentes" 
              @toggle-atividade="atividadesStore.alternarConcluida" 
            />
            <div v-else class="fit flex flex-center text-center column">
              <div class="text-grey-5 q-mt-md">Nada por aqui.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="concluidas" class="q-pa-none">
          <q-scroll-area class="fit q-pa-md">
            <AtividadeLista v-if="atividadesStore.atividadesCompletas.length > 0"
              :atividades="atividadesStore.atividadesCompletas" @toggle-atividade="atividadesStore.alternarConcluida" />
            <div v-else class="fit flex flex-center text-center column">
              <div class="text-grey-5 q-mt-md">Nada por aqui.</div>
            </div>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-page-sticky position="bottom-right" :offset="[50, 50]" v-if="userStore.isProfessor">
      <q-btn fab icon="add" color="accent" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import { useUserStore } from 'src/stores/userStore';
import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';


const userStore = useUserStore();
const tabAtividades = ref('pendentes');
const route = useRoute();
const atividadesStore = useAtividadesStore();

onMounted(() => {
  if (route.query.tab) {
    tabAtividades.value = route.query.tab;
  }
});
</script>