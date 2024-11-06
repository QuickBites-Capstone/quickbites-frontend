<template>
  <div>
    <v-card>
      <v-layout>
        <v-main>
          <v-app class="px-5 py-5">
            <v-col>
              <v-col>
                <h1 class="page-title">Products</h1>
              </v-col>

              <v-col>
                <v-row>
                  <v-card class="custom-radius d-flex align-center justify-center">
                    <v-tabs v-model="tab" color="primary">
                      <v-tab class="custom-radius my-auto" value="meals">Meals</v-tab>
                      <v-tab class="custom-radius my-auto" value="snacks">Snacks</v-tab>
                      <v-tab class="custom-radius my-auto" value="chips">Chips</v-tab>
                      <v-tab class="custom-radius my-auto" value="candies">Candies</v-tab>
                      <v-tab class="custom-radius my-auto" value="drinks">Drinks</v-tab>
                      <v-tab class="custom-radius my-auto" value="supplies">Supplies</v-tab>
                    </v-tabs>
                  </v-card>
                  <v-spacer class="custom-spacer"></v-spacer>
                  <v-row class="align-center">
                    <v-text-field v-model="searchQuery" max-width="300px" class="custom-radius mr-5" height="5px"
                      style="height: 60px;" dense variant="outlined" label="Search product"
                      prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                    <AddNewProduct />
                  </v-row>
                </v-row>
              </v-col>

              <v-card-text>
                <v-tabs-items v-model="tab">
                  <v-tab-item v-for="category in ['meals', 'snacks', 'chips', 'candies', 'drinks', 'supplies']"
                    :key="category" :value="category">
                    <ProductCategory v-if="tab === category" :category="category" :searchQuery="searchQuery" />
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-col>
          </v-app>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const tab = ref("meals");
const searchQuery = ref('');

const onInputChange = () => {
  if (searchQuery.value) {
    searchProducts();
  } else {
    resetProducts();
  }
};

const searchProducts = async () => {
  try {
    const response = await axios.get(`/api/search-products`, {
      params: {
        searchTerm: searchQuery.value,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const resetProducts = async () => {
  try {
    await axios.get(`/api/products`, {
      params: {
        category: tab.value,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

watch(tab, () => {
  searchQuery.value = '';
  resetProducts();
});
</script>


<style scoped>
.custom-spacer {
  width: 0 !important;
}

.custom-radius {
  border-radius: 10px !important;
}
</style>
