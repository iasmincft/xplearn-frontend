<template>
    <div class="row items-center q-gutter-sm">
        <div class="text-subtitle1">Nível {{ userStore.currentUser.nivel }}</div>
        <q-linear-progress
            rounded
            size="15px"
            :value="progress"
            color="primary"
            class="q-mt-sm col"
        />
        <div class="text-right text-caption text-grey-5 q-mt-xs">{{userStore.currentUser.xp}}/1000 XP</div>
    </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const progress = computed(() => {
    const currentXp = Number(userStore.currentUser.xp) || 0;

    if (currentXp === 0) return 0;

    return Math.min(currentXp / 1000, 1);
});
</script>
