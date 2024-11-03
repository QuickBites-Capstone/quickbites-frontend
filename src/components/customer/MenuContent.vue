<template>
  <div>
    <v-container fluid>
      <v-col>
        <SearchBar @select-product="navigateToCategory" />
      </v-col>
      <v-row class="category-container my-3">
        <div v-for="category in categories" :key="category.id" class="category-wrapper"
          :class="{ active: category.id === activeCategory }">
          <v-card :class="['category-card custom-radius', { active: category.id === activeCategory }]"
            @click="setActiveCategory(category.id)" color="transparent" flat>
            <v-img :src="category.image" alt="Category Image" class="category-image" />
          </v-card>
          <div class="category-text">{{ category.name }}</div>
        </div>
      </v-row>
    </v-container>
    <CategoryContent :categoryId="activeCategory" v-if="activeCategory" :categories="categories"
      :highlightedProductId="highlightedProductId" :searchedProductId="searchedProductId" :products="products" />
    <AllProducts v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const categories = ref([]);
const activeCategory = ref(null);
const highlightedProductId = ref(null);
const searchedProductId = ref(null);
const products = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get("/api/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const setActiveCategory = (categoryId) => {
  activeCategory.value = activeCategory.value === categoryId ? null : categoryId;
};

const navigateToCategory = (categoryId, productId) => {
  activeCategory.value = categoryId;
  highlightedProductId.value = productId;
  searchedProductId.value = productId;
};

watch(activeCategory, async (newCategory) => {
  if (newCategory) {
    await fetchProductsForCategory(newCategory);
  }
});

const fetchProductsForCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/categories/${categoryId}/products`);
    products.value = response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.category-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.category-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s ease;
}

.category-card {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-image {
  width: 100%;
  height: auto;
}

.category-text {
  font-size: 10px;
  text-align: center;
  margin-top: 5px;
}

.category-card.active {
  transform: rotate(20deg);
}

.category-wrapper.active {
  background-color: #ccc !important;
  border-radius: 15px;
}
</style>
