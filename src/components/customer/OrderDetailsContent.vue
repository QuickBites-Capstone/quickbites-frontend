<template>
  <div class="py-0 mt-0 pt-0">
    <v-row class="header-holder mt-1 mb-3">
      <v-btn to="/orders" size="small" class="items button-text" variant="text" color="black">
        <v-icon class="justify-start">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="items">Order Details</h2>
    </v-row>

    <v-col v-if="order?.order_status_id === 2">
      <div class="text-center">
        <LottieAnimation :animationData="InProgressAnimation" class="mx-auto" width="200px" height="200px" />
        <h4>Your order is currently being prepared.</h4>
      </div>
    </v-col>

    <v-col v-if="order?.order_status_id === 3">
      <div class="text-center">
        <LottieAnimation :animationData="ReadyAnimation" class="mx-auto" width="200px" height="200px" />
        <h4>Your order is ready for pick-up!</h4>
      </div>
    </v-col>

    <v-col class="px-0" v-if="order">
      <v-card class="custom-radius mb-5 justify-space-between">
        <v-container fluid class="py-0">
          <v-row v-for="item in order.cart.cart_items" :key="item.id" class="my-3 ml-auto align-center">
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
            <v-card-title class="last-item text-body-2">
              ₱ {{ item.price }}
            </v-card-title>
          </v-row>

          <v-row class="mt-3 mb-1 align-center justify-space-between">
            <v-card-title class="text-body-2">
              Total Amount:
            </v-card-title>
            <v-card-title class="font-weight-bold" style="font-size: 15px;">
              ₱ {{ order.cart.total }}
            </v-card-title>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="custom-radius mt-3">
        <v-col class="d-flex justify-space-between">
          <p class="font-weight-bold"> Order Number </p>
          <p class="font-weight-bold">
            {{ order?.order_number }}
          </p>
        </v-col>
        <v-col class="d-flex justify-space-between">
          <p> Order Status </p>
          <p>
            {{ order?.status_label }}
          </p>
        </v-col>
        <v-col class="d-flex justify-space-between">
          <p>Paid by:</p>
          <p class="text-body-1">
            {{ paymentMapping[order.cart?.payment_id] }}
          </p>
        </v-col>
        <v-col class="d-flex justify-space-between">
          <p> Order Time: </p>
          <p>
            {{ formatDate(order.created_at) }}
          </p>
        </v-col>
      </v-card>
    </v-col>
    <v-col v-else>
      <h3> Loading order details... </h3>
    </v-col>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import InProgressAnimation from "../../Lottie/preparing.json";
import ReadyAnimation from "../../Lottie/Ready.json";

const route = useRoute();
const order = ref(null);

const paymentMapping = {
  1: "Wallet",
  2: "Cash",
};

const getOrderDetails = async () => {
  try {
    const { customer } = getAuth();
    const customerId = customer ? customer.id : null;

    const response = await axios.get(
      `/api/customers/${customerId}/orders/inactive`
    );

    order.value = response.data.find((o) => o.id === parseInt(route.params.id));
  } catch (error) {
    // console.error("Error fetching order details:", error);
  }
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");
};

let debounceTimer = null;

const debouncedFetchOrderDetails = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(getOrderDetails, 300);
};


onMounted(() => {
  getOrderDetails();
  window.Echo.channel('chat')
    .listen('MessageSent', (event) => {
      console.log('Order status updated:', event);
      debouncedFetchOrderDetails();
    });
});
</script>

<style scoped>
.header-holder {
  justify-content: start;
  align-items: center;
}

.items {
  margin-right: 75px;
}

.button-text {
  font-size: 22px;
}

.product-image {
  height: auto;
  object-fit: cover;
}

.btn {
  border-radius: 0 !important;
}

.last-item {
  margin-left: auto;
}
</style>
