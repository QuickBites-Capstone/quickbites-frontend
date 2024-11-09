<template>
  <div class="py-0 mt-0 pt-0">
    <v-row v-if="loading" class="justify-center mt-5">
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
    </v-row>

    <v-row v-if="!loading && sortedOrders.length > 0" class="header-holder mt-1 mb-3">
      <v-btn to="/" size="small" class="items button-text" variant="text" color="black">
        <v-icon class="justify-start">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="page-title mx-auto">My Orders</h2>
    </v-row>

    <v-col v-if="!loading && sortedOrders.length === 0" class="text-center mt-5">
      <h2>No orders available</h2>
      <p>
        It looks like you haven't placed any orders yet. Start ordering now!
      </p>
      <v-btn to="/" class="mt-2" color="primary"> Go to Menu </v-btn>
    </v-col>

    <v-col class="px-0" v-for="order in sortedOrders" :key="order.id">
      <v-card class="custom-radius" :to="`/orderdetails/${order.id}`">
        <v-container fluid>
          <v-row class="px-2 py-2 d-flex flex-row align-center justify-space-between">
            <v-card-subtitle class="text-subtitle-1">
              Order {{ order.order_number }}
            </v-card-subtitle>
            <v-card-title class="text-primary text-body-2">
              {{ order.status_label }}
            </v-card-title>
          </v-row>

          <v-row v-for="item in order.cart.cart_items.slice(0, 2)" :key="item.id" class="my-3 ml-2 align-center">
            <v-card class="custom-radius" height="80px" width="80px">
              <v-img :src="item.product?.image_url" alt="Product Image" class="product-image" height="100%" width="100%"
                cover />
            </v-card>
            <v-col>
              <v-card-title class="text-subtitle-1">
                {{ item.product?.name }}
              </v-card-title>
              <v-card-subtitle>
                X {{ item.quantity }}
              </v-card-subtitle>
            </v-col>
            <v-card-title class="last-item mr-2 text-body-2">
              ₱ {{ item.price }}
            </v-card-title>
          </v-row>

          <v-row v-if="order.cart.cart_items.length > 2" class="justify-center">
            <small>+{{ order.cart.cart_items.length - 2 }} More</small>
          </v-row>

          <v-row class="mt-3 mb-1 justify-end">
            <v-card-title class="text-body-2 mr-2">
              Total {{ calculateItemCount(order) }} items: ₱ {{ order.cart.total }}
            </v-card-title>
          </v-row>

          <v-btn :to="`/orderdetails/${order.id}`" class="w-100" color="primary">View Details</v-btn>
        </v-container>
      </v-card>
    </v-col>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { getAuth } from "@/pages/auth/authServiceProvider/authService";

const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { customer } = getAuth();
    const customerId = customer ? customer.id : null;
    const response = await axios.get(
      `/api/customers/${customerId}/orders/inactive`
    );
    orders.value = response.data;
  } catch (error) {
    // console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
});

const sortedOrders = computed(() => {
  return orders.value.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
});

const calculateItemCount = (order) => {
  return order.cart.cart_items.reduce((total, item) => total + item.quantity, 0);
};
</script>

<style scoped>
.header-holder {
  justify-content: start;
  align-items: center;
}

.page-title {
  translate: -10px;
}

.button-text {
  font-size: 22px;
}

.product-image {
  height: auto;
  object-fit: cover;
}

.last-item {
  margin-left: auto;
}

.btn {
  border-radius: 0 !important;
}
</style>
