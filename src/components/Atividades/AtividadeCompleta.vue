<template>
    <transition
        leave-active-class="animated zoomOut"
    >

    <div
        v-if="atividadesStore.atividadesCompletas.length"
    >

    <AtividadeItem
        v-for="atividade in atividadesStore.atividadesCompletas"
        :key="atividade.id"
        :atividade="atividade"
        @toggle-atividade="atividadesStore.alternarConcluida"
    />

    </div>

    </transition>
</template>

<script setup>
import { useAtividadesStore } from 'src/stores/atividadesStore';
import AtividadeItem from './AtividadeItem.vue';

const atividadesStore = useAtividadesStore();
</script>