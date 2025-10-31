<template>
    <q-dialog v-model="abrirModalAvatares" >
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Escolha seu Avatar</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="q-gutter-md row justify-center">

                    <q-img 
                        :src="avatarStore.items[index - 1] ? avatarStore.items[index - 1].avatar : emptySlot" 
                        width="100px" 
                        height="100px" 
                        style="border-radius: 8px;"
                    />
                </div>
            </q-card-section>

        </q-card>
    </q-dialog>
</template>

<script setup>


</script>