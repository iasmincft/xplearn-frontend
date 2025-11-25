import { defineStore, acceptHMRUpdate } from 'pinia'
import { login as authLogin, logout as authLogout } from 'src/services/authService'
import { getUserProfile } from 'src/services/userService'
import { useAvatarStore } from './avatarStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      role: null,
      avatar_id_fk: null,
      nome: '',
      nickname: '', // Apenas para alunos
      icone: null,
      xp: 0, // Apenas para alunos
      nivel: 1, // Apenas para alunos
      matricula: ''
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
        this.currentUser.nome = userData.nome || this.currentUser.nome
        this.currentUser.matricula = userData.matricula || this.currentUser.matricula
        this.currentUser.avatar_id_fk = userData.avatar_id_fk ?? this.currentUser.avatar_id_fk
        this.currentUser.icone = userData.icone ?? this.currentUser.icone
        
        // Campos específicos de aluno
        if (this.currentUser.role === 'aluno') {
          this.currentUser.nickname = userData.nickname || this.currentUser.nickname
          this.currentUser.xp = userData.xp ?? this.currentUser.xp
          this.currentUser.nivel = userData.nivel ?? this.currentUser.nivel
        } else {
          // Professor não tem nickname, xp, nivel
          this.currentUser.nickname = ''
          this.currentUser.xp = 0
          this.currentUser.nivel = 1
        }
      }
    },

    async fetchUserProfile(matricula, role) {
      try {
        const userData = await getUserProfile(matricula, role)
        if (userData) {
          this.setDados(userData)
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error)
      }
    },

    async login(matricula, senha) {
      const userRole = matricula.length === 12 ? 'aluno' : (matricula.length === 7 ? 'professor' : null)
      if (!userRole) throw new Error('Matrícula inválida')

      try {
        const responseData = await authLogin({ matricula, senha }, userRole)

        this.setRole(userRole)

        // O backend retorna { data: { access_token, ...dados_do_usuario } }
        // responseData já é o objeto dentro de data (extraído no authService)
        const userData = responseData.nome ? responseData : null

        if (userData && userData.nome) {
          this.setDados(userData)
        } else {
          // Se não vier os dados no login, busca o perfil
          await this.fetchUserProfile(matricula, userRole)
        }

        if (this.currentUser.avatar_id_fk) {
          const avatarStore = useAvatarStore()
          if (avatarStore.items.length === 0) {
            avatarStore.fetchAvatares().then(() => {
              avatarStore.setAvatar(this.currentUser.avatar_id_fk)
            })
          } else {
            avatarStore.setAvatar(this.currentUser.avatar_id_fk)
          }
        }
        return true
      } catch (error) {
        authLogout()
        throw error
      }
    },

    logout(router) {
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
      authLogout()
      const avatarStore = useAvatarStore()
      avatarStore.clearAvatar()
      router.push('/auth/login')
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}