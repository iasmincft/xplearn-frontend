import { api } from 'src/boot/axios'

const basePath = '/alunos/'

export async function listRanking(turmaId = null) {
  const params = {}

  if (turmaId && turmaId !== 'geral') {
    params.turma_id = turmaId
  }

  const { data } = await api.get(basePath, { params })
  return data.data || data
}
