<template>
  <q-item
    clickable
    tag="a"
    :href="props.link"
  >
    <q-item-section
     v-if="props.icon"
      avatar
      class="row justify-center items-left">
      <q-icon :name="props.icon" />
      
    </q-item-section>
    <q-item-section
      v-if="props.icon"
      avatar
      class="row justify-center items-center"
      style="width: 60px;"
    >

      <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
        <strong>{{ title }}</strong>
      </q-tooltip>

    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
// seu script permanece o mesmo
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>