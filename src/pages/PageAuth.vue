<template>
    <q-page class="bg-dark-page flex flex-center auth-bg">
        <q-card class="q-pa-xl text-black" style="background: white">
            <router-view />
        </q-card>
    </q-page>
</template>

<script setup>

</script>

<style scoped>

.auth-bg {
    background-image: url('/bg.png');
    background-size: 800px;
    background-position: center;
    background-repeat: no-repeat;
}


</style>
