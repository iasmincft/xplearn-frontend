<template>
    <div class="row items-center q-gutter-sm">
        <div class="text-subtitle1">Nível {{ userStore.currentUser.nivel }}</div>

        <q-linear-progress
            rounded
            size="15px"
            :value="progress"
            color="primary"
            class="q-mt-sm col"
        >
            <q-tooltip>
                {{ xpNoNivelAtual }} / {{ XP_POR_NIVEL }} XP neste nível
            </q-tooltip>
        </q-linear-progress>

        <div class="text-right text-caption text-grey-5 q-mt-xs">
            {{ xpNoNivelAtual }}/{{ XP_POR_NIVEL }} XP
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const XP_POR_NIVEL = 1000; 

const xpNoNivelAtual = computed(() => {
    const totalXp = Number(userStore.currentUser.xp) || 0;
    return totalXp % XP_POR_NIVEL;
});

const progress = computed(() => {
    if (xpNoNivelAtual.value === 0) return 0;
    return xpNoNivelAtual.value / XP_POR_NIVEL;
});
</script>
