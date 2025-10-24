import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: null, // ALTERADO: O role agora é 'null' antes do login
      matricula: null
    }
  }),
  getters: {
    isProfessor: (state) => state.currentUser.role === 'professor',
    isAluno: (state) => state.currentUser.role === 'aluno'
  },
  actions: {
    setRole(newRole) {
      if (['aluno', 'professor'].includes(newRole)) {
        this.currentUser.role = newRole
      }
    },

    loginByMatricula(matricula) {
      const matriculaStr = String(matricula).trim();
      const length = matriculaStr.length;
      let newRole = null; 

      if (!/^\d+$/.test(matriculaStr)) {
          console.error("Matrícula inválida: deve conter apenas números.");
          return { success: false, message: "Matrícula inválida." };
      }

      if (length === 7) {
        newRole = 'professor';
      } else if (length === 12) {
        newRole = 'aluno';
      } else {
        return { success: false, message: "Matrícula deve ter 7 ou 12 dígitos." };
      }

      this.currentUser.matricula = matriculaStr;
      this.currentUser.role = newRole; 
      return { success: true, role: newRole };
    }
  }
})