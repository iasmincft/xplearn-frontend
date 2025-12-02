// Camada de serviço para Ranking
import { api } from 'src/boot/axios'

const basePath = '/ranking/'

/** @returns {Promise<import('../types/ranking').Ranking[]>} */
export async function listRanking() {
  const { data } = await api.get(basePath)
  return data.data || data
}

/** @param {import('../types/ranking').CreateRankingDto} payload */
export async function createRanking(payload) {
  const { data } = await api.post(basePath, payload)
  return data.data || data
}

/** @param {import('../types/ranking').UpdateRankingDto} payload */
export async function updateRanking(payload) {
  const { id, ...rest } = payload
  const { data } = await api.put(`${basePath}${id}`, { id, ...rest })
  return data.data || data
}

/** @param {number|string} id */
export async function deleteRanking(id) {
  await api.delete(`${basePath}${id}`)
}

