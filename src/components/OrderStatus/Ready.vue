<template>
    <div>
        <v-dialog v-model="isOrderReady" max-width="400">
            <v-card>
                <v-card-title>Your Order is Ready!</v-card-title>
                <v-card-actions>
                    <v-btn color="primary" @click="closeDialog">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    currentCustomerId: {
        type: Number,
        required: true
    }
});

const isOrderReady = ref(false);
const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/order-updates`);

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Check if the update is for the current customer
    if (data.customer_id === props.currentCustomerId && data.status === 3) {
        isOrderReady.value = true;
    }
};

const closeDialog = () => {
    isOrderReady.value = false;
};
</script>
