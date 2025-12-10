<template>
  <div class="col-12" v-if="alunos && alunos.length > 0">
    <q-list bordered separator class="rounded-borders bg-dark-page">
      <q-item v-for="aluno in alunos" :key="aluno.matricula" class="q-py-md">

        <q-item-section avatar>
          <q-avatar>
            <img v-if="aluno.avatar" :src="resolveAvatarPath(aluno.avatar.caminho_foto)">
            <q-icon v-else name="person" color="grey-5" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-white text-subtitle1">{{ aluno.nome }}</q-item-label>
          <q-item-label caption class="text-grey-5">
            @{{ aluno.nickname }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn icon="close" flat round dense color="negative" class=" q-ma-sm" v-close-popup>
            <q-tooltip>Remover aluno</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <div v-else class="text-grey q-pa-md">
    Nenhum aluno matriculado nesta turma.
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios';

defineProps({
  alunos: {
    type: Array,
    required: true,
    default: () => []
  }
});

const BASE_URL_AXIOS = api.defaults.baseURL;

const resolveAvatarPath = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}/static${cleanPath}`;
};
</script>
