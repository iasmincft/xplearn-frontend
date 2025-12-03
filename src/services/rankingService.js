// Camada de serviço para Ranking
import { api } from 'src/boot/axios'

const basePath = '/alunos/' 

export async function listRanking() {
  const { data } = await api.get(basePath)
  return data.data || data
}

