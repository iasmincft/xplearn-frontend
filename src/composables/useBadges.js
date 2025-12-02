// Composable estilo hook para consumir o domínio de Badges
import { computed } from 'vue'
import { useBadgeStore } from 'src/stores/badgeStore'

export function useBadges() {
  const store = useBadgeStore()

  return {
    badges: computed(() => store.items),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    fetchBadges: store.fetchBadges,
    addBadge: store.addBadge,
    updateBadge: store.updateBadge,
    deleteBadge: store.deleteBadge,
  }
}

