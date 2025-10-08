<template>
  <q-page class="q-pa-lg column no-wrap">
    <div class="q-pl-xl">
      <div class="text-h5">Conquistados</div>
      <div class="row q-pt-md q-gutter-sm">
        <div 
          v-for="index in maxSlots"
          :key="`slot-${index}`"
        >
          <q-img 
            :src="badgeStore.items[index - 1] ? badgeStore.items[index - 1].badge : emptySlot" 
            width="100px" 
            height="100px" 
            style="border-radius: 8px;"
          >
            <q-tooltip>
              {{ badgeStore.items[index - 1] ? badgeStore.items[index - 1].nome : 'Slot Vazio' }}
            </q-tooltip>
          </q-img>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useBadgeStore } from 'src/stores/badgeStore';

const badgeStore = useBadgeStore();

const maxSlots = 20;
const emptySlot = '/emptyBadgeSlot.png'
</script>
