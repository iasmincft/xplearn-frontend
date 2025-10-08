import { computed } from 'vue'
import { useUserStore } from 'src/stores/userStore'

/**
 * Composable para gerenciar permissões baseadas em roles
 * @returns {Object} Objeto com funções e propriedades de permissão
 */
export function usePermissions() {
  const userStore = useUserStore()

  // Computed properties para acessar roles
  const isProfessor = computed(() => userStore.isProfessor)
  const isAluno = computed(() => userStore.isAluno)
  const currentRole = computed(() => userStore.currentUser.role)

  // Funções de permissão específicas
  const can = {
    // Atividades
    editarAtividade: computed(() => isProfessor.value),
    criarAtividade: computed(() => isProfessor.value),
    deletarAtividade: computed(() => isProfessor.value),
    visualizarAtividade: computed(() => true), // Todos podem visualizar
    concluirAtividade: computed(() => isAluno.value),

    // Turmas
    gerenciarTurma: computed(() => isProfessor.value),
    verTurma: computed(() => true),

    // Badges
    atribuirBadge: computed(() => isProfessor.value),
    verBadges: computed(() => true),

    // Ranking
    verRanking: computed(() => true),
    editarNotas: computed(() => isProfessor.value),
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   * @param {string} permission - Nome da permissão (ex: 'editarAtividade')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return can[permission]?.value ?? false
  }

  /**
   * Verifica se o usuário tem alguma das permissões fornecidas
   * @param {string[]} permissions - Array de permissões
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission))
  }

  /**
   * Verifica se o usuário tem todas as permissões fornecidas
   * @param {string[]} permissions - Array de permissões
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    // Roles
    isProfessor,
    isAluno,
    currentRole,
    
    // Permissões
    can,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}

