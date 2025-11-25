import { defineStore, acceptHMRUpdate } from 'pinia'
import { listBadges, createBadge, updateBadge, deleteBadge } from 'src/services/badgesService'

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
        this.items = await listBadges()
      } catch (err) {
        this.error = 'Falha ao buscar badges da API.'
        console.error('Erro ao buscar badges:', err)
        // Fallback para localStorage se API falhar
        const localData = JSON.parse(localStorage.getItem('badge'))
        if (localData) {
          this.items = localData
        } else {
          this.items = [{ id: 1, nome: 'Mestre dos Algoritmos', badge: '/icons/iconxplearn.png' }]
        }
      } finally {
        this.loading = false
      }
    },

    async addBadge(novoBadge) {
      try {
        const created = await createBadge(novoBadge)
        this.items.unshift(created)
      } catch (err) {
        this.error = 'Falha ao adicionar badge.'
        console.error('Erro ao adicionar badge:', err)
        throw err
      }
    },

    async updateBadge(badgeAtualizado) {
      try {
        const index = this.items.findIndex(item => item.id === badgeAtualizado.id)
        if (index === -1) {
          throw new Error("Badge não encontrado localmente.")
        }
        const updated = await updateBadge(badgeAtualizado)
        this.items[index] = updated ?? badgeAtualizado
      } catch (err) {
        this.error = 'Falha ao atualizar badge.'
        console.error('Erro ao atualizar badge:', err)
        throw err
      }
    },

    async deleteBadge(idParaDeletar) {
      try {
        await deleteBadge(idParaDeletar)
        this.items = this.items.filter(item => item.id !== idParaDeletar)
      } catch (err) {
        this.error = 'Falha ao deletar badge.'
        console.error('Erro ao deletar badge:', err)
        throw err
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBadgeStore, import.meta.hot))
}
