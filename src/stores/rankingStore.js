import { defineStore, acceptHMRUpdate } from 'pinia'

export const useRankingStore = defineStore('ranking', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('ranking')) || [
            { id: 1, nome: 'Ranking A', professor: 'Professor 1' },
            { id: 2, nome: 'Ranking B', professor: 'Professor 2' },
            { id: 3, nome: 'Ranking C', professor: 'Professor 3' },
        ],
    }),
    getters: {

    },
    actions: {

        salvarNoLocalStorage() {
            localStorage.setItem('ranking', JSON.stringify(this.items))
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRankingStore, import.meta.hot))
}

