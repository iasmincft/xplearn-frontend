// Composable estilo hook para consumir o domínio de Avatares
import { computed } from 'vue'
import { useAvatarStore } from 'src/stores/avatarStore'

export function useAvatares() {
  const store = useAvatarStore()

  return {
    avatares: computed(() => store.items),
    selectedAvatarId: computed(() => store.selectedAvatarId),
    selectedAvatarUrl: computed(() => store.selectedAvatarUrl),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    getAvatarById: store.getAvatarById,
    fetchAvatares: store.fetchAvatares,
    setAvatar: store.setAvatar,
    clearAvatar: store.clearAvatar,
  }
}

