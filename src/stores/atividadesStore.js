import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  listAtividades,
  createAtividade,
  updateAtividade as updateAtividadeService,
  deleteAtividade as deleteAtividadeService,
} from 'src/services/atividadesService'
import { useUserStore } from './userStore'
import { useTurmaStore } from './turmaStore'
import { api } from 'src/boot/axios'

export const useAtividadesStore = defineStore('atividades', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    minhasAtividades: (state) => {
      const userStore = useUserStore()
      const turmaStore = useTurmaStore()

      if (userStore.isAluno) {
        return state.items
      }

      const meusTurmaIds = turmaStore.minhasTurmas.map(turma => turma.id)
      return state.items.filter(atividade => {
        if (!atividade) return false
        const turmaId = atividade.turma?.id || atividade.turma_id_fk
        return turmaId && meusTurmaIds.includes(turmaId)
      })
    },

    atividadesPendentes() {
      const userStore = useUserStore()

      if (userStore.isProfessor) {
        const agora = new Date()
        return this.minhasAtividades.filter(a => new Date(a.data_entrega) > agora)
      }

      return this.minhasAtividades.filter(a => !a.fez_atividade)
    },

    atividadesConcluidas() {
      const userStore = useUserStore()

      if (userStore.isProfessor) {
        const agora = new Date()
        return this.minhasAtividades.filter(a => new Date(a.data_entrega) <= agora)
      }

      return this.minhasAtividades.filter(a => a.fez_atividade)
    },

    verificarAtraso: () => (atividade) => {
      if (!atividade.data_entrega) return false
      if (atividade.fez_atividade) return false

      const agora = new Date()
      const entrega = new Date(atividade.data_entrega)
      return entrega < agora
    },

    atividadesPorTurma: (state) => (turmaId) => {
        if (!turmaId) return []
        const turmaIdNum = Number(turmaId)
        return state.items.filter(a => {
          if (!a) return false
          const atividadeTurmaId = a.turma?.id || a.turma_id_fk
          return Number(atividadeTurmaId) === turmaIdNum
        })
    }
  },
  actions: {
    async fetchAtividades() {
      this.loading = true
      this.error = null
      const userStore = useUserStore()

      try {
        if (userStore.isAluno) {
            const matricula = userStore.currentUser.matricula
            const response = await api.get(`/alunos/${matricula}/atividades`)
            this.items = response.data
        } else {
            const data = await listAtividades()
            this.items = data
        }
      } catch (err) {
        this.error = 'Falha ao buscar atividades.'
        console.error('Erro ao buscar atividades:', err)
      } finally {
        this.loading = false
      }
    },

    async addAtividade(novaAtividade) {
      const created = await createAtividade(novaAtividade)
      this.items.unshift(created)
    },

    async updateAtividade(atividadeAtualizada) {
      const index = this.items.findIndex(item => item.id === atividadeAtualizada.id)
      if (index !== -1) {
          const updated = await updateAtividadeService(atividadeAtualizada)
          this.items[index] = updated ?? atividadeAtualizada
      }
    },

    async deleteAtividade(id) {
      await deleteAtividadeService(id)
      this.items = this.items.filter(item => item.id !== id)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAtividadesStore, import.meta.hot))
}
