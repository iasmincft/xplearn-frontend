import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAtividadesStore = defineStore('atividades', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('atividades')) || [
      { id: 1, nome: 'Estudar Quasar', data: '10/09/2001', concluida: false },
      { id: 2, nome: 'Estudar Pinia', data: '10/09/2001', concluida: false },
    ],
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
    alternarConcluida(idParaAlternar) {
      const atividade = this.items.find(item => item.id === idParaAlternar)
      if (atividade) {
        atividade.concluida = !atividade.concluida
        this.salvarNoLocalStorage()
      }
    },

    addAtividade(novaAtividade) {
      const atividadeParaAdicionar = {
        id: Date.now(),
        ...novaAtividade
      };
      this.items.unshift(atividadeParaAdicionar);
      this.salvarNoLocalStorage();
    },

    updateAtividade(atividadeAtualizada) {
    const index = this.items.findIndex(item => item.id === atividadeAtualizada.id);
    
    if (index !== -1) {
      this.items[index] = atividadeAtualizada;
      this.salvarNoLocalStorage(); 
    }
  },

  deleteAtividade(idParaDeletar) {
  this.items = this.items.filter(item => item.id !== idParaDeletar);
  this.salvarNoLocalStorage();
},
    salvarNoLocalStorage() {
      localStorage.setItem('atividades', JSON.stringify(this.items))
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAtividadesStore, import.meta.hot))
}
