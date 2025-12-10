<template>
  <q-page class="q-pa-lg column no-wrap">
    <div class="q-pl-xl">

      <div v-if="!userStore.isProfessor">
        <div class="text-h5">Minhas Conquistas</div>

        <div v-if="badgeStore.userItems.length === 0" class="q-pt-md text-grey">
          Nenhum badge conquistado ainda.
        </div>

        <div v-else class="row q-pt-md q-gutter-sm">
          <div
            v-for="badge in badgeStore.userItems"
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
import { onMounted, computed } from 'vue';
import { useBadgeStore } from 'src/stores/badgeStore';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/userStore';

const badgeStore = useBadgeStore();

const userStore = useUserStore();

const emptySlot = '/emptyBadgeSlot.png'
const maxSlots = computed(() => {
  return badgeStore.items ? badgeStore.items.length : 0;
});

const BASE_URL_AXIOS = api.defaults.baseURL;


const getBadgeImage = (indexOrItem) => {
  let item;

  if (typeof indexOrItem === 'object') {
    item = indexOrItem;
  } else {
    item = badgeStore.items && badgeStore.items[indexOrItem];
  }

  const pathDoBanco = item ? item.caminho_foto : null;

  if (!item || !pathDoBanco) {
    return emptySlot;
  }

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`;

  return `${baseUrl}/static${path}`;
};

const getBadgeName = (index) => {
  const item = badgeStore.items && badgeStore.items[index];
  return item ? item.nome : 'Slot Vazio';
};

onMounted(async () => {
    const promises = [badgeStore.fetchBadges()];

    if (userStore.isAluno && userStore.currentUser?.matricula) {
        promises.push(badgeStore.fetchUserBadges(userStore.currentUser.matricula));
    }

    await Promise.all(promises);
});
</script>
