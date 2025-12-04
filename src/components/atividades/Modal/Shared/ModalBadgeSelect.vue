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
    :loading="loading">
  </q-select>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useBadgeStore } from 'src/stores/badgeStore';

defineProps({
  badgeId: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:badgeId']);

const badgeStore = useBadgeStore();

const loading = computed(() => badgeStore.loading);

const badgesOptions = computed(() => {
  return badgeStore.items.map(badge => ({
    label: badge.nome,
    value: badge.id
  }));
});

onMounted(async () => {
  if (badgeStore.items.length === 0) {
    await badgeStore.fetchBadges();
  }
});
</script>
