<template>
    <q-page class="bg-dark-page flex flex-center auth-bg">
        <q-card class="q-pa-xl text-black" style="background: white">
            <q-card-section>
                <div class="row no-wrap items-center" style="height: 70px;">
                    <div class="col-auto row justify-center items-center" style="width: 60px;">
                        <q-img src="icons/favicon-128x128.png" style="width: 38px;" />
                    </div>
                    <div class="col q-pl-md">
                        <div class="text-weight-bold ellipsis text-black text-h5">XP Learn</div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none text-center">
                <div class="text-h6">Bem-Vindo ao XP Learn!</div>
                <div class="">Entre na sua conta para começar.</div>
            </q-card-section>
            <q-card-section>
                <q-input outlined v-model="email" label="Matrícula">
                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section>
                <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Senha" >
                    <template v-slot:prepend>
                        <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                        <q-icon v-if="password" name="close" @click="password = ''" class="cursor-pointer" />
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section class="text-center">
                <q-btn class="gradient-button" label="Entrar"  />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';


const email = ref('');
const password = ref('');
const isPwd = ref(true);

</script>

<style scoped>

.auth-bg {
    background-image: url('public/bg.png');
    background-size: 700px;
    background-position: center;
    background-repeat: no-repeat;
}

.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
}
</style>