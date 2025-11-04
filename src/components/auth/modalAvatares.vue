<template>
    <q-card class="bg-dark" style="width: 700px; max-width: 80vw;" @close="$emit('close')">
        <q-card-section>
            <div class="text-h6 text-white">Escolha seu Avatar</div>
        </q-card-section>


        <q-card-section class="q-pt-none">
            <div class="q-gutter-md row justify-center">

                <q-img 
                    v-for="avatar in avatarStore.items" 
                    :key="avatar.id" 
                    :src="avatar.caminho_foto"
                    @click="selectAvatar(avatar.id)" 
                    width="100px" 
                    height="100px" 
                    style="border-radius: 50px; border: 2px solid #162646 "
                    class="q-hoverable transition-all"
                    :class="{ 'q-hovered': avatarStore.selectedAvatarId === avatar.id }"/>
            </div>
        </q-card-section>

    </q-card>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAvatarStore } from 'src/stores/avatarStore';

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/* const getAvatarFullPath = (caminhoFoto) => {
    return `/static${caminhoFoto}`;
};
*/

const avatarStore = useAvatarStore();

const dialogVisible = ref(true);
const open = () => {
    dialogVisible.value = false;
};
const emit = defineEmits(['close']);
defineExpose({ open });


onMounted(() => {
    avatarStore.fetchAvatares();
});

const selectAvatar = (avatarId) => {
    //index.value = avatarId;
    avatarStore.setAvatar(avatarId);


    emit('close');
};

</script>