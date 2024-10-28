<template>
    <v-col>
        <v-row v-if="loading">
            <p>Loading orders...</p>
        </v-row>
        <v-row v-if="error">
            <p>{{ error }}</p>
        </v-row>
        <v-row v-if="!loading && !error && orders.length === 0">
            <p>No orders available.</p>
        </v-row>
        <v-row v-if="!loading && !error && orders.length > 0">
            <OrderCard v-for="order in sortedOrders" :key="order.id" :order="order" />
        </v-row>
    </v-col>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(true);
const error = ref(null);
const orders = ref([]);

const fetchHistoryOrders = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/orders');
        orders.value = response.data;
    } catch (err) {
        error.value = 'Failed to fetch history orders. Please try again.';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

onMounted(fetchHistoryOrders);
defineExpose({ fetchHistoryOrders });
</script>

<style></style>
