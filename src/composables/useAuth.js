// Composable estilo hook para autenticação e usuário
import { computed } from 'vue'
import { useUserStore } from 'src/stores/userStore'

export function useAuth() {
  const store = useUserStore()

  return {
    currentUser: computed(() => store.currentUser),
    isProfessor: computed(() => store.isProfessor),
    isAluno: computed(() => store.isAluno),
    isAuthenticated: computed(() => !!store.currentUser.role),
    login: store.login,
    logout: store.logout,
    fetchUserProfile: store.fetchUserProfile,
    setRole: store.setRole,
    setDados: store.setDados,
  }
}

