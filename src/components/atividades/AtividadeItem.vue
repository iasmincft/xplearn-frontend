<template>
  <q-expansion-item class="q-list-bordered" header-class="q-pa-lg">

    <template v-slot:header>

      <q-item-section avatar>
        <q-icon color="primary" name="assignment" class="text-h5" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ atividade.nome }}</q-item-label>
        <q-item-label caption class="text-grey-5">Entrega: {{ formatarData(atividade.data_entrega) }}</q-item-label>
      </q-item-section>

      <q-item-section avatar>
        <q-btn v-if="userStore.isProfessor" :class="{ 'bg-dark': menuAberto }" icon="more_horiz" class="text-h5" flat
          dense size="md" />
        <q-menu v-model="menuAberto" anchor="bottom right" self="bottom left" class="bg-dark q-pa-xs">
          <q-item-section avatar>
            <q-btn v-if="userStore.isProfessor" color="white" icon="edit" class="text-h5" flat dense size="md"
              label="Editar" @click.stop="$emit('editar-atividade', atividade)" />
          </q-item-section>
          <q-item-section avatar>
            <q-btn v-if="userStore.isProfessor" color="white" icon="delete" class="text-h5" flat dense size="md"
              label="Deletar" @click.stop="$emit('deletar-atividade', atividade)" />
          </q-item-section>
        </q-menu>
      </q-item-section>



    </template>

    <q-card class="bg-dark-page text-white q-pl-md" flat>

      <q-card-section v-if="atividade.descricao">
        <div class="text-body2">{{ atividade.descricao }}</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-body2 text-grey-5">Sem descrição</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center q-gutter-md">

          <div class="col-auto">
            <div class="text-caption text-grey-5">Nota Máxima:</div>
            <div class="text-body1" style="line-height: 40px">{{ atividade.nota_max || '-' }}</div>
          </div>

          <div class="col-auto">
            <div class="text-caption text-grey-5">Pontos XP:</div>
            <div class="text-body1" style="line-height: 40px">{{ atividade.pontos || '-' }}</div>
          </div>

          <div class="col-auto">
            <div class="text-caption text-grey-5">Badge:</div>
            <div v-if="atividade.badge" >
              <q-img
                :src="getBadgeSrc(atividade.badge)"
                width="40px"
                height="40px"
                style="border-radius: 4px;"
              >
                <q-tooltip>{{ atividade.badge.nome }}</q-tooltip>
              </q-img>
            </div>
          </div>

        </div>
      </q-card-section>

    </q-card>

  </q-expansion-item>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from 'src/stores/userStore';
import { api } from 'src/boot/axios';

const userStore = useUserStore();


defineProps({
  atividade: {
    type: Object,
    required: true
  }
})
const menuAberto = ref(false);
defineEmits(['editar-atividade', 'deletar-atividade'])

const BASE_URL_AXIOS = api.defaults.baseURL;

function getBadgeSrc(badge) {
  if (!badge) return '';

  const pathDoBanco = badge.caminho_foto;

  if (pathDoBanco.startsWith('http')) return pathDoBanco;

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`;

  return `${baseUrl}/static${path}`;
}

function formatarData(dataISO) {
  if (!dataISO) return ''
  const data = new Date(dataISO)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss">
.q-list-bordered {
  background-color: $dark-page;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: border-radius 0.3s ease-in-out;
}
</style>
