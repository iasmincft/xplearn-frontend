import { defineStore, acceptHMRUpdate } from 'pinia'
import { listTurmas, createTurma, updateTurma, deleteTurma } from 'src/services/turmasService'
import { useUserStore } from 'src/stores/userStore'

export const useTurmaStore = defineStore('turma', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
    }),
    getters: {
        getTurmaById: (state) => {
            return (id) => state.items.find(item => item.id === id)
        },

        minhasTurmas: (state) => {
            const userStore = useUserStore()
            const user = userStore.currentUser

            if (!user) return []

            return state.items.filter(turma => {


                if (userStore.isProfessor) {
                    return turma.professor === user.nome
                }

                if (userStore.isAluno) {
                    if (turma.alunos && Array.isArray(turma.alunos)) {
                        return turma.alunos.some(aluno => aluno.id === user.id)
                    }
                    return false
                }

                return false
            })
        }
    },
    actions: {
        async fetchTurmas() {
            this.loading = true
            this.error = null
            try {
                this.items = await listTurmas()
            } catch (err) {
                this.error = 'Falha ao buscar turmas da API.'
                console.error('Erro ao buscar turmas:', err)
                const localData = JSON.parse(localStorage.getItem('turma'))
                if (localData) {
                    this.items = localData
                }
            } finally {
                this.loading = false
            }
        },

        async addTurma(novaTurma) {
            try {
                const created = await createTurma(novaTurma)
                this.items.unshift(created)
            } catch (err) {
                this.error = 'Falha ao adicionar turma.'
                console.error('Erro ao adicionar turma:', err)
                throw err
            }
        },

        async updateTurma(turmaAtualizada) {
            try {
                const index = this.items.findIndex(item => item.id === turmaAtualizada.id)
                if (index === -1) {
                    throw new Error("Turma não encontrada localmente.")
                }
                const updated = await updateTurma(turmaAtualizada)
                this.items[index] = updated ?? turmaAtualizada
            } catch (err) {
                this.error = 'Falha ao atualizar turma.'
                console.error('Erro ao atualizar turma:', err)
                throw err
            }
        },

        async deleteTurma(idParaDeletar) {
            try {
                await deleteTurma(idParaDeletar)
                this.items = this.items.filter(item => item.id !== idParaDeletar)
            } catch (err) {
                this.error = 'Falha ao deletar turma.'
                console.error('Erro ao deletar turma:', err)
                throw err
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTurmaStore, import.meta.hot))
}

