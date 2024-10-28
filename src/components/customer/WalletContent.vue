<template>
  <div>
    <v-col v-if="customer">
      <v-col>
        <v-card class="custom-radius" color="primary-darken-1">
          <div class="d-flex flex-column align-end">
            <v-btn @click="hideBalance" :icon="isBalanceHidden ? 'mdi-eye' : 'mdi-eye-off'" height="30px" width="50px"
              variant="text" flat :style="{ fontSize: '0.8rem', opacity: '0.8' }" />
          </div>
          <div class="text-center">
            <v-card-title class="font-weight-bold">
              {{ isBalanceHidden ? '****' : `₱ ${customer?.balance?.toLocaleString()}` }}
            </v-card-title>
            <v-card-text><small>Balance</small></v-card-text>
          </div>
        </v-card>
      </v-col>

      <v-col>
        <h3>How to Add Money to Your Account?</h3>
        <v-col>
          <ol>
            <li><b>Visit the Canteen</b></li>
            <li><b>Provide Your Details</b></li>
            <ul>
              <li>Provide your last name and first name.</li>
              <li>Or, you can provide your email address.</li>
            </ul>
            <li><b>Specify the Amount:</b> Let them know how much money you would like to cash in.</li>
            <li><b>Make Your Payment:</b> Pay the amount as instructed by the staff.</li>
            <li><b>Receive Confirmation:</b> After your payment is processed, you'll receive a confirmation receipt or
              notification.</li>
          </ol>
        </v-col>
      </v-col>
    </v-col>
    <div v-else>
      <p>Loading customer information...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import axios from 'axios';

const customer = ref({});
const isBalanceHidden = ref(false);

function hideBalance() {
  isBalanceHidden.value = !isBalanceHidden.value;
}

onMounted(async () => {
  const { token } = getAuth();
  try {
    const response = await axios.get('/api/get-customer-name', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    customer.value = response.data[0];
  } catch (error) {
    console.error(`Error fetching customer name:`, error);
  }
});
</script>
