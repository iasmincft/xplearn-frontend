// Composable estilo hook para consumir o domínio de Atividades
// Pode ser usado diretamente nas páginas, ou em conjunto com o store

import { computed } from 'vue'
import { useAtividadesStore } from 'src/stores/atividadesStore'

export function useAtividades() {
  const store = useAtividadesStore()

  const atividades = computed(() => store.items)
  const pendentes = computed(() => store.atividadesPendentes)
  const vencidas = computed(() => store.atividadesVencidas)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  return {
    atividades,
    pendentes,
    vencidas,
    atividadesPorTurma: store.atividadesPorTurma,
    atividadesPorBadge: store.atividadesPorBadge,
    loading,
    error,
    fetchAtividades: store.fetchAtividades,
    addAtividade: store.addAtividade,
    updateAtividade: store.updateAtividade,
    deleteAtividade: store.deleteAtividade,
  }
}
