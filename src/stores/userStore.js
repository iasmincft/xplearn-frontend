import { defineStore } from 'pinia'
import { api } from 'boot/axios';
import { useAvatarStore } from './avatarStore';


export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: null,
      avatar_id: null,
      nome: '',
      nickname: ''
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

    setDados(userData) {
      if (userData) {
        this.currentUser.nome = userData.nome || this.currentUser.nome;
        this.currentUser.nickname = userData.nickname || this.currentUser.nickname;
        this.currentUser.avatar_id = userData.avatar_id || userData.avatar_id_fk || this.currentUser.avatar_id;
      }
    },

    async fetchUserProfile(matricula, role) {
      try {

        const endpoint = role === 'aluno' ? `/alunos/${matricula}` : `/professores/${matricula}`;
        const { data } = await api.get(endpoint);


        if (data && data.data) {
          this.setDados(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
    },

    async login(matricula, senha) {

      const userRole = matricula.length === 12 ? 'aluno' : (matricula.length === 7 ? 'professor' : null);
      if (!userRole) throw new Error('Matrícula inválida');

      try {
        const { data } = await api.post(`/login/${userRole}`, { matricula, senha });
        const token = data.access_token || data.token;
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        this.setRole(userRole);

        const userData = data.user || data.data || (data.nome ? data : null);

        if (userData && userData.nome) {

          this.setDados(userData);
        } else {

          await this.fetchUserProfile(matricula, userRole);
        }

        if (this.currentUser.avatar_id) {
          const avatarStore = useAvatarStore();
          if (avatarStore.items.length === 0) {
            avatarStore.fetchAvatares().then(() => {
              avatarStore.setAvatar(this.currentUser.avatar_id);
            });
          } else {
            avatarStore.setAvatar(this.currentUser.avatar_id);
          }
        }
        return true;
      } catch (error) {
        api.defaults.headers.common['Authorization'] = '';
        throw error;
      }
    },

    logout(router) {
      this.currentUser = {
        role: null,
        avatar_id: null,
        nome: '',
        nickname: ''
      };
      api.defaults.headers.common['Authorization'] = '';
      const avatarStore = useAvatarStore();
      avatarStore.clearAvatar();
      router.push('/auth/login');
    }
  }
})