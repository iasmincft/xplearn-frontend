// Camada de serviço para Atividades
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

  // URL com a barra final
  const url = `${basePath}${id}/`

  console.log('%c[DEBUG SERVICE] Tentando PUT em:', 'color: orange; font-weight: bold', url)
  console.log('[DEBUG SERVICE] Payload:', rest)

  // MUDANÇA: Voltando para PUT, mas agora com a certeza da barra "/"
  const { data } = await api.put(url, rest)

  return data.data || data
}

export async function deleteAtividade(id) {
  await api.delete(`${basePath}${id}/`)
}
