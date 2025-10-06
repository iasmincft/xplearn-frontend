<template>
  <q-page class="q-pa-xl column no-wrap" >
    <q-tabs v-model="tabAtividades" align="justify" indicator-color="grey-3" active-color="white" >
      <q-tab name="pendentes" label="Pendentes" />
      <q-tab name="concluidas" label="Concluídas" />
    </q-tabs>

    <div class="col relative-position">
      <q-tab-panels 
        v-model="tabAtividades" 
        animated 
        class="bg-transparent absolute-full"
        >
        <q-tab-panel name="pendentes" class="q-pa-none">
          <q-scroll-area class="fit">
            <q-list class="q-pa-md">
              <AtividadePendente />
            </q-list>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="concluidas" class="q-pa-none">
          <q-scroll-area class="fit">
            <q-list class="q-pa-md">
              <AtividadeCompleta />
            </q-list>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>

</template>

<script setup>
import { ref } from 'vue';
import AtividadePendente from 'src/components/Atividades/AtividadePendente.vue';
import AtividadeCompleta from 'src/components/Atividades/AtividadeCompleta.vue';

const tabAtividades = ref('pendentes');

</script>

<style scoped>

</style>