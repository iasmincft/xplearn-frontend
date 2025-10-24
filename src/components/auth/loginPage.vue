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
    
    <ModalMatricula ref="matricuaRef" />
    
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
        <q-btn class="gradient-button" label="Entrar" @click="handleLogin" />
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
import ModalMatricula from './shared/ModalMatricula.vue';
import { useUserStore } from 'stores/userStore';
import { useRouter } from 'vue-router';

const password = ref('');
const isPwd = ref(true);
const matriculaRef = ref(null); // Ref para o componente filho
const userStore = useUserStore();
const router = useRouter();

const handleLogin = () => {
    
    const matriculaValue = matriculaRef.value?.matricula.value; 

    if (!matriculaValue) {
        // Lógica de erro para campo vazio, se necessário
        return; 
    }

    // Chama a lógica de login com a matrícula
    const result = userStore.loginByMatricula(matriculaValue);

    if (result.success) {
        router.push('/home');
    } else {
        // Lógica para exibir erro no loginPage, se houver
        console.error(result.message);
        // Você precisaria de um estado de erro aqui para exibir na tela
    }
};
</script>

<style scoped>

.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
    border-radius: 8px;
}

</style>