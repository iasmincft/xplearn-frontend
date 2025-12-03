// Camada de serviço para Autenticação
import { api } from 'src/boot/axios'

/**
 * @param {import('../types/user').LoginAlunoRequest|import('../types/user').LoginProfessorRequest} credentials
 * @param {'aluno'|'professor'} role
 * @returns {Promise<import('../types/user').LoginAlunoResponse|import('../types/user').LoginProfessorResponse>}
 */
export async function login(credentials, role) {
  const { data } = await api.post(`/login/${role}`, credentials)


  const responseData = data.data || data

  const token = responseData.access_token || responseData.token
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return responseData
}

export async function register(userData, role) {
  const endpoint = role === 'aluno' ? '/aluno' : '/professor'
  const { data } = await api.post(endpoint, userData)

  const responseData = data.data || data
  const token = responseData.access_token || responseData.token
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return responseData
}

export function logout() {
  api.defaults.headers.common['Authorization'] = ''
}

