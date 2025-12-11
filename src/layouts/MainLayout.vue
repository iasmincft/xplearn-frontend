<template>
  <q-layout view="lHh LpR lFf">

    <q-drawer show-if-above :breakpoint="0" :width="isExpanded ? 250 : 60" @mouseover="isExpanded = true"
      @mouseleave="handleDrawerMouseLeave" class="bg-dark-page text-white" v-if="!route.meta.hideHeaderAuth">

      <q-list class="column full-height">
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

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" :is-expanded="isExpanded" />
        <q-space />
        <div class="row full-width no-wrap items-end q-pb-lg" style="height: 70px;">
          <div class="col-auto row justify-center items-center" style="width: 60px;">
            <q-avatar size="40px">
              <img :src="avatarStore.selectedAvatarUrl" style="border: 2px solid white"> </q-avatar>
          </div>
          <div v-show="isExpanded" class="row no-wrap items-center">
            <div class="col q-pl-sm" style="width: 130px;">
              <div class="text-weight-bold ellipsis">{{ userStore.currentUser?.nome }}</div>
              <div
              class="text-caption text-grey-5 ellipsis"
              v-if="userStore.currentUser?.nickname"
              >@{{userStore.currentUser?.nickname }}</div>
            </div>
            <div class="col-auto no-wrap">
              <q-btn icon="more_vert" flat round dense >
                <q-menu
                  auto-close
                  anchor="top end"
                  self="bottom right"
                  class="bg-dark"
                  @mouseover="isMouseOverMenu = true"
                  @mouseleave="handleMenuMouseLeave"
                  ref="userMenu"
                >
                  <q-list dense class="bg-dark text-white q-pa-sm">

                    <q-item
                      clickable
                      v-close-popup
                      to="/editarUsuario"
                      class="text-white"
                    >
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Editar perfil</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="handleLogout"
                      class="text-white "
                    >
                      <q-item-section avatar>
                        <q-icon name="logout" />
                      </q-item-section>
                      <q-item-section>Logout</q-item-section>
                    </q-item>

                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn icon="settings" to="/settings" flat round dense />
            </div>
          </div>
        </div>
      </q-list>

    </q-drawer>

    <q-page-container class="bg-dark text-white q-pb-xs">
      <div class="text-h4 text-bold q-pa-md q-ml-lg" v-if="!route.meta.hideHeaderAuth">
        <div class="row">
          {{ pageTitle }}
          <q-space />
          <div class="col-xs-12 col-sm-5 q-pa-sm">
            <SecaoNivelXP v-if="!route.meta.hideHeaderElement && userStore.isAluno" />
          </div>
        </div>
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from 'stores/userStore'
import { useAvatarStore } from 'src/stores/avatarStore';

import EssentialLink from 'components/EssentialLink.vue'
import SecaoNivelXP from 'src/components/nivelXP/SecaoNivelXP.vue';

const userStore = useUserStore();
const avatarStore = useAvatarStore();
const router = useRouter();
const route = useRoute()

const isExpanded = ref(false)
const isMouseOverMenu = ref(false)
const userMenu = ref(null);

const headerTitle = 'XP Learn'
const pageTitle = computed(() => route.meta.title || 'Página')


const linksList = computed(() => {
  const links = [
    {
      title: 'Home',
      icon: 'home',
      link: '/home'
    }
  ]

  if (userStore.currentUser?.role !== 'professor') {
    links.push({
      title: 'Atividades',
      icon: 'list',
      link: '/atividades',
    })
  }

  links.push(
    {
      title: 'Ranking',
      icon: 'leaderboard',
      link: '/ranking',
    },
    {
      title: 'Turmas',
      icon: 'groups',
      link: '/turmas',
      active: route.path.startsWith('/turmas')
    },
    {
      title: 'Badges',
      icon: 'military_tech',
      link: '/badges',
    }
  )

  return links
})

const handleLogout = () => {
  userStore.logout(router)
}

const handleDrawerMouseLeave = () => {
  setTimeout(() => {
    if (!isMouseOverMenu.value) {
      isExpanded.value = false;
      if (userMenu.value) {
          userMenu.value.hide()
        }
    }
  }, 100);
}

const handleMenuMouseLeave = () => {
  isMouseOverMenu.value = false;
  isExpanded.value = false;
}

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
