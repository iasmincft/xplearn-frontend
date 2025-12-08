<template>
  <q-card class="bg-dark text-white relative-position" style="width: 350px; border-radius: 12px;">

    <q-btn
      icon="close"
      flat
      round
      dense
      color="grey-4"
      class=" q-ma-sm"
      v-close-popup
    />

    <q-card-section v-if="student" class="column items-center q-pb-none q-pt-lg">

      <q-avatar size="100px" class="shadow-5 q-mb-md bg-grey-9" style="border: 3px solid #027be3;">

        <img
          v-if="student.avatar"
          :src="resolveImage(student.avatar.caminho_foto)"
        >

        <q-icon v-else name="person" size="60px" color="grey-5" />

      </q-avatar>

      <div class="text-h6">{{ student.aluno }}</div>
      <div class="text-subtitle2 text-grey-5">Nível {{ student.nivel }}</div>

      <q-badge color="primary" class="q-mt-sm">
        {{ student.xp }} XP Total
      </q-badge>
    </q-card-section>

    <q-card-section v-if="student">
      <div class="text-subtitle2 q-mb-sm">Badges Conquistados</div>

      <div v-if="student.badges && student.badges.length > 0" class="row q-gutter-sm q-pl-md">
        <div v-for="badge in student.badges" :key="badge.id">
          <q-img
            :src="resolveImage(badge.caminho_foto)"
            width="50px"
            height="50px"
            style="border-radius: 6px;"
          >
            <q-tooltip>{{ badge.caminho_foto }}</q-tooltip>
          </q-img>
        </div>
      </div>

      <div v-else class="text-center text-grey-6 text-caption q-pa-md dashed-border">
        Nenhum badge exibido.
      </div>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';
import { api } from 'src/boot/axios';

defineProps({
  student: {
    type: Object,
    default: null
  }
});

const BASE_URL_AXIOS = api.defaults.baseURL;

const resolveImage = (path) => {

  if (!path) return null;

  if (path.startsWith('http')) return path;

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}/static${cleanPath}`;
};




</script>

<style scoped>
.dashed-border {
  border: 1px dashed #666;
  border-radius: 4px;
}
</style>
