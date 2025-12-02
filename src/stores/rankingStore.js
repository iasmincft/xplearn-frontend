import { defineStore, acceptHMRUpdate } from 'pinia'
import { listRanking, createRanking, updateRanking, deleteRanking } from 'src/services/rankingService'

export const useRankingStore = defineStore('ranking', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
    }),
    getters: {

    },
    actions: {
        async fetchRanking() {
            this.loading = true
            this.error = null
            try {
                this.items = await listRanking()
            } catch (err) {
                this.error = 'Falha ao buscar ranking da API.'
                console.error('Erro ao buscar ranking:', err)
                // Fallback para localStorage se API falhar
                const localData = JSON.parse(localStorage.getItem('ranking'))
                if (localData) {
                    this.items = localData
                }
            } finally {
                this.loading = false
            }
        },

        async addRanking(novoRanking) {
            try {
                const created = await createRanking(novoRanking)
                this.items.unshift(created)
            } catch (err) {
                this.error = 'Falha ao adicionar ranking.'
                console.error('Erro ao adicionar ranking:', err)
                throw err
            }
        },

        async updateRanking(rankingAtualizado) {
            try {
                const index = this.items.findIndex(item => item.id === rankingAtualizado.id)
                if (index === -1) {
                    throw new Error("Ranking não encontrado localmente.")
                }
                const updated = await updateRanking(rankingAtualizado)
                this.items[index] = updated ?? rankingAtualizado
            } catch (err) {
                this.error = 'Falha ao atualizar ranking.'
                console.error('Erro ao atualizar ranking:', err)
                throw err
            }
        },

        async deleteRanking(idParaDeletar) {
            try {
                await deleteRanking(idParaDeletar)
                this.items = this.items.filter(item => item.id !== idParaDeletar)
            } catch (err) {
                this.error = 'Falha ao deletar ranking.'
                console.error('Erro ao deletar ranking:', err)
                throw err
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRankingStore, import.meta.hot))
}

