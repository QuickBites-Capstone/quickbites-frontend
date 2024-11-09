<template>
  <v-col class="mx-0 px-1">
    <h3 class="mb-2">All</h3>

    <v-row v-if="hasProducts">
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4">
        <v-card class="custom-radius product-card py-2" height="90" :class="{ disabled: product.stock_quantity === 0 }">
          <v-card class="custom-radius product-image-holder">
            <v-img :src="product.image_url" alt="Product Image" class="product-image" height="100%" width="100%"
              cover />
          </v-card>

          <v-col class="pa-0">
            <v-card-title class="text-subtitle-1 py-0">{{
              product.name
            }}</v-card-title>
            <v-card-subtitle class="text-subtitle-2 py-0">{{
              "₱" + product.price.toFixed(2)
            }}</v-card-subtitle>
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
        <p>No products available.</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import { cart } from "@/stores/cart";
import { getAuth } from "@/pages/auth/authServiceProvider/authService";

const products = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMoreProducts = ref(true);
const router = useRouter();

const fetchProducts = async () => {
  if (loading.value || !hasMoreProducts.value) return;

  loading.value = true;
  try {
    const response = await axios.get(`/api/products/all?page=${page.value}`);
    const newProducts = response.data.data;

    if (newProducts.length === 0) {
      hasMoreProducts.value = false;
    } else {
      products.value.push(...newProducts);
      page.value += 1;
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
  window.addEventListener("touchend", handleScroll);  // Add touchend for mobile support
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Check if the user is near the bottom of the page (within 200px of the bottom)
  if (scrollPosition + 200 >= documentHeight && !loading.value && hasMoreProducts.value) {
    fetchProducts();
  }
};

const hasProducts = computed(() => {
  return products.value.length > 0;
});

const addToCart = async (product) => {
  const productId = product.id;
  const quantity = 1;

  const { customer } = getAuth();
  const customerId = customer ? customer.id : null;

  if (!customerId) {
    console.error("Customer is not logged in.");
    router.push("/auth/login");
    return;
  }

  try {
    const items = [
      {
        product_id: productId,
        quantity: quantity,
      },
    ];
    await axios.post(`/api/cart/${customerId}`, { items });

    cart.addProduct(product);
  } catch (error) {
    console.error(
      "Failed to add product to cart:",
      error.response ? error.response.data : error
    );
  }
};
</script>

<style scoped>
.product-card {
  transition: 0.3s ease;
  display: flex;
  align-items: center;
  flex: 1;
}

.product-card.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.product-image-holder {
  width: 100px;
  height: 100px;
}

.product-image {
  width: 100%;
  height: auto;
}

.add-button {
  width: 40px !important;
  border-radius: 0 !important;
}

.v-btn:active {
  background-color: green !important;
}
</style>
