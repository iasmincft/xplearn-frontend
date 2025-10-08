import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: 'aluno', // 'aluno' ou 'professor'
      nome: 'Jane Doe',
      email: 'jane@example.com',
      avatar: 'https://cdn.quasar.dev/img/avatar.png'
    }
  }),
  getters: {
    isProfessor: (state) => state.currentUser.role === 'professor',
    isAluno: (state) => state.currentUser.role === 'aluno'
  },
  actions: {
    /**
     * Altera o role do usuário atual
     * @param {string} newRole - 'aluno' ou 'professor'
     */
    setRole(newRole) {
      if (newRole === 'aluno' || newRole === 'professor') {
        this.currentUser.role = newRole
      } else {
        console.warn('Role inválido. Use "aluno" ou "professor".')
      }
    },

    /**
     * Alterna entre aluno e professor (útil para testes)
     */
    toggleRole() {
      this.currentUser.role = this.isProfessor ? 'aluno' : 'professor'
    },

    /**
     * Atualiza os dados do usuário
     * @param {Object} userData - Dados do usuário
     */
    updateUser(userData) {
      this.currentUser = { ...this.currentUser, ...userData }
    }
  }
})