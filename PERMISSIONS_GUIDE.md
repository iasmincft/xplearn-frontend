# 🔐 Guia de Sistema de Permissões - XPLearn

Este guia explica como usar o sistema de permissões baseado em roles (Professor/Aluno) no XPLearn.

## 📚 Índice

- [Visão Geral](#visão-geral)
- [Como Usar](#como-usar)
- [Exemplos Práticos](#exemplos-práticos)
- [Adicionar Novas Permissões](#adicionar-novas-permissões)

---

## Visão Geral

O sistema de permissões do XPLearn permite que você **reutilize componentes** sem duplicar código, mostrando diferentes interfaces e ações baseadas no role do usuário (Professor ou Aluno).

### Arquitetura

```
┌─────────────────┐
│   UserStore     │  ← Armazena role do usuário
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ usePermissions  │  ← Composable que verifica permissões
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Componentes   │  ← Usam v-if para renderização condicional
└─────────────────┘
```

---

## Como Usar

### 1. Importar o Composable

Em qualquer componente Vue:

```vue
<script setup>
import { usePermissions } from 'src/composables/usePermissions'

const permissions = usePermissions()
</script>
```

### 2. Usar no Template

#### Exemplo 1: Mostrar botão apenas para Professor

```vue
<template>
  <q-btn
    v-if="permissions.can.editarAtividade.value"
    label="Editar"
    @click="handleEditar"
  />
</template>
```

#### Exemplo 2: Mostrar conteúdo diferente por role

```vue
<template>
  <!-- Botões para Professor -->
  <div v-if="permissions.isProfessor.value">
    <q-btn label="Criar Atividade" />
    <q-btn label="Gerenciar Turma" />
  </div>

  <!-- Botões para Aluno -->
  <div v-if="permissions.isAluno.value">
    <q-btn label="Submeter Trabalho" />
    <q-checkbox label="Marcar como Concluída" />
  </div>
</template>
```

#### Exemplo 3: Múltiplas condições

```vue
<template>
  <!-- Mostrar se o usuário pode VER OU EDITAR -->
  <q-card v-if="permissions.hasAnyPermission(['visualizarAtividade', 'editarAtividade'])">
    <!-- conteúdo -->
  </q-card>
</template>
```

---

## Exemplos Práticos

### Exemplo Completo: Componente de Turma

```vue
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ turma.nome }}</div>
      
      <!-- Todos podem ver informações básicas -->
      <div>
        <p>Código: {{ turma.codigo }}</p>
        <p>Alunos: {{ turma.totalAlunos }}</p>
      </div>

      <!-- Apenas professor pode editar -->
      <q-card-actions v-if="permissions.can.gerenciarTurma.value">
        <q-btn flat label="Editar" icon="edit" @click="handleEditar" />
        <q-btn flat label="Adicionar Aluno" icon="person_add" @click="handleAddAluno" />
      </q-card-actions>

      <!-- Apenas aluno pode sair da turma -->
      <q-card-actions v-if="permissions.isAluno.value">
        <q-btn flat label="Sair da Turma" icon="exit_to_app" @click="handleSair" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { usePermissions } from 'src/composables/usePermissions'

const props = defineProps({
  turma: Object
})

const permissions = usePermissions()

const handleEditar = () => {
  // Lógica de edição (apenas professor)
}

const handleAddAluno = () => {
  // Lógica de adicionar aluno (apenas professor)
}

const handleSair = () => {
  // Lógica de sair da turma (apenas aluno)
}
</script>
```

### Exemplo: Menu Condicional

```vue
<template>
  <q-list>
    <!-- Item visível para todos -->
    <q-item clickable to="/home">
      <q-item-section avatar>
        <q-icon name="home" />
      </q-item-section>
      <q-item-section>Home</q-item-section>
    </q-item>

    <!-- Item apenas para Professor -->
    <q-item 
      v-if="permissions.can.gerenciarTurma.value"
      clickable 
      to="/admin/turmas"
    >
      <q-item-section avatar>
        <q-icon name="admin_panel_settings" />
      </q-item-section>
      <q-item-section>Gerenciar Turmas</q-item-section>
    </q-item>

    <!-- Item apenas para Aluno -->
    <q-item 
      v-if="permissions.can.concluirAtividade.value"
      clickable 
      to="/minhas-atividades"
    >
      <q-item-section avatar>
        <q-icon name="assignment" />
      </q-item-section>
      <q-item-section>Minhas Atividades</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { usePermissions } from 'src/composables/usePermissions'

const permissions = usePermissions()
</script>
```

---

## Adicionar Novas Permissões

### Passo 1: Editar o Composable

Abra `src/composables/usePermissions.js` e adicione sua nova permissão:

```js
const can = {
  // ... permissões existentes ...
  
  // Nova permissão
  exportarRelatorio: computed(() => isProfessor.value),
  verNotas: computed(() => true), // Todos podem
  editarPerfil: computed(() => true), // Todos podem
}
```

### Passo 2: Usar no Componente

```vue
<template>
  <q-btn
    v-if="permissions.can.exportarRelatorio.value"
    label="Exportar PDF"
    icon="download"
  />
</template>
```

---

## Permissões Disponíveis

### Atividades
- ✅ `visualizarAtividade` - Todos
- 👨‍🏫 `editarAtividade` - Professor
- 👨‍🏫 `criarAtividade` - Professor
- 👨‍🏫 `deletarAtividade` - Professor
- 👨‍🎓 `concluirAtividade` - Aluno

### Turmas
- 👨‍🏫 `gerenciarTurma` - Professor
- ✅ `verTurma` - Todos

### Badges
- 👨‍🏫 `atribuirBadge` - Professor
- ✅ `verBadges` - Todos

### Ranking
- ✅ `verRanking` - Todos
- 👨‍🏫 `editarNotas` - Professor

---

## API do Composable

### Propriedades

```js
const permissions = usePermissions()

// Verificar role
permissions.isProfessor.value  // boolean
permissions.isAluno.value      // boolean
permissions.currentRole.value  // 'professor' | 'aluno'

// Verificar permissão específica
permissions.can.editarAtividade.value  // boolean
```

### Métodos

```js
// Verificar se tem uma permissão
permissions.hasPermission('editarAtividade')  // boolean

// Verificar se tem ALGUMA das permissões
permissions.hasAnyPermission(['ver', 'editar'])  // boolean

// Verificar se tem TODAS as permissões
permissions.hasAllPermissions(['ver', 'editar'])  // boolean
```

---

## Testar Permissões

### Durante Desenvolvimento

1. Acesse a página **Settings**
2. Use o botão **"Alternar Role"** para trocar entre Professor e Aluno
3. Navegue pelas páginas e veja as diferentes interfaces

### Programaticamente

```js
import { useUserStore } from 'src/stores/userStore'

const userStore = useUserStore()

// Trocar para professor
userStore.setRole('professor')

// Trocar para aluno
userStore.setRole('aluno')

// Alternar entre roles
userStore.toggleRole()
```

---

## Dicas e Boas Práticas

### ✅ Faça

- Use `v-if` para esconder elementos sensíveis
- Valide permissões no backend também (nunca confie apenas no frontend)
- Nomeie permissões de forma descritiva: `criarAtividade` ao invés de `create`

### ❌ Evite

- Não use `v-show` para permissões (elementos ainda existem no DOM)
- Não duplice lógica de permissões em múltiplos arquivos
- Não confie apenas em permissões frontend para segurança

---

## Exemplo Real: Página de Atividades

Veja o arquivo `src/pages/PageAtividades.vue` para um exemplo completo de como implementar permissões em uma página inteira.

**Principais características:**
- Botão "Nova Atividade" visível apenas para Professor
- Botões "Editar" e "Deletar" nas atividades apenas para Professor
- Checkbox "Concluir" apenas para Aluno
- Todos podem ver detalhes das atividades

---

## Suporte

Se tiver dúvidas ou precisar adicionar novas permissões, consulte:
- `src/composables/usePermissions.js` - Lógica de permissões
- `src/stores/userStore.js` - Gerenciamento de usuário
- `src/components/Atividades/AtividadeItem.vue` - Exemplo de componente

---

**Desenvolvido para XPLearn - Sistema de Aprendizado Gamificado** 🎮📚

