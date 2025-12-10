import { defineStore, acceptHMRUpdate } from 'pinia'
import { listTurmas, createTurma, updateTurma, deleteTurma } from 'src/services/turmasService'
import { useUserStore } from 'src/stores/userStore'
import { api } from 'src/boot/axios'

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
          const matriculaMatch = turma.professor_matricula_fk && user.matricula && String(turma.professor_matricula_fk) === String(user.matricula);
          const nomeMatch = turma.professor && user.nome && turma.professor === user.nome;
          return matriculaMatch || nomeMatch;
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
        const userStore = useUserStore()

        const payload = {
          ...novaTurma,
          professor_matricula_fk: userStore.currentUser.matricula
        }

        const created = await createTurma(payload)

        if (!created.professor_matricula_fk) {
          created.professor_matricula_fk = userStore.currentUser.matricula
        }

        if (!created.professor) {
          created.professor = userStore.currentUser.nome
        }
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
        const merged = { ...this.items[index], ...(updated ?? turmaAtualizada) }
        this.items[index] = merged
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

    async adicionarAlunos(turmaId, alunosMatriculas) {
      try {
        const requests = alunosMatriculas.map(matricula =>
          api.post(`/turmas/${turmaId}/alunos/${matricula}`)
        );
        await Promise.all(requests);
        await this.fetchTurmas();
      } catch (error) {
        console.error("Erro ao matricular alunos:", error);
        throw error;
      }
    },
    async sincronizarAlunos(turmaId, alunosParaAdicionar, alunosParaRemover) {
      try {
        const promises = [];

        if (alunosParaAdicionar.length > 0) {
          alunosParaAdicionar.forEach(matricula => {
            promises.push(api.post(`/turmas/${turmaId}/alunos/${matricula}`));
          });
        }

        if (alunosParaRemover.length > 0) {
          alunosParaRemover.forEach(matricula => {
            promises.push(api.delete(`/turmas/${turmaId}/alunos/${matricula}`));
          });
        }

        await Promise.all(promises);

        await this.fetchTurmas();

      } catch (error) {
        console.error("Erro ao sincronizar alunos:", error);
        throw error;
      }
    },


    async removerAluno(turmaId, matricula) {
      await api.delete(`/turmas/${turmaId}/alunos/${matricula}`);
      await this.fetchTurmas();
      }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTurmaStore, import.meta.hot))
}

