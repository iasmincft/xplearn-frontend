import { defineStore, acceptHMRUpdate } from 'pinia'

export const useTurmaStore = defineStore('turma', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('turma')) || [
            { id: 1, nome: 'Turma A', professor: 'Professor 1' },
            { id: 2, nome: 'Turma B', professor: 'Professor 2' },
            { id: 3, nome: 'Turma C', professor: 'Professor 3' },
        ],
    }),
    getters: {

    },
    actions: {

        salvarNoLocalStorage() {
            localStorage.setItem('turma', JSON.stringify(this.items))
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTurmaStore, import.meta.hot))
}

