// Camada de serviço para Badges
import { api } from 'src/boot/axios'

const basePath = '/badges/'

/** @returns {Promise<import('../types/badge').Badge[]>} */
export async function listBadges() {
  const { data } = await api.get(basePath)
  return data.data || data
}

