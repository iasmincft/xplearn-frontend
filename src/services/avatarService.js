// Camada de serviço para Avatares
import { api } from 'src/boot/axios'

const basePath = '/avatares/'

const BASE_URL_AXIOS = api.defaults.baseURL

const getFullPath = (caminhoFoto) => {
  const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS
  const path = caminhoFoto.startsWith('/') ? caminhoFoto : `/${caminhoFoto}`
  return `${baseUrl}/static${path}`
}

/** @returns {Promise<import('../types/avatar').Avatar[]>} */
export async function listAvatares() {
  const { data } = await api.get(basePath)
  return data.data || data
}

/**
 * Converte caminho_foto para URL completa
 * @param {import('../types/avatar').Avatar} avatar
 * @returns {string}
 */
export function getAvatarFullUrl(avatar) {
  return getFullPath(avatar.caminho_foto)
}

