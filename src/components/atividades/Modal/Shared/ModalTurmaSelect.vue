<template>
  <q-select filled :model-value="turmaId" @update:model-value="$emit('update:turmaId', $event)" :options="turmasOptions"
    label="Turma" id="turma_id_fk" name="turma_id_fk" option-label="label" option-value="value" emit-value map-options
    :rules="[val => val !== null && val !== '' || 'Campo obrigatório']" :loading="loading" clearable>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhuma turma disponível
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTurmaStore } from 'src/stores/turmaStore';

defineProps({
  turmaId: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:turmaId']);

const turmaStore = useTurmaStore();

const loading = computed(() => turmaStore.loading);

const turmasOptions = computed(() => {
  return turmaStore.items.map(turma => ({
    label: turma.nome,
    value: turma.id
  }));
});

onMounted(async () => {
  if (turmaStore.items.length === 0) {
    await turmaStore.fetchTurmas();
  }
});
</script>
