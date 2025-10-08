<template>
  <div class="conditional-actions">
    <slot 
      :can="permissions.can"
      :isProfessor="permissions.isProfessor.value"
      :isAluno="permissions.isAluno.value"
      :hasPermission="permissions.hasPermission"
    />
  </div>
</template>

<script setup>
/**
 * Componente reutilizável que fornece permissões via slots
 * 
 * Exemplo de uso:
 * 
 * <ConditionalActions v-slot="{ can, isProfessor, isAluno }">
 *   <q-btn v-if="can.editarAtividade.value" label="Editar" />
 *   <q-btn v-if="isAluno" label="Submeter" />
 * </ConditionalActions>
 */
import { usePermissions } from 'src/composables/usePermissions'

const permissions = usePermissions()
</script>

<style lang="scss" scoped>
.conditional-actions {
  display: contents;
}
</style>

