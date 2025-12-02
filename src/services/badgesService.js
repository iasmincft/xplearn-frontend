// Camada de serviço para Badges
import { api } from 'src/boot/axios'

const basePath = '/badges/'

/** @returns {Promise<import('../types/badge').Badge[]>} */
export async function listBadges() {
  const { data } = await api.get(basePath)
  return data.data || data
}

/** @param {import('../types/badge').CreateBadgeDto} payload */
export async function createBadge(payload) {
  const { data } = await api.post(basePath, payload)
  return data.data || data
}

/** @param {import('../types/badge').UpdateBadgeDto} payload */
export async function updateBadge(payload) {
  const { id, ...rest } = payload
  const { data } = await api.put(`${basePath}${id}`, { id, ...rest })
  return data.data || data
}

/** @param {number|string} id */
export async function deleteBadge(id) {
  await api.delete(`${basePath}${id}`)
}

