import { defineStore, acceptHMRUpdate } from 'pinia'
import { listBadges } from 'src/services/badgesService'


export const useBadgeStore = defineStore('badge', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {

  },
  actions: {
    async fetchBadges() {
      this.loading = true
      this.error = null
      try {
        const resposta = await listBadges()
        this.items = Array.isArray(resposta) ? resposta : []
      } catch (err) {
        this.error = 'Falha ao buscar badges da API.'
        console.error('Erro ao buscar badges:', err)
        this.items = []
      } finally {
        this.loading = false
      }
    },

  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBadgeStore, import.meta.hot))
}
