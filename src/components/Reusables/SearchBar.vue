<template>
  <v-row class="mt-1 mb-5" style="position: relative;">
    <v-row class="justify-center">
      <v-text-field
        v-model="searchQuery"
        class="custom-radius w-100"
        height="30px"
        :label="searchLabel"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        clearable
        hide-details="auto"
        @input="handleSearch"
        @focus="onFocus"
        @blur="closeSuggestions"
        @click:clear="clearSearch"
        solo
      />
    </v-row>

  
    <v-list
      v-if="showSuggestions && (suggestions.length > 0 || (hasSearched && suggestions.length === 0))"
      class="suggestions-dropdown"
      style="position: absolute; z-index: 10; top: 50px; width: 100%; background-color: white; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;"
    >
 
      <v-list-item v-if="hasSearched && suggestions.length === 0">
        <v-list-item-title>No items found</v-list-item-title>
      </v-list-item>

    
      <v-list-item
        v-for="item in suggestions"
        :key="item.id"
        @click="selectSuggestion(item)"
        v-else
      >
        <v-list-item-title>
          {{ item.name }} 
          <small>({{ item.category.name }})</small>
          <span v-if="item.label" class="badge" :style="getBadgeStyle(item.label)">
            {{ item.label }}
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';
import { debounce } from 'lodash';

const props = defineProps({
  searchLabel: {
    type: String,
    default: 'Search for an item',
  },
});

const emit = defineEmits(['select-product']);
const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const hasSearched = ref(false);

const handleSearch = debounce(async () => {
  if (searchQuery.value.trim()) {
    hasSearched.value = true;
    try {
      const response = await axios.get(`/api/search`, {
        params: { query: searchQuery.value },
      });
      const products = response.data;
      const searchedProduct = products.find(item => item.name.toLowerCase() === searchQuery.value.toLowerCase());
      if (searchedProduct) {
        const filteredProducts = products.filter(item => item.id !== searchedProduct.id);
        suggestions.value = [searchedProduct, ...filteredProducts];
      } else {
        suggestions.value = products;
      }

      showSuggestions.value = true;
    } catch (err) {
      console.error(`Failed to fetch search suggestions:`, err);
    }
  } else {
    suggestions.value = [];
    showSuggestions.value = false; 
    hasSearched.value = false; 
  }
}, 300);

const onFocus = () => {
  if (searchQuery.value.trim()) {
    showSuggestions.value = true;
  }
};

const selectSuggestion = (item) => {
  emit('select-product', item.category.id, item.id);
  searchQuery.value = item.name;
  suggestions.value = [];
  showSuggestions.value = false; 
  hasSearched.value = false; 
};

const clearSearch = () => {
  searchQuery.value = ''; 
  suggestions.value = [];   
  showSuggestions.value = false; 
  hasSearched.value = false; 
};

const closeSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const getBadgeStyle = (label) => {
  switch (label.toLowerCase()) {
    case 'hot':
      return { backgroundColor: 'red' };
    case 'best seller':
      return { backgroundColor: 'gold' }; 
    case 'new':
      return { backgroundColor: 'green' };
    default:
      return { backgroundColor: 'gray' }; 
  }
};
</script>

<style scoped>
.suggestions-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
.badge {
  color: white;
  padding: 2px 10px;
  border-radius: 12px; 
  margin-left: 10px; 
  font-size: 0.8rem;
  display: inline-block; 
}
</style>
