import { defineStore, acceptHMRUpdate } from 'pinia'
import { login as authLogin, logout as authLogout, register as authRegister } from 'src/services/authService'
import { getUserProfile } from 'src/services/userService'
import { useAvatarStore } from './avatarStore'
import { api } from 'src/boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    currentUser: {
      role: localStorage.getItem('user_role') || null,
      avatar: null,
      avatar_id_fk: null,
      nome: '',
      nickname: '',
      icone: null,
      xp: 0,
      nivel: 1,
      matricula: localStorage.getItem('user_matricula') || ''
    }
  }),
  getters: {
    isProfessor: (state) => state.currentUser.role === 'professor',
    isAluno: (state) => state.currentUser.role === 'aluno',
    isAuthenticated: (state) => !!state.token,
    dadosDoAluno: (state) => state.currentUser
  },
  actions: {
    setRole(newRole) {
      if (['aluno', 'professor'].includes(newRole)) {
        this.currentUser.role = newRole
        localStorage.setItem('user_role', newRole)
      }
    },

    async syncAvatar() {
      const avatarId = this.currentUser.avatar?.id || this.currentUser.avatar_id_fk;

      if (avatarId) {
        const avatarStore = useAvatarStore()
        if (!avatarStore.items || avatarStore.items.length === 0) {
          await avatarStore.fetchAvatares();
        }
        avatarStore.setAvatar(Number(avatarId))
      }
    },

    setDados(userData) {
      if (userData) {
        this.currentUser.id = userData.id || this.currentUser.id;
        this.currentUser.nome = userData.nome || this.currentUser.nome;
        this.currentUser.matricula = userData.matricula || this.currentUser.matricula;
        this.currentUser.icone = userData.icone ?? this.currentUser.icone;

        let extractedId = null;

        if (userData.avatar && userData.avatar.id) {
            this.currentUser.avatar = userData.avatar;
            extractedId = userData.avatar.id;
        } else if (userData.avatar_id_fk) {
            extractedId = userData.avatar_id_fk;
        }

        if (extractedId) {
            this.currentUser.avatar_id_fk = extractedId;
        }

        if (this.currentUser.matricula) {
            localStorage.setItem('user_matricula', this.currentUser.matricula);
        }

        if (this.currentUser.role === 'aluno') {
          this.currentUser.nickname = userData.nickname || this.currentUser.nickname;
          this.currentUser.xp = userData.xp ?? this.currentUser.xp;
          this.currentUser.nivel = userData.nivel ?? this.currentUser.nivel;
        } else {
          this.currentUser.nickname = '';
          this.currentUser.xp = 0;
          this.currentUser.nivel = 1;
        }
      }
    },

    async finishAuth(responseData, matricula, role) {

      const token = responseData.access_token || responseData.token
      if (token) {
        this.token = token
        localStorage.setItem('auth_token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      this.setRole(role)

      const userData = responseData.nome ? responseData : null

      if (userData && userData.nome) {
        this.setDados(userData)
      } else {
        await this.fetchUserProfile(matricula, role)
      }

      await this.syncAvatar()
    },

    async checkAuth() {
      if (!this.token) return false

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

      if (this.currentUser.matricula && this.currentUser.role) {
        try {
          await this.fetchUserProfile(this.currentUser.matricula, this.currentUser.role)
          await this.syncAvatar()
          return true
        } catch (error) {
          console.error('Sessão inválida ou expirada', error)
          this.logout()
          return false
        }
      }
      return true
    },

    async fetchUserProfile(matricula, role) {
      try {
        const userData = await getUserProfile(matricula, role)
        if (userData) {
          this.setDados(userData)
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error)
        throw error
      }
    },


    async login(matricula, senha) {
      const userRole = matricula.length === 12 ? 'aluno' : (matricula.length === 7 ? 'professor' : null)
      if (!userRole) throw new Error('Matrícula inválida')

      try {
        const responseData = await authLogin({ matricula, senha }, userRole)

        await this.finishAuth(responseData, matricula, userRole)

        return true
      } catch (error) {
        authLogout()
        throw error
      }
    },

    async register(userData, role) {
        const responseData = await authRegister(userData, role)
        await this.finishAuth(responseData, userData.matricula, role)
        this.currentUser.nome = userData.nome || userData.name || this.currentUser.nome
      this.currentUser.matricula = userData.matricula || this.currentUser.matricula

      if (role === 'aluno') {
        this.currentUser.nickname = userData.nickname || userData.nick || this.currentUser.nickname
        this.currentUser.xp = 0
        this.currentUser.nivel = 1
      }

      if (userData.avatar_id_fk) {
        this.currentUser.avatar_id_fk = userData.avatar_id_fk
        const avatarStore = useAvatarStore()
        if (avatarStore.items.length === 0) await avatarStore.fetchAvatares()
        avatarStore.setAvatar(this.currentUser.avatar_id_fk)
      }
      return true
    },

    logout(router = null) {
      this.token = null
      this.currentUser = {
        role: null,
        avatar_id_fk: null,
        nome: '',
        nickname: '',
        icone: null,
        xp: 0,
        nivel: 1,
        matricula: ''
      }

      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('user_matricula')

      authLogout()
      const avatarStore = useAvatarStore()
      avatarStore.clearAvatar()
      if (router) {
        router.push('/auth/login')
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
