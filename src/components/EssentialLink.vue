<template>
  <router-link 
    :to="props.link" 
    custom 
    v-slot="{ navigate, isActive }"
  >
    <div
      class="custom-link row no-wrap items-center"
      :class="{ 'active-link': isActive }"
      @click="navigate"
    >
      
      <div class="col-auto row justify-center items-center" style="width: 60px;">
        <q-icon :name="props.icon" size="sm" />
      </div>

      <div class="col q-pl-md" style="width: 190px;">
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div v-show="props.isExpanded" class="ellipsis">{{ props.title }}</div>
        </transition>
      </div>

      <q-tooltip v-if="!props.isExpanded" anchor="center right" self="center left" :offset="[10, 10]">
        <strong>{{ props.title }}</strong>
      </q-tooltip>

    </div>
  </router-link>
</template>

<script setup>

// seu script permanece o mesmo
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
  exact: {
    type: Boolean,
    default: false,
  }
})
</script>

<style lang="scss" scoped>
// Adicionamos estilos manuais para fazer a DIV parecer um item de menu
.custom-link {
  height: 48px; // Altura padrão de um item de lista
  cursor: pointer;
  transition: background-color 0.3s;
  color: inherit;
  text-decoration: none;
}

.custom-link:hover {
  background-color: rgba(0, 0, 0, 0.04); // Efeito de hover sutil
}

// Estilo do link ativo (quando a rota corresponde)
.active-link {
  color: $primary; // Usa a cor primária do Quasar
  background-color: rgba($primary, 0.1); // Usa a cor primária com 10% de opacidade
}
</style>