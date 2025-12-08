<template>
    <q-page v-if="turma" class="q-pa-xl">
        <q-btn to="/turmas" icon="chevron_left" flat round dense />

        <div class="row q-pl-xl">
            <div class="text-h5 text-bold col">{{ turma.nome }}</div>
            <div class="text-h5 col">Professor: {{ turma.professor }}</div>
        </div>

        <div class="row q-pl-xl">
            <div class="text-h5 q-pt-lg q-mb-md col-12">Atividades</div>
            <div v-if="atividades && atividades.length > 0" class="col-12">
                <AtividadeLista v-if="atividadesStore" :atividades="atividadesStore" />
            </div>
            <div v-else class="text-grey q-pa-md">
                Nenhuma atividade encontrada.
            </div>
        </div>

        <div class="row q-pl-xl q-mt-lg">
            <div class="text-h5 q-mb-md col-12">Alunos Matriculados</div>

            <div class="col-12" v-if="alunos && alunos.length > 0">
                <q-list bordered separator class="rounded-borders bg-grey-9">
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
                                Nível {{ aluno.nivel || 1 }}
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge color="primary">{{ aluno.xp || 0 }} XP</q-badge>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

            <div v-else class="text-grey q-pa-md">
                Nenhum aluno matriculado nesta turma.
            </div>
        </div>

    </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmaStore } from 'src/stores/turmaStore';
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeLista from 'src/components/atividades/AtividadeLista.vue';
import { api } from 'src/boot/axios';

const route = useRoute();
const turmaStore = useTurmaStore();
const atividadesStore = useAtividadesStore();
const turmaId = Number(route.params.id);

const turma = computed(() => turmaStore.getTurmaById(turmaId));

const alunos = computed(() => {
    return turma.value?.alunos || [];
});

const atividades = computed(() => {
  return atividadesStore.atividadesPorTurma(turmaId);
});


const BASE_URL_AXIOS = api.defaults.baseURL;
const resolveAvatarPath = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/static${cleanPath}`;
};

onMounted(async () => {
  if (turmaStore.items.length === 0) {
      await turmaStore.fetchTurmas();
  }
  await atividadesStore.fetchAtividades();
});
</script>
