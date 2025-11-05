import { defineStore } from 'pinia'
import { api } from 'boot/axios';
import { useAvatarStore } from './avatarStore';


export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: null
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

    async login(matricula, senha) {
      
      const credentials = {
        matricula: matricula, 
        senha: senha,         
      };
      
      const { data } = await api.post('/login', credentials);
      
      this.setDados(data.user);

      const avatarStore = useAvatarStore();
      await avatarStore.fetchAvatares(); 

      avatarStore.setAvatar(data.user.avatar_id);
    }
  }
})