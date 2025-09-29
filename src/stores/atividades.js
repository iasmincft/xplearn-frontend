import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAtividadesStore = defineStore('atividades', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('atividades')) || {
        1: { id: 1, titulo: 'Estudar Quasar', data: '10/09/2001', concluida: false },
    },
  }),
  getters: {
    atividades: (state) => state.items,
  },
  actions: {
    alternarConcluida(id) {
      const atividade = this.items[id]
      if (atividade) {
        atividade.concluida = !atividade.concluida
        this.salvarNoLocalStorage()
      }
    },
    salvarNoLocalStorage() {
      localStorage.setItem('atividades', JSON.stringify(this.items))
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAtividadesStore, import.meta.hot))
}
