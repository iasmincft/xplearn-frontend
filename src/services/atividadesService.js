// Camada de serviço para Atividades
// Responsável por isolar chamadas HTTP e regras de transformação de dados

import { api } from 'src/boot/axios'

const basePath = '/atividades/'

/** @returns {Promise<import('../types/atividade').Atividade[]>} */
export async function listAtividades() {
  const { data } = await api.get(basePath)
  return data
}

/** @param {import('../types/atividade').CreateAtividadeDto} payload */
export async function createAtividade(payload) {
  const { data } = await api.post(basePath, payload)
  return data
}

/** @param {import('../types/atividade').UpdateAtividadeDto} payload */
export async function updateAtividade(payload) {
  const { id, ...rest } = payload
  const { data } = await api.put(`${basePath}${id}`, { id, ...rest })
  return data
}

/** @param {number|string} id */
export async function deleteAtividade(id) {
  await api.delete(`${basePath}${id}`)
}





