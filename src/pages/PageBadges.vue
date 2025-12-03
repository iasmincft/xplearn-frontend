<template>
  <q-page class="q-pa-lg column no-wrap">
    <div class="q-pl-xl">
      <div class="text-h5">Conquistados</div>
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
import { onMounted  } from 'vue';
import { useBadgeStore } from 'src/stores/badgeStore';
import { api } from 'src/boot/axios';


const badgeStore = useBadgeStore();

const maxSlots = 20;
const emptySlot = '/emptyBadgeSlot.png'

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
