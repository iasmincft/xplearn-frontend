// Camada de serviço para Turmas
import { api } from 'src/boot/axios'

const basePath = '/turmas/'

/** @returns {Promise<import('../types/turma').Turma[]>} */
export async function listTurmas() {
  const { data } = await api.get(basePath)
  return data.data || data
}

/** @param {import('../types/turma').CreateTurmaDto} payload */
export async function createTurma(payload) {
  const { data } = await api.post(basePath, payload)
  return data.data || data
}

/** @param {import('../types/turma').UpdateTurmaDto} payload */
export async function updateTurma(payload) {
  const { id, ...rest } = payload
  const { data } = await api.put(`${basePath}${id}`, { id, ...rest })
  return data.data || data
}

/** @param {number|string} id */
export async function deleteTurma(id) {
  await api.delete(`${basePath}${id}`)
}

