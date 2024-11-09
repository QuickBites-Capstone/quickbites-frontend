<template>
  <v-col>
    <v-row v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary" size="32" width="4" />
    </v-row>

    <v-row v-if="error" class="d-flex justify-center">
      <p>{{ error }}</p>
    </v-row>

    <v-row v-if="!loading && !error && filteredProducts.length > 0">
      <ProductTable :products="paginatedFilteredProducts" :updateProduct="updateProduct"
        :deleteProduct="deleteProduct" />
    </v-row>

    <v-row v-if="!loading && !error && filteredProducts.length === 0">
      <v-card class="w-100 custom-radius">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Image</th>
              <th class="text-left">Name</th>
              <th class="text-left">Quantity</th>
              <th class="text-left">Price</th>
              <th class="text-left">Availability</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" class="text-center">No Data</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-row>

    <v-row v-if="filteredProducts.length > 0 && !loading && !error">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" :maxVisiblePages="10" @updatePage="onUpdatePage"
        @nextPages="onNextPage" />
    </v-row>
  </v-col>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';


const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const error = ref(null);
const products = ref([]);
const isUpdating = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(5);

const filteredProducts = ref([]);

const paginatedFilteredProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredProducts.value.slice(start, end);
});

const fetchProducts = async () => {
  loading.value = true;
  products.value = [];
  filteredProducts.value = [];
  totalPages.value = 1;

  try {
    let page = 1;
    const searchQueryLower = (props.searchQuery || "").toLowerCase();

    while (true) {
      const response = await axios.get(
        `/api/products?page=${page}&per_page=${perPage.value}&category=${props.category}`
      );
      const pageProducts = response.data.products;

      const matchingProducts = pageProducts.filter(product =>
        product.name?.toLowerCase().includes(searchQueryLower) &&
        !filteredProducts.value.some(existingProduct => existingProduct.id === product.id)
      );

      if (matchingProducts.length > 0) {
        filteredProducts.value.push(...matchingProducts);
      }

      if (page >= response.data.last_page) {
        break;
      }
      page++;
    }

    totalPages.value = Math.ceil(filteredProducts.value.length / perPage.value);

    if (filteredProducts.value.length === 0) {
      currentPage.value = 1;
    }

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }

  } catch (err) {
    error.value = 'Failed to fetch products. Please try again.';
    // console.error(err);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchProducts = debounce(() => {
  fetchProducts();
}, 500);

const onUpdatePage = (page) => {
  if (page > totalPages.value || page < 1) return;
  currentPage.value = page;
  fetchProducts();
};

const onNextPage = () => {
  if (currentPage.value < totalPages.value) {
    onUpdatePage(currentPage.value + 1);
  }
};

const updateProduct = async (product) => {
  isUpdating.value = true;
  try {
    await axios.put(`/api/products/${product.id}`, {
      name: product.name,
      stock_quantity: product.stock_quantity,
      price: product.price,
    });
    window.$snackbar('Product updated successfully', 'success');
    product.isEditing = false;
  } catch (error) {
    window.$snackbar(error.response?.data?.message || 'Error updating product.', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const deleteProduct = async (productId) => {
  try {
    await axios.delete(`/api/products/${productId}`);
    window.$snackbar('Product deleted successfully', 'success');
    products.value = products.value.filter(product => product.id !== productId);
    filteredProducts.value = filteredProducts.value.filter(product => product.id !== productId);
    fetchProducts();
  } catch (error) {
    window.$snackbar(error.response?.data?.message || 'Error deleting product.', 'error');
  }
};

watch(() => props.searchQuery, () => {
  currentPage.value = 1;
  debouncedFetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.custom-radius {
  border-radius: 12px;
}
</style>
