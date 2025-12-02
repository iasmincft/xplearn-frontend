// Camada de serviço para Usuários
import { api } from 'src/boot/axios'

/**
 * @param {string} matricula
 * @returns {Promise<import('../types/user').Aluno>}
 */
export async function getAlunoProfile(matricula) {
  const { data } = await api.get(`/alunos/${matricula}`)
  return data.data || data
}

/**
 * @param {string} matricula
 * @returns {Promise<import('../types/user').Professor>}
 */
export async function getProfessorProfile(matricula) {
  const { data } = await api.get(`/professores/${matricula}`)
  return data.data || data
}

/**
 * @param {string} matricula
 * @param {'aluno'|'professor'} role
 * @returns {Promise<import('../types/user').Aluno|import('../types/user').Professor>}
 */
export async function getUserProfile(matricula, role) {
  return role === 'aluno' 
    ? getAlunoProfile(matricula)
    : getProfessorProfile(matricula)
}

