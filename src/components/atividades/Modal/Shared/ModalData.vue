<template>
    <q-input filled :model-value="data" @update:model-value="$emit('update:data', $event)" label="Data de Entrega"
        id="data" name="data" mask="##/##/####" clearable>

        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale"
                    @before-show="$emit('open-date-picker')">

                    <q-date 
                        :model-value="data" 
                        @update:model-value="$emit('update:data', $event)"
                        mask="DD/MM/YYYY" 
                        color="primary" 
                        >
                        <div class="row items-center justify-end">
                            <q-btn 
                                v-close-popup 
                                label="Fechar" 
                                color="negative" 
                                flat 
                            />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script setup>


defineProps({
    data: {
        type: String,
        default: ''
    }
});

defineEmits(['update:data', 'open-date-picker']);


</script>