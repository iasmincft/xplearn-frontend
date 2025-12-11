import { api } from 'src/boot/axios'

const basePath = '/atividades/'

export async function listAtividades() {
  const { data } = await api.get(basePath)
  return data.data || data
}

export async function createAtividade(payload) {
  const { data } = await api.post(basePath, payload)
  return data.data || data
}

export async function updateAtividade(payload) {
  const { id, ...rest } = payload

  const url = `${basePath}${id}`

  console.log('%c[DEBUG SERVICE] Tentando PUT em:', 'color: orange; font-weight: bold', url)
  console.log('[DEBUG SERVICE] Payload:', rest)

  const { data } = await api.put(url, rest)

  return data.data || data
}

export async function deleteAtividade(id) {
  await api.delete(`${basePath}${id}/`)
}

export async function getAtividadeById(id) {
  const { data } = await api.get(`${basePath}${id}/`)
  return data.data || data
}

export async function getAlunosAtividade(id) {
  const { data } = await api.get(`${basePath}${id}/alunos`)
  return data
}

export async function marcarAlunoFezAtividade(atividadeId, matricula, nota = '0') {
  const { data } = await api.post(`${basePath}${atividadeId}/alunos/${matricula}`, { nota })
  return data
}

export async function desmarcarAlunoFezAtividade(atividadeId, matricula) {
  const { data } = await api.delete(`${basePath}${atividadeId}/alunos/${matricula}`)
  return data
}

export async function atualizarNotaAluno(atividadeId, matricula, nota) {
  const { data } = await api.put(`${basePath}${atividadeId}/alunos/${matricula}/nota`, { nota: String(nota) })
  return data
}
