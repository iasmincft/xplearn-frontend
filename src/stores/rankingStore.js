import { defineStore, acceptHMRUpdate } from 'pinia'
import { listRanking } from 'src/services/rankingService'

export const useRankingStore = defineStore('ranking', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        filtroAtual: 'geral'
    }),

    actions: {
        async fetchRanking(turmaId = null) {
            this.loading = true
            this.error = null

            if (turmaId) this.filtroAtual = turmaId;

            try {
                const resposta = await listRanking(turmaId)
                const alunos = Array.isArray(resposta) ? resposta : (resposta.data || [])

                this.items = alunos.sort((a, b) => {
                    if (b.nivel !== a.nivel) {
                        return b.nivel - a.nivel
                    }
                    return b.xp - a.xp
                })

            } catch (err) {
                this.error = 'Falha ao buscar ranking.'
                console.error('Erro ao buscar ranking:', err)
                this.items = []
            } finally {
                this.loading = false
            }
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRankingStore, import.meta.hot))
}
