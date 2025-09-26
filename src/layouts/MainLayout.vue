<template>
  <q-layout view="lHh lpR lFf">

    <q-drawer 
      bordered
      :width="250"
      :mini-width="60"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseleave="miniState = true"
      mini-to-overlay
      class="bg-dark"
      show-if-above
      :breakpoint="0" 
    >
      <q-list >
        <q-item style="height: 70px;" class="q-py-sm">
          
          <q-item-section
            avatar
            class="row justify-center items-center"
            style="width: 60px;"
          >
            <q-img
              src="icons/favicon-128x128.png"
              style="width: 38px;"
              
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold text-white">{{ headerTitle }}</q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          class="text-white"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
    
const miniState = ref(true)

const headerTitle = 'XP Learn'

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/',
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
  transition: width 0.3s ease;
}
.q-drawer__content {
  overflow-x: hidden;
}

</style>

