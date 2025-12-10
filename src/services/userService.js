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

/**
 * Atualiza o perfil de um aluno
 * @param {string} matricula
 * @param {Object} payload - Dados para atualizar
 * @returns {Promise<import('../types/user').Aluno>}
 */
export async function updateAlunoProfile(matricula, payload) {
  const { data } = await api.put(`/alunos/${matricula}`, payload)
  return data.data || data
}

/**
 * Atualiza o perfil de um professor
 * @param {string} matricula
 * @param {Object} payload - Dados para atualizar
 * @returns {Promise<import('../types/user').Professor>}
 */
export async function updateProfessorProfile(matricula, payload) {
  const { data } = await api.put(`/professores/${matricula}`, payload)
  return data.data || data
}

/**
 * Atualiza o perfil do usuário (aluno ou professor)
 * @param {string} matricula
 * @param {'aluno'|'professor'} role
 * @param {Object} payload - Dados para atualizar
 * @returns {Promise<import('../types/user').Aluno|import('../types/user').Professor>}
 */
export async function updateUserProfile(matricula, role, payload) {
  return role === 'aluno'
    ? updateAlunoProfile(matricula, payload)
    : updateProfessorProfile(matricula, payload)
}

