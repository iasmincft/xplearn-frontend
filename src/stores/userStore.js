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

      let userRole;
      if (matricula.length === 12) {
      userRole = 'aluno';
    } else (matricula.length === 7) {
      userRole = 'professor';
    }
      
      const credentials = {
        matricula: matricula, 
        senha: senha,         
      };
      
      const loginUrl = `/login/${userRole}`;

      const { data } = await api.post(loginUrl, credentials);
      this.setRole(userRole);
      this.setDados(data.user);

      //const avatarStore = useAvatarStore();
      //await avatarStore.fetchAvatares(); 

      //avatarStore.setAvatar(data.user.avatar_id);
    }
  }
})