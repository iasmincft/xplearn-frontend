<template>
  <q-select
    filled
    :model-value="badgeId"
    @update:model-value="$emit('update:badgeId', $event)"
    :options="badgesOptions"
    label="Badge"
    id="badge_id_fk"
    name="badge_id_fk"
    option-label="label"
    option-value="value"
    emit-value
    map-options
    :rules="[val => val !== null && val !== '' || 'Campo obrigatório']"
    :loading="loading"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-img 
            :src="getBadgeUrl(scope.opt.caminho_foto)" 
            width="30px" 
            height="30px"
            style="border-radius: 4px;"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
        <div class="row items-center q-gutter-x-sm" v-if="scope.opt">
            <q-img 
                :src="getBadgeUrl(scope.opt.caminho_foto)" 
                width="24px" 
                height="24px"
                style="border-radius: 4px;"
            />
            <span>{{ scope.opt.label }}</span>
        </div>
    </template>

  </q-select>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useBadgeStore } from 'src/stores/badgeStore';
import { api } from 'src/boot/axios'; 

defineProps({
  badgeId: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:badgeId']);

const badgeStore = useBadgeStore();
const BASE_URL_AXIOS = api.defaults.baseURL;

const loading = computed(() => badgeStore.loading);

const badgesOptions = computed(() => {
  return badgeStore.items.map(badge => ({
    label: badge.nome,
    value: badge.id,
    caminho_foto: badge.caminho_foto 
  }));
});

function getBadgeUrl(pathDoBanco) {
  if (!pathDoBanco) return '';
  
  if (pathDoBanco.startsWith('http')) return pathDoBanco;

  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
  const path = pathDoBanco.startsWith('/') ? pathDoBanco : `/${pathDoBanco}`;

  return `${baseUrl}/static${path}`;
}

onMounted(async () => {
  if (badgeStore.items.length === 0) {
    await badgeStore.fetchBadges();
  }
});
</script>