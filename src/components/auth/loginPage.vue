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
    <q-form @submit.prevent="onSubmit">
        <q-input 
            outlined 
            v-model="formData.matricula" 
            label="Matrícula" 
            class="q-pb-sm" 
            type="tel" 
            placeholder="Matrícula" 
            :rules="[
            val => (val && val.length > 0) || 'Campo obrigatório',
            val => /^[0-9]+$/.test(val) || 'Use apenas números',
            val => (val.length === 7 || val.length === 12) || 'A matrícula deve ter 7 (professor) ou 12 (aluno) dígitos'
            ]"
            maxlength="12"
            lazy-rules
            bottom-slots
            hide-bottom-space
            >
            <template v-slot:prepend>
                <q-icon name="person" />
            </template>
        </q-input>
        
        <q-input 
            outlined 
            v-model="formData.senha" 
            :type="isSenhaVisible ? 'text' : 'password'"
            label="Senha" 
            class="q-pb-sm" 
            lazy-rules
            :rules="[
                val => !!val || 'Insira a senha.',
                val => val.length >= 6 || 'A senha deve ter pelo menos 6 caracteres.'
            ]" 
            bottom-slots
            hide-bottom-space
        >
            <template v-slot:prepend>
                <q-icon name="lock" />
            </template>
            <template v-slot:append>
                <q-icon v-if="formData.senha" name="close" @click="formData.senha = ''" class="cursor-pointer" />
                <q-icon :name="isSenhaVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                    @click="isSenhaVisible = !isSenhaVisible" />
            </template>
        </q-input>
        
        <div class="text-center q-pb-sm" >
            <q-btn class="gradient-button" label="Entrar" type="submit" />
        </div>
    </q-form>
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
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';
//import { api } from 'boot/axios';

const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();

const formData = reactive({
    matricula: '',
    senha: '',
});
const isSenhaVisible = ref(false);


async function onSubmit() {
    try {
        await userStore.login(formData.matricula, formData.senha);
        $q.notify({
            color: 'positive',
            position: 'top',
            message: 'Login realizado com sucesso!',
            icon: 'check_circle'
        });
        router.push('/home');
    } catch (error) {
        // Erro se a matrícula já existe ou outro problema
        console.error('Erro no login:', error.response?.data?.detail || error.message);
        $q.notify({
            color: 'negative',
            position: 'top',
            message: error.response?.data?.detail || 'Falha no login. Tente novamente.',
            icon: 'report_problem'
        });
    }
}

</script>

<style scoped>

.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
    border-radius: 8px;
}

</style>