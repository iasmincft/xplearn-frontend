<template>
  <q-expansion-item
    class="q-list-bordered"
    header-class="q-pa-lg"
  >

    <template v-slot:header>
      
      <q-item-section avatar>
        <q-icon color="primary" name="assignment" class="text-h5" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ atividade.titulo }}</q-item-label>
        <q-item-label caption class="text-grey-5">Entrega: {{ atividade.data }}</q-item-label>
      </q-item-section>

      </template>

    <q-card class="bg-dark-page text-white q-pl-md" flat>

    <q-card-section>
      Descrição...
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row items-center">

        <div class="col q-mr-xl">
          Valor:
        </div>

        <div class="col q-mr-xl">
            Prêmio:
        </div>

        <div class="col">
            Badge:
        </div>

      </div>
    </q-card-section>

  </q-card>

  </q-expansion-item>
</template>

<script setup>
defineProps({
  atividade: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss">
.q-list-bordered {
  background-color: $dark-page;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: border-radius 0.3s ease-in-out;
}


</style>