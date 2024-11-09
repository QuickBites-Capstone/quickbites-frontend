<template>
  <div class="py-0 mt-0 pt-0">
    <v-row class="header-holder mt-1 mb-3">
      <v-btn to="/" size="small" class="items button-text" variant="text" color="black">
        <v-icon class="justify-start">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="items">Checkout</h2>
    </v-row>

    <v-container class="px-0 p-0 py-0 my-0 mt-0">
      <h1 class="text-h6 font-weight-bold mt-4 mb-3">Pick-up options</h1>
      <v-row>
        <v-col cols="12">
          <v-card v-for="(option, index) in pickupOptions" :key="index" @click="selectPickupOption(index)"
            :class="{ 'selected-card': selectedPickupOption === index }" variant="outlined" height="80px"
            class="custom-radius d-flex align-center px-4 py-3 mb-3">
            <v-icon class="mr-3">{{ option.icon }}</v-icon>
            <v-col>
              <v-card-title class="px-0 py-0">{{ option.title }}</v-card-title>
              <v-card-subtitle class="px-0 py-0">{{
                option.subtitle
              }}</v-card-subtitle>
            </v-col>
          </v-card>
        </v-col>
      </v-row>

      <h1 class="text-h6 font-weight-bold mt-4 mb-3">Select Payment Method</h1>
      <v-row>
        <v-col cols="12">
          <v-card v-for="(payment, index) in paymentMethods" :key="index" @click="selectPaymentMethod(index)"
            :class="{ 'selected-card': activeIndex === index }" variant="outlined" height="70px"
            class="custom-radius d-flex align-center px-4 py-3 mb-3">
            <v-col v-if="payment.title === 'Wallet'" class="px-0 py-0 d-flex w-100 align-center">
              <v-icon class="mr-3">{{ payment.icon }}</v-icon>

              <v-card-title>{{ payment.title }}</v-card-title>
              <v-card-subtitle class="last-item"> ₱ {{
                customerData.balance
              }}</v-card-subtitle>
            </v-col>

            <v-col class="d-flex px-0 align-center" v-else>
              <v-icon class="mr-3">{{ payment.icon }}</v-icon>
              <v-card-title>{{ payment.title }}</v-card-title>
            </v-col>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="bottom-section action-cards w-100 mt-5" elevation="10">
        <v-row align="center" justify="space-between">
          <v-col cols="6">
            <p class="font-weight-bold text-left">Total:</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold text-right">₱ {{ totalPrice }}</p>
          </v-col>
        </v-row>

        <v-col>
          <v-btn class="custom-radius w-100 mb-3" height="50" color="black" :loading="loading" @click="confirmOrder">
            Confirm Order
          </v-btn>
        </v-col>
      </v-card>
    </v-container>

    <Terms />

    <Modal v-model="isScheduleModalVisible" title="Schedule" icon="mdi-calendar-clock" max-width="500px">
      <div class="d-flex justify-center">
        <v-time-picker v-model="selectedTime" class="pt-0 mb-3" color="primary" />
      </div>
      <v-btn color="primary" height="50px" class="w-100" @click="confirmSchedule">Confirm</v-btn>
    </Modal>

    <Modal v-model="isConfirmationModalVisible" title="Order placed!" icon="mdi-check-circle" max-width="500px"
      class="mx-auto d-flex flex-row justify-space-between">
      <div class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">Your order has been successfully placed.</span>
      </div>
      <div class="my-2">
        We'll notify you as soon as it's ready for pick up.
      </div>
      <div class="mt-3">
        <v-btn @click="closeConfirmationModal" class="w-100" height="50px" color="primary">Okay</v-btn>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { cart } from "@/stores/cart";
import axios from "axios";
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import { VTimePicker } from 'vuetify/labs/VTimePicker'

const router = useRouter();
const route = useRoute();
const totalPrice = ref(route.query.total);
const selectedTime = ref("");
const loading = ref(false);
const customerData = ref({
  balance: null,
});
const activeIndex = ref(null);

