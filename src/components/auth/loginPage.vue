<template>
    <div class="row no-wrap justify-center items-center" style="height: 70px;">
        <div class="q-pr-md">
            <q-img src="icons/favicon-128x128.png" style="width: 38px;" />
        </div>
        <div class="text-weight-bold ellipsis text-black text-h5">XP Learn</div>
    </div>

    <div class="q-py-md text-center">
        <div class="text-h6 text-semibold">Bem-Vindo ao XP Learn!</div>
        <div class="">Entre na sua conta para começar.</div>
    </div>
    
    <q-input outlined v-model="email" label="Matrícula" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="person" />
        </template>
    </q-input>
    
    <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Senha" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="lock" />
        </template>
        <template v-slot:append>
            <q-icon v-if="password" name="close" @click="password = ''" class="cursor-pointer" />
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
        </template>
    </q-input>
    
    <div class="text-center q-pb-sm" >
        <q-btn class="gradient-button" label="Entrar"  />
    </div>
    <div class="text-center q-pt-none">
        <q-btn 
            dense 
            flat 
            no-caps 
            :ripple="false"  
            label="Esqueceu a senha?" 
            text-color="primary" 
            style="text-decoration: underline;"
        />
        <div class="q-pt-md">
            Novo por aqui?
        </div>
        <q-btn 
            dense 
            flat 
            no-caps 
            :ripple="false" 
            label="Cadastre-se" 
            text-color="primary" 
            style="text-decoration: underline;"
            to="/auth/cadastro"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';


const email = ref('');
const password = ref('');
const isPwd = ref(true);


</script>

<style scoped>


.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
    border-radius: 8px;
}

</style>