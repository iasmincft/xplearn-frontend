<template>
    <div class="row items-center relative-position q-mb-lg">
        <q-btn 
            to="/auth/login" 
            icon="chevron_left"
            color="secondary"
            class="absolute-left"
            unelevated
            round
            dense
        />
        <div class="col text-center text-weight-bold ellipsis text-black text-h5">Cadastrar</div>
    </div>
    
    <q-form @submit.prevent="onSubmit">
        <div class="text-center q-pb-md border-style">
            <q-btn  
                icon="edit"
                color="grey"
                unelevated
                round
                size="30px"
                style="border: 2px solid #8c52ff"
                @click="abrirModalAvatares = true"
            />
            <ModalAvatares v-model="abrirModalAvatares" />
            
        </div>
        <q-input 
            dense 
            outlined 
            v-model="formData.matricula" 
            label="Matrícula*" 
            class="q-pb-sm"
            hide-bottom-space
            bottom-slots
            type="tel" 
            placeholder="Matrícula" 
            :rules="[
                val => (val && val.length > 0) || 'Campo obrigatório',
                val => /^[0-9]+$/.test(val) || 'Use apenas números',
                val => (val.length === 7 || val.length === 12) || 'A matrícula deve ter 7 (professor) ou 12 (aluno) dígitos'
            ]"
            maxlength="12"
            lazy-rules
        >
            <template v-slot:prepend>
                <q-icon name="check" />
            </template>
        </q-input>

        <q-input 
            dense 
            outlined 
            v-model="formData.nome" 
            label="Nome*" 
            class="q-pb-sm"
            hide-bottom-space
            :rules="[
                val => (val && val.length > 0) || 'Campo obrigatório'
            ]"
            bottom-slots
        >
            <template v-slot:prepend>
                <q-icon name="person" />
            </template>
        </q-input>

        <q-input 
            dense 
            outlined 
            v-model="formData.nickname" 
            label="Nickname" 
            class="q-pb-sm"
            hide-bottom-space
            bottom-slots
        >
            <template v-slot:prepend>
                <q-icon name="person" />
            </template>
        </q-input>

        <q-input 
            dense 
            outlined 
            v-model="formData.senha" 
            :type="isSenhaVisible ? 'text' : 'password'" 
            label="Senha*" 
            class="q-pb-sm"
            hide-bottom-space
            lazy-rules
            :rules="[
                val => (val && val.length > 0) || 'Campo obrigatório',
                val => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']"
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

        <q-input 
            dense 
            outlined 
            v-model="formData.confirmarSenha" 
            :type="isConfirmarVisible ? 'text' : 'password'" 
            label="Confirmar senha*" 
            class="q-pb-sm"
            hide-bottom-space
            lazy-rules
            :rules="[
                val => (val && val.length > 0) || 'Campo obrigatório',
                val => val === formData.senha || 'As senhas não são iguais'
            ]"
        >
            <template v-slot:prepend>
                <q-icon name="lock" />
            </template>

            <template v-slot:append>
                <q-icon v-if="formData.confirmarSenha" name="close" @click="formData.confirmarSenha = ''" class="cursor-pointer" />
                <q-icon :name="isConfirmarVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                    @click="isConfirmarVisible = !isConfirmarVisible" />
            </template>
        </q-input>
        
        <div class="text-center q-pt-md" >
            <q-btn class="gradient-button" label="Cadastrar" type="submit" />
        </div>
    </q-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { api } from 'boot/axios'; // Importe da 'api' 
import { useQuasar } from 'quasar'; // Para mostrar pop-ups (feedback)
import { useRouter } from 'vue-router';// Para navegar após o cadastro
import ModalAvatares from './modalAvatares.vue'; 

const $q = useQuasar();
const router = useRouter();

const formData = reactive({
    matricula: '',
    nome: '',
    nickname: '',
    senha: '',
    confirmarSenha: ''
});

const isSenhaVisible = ref(false);
const isConfirmarVisible = ref(false);

const abrirModalAvatares = ref(false);

async function onSubmit() {
    // Decide qual URL chamar baseado no tamanho da matrícula
    const isAluno = formData.matricula.length === 12;
    const isProfessor = formData.matricula.length === 7;

    try {
        let payload;
        let url;

        if (isAluno) {
            // Monta o pacote de dados (payload) como a API de Aluno espera
            url = '/alunos'; //
            payload = {
                matricula: formData.matricula,
                nome: formData.nome,
                nickname: formData.nickname,
                senha: formData.senha,
                xp: 0,
                nivel: 1,
                avatar_id_fk: 1 // Valor padrão
            };
        } else if (isProfessor) {
            // Monta o payload como a API de Professor espera
            url = '/professores'; //
            payload = {
                matricula: formData.matricula,
                nome: formData.nome,
                senha: formData.senha,
                avatar_id_fk: 1 // Valor padrão
            };
        } else {
            throw new Error('Matrícula inválida.');
        }
        await api.post(url, payload);

        // 
        $q.notify({
            color: 'positive',
            position: 'top',
            message: 'Cadastro realizado com sucesso!',
            icon: 'check_circle'
        });
        
        router.push('/auth/login'); // Navega para o login

    } catch (error) {
        // Erro se a matrícula já existe ou outro problema
        console.error('Erro no cadastro:', error);
        $q.notify({
            color: 'negative',
            position: 'top',
            message: error.response?.data?.detail || 'Falha no cadastro. Tente novamente.',
            icon: 'report_problem'
        });
    }
}
</script>

<style>
.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
    border-radius: 8px;
}
</style>