const pickupOptions = [
  { title: "Standard", subtitle: "5-10 minutes", icon: "mdi-clock-fast" },
  { title: "Schedule", subtitle: "Choose a time", icon: "mdi-calendar-clock" },
];

const paymentMethods = [
  { title: "Wallet", amount: "₱500.00", icon: "mdi-wallet" },
  { title: "Cash", amount: "", icon: "mdi-cash" },
];

const selectedPickupOption = ref(null);
const selectedPaymentMethod = ref(null);
const isScheduleModalVisible = ref(false);
const isConfirmationModalVisible = ref(false);

onMounted(async () => {
  const { customer } = getAuth();
  const customerId = customer ? customer.id : null;

  if (customerId) {
    try {
      const response = await axios.get(`/api/customers/${customerId}`);
      customerData.value = response.data;

    } catch (error) {
      // console.error("Failed to fetch customer data:", error);
      window.$snackbar(
        `Failed to fetch customer data. Please try again.`,
        "error"
      );
    }
  } else {
    // console.error("Customer is not logged in.");
  }
});

const selectPickupOption = (index) => {
  selectedPickupOption.value = index;

  if (index === 0) {
  } else if (index === 1) {
    isScheduleModalVisible.value = true;
  }
};

const selectPaymentMethod = (index) => {
  selectedPaymentMethod.value = index;
  let paymentId;

  if (index === 0) {
    paymentId = 1; // Wallet
  } else if (index === 1) {
    paymentId = 2; // Cash
  }

  selectedPaymentMethod.value = paymentId;
  activeIndex.value = index;
};

const confirmOrder = async () => {
  loading.value = true;
  try {
    const paymentId = selectedPaymentMethod.value;
    const schedule =
      selectedPickupOption.value === 0 ? "Standard" : selectedTime.value;

    if (!customerData.value) {
      // console.error("Customer data not available.");
      return;
    }

    const customerBalance = parseFloat(customerData.value.balance);
    const totalAmount = parseFloat(totalPrice.value);

    const items = cart.products.value.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
    }));

    if (paymentId === 1) {
      if (customerBalance < totalAmount) {
        window.$snackbar(`Insufficient balance!`, "error");
        return;
      }

      await axios.post(`/api/cart/${customerData.value.id}`, {
        total: totalPrice.value,
        schedule: schedule,
        payment_id: paymentId,
        items: items,
      });
    } else if (paymentId === 2) {
      await axios.post(`/api/cart/${customerData.value.id}`, {
        total: totalPrice.value,
        schedule: schedule,
        payment_id: paymentId,
        items: items,
      });
    } else {
      window.$snackbar(`Invalid payment method selected.`, "error");
      return;
    }

    isConfirmationModalVisible.value = true;
    cart.clearCart();
    totalPrice.value = 0;
    selectedPickupOption.value = false;
    activeIndex.value = false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      window.$snackbar(`Low in stocks, order something else or try again later`, `error`);
      totalPrice.value = 0;
      selectedPickupOption.value = false;
      activeIndex.value = false;
    } else {
      window.$snackbar(`Order failed! Please try again.`, "error");
      // console.error(`Order failed:`, error);
    }
  } finally {
    loading.value = false;
  }
};

const closeConfirmationModal = () => {
  isConfirmationModalVisible.value = false;
  totalPrice.value = 0;
  router.push('/');
};

const confirmSchedule = () => {
  isScheduleModalVisible.value = false;
};
</script>

<style scoped>
.selected-card {
  border: 2px solid green;
}

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

.bottom-section {
  bottom: 0;
  position: fixed;
  right: 0;
  left: 0;
  padding: 10px;
}

.wallet-holder {
  display: flex;
  justify-content: start;
  align-items: center;
}

.last-item {
  margin-left: auto;
}

.custom-radius {
  border-radius: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mt-5 {
  margin-top: 32px;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}

.mr-3 {
  margin-right: 12px;
}
</style>
