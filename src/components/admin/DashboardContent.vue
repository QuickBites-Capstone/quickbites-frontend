<template>
    <v-container fluid>
        <v-col class="mb-10">
            <v-row>
                <v-card class="custom-radius me-5" width="100%" max-width="200px">
                    <v-col>
                        <v-col>
                            <v-card class="d-flex align-center justify-center rounded-pill" color="secondary"
                                height="50px" width="50px" flat>
                                <v-icon>mdi-hand-coin</v-icon>
                            </v-card>
                        </v-col>

                        <v-card-title class="font-weight-bold">₱ {{ stats.total_earnings }}</v-card-title>
                        <v-card-subtitle>Total Earning</v-card-subtitle>
                    </v-col>
                </v-card>

                <v-card class="custom-radius me-5" width="100%" max-width="200px">
                    <v-col>
                        <v-col>
                            <v-card class="d-flex align-center justify-center rounded-pill" color="primary"
                                height="50px" width="50px" flat>
                                <v-icon>mdi-account-group</v-icon>
                            </v-card>
                        </v-col>

                        <v-card-title class="font-weight-bold">{{ stats.total_customers }}</v-card-title>
                        <v-card-subtitle>Total Customers</v-card-subtitle>
                    </v-col>
                </v-card>

                <v-card class="custom-radius me-5" width="100%" max-width="200px">
                    <v-col>
                        <v-col>
                            <v-card class="d-flex align-center justify-center rounded-pill" color="primary-darken-1"
                                height="50px" width="50px" flat>
                                <v-icon>mdi-shopping</v-icon>
                            </v-card>
                        </v-col>

                        <v-card-title class="font-weight-bold">{{ stats.total_orders }}</v-card-title>
                        <v-card-subtitle>Total Orders</v-card-subtitle>
                    </v-col>
                </v-card>
            </v-row>
        </v-col>

        <v-col>
            <v-row>
                <v-card class="custom-radius" width="100%" max-width="400px">
                    <v-card-title class="font-weight-bold border-b-sm">Top Selling Items</v-card-title>
                    <v-card-text>
                        <div v-for="item in topSellingItems" :key="item.id"
                            class="d-flex mt-3 align-center justify-space-between">
                            <div class="d-flex align-center">
                                <v-card class="custom-radius me-2" width="50px" height="50px">
                                    <v-img :src="item.image" height="100%" width="100%" cover />
                                </v-card>
                                {{ item.name }}
                            </div>
                            <div class="price">
                                ₱ {{ item.price.toLocaleString() }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-row>
        </v-col>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
    total_orders: 0,
    total_customers: 0,
    total_earnings: 0,
});

const fetchDashboardStats = async () => {
    try {
        const response = await axios.get('/api/dashboard/stats');
        stats.value = response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
};

const topSellingItems = ref([]);

const fetchTopSellingItems = async () => {
    try {
        const response = await axios.get('/api/dashboard/top-selling-items');
        topSellingItems.value = response.data;
    } catch (error) {
        console.error('Error fetching top selling items:', error);
    }
};

onMounted(() => {
    fetchDashboardStats();
    fetchTopSellingItems();
});
</script>
