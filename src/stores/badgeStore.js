import { defineStore, acceptHMRUpdate } from 'pinia'
import { listBadges, listBadgesDoAluno } from 'src/services/badgesService'


export const useBadgeStore = defineStore('badge', {
  state: () => ({
    items: [],
    userItems: [],
    loading: false,
    error: null,
  }),
  getters: {
    hasBadge: (state) => (badgeId) => {
        return state.userItems.some(b => b.id === badgeId)
    }
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

    async fetchUserBadges(matricula) {
      if (!matricula) return;

      this.loading = true
      try {
        const resposta = await listBadgesDoAluno(matricula)
        this.userItems = Array.isArray(resposta) ? resposta : []
      } catch (err) {
        console.error('Erro ao buscar badges do aluno:', err)
        this.userItems = []
      } finally {
        this.loading = false
      }
    }

  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBadgeStore, import.meta.hot))
}
