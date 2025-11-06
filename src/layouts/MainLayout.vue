<template>
  <q-layout view="lHh LpR lFf">

    <q-drawer show-if-above :breakpoint="0" :width="isExpanded ? 250 : 60" @mouseover="isExpanded = true"
      @mouseleave="isExpanded = false" class="bg-dark-page text-white" v-if="!route.meta.hideHeaderAuth">

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
              <div class="text-weight-bold ellipsis">Jane Doe</div>
              <div class="text-caption text-grey-5 ellipsis">@janedoe</div>
            </div>
            <div class="col-auto no-wrap">
              <q-btn icon="more_vert" to="/auth/login" flat round dense />
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
          <div>
            <q-btn-toggle 
              v-model="userRole" 
              class="my-custom-toggle" 
              no-caps 
              rounded 
              unelevated 
              toggle-color="primary"
              color="white" 
              text-color="primary" 
              :options="[
                { label: 'Aluno', value: 'aluno' }, 
                { label: 'Professor', value: 'professor' }]" 
            />
          </div>
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
import { useRoute } from 'vue-router'
import { useUserStore } from 'stores/userStore'
import { useAvatarStore } from 'src/stores/avatarStore';
import { onMounted } from 'vue';


import EssentialLink from 'components/EssentialLink.vue'
import SecaoNivelXP from 'src/components/nivelXP/SecaoNivelXP.vue';

const userStore = useUserStore()
const avatarStore = useAvatarStore();

const isExpanded = ref(false)

const headerTitle = 'XP Learn'
const route = useRoute()
const pageTitle = computed(() => route.meta.title || 'Página')

const userRole = computed({
  get: () => userStore.currentUser.role,
  set: (newRole) => userStore.setRole(newRole)
})


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

]

onMounted(async () => {
  
    if (avatarStore.items.length === 0) {
        await avatarStore.fetchAvatares();
    }

    if (userStore.isAluno && userStore.dadosDoAluno.avatar_id) {
      avatarStore.setAvatar(userStore.dadosDoAluno.avatar_id);
    }
});

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
