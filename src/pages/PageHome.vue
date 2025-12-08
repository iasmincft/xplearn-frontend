
<template>
  <q-page padding class="q-ma-lg">
    <div class="q-pa-md">

      <q-card rounded class="bg-dark-page q-pa-sm " flat>
        <q-card-section>
          <div class="row items-center">
            <q-avatar size="100px">
              <img :src="avatarStore.selectedAvatarUrl"
              style="border-radius: 50px; border: 3px solid white "
              >
            </q-avatar>
            <div class="q-ml-lg">
              <div class="text-h4">{{ userStore.currentUser?.nome }}</div>
              <div
              class="text-grey-5"
              v-if="userStore.currentUser?.nickname"
              >@{{userStore.currentUser?.nickname }}</div>
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-5 q-pr-lg">
              <SecaoNivelXP
                v-if="userStore.isAluno"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-xl">

        <div class="col-12 col-md-7">

          <div style="width: fit-content;">
            <div class="text-h5 q-pt-xl q-mb-md">Atividades</div>
              <q-card rounded class="bg-dark-page q-pa-sm" style="width: fit-content;" flat >
                <q-list>
                  <router-link
                    style="text-decoration: none;"
                    :to="{ path: '/atividades', query: { tab: 'pendentes' } }"
                  >
                    <q-item class="bgdark">
                      <q-chip clickable class="bg-dark text-white" style="width: 190px;">
                        <span class="q-pr-lg ">Atividades Pendentes:</span>
                        <q-avatar class="q-ml-md" color="secondary" text-color="white" size="24px">
                          2
                        </q-avatar>
                      </q-chip>
                    </q-item>
                  </router-link>
                  <router-link
                    style="text-decoration: none;"
                    :to="{ path: '/atividades', query: { tab: 'concluidas' } }"
                  >
                    <q-item>
                      <q-chip clickable class="bg-dark text-white" style="width: 190px;">
                        <span class="q-pr-lg ">Atividades Concluídas:</span>
                        <q-avatar class="q-ml-md" color="secondary" text-color="white" size="24px">
                          0
                        </q-avatar>
                      </q-chip>
                    </q-item>
                  </router-link>
                </q-list>
              </q-card>
            </div>
          <div style="width: fit-content;" v-if="userStore.isAluno">
            <div class="text-h5 q-mb-md q-pt-xl">Badges</div>
            <div class="row q-gutter-md">
              <div
                v-for="index in slotsVisiveis"
                :key="`home-slot-${index}`"
              >
                <q-avatar size="90px">
                  <q-img
                    :src="badgeStore.items[index - 1] ? badgeStore.items[index - 1].badge : emptySlotImage"
                  >
                    <q-tooltip>
                      {{ badgeStore.items[index - 1] ? badgeStore.items[index - 1].nome : 'Slot Vazio' }}
                    </q-tooltip>
                  </q-img>
                </q-avatar>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">

          <RankingTurma
            v-if="userStore.isAluno"
          />

          <Turmas
            v-if="userStore.isProfessor"
          />

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useBadgeStore } from 'src/stores/badgeStore';
import { useUserStore } from 'src/stores/userStore';
import { useAvatarStore } from 'src/stores/avatarStore';

import SecaoNivelXP from 'src/components/nivelXP/SecaoNivelXP.vue';
import RankingTurma from 'src/pages/PageRanking.vue'
import Turmas from "src/pages/PageTurmas.vue";

const badgeStore = useBadgeStore();
const userStore = useUserStore();
const avatarStore = useAvatarStore();

const slotsVisiveis = 5;
const emptySlotImage = '/emptyBadgeSlot.png';

</script>

<style lang="scss" scoped>
.q-card {
  border-radius: 8px;
}
</style>
