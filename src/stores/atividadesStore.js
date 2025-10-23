import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAtividadesStore = defineStore('atividades', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    atividadesPendentes: (state) => {
      return state.items.filter(atividade => !atividade.concluida)
    },
    atividadesCompletas: (state) => {
      return state.items.filter(atividade => atividade.concluida)
    }
  },
  actions: {
    async fetchAtividades() {
      this.loading = true
      this.error = null
      try {

        const response = await api.get('/atividades/')
        this.items = response.data
      } catch (err) {
        this.error = 'Falha ao buscar atividades da API.'
        console.error('Erro ao buscar atividades:', err)
      } finally {
        this.loading = false
      }
    },

    async alternarConcluida(idParaAlternar) {
        const atividade = this.items.find(item => item.id === idParaAlternar)
        if (atividade) {
            const atividadeModificada = { ...atividade, concluida: !atividade.concluida };
            // Chamamos a ação principal de atualização
            await this.updateAtividade(atividadeModificada); 
        }
    },
    async addAtividade(novaAtividade) {
      try {
        const response = await api.post('/atividades/', novaAtividade)
        this.items.unshift(response.data)
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

        // PUT ou PATCH para o endpoint que atualiza (ex: /atividades/1)
        await api.put(`/atividades/${atividadeAtualizada.id}`, atividadeAtualizada)

        // Atualiza o estado local após o sucesso do backend
        this.items[index] = atividadeAtualizada

      } catch (err) {
        this.error = 'Falha ao atualizar atividade.'
        console.error('Erro ao atualizar atividade:', err)
        throw err;
      }
    },

    async deleteAtividade(idParaDeletar) {
      try {
        // DELETE para o endpoint que deleta (ex: /atividades/1)
        await api.delete(`/atividades/${idParaDeletar}`)
        
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
