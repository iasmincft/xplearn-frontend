// Composable estilo hook para consumir o domínio de Ranking
import { computed } from 'vue'
import { useRankingStore } from 'src/stores/rankingStore'

export function useRanking() {
  const store = useRankingStore()

  return {
    ranking: computed(() => store.items),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    fetchRanking: store.fetchRanking,
    addRanking: store.addRanking,
    updateRanking: store.updateRanking,
    deleteRanking: store.deleteRanking,
  }
}

