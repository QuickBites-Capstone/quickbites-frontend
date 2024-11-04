<template>
  <v-col class="mx-0 px-1">
    <h3 class="mb-2">{{ categoryName }}</h3>

    <v-row v-if="loading && products.length === 0">
      <v-col>
        <p>Loading products...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="hasProducts">
      <v-col v-for="product in sortedProducts" :key="product.id" cols="12" sm="6" md="4">
        <v-card class="custom-radius product-card py-2" height="90" :class="{ disabled: product.stock_quantity === 0 }">
          <v-card class="custom-radius product-image-holder">
            <v-img :src="product.image_url" alt="Product Image" class="product-image" height="100%" width="100%"
              cover />
          </v-card>
          <v-col class="pa-0">
            <v-card-title class="text-subtitle-1 py-0 text-wrap">
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle class="text-subtitle-2 py-0">
              {{ "₱" + product.price.toFixed(2) }}
            </v-card-subtitle>
            <v-card-subtitle class="text-subtitle-2 py-0">
              <small v-if="product.stock_quantity >= 1">{{ product.stock_quantity }} Available</small>
              <small v-else>Sold Out</small>
            </v-card-subtitle>
          </v-col>
          <v-btn @click.prevent="addToCart(product)" color="primary add-button" size="" height="100">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <p>No products available for this category.</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import { cart } from "@/stores/cart";
import { getAuth } from '@/pages/auth/authServiceProvider/authService';

const props = defineProps({
  categoryId: Number,
  categories: {
    type: Array,
    required: true,
  },
  highlightedProductId: {
    type: Number,
    default: null,
  },
  searchedProductId: {
    type: Number,
    default: null,
  },
});

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMoreProducts = ref(true);

const categoryName = computed(() => {
  const category = props.categories.find((category) => category.id === props.categoryId);
  return category ? category.name : "Unknown Category";
});

const fetchProducts = async () => {
  if (loading.value || !hasMoreProducts.value) return;
  loading.value = true;

  try {
    const response = await axios.get(`/api/categories/${props.categoryId}/products?page=${page.value}`);
    const newProducts = response.data.data;

    if (newProducts.length > 0) {
      products.value = [...products.value, ...newProducts];
      page.value += 1;
    } else {
      hasMoreProducts.value = false;
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading.value && hasMoreProducts.value) {
    fetchProducts();
  }
};

watch(
  () => props.categoryId,
  () => {
    products.value = [];
    page.value = 1;
    hasMoreProducts.value = true;
    fetchProducts();
  }
);

const hasProducts = computed(() => products.value.length > 0);

const orderProducts = () => {
  const searchedProduct = products.value.find(product => product.id === props.searchedProductId);
  const highlightedProduct = products.value.find(product => product.id === props.highlightedProductId);

  const otherProducts = products.value.filter(
    product => product.id !== props.searchedProductId && product.id !== props.highlightedProductId
  );

  return [
    ...(searchedProduct ? [searchedProduct] : []),
    ...(highlightedProduct && highlightedProduct.id !== searchedProduct?.id ? [highlightedProduct] : []),
    ...otherProducts,
  ];
};

const sortedProducts = computed(() => orderProducts());

const addToCart = async (product) => {
  const productId = product.id;
  const { customer } = getAuth();
  const customerId = customer ? customer.id : null;

  if (!customerId) {
    router.push('/auth/login');
    return;
  }

  try {
    await axios.post(`/api/cart/${customerId}`, { items: [{ product_id: productId, quantity: 1 }] });
    cart.addProduct(product);
  } catch (error) {
    console.error("Failed to add product to cart:", error);
  }
};
</script>

<style scoped>
.product-card {
  display: flex;
  align-items: center;
}

.product-card.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.product-image-holder {
  width: 90px;
  height: 90px;
  margin-right: 10px;
}

.product-image {
  object-fit: cover;
}

.add-button {
  width: 40px;
  border-radius: 0 !important;
}
</style>
