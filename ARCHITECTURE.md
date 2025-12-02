## Arquitetura do Frontend (XP Learn)

Este projeto adota uma arquitetura em camadas (Layered) com influência de MVVM e Flux, organizada por domínio.

- Camada de View: componentes e páginas Vue (`src/pages`, `src/components`)
- Camada de ViewModel: estado global e lógica de apresentação (`src/stores` + `src/composables`)
- Camada de Domain/Data: serviços HTTP e contratos de dados (`src/services` + `src/types`)

Resumo do fluxo: View -> chama composable/store -> store usa services -> services chamam API -> resposta atualiza o estado -> View re-renderiza.

### Benefícios
- Separação de responsabilidades clara (UI vs estado vs dados)
- Testabilidade e reuso (services e composables são independentes da UI)
- Facilidade para migrar de mocks/localStorage para API real por domínio

---

## Padrões e diretórios

- `src/types`: contratos/DTOs (via JSDoc ou TS futuramente)
- `src/services`: camada de acesso a dados (Axios)
- `src/stores`: Pinia (estado global por domínio)
- `src/composables`: hooks `useXxx()` que expõem estado e ações para a View
- `src/boot/axios.js`: configuração do cliente HTTP (`api`)

### Exemplo real (domínio: Atividades)
- Types: `src/types/atividade.js`
- Service: `src/services/atividadesService.js`
- Store: `src/stores/atividadesStore.js`
- Composable: `src/composables/useAtividades.js`

---

## Guia: como criar um novo domínio

Suponha um novo domínio "Turmas". Siga os passos:

### 1) Defina os tipos (src/types/turma.js)
Use JSDoc para documentar campos e DTOs.

```javascript
/** @typedef {Object} Turma
 *  @property {number|string} id
 *  @property {string} nome
 *  @property {string} professor
 */

/** @typedef {Object} CreateTurmaDto
 *  @property {string} nome
 *  @property {string} professor
 */

/** @typedef {Object} UpdateTurmaDto
 *  @property {number|string} id
 *  @property {string} [nome]
 *  @property {string} [professor]
 */
```

### 2) Crie o service HTTP (src/services/turmasService.js)
Isola endpoints e transformações de dados. Reutilize `api` do boot.

```javascript
import { api } from 'src/boot/axios'

const basePath = '/turmas/'

/** @returns {Promise<import('src/types/turma').Turma[]>} */
export async function listTurmas() {
  const { data } = await api.get(basePath)
  return data
}

/** @param {import('src/types/turma').CreateTurmaDto} payload */
export async function createTurma(payload) {
  const { data } = await api.post(basePath, payload)
  return data
}

/** @param {import('src/types/turma').UpdateTurmaDto} payload */
export async function updateTurma(payload) {
  const { id, ...rest } = payload
  const { data } = await api.put(`${basePath}${id}`, { id, ...rest })
  return data
}

/** @param {number|string} id */
export async function deleteTurma(id) {
  await api.delete(`${basePath}${id}`)
}
```

### 3) Monte o store (src/stores/turmaStore.js)
O store orquestra o estado e usa o service.

```javascript
import { defineStore } from 'pinia'
import { listTurmas, createTurma, updateTurma, deleteTurma } from 'src/services/turmasService'

export const useTurmaStore = defineStore('turma', {
  state: () => ({ items: [], loading: false, error: null }),
  getters: {
    total: (state) => state.items.length,
  },
  actions: {
    async fetchTurmas() {
      this.loading = true
      this.error = null
      try {
        this.items = await listTurmas()
      } catch (e) {
        this.error = 'Falha ao buscar turmas.'
      } finally {
        this.loading = false
      }
    },
    async addTurma(payload) {
      const created = await createTurma(payload)
      this.items.unshift(created)
    },
    async updateTurmaLocal(payload) {
      const idx = this.items.findIndex(t => t.id === payload.id)
      if (idx === -1) throw new Error('Turma não encontrada')
      const updated = await updateTurma(payload)
      this.items[idx] = updated ?? payload
    },
    async deleteTurmaLocal(id) {
      await deleteTurma(id)
      this.items = this.items.filter(t => t.id !== id)
    },
  }
})
```

### 4) Crie o composable (src/composables/useTurmas.js)
Exponha dados/ações do store para a View, no estilo "hook".

```javascript
import { computed } from 'vue'
import { useTurmaStore } from 'src/stores/turmaStore'

export function useTurmas() {
  const store = useTurmaStore()
  return {
    items: computed(() => store.items),
    total: computed(() => store.total),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    fetchTurmas: store.fetchTurmas,
    addTurma: store.addTurma,
    updateTurma: store.updateTurmaLocal,
    deleteTurma: store.deleteTurmaLocal,
  }
}
```

### 5) Consumir na página
Em `PageTurmas.vue` (ou componente), importe o hook e use no `onMounted`:

```javascript
<script setup>
import { onMounted } from 'vue'
import { useTurmas } from 'src/composables/useTurmas'

const { items, loading, error, fetchTurmas, addTurma } = useTurmas()

onMounted(fetchTurmas)
</script>
```

---

## Convenções e boas práticas

- Services não devem conhecer a UI; apenas HTTP + transformação de dados.
- Stores não devem conter chamadas diretas a axios; usar sempre os services.
- Composables devem ser finos, preferencialmente expondo dados/ações do store.
- Mantenha nomes consistentes por domínio: `types/<dominio>.js`, `services/<dominio>Service.js`, `stores/<dominio>Store.js`, `composables/use<Domínio>.js`.
- Trate erros nos services e padronize mensagens nos stores.
- Configure `API_BASE_URL` em `src/boot/axios.js` (ou via `.env` com `VITE_API_BASE_URL`).

---

## Roadmap sugerido

- Autenticação: `authService`, interceptors (Bearer), `userStore`, `useAuth`.
- Migrar domínios que usam localStorage (Turmas/Ranking/Badges) para API.
- Tipagem TypeScript no futuro (substituir JSDoc por `.ts`).


