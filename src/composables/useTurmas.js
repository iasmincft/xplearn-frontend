// Composable estilo hook para consumir o domínio de Turmas
import { computed } from 'vue'
import { useTurmaStore } from 'src/stores/turmaStore'

export function useTurmas() {
  const store = useTurmaStore()

  return {
    turmas: computed(() => store.items),
    getTurmaById: store.getTurmaById,
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    fetchTurmas: store.fetchTurmas,
    addTurma: store.addTurma,
    updateTurma: store.updateTurma,
    deleteTurma: store.deleteTurma,
  }
}

