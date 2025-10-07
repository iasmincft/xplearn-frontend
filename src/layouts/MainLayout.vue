<template>
  <q-layout view="lHh lpR lFf">

    <q-drawer
      show-if-above
      :breakpoint="0"
      :width="isExpanded ? 250 : 60"
      @mouseover="isExpanded = true"
      @mouseleave="isExpanded = false"
      class="bg-dark-page text-white"
      
    >
      <q-list>
        <div class="row no-wrap items-center" style="height: 70px;">
          <div class="col-auto row justify-center items-center" style="width: 60px;">
            <q-img src="icons/favicon-128x128.png" style="width: 38px;" />
          </div>
          <div class="col q-pl-md" style="width: 190px;">
            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <div v-show="isExpanded" class="text-weight-bold ellipsis text-white">{{ headerTitle }}</div>
            </transition>
          </div>
        </div>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          :is-expanded="isExpanded"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-dark text-white ">
      <div class="text-h4 text-bold q-pa-md q-ml-lg">
        {{ pageTitle }}
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
    
const isExpanded = ref(false)

const headerTitle = 'XP Learn'
const route = useRoute()
const pageTitle = computed(() => route.meta.title || 'Página')


const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Atividades',
    icon: 'list',
    link: '/atividades',
  },
  {
    title: 'Ranking',
    icon: 'leaderboard',
    link: '/ranking',
  },
  {
    title: 'Turmas',
    icon: 'groups',
    link: '/turmas',
  },
  {
    title: 'Badges',
    icon: 'military_tech',
    link: '/badges',
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings',
  }
]

</script>

<style lang="scss">

.q-drawer {
  transition: width 0.35s ease;
}

.q-page-container {
  transition: padding-left 0.35s ease;
}

.q-drawer__content {
  overflow-x: hidden;
}

.bg-dark-page {
  background-color: $dark-page;
}
.active-link {
  background-color: $dark !important;
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

</style>

