<template>
  <v-row class="mt-10 justify-center ">
    <v-btn size="small" class="custom-radius mr-2" :disabled="currentPage === 1" @click="$emit('updatePage', currentPage - 1)">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <v-btn size="small" class="custom-radius mr-2" v-for="page in visiblePages" :key="page"
      :color="currentPage === page ? 'primary' : ''" @click="$emit('updatePage', page)">
      {{ page }}
    </v-btn>

    <v-btn v-if="totalPages > maxVisiblePages && visiblePages.length < totalPages" @click="$emit('nextPages')"></v-btn>

    <v-btn size="small" class="custom-radius" :disabled="currentPage === totalPages"
      @click="$emit('updatePage',currentPage + 1)"><v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </v-row>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 10
  },
});

const visiblePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
  const endPage = Math.min(startPage + props.maxVisiblePages - 1, props.totalPages);

  for(let page = startPage; page <= endPage; page++){
    pages.push(page);
  }
  return pages;
});
</script>
<style scoped>
.custom-radius{
  border-radius: 10px!important;
}
</style>