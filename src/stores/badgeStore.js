import { defineStore, acceptHMRUpdate } from 'pinia'

export const useBadgeStore = defineStore('badge', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('badge')) || {
        0: { id: 1, nome: 'Mestre dos Algoritmos', badge: '/icons/iconxplearn.png' },
    },
  }),
  getters: {
    
  },
  actions: {
    
    salvarNoLocalStorage() {
      localStorage.setItem('badge', JSON.stringify(this.items))
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBadgeStore, import.meta.hot))
}
