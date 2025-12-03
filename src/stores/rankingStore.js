import { defineStore, acceptHMRUpdate } from 'pinia'
import { listRanking } from 'src/services/rankingService' 

export const useRankingStore = defineStore('ranking', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
    }),
    
    actions: {
        async fetchRanking() {
            this.loading = true
            this.error = null
            try {
                const resposta = await listRanking()
                const alunos = Array.isArray(resposta) ? resposta : (resposta.data || [])
            
                this.items = alunos.sort((a, b) => {
                    if (b.nivel !== a.nivel) {
                        return b.nivel - a.nivel // Decrescente por Nível
                    }
                    return b.xp - a.xp // Decrescente por XP (Desempate)
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