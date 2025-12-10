<template>
  <router-link
    :to="props.link"
    custom
    v-slot="{ navigate, isActive }"
  >
    <div
      class="custom-link row no-wrap items-center"
      :class="{ 'active-link': isActive || props.active }"
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

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '/home',
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
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.custom-link {
  height: 48px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: inherit;
  text-decoration: none;
}

.custom-link:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.active-link {
  color: $primary;
  background-color: rgba($primary, 0.1);
}
</style>
