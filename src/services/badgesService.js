import { api } from 'src/boot/axios'

const basePath = '/badges/'

/** @returns {Promise<import('../types/badge').Badge[]>} */
export async function listBadges() {
  const { data } = await api.get(basePath)
  return data.data || data
}

export const listBadgesDoAluno = async (matricula) => {
    const { data } = await api.get(`/alunos/${matricula}/badges`)
    return data
}
