import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: 'aluno' 
    }
  }),
  getters: {
    isProfessor: (state) => state.currentUser.role === 'professor',
    isAluno: (state) => state.currentUser.role === 'aluno'
  },
})