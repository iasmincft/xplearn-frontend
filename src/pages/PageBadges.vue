<template>
  <q-page class="q-pa-lg column no-wrap">
    <div class="q-pl-xl">
      <div class="text-h5">Minhas Conquistas</div>
      <div v-if="userBadges.length === 0" class="q-pt-md text-grey">
        Nenhum badge conquistado ainda.
      </div>
      <div v-else class="row q-pt-md q-gutter-sm">
        <div
          v-for="badge in userBadges"
          :key="`user-badge-${badge.id}`"
        >
          <q-img
            :src="getBadgeImage(badge)"
            width="100px"
            height="100px"
            style="border-radius: 8px;"
          >
            <q-tooltip>
              {{ badge.nome }}
            </q-tooltip>
          </q-img>
        </div>
      </div>

      <div class="text-h5 q-pt-xl">Badges disponíveis</div>
      <div class="row q-pt-md q-gutter-sm">
        <div
          v-for="index in maxSlots"
          :key="`slot-${index}`"
        >
          <q-img
            :src="getBadgeImage(index - 1)"
            width="100px"
            height="100px"
            style="border-radius: 8px;"
          >
            <q-tooltip>
              {{ getBadgeName(index - 1) }}
            </q-tooltip>
          </q-img>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useBadgeStore } from 'src/stores/badgeStore';
import { api } from 'src/boot/axios';


const badgeStore = useBadgeStore();
const userBadges = ref([]);
const emptySlot = '/emptyBadgeSlot.png'
const maxSlots= computed(() => {
  return badgeStore.items ? badgeStore.items.length : 0;
});

const BASE_URL_AXIOS = api.defaults.baseURL;


const getBadgeImage = (index) => {
  const item = badgeStore.items && badgeStore.items[index];
  const pathDoBanco = item ? item.caminho_foto : null;

  if (!item || !pathDoBanco) {
    return emptySlot;
  }

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`;
  const fullUrl = `${baseUrl}/static${path}`;

  return fullUrl
};

const getBadgeName = (index) => {
  const item = badgeStore.items && badgeStore.items[index];
  return item ? item.nome : 'Slot Vazio';
};

onMounted(async () => {
    await badgeStore.fetchBadges();
});
</script>
