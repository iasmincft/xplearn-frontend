import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  listAtividades,
  createAtividade,
  updateAtividade as updateAtividadeService,
  deleteAtividade as deleteAtividadeService,
} from 'src/services/atividadesService'

export const useAtividadesStore = defineStore('atividades', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    // Filtra atividades por data de entrega (pendentes = ainda não entregues)
    atividadesPendentes: (state) => {
      const agora = new Date()
      return state.items.filter(atividade => {
        const dataEntrega = new Date(atividade.data_entrega)
        return dataEntrega > agora
      })
    },
    // Atividades com data de entrega já passada
    atividadesVencidas: (state) => {
      const agora = new Date()
      return state.items.filter(atividade => {
        const dataEntrega = new Date(atividade.data_entrega)
        return dataEntrega <= agora
      })
    },
    // Filtra por turma
    atividadesPorTurma: (state) => {
      return (turmaId) => state.items.filter(a => a.turma.id === turmaId)
    },
    // Filtra por badge
    atividadesPorBadge: (state) => {
      return (badgeId) => state.items.filter(a => a.badge.id === badgeId)
    }
  },
  actions: {
    async fetchAtividades() {
      this.loading = true
      this.error = null
      try {
        const data = await listAtividades()
        this.items = data
      } catch (err) {
        this.error = 'Falha ao buscar atividades da API.'
        console.error('Erro ao buscar atividades:', err)
      } finally {
        this.loading = false
      }
    },

    async addAtividade(novaAtividade) {
      try {
        const created = await createAtividade(novaAtividade)
        this.items.unshift(created)
      } catch (err) {
        this.error = 'Falha ao adicionar atividade.'
        console.error('Erro ao adicionar atividade:', err)
        throw err;
      }
    },

    async updateAtividade(atividadeAtualizada) {
      try {
        // Encontra o item original para garantir que o ID é válido
        const index = this.items.findIndex(item => item.id === atividadeAtualizada.id)

        if (index === -1) {
          throw new Error("Atividade não encontrada localmente.")
        }

        // PUT ou PATCH via service
        const updated = await updateAtividadeService(atividadeAtualizada)

        // Atualiza o estado local após o sucesso do backend
        this.items[index] = updated ?? atividadeAtualizada

      } catch (err) {
        this.error = 'Falha ao atualizar atividade.'
        console.error('Erro ao atualizar atividade:', err)
        throw err;
      }
    },

    async deleteAtividade(idParaDeletar) {
      try {
        // DELETE via service
        await deleteAtividadeService(idParaDeletar)

        // Remove do estado local após o sucesso do backend
        this.items = this.items.filter(item => item.id !== idParaDeletar)

      } catch (err) {
        this.error = 'Falha ao deletar atividade.'
        console.error('Erro ao deletar atividade:', err)
        throw err;
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAtividadesStore, import.meta.hot))
}
