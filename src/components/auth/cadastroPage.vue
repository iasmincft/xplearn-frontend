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
    <div class="text-center q-pb-md border-style">
        <q-btn 
            to="" 
            icon="edit"
            color="grey"
            unelevated
            round
            size="30px"
            style="border: 2px solid #8c52ff  "
        />
    </div>
    <q-input dense outlined v-model="email" label="Matrícula*" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="check" />
        </template>
    </q-input>
    <q-input dense outlined v-model="email" label="Nome*" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="person" />
        </template>
    </q-input>
    <q-input dense outlined v-model="email" label="Nickname" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="person" />
        </template>
    </q-input>
    
    
    <q-input dense outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Senha*" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="lock" />
        </template>
        <template v-slot:append>
            <q-icon v-if="password" name="close" @click="password = ''" class="cursor-pointer" />
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
        </template>
    </q-input>
    <q-input dense outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Confirmar senha*" class="q-pb-sm">
        <template v-slot:prepend>
            <q-icon name="lock" />
        </template>
        <template v-slot:append>
            <q-icon v-if="password" name="close" @click="password = ''" class="cursor-pointer" />
            <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
        </template>
    </q-input>
    
    <div class="text-center q-pt-md" >
        <q-btn class="gradient-button" label="Cadastrar"  />
    </div>
    
</template>
<script setup>
import { ref } from 'vue';


const email = ref('');
const password = ref('');
const isPwd = ref(true);
</script>

<style>
.gradient-button {
    background: linear-gradient(90deg, #5ce1e6, #8c52ff);
    color: white;
    width: 90%;
    border-radius: 8px;
}
</style>