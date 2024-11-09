<template>
    <v-container fluid>
        <v-col class="mb-10">
            <v-row>
                <v-card v-for="stat in statsList" :key="stat.title" class="custom-radius me-5" width="100%"
                    max-width="200px">
                    <v-col>
                        <v-col>
                            <v-card class="d-flex align-center justify-center rounded-pill" :color="stat.color"
                                height="50px" width="50px" flat>
                                <v-icon>{{ stat.icon }}</v-icon>
                            </v-card>
                        </v-col>
                        <v-card-title class="font-weight-bold">
                            {{ stat.value }}
                        </v-card-title>
                        <v-card-subtitle>{{ stat.title }}</v-card-subtitle>
                    </v-col>
                </v-card>
            </v-row>
        </v-col>

        <v-col>
            <v-row>
                <v-card class="custom-radius me-5 mb-10" max-width="800px" width="100%">
                    <v-card-title class="border-b-sm font-weight-bold">Monthly Earnings</v-card-title>
                    <v-card-text>
                        <Line :data="chartData" :options="chartOptions" />
                    </v-card-text>
                </v-card>

                <v-card class="custom-radius" height="100%" width="100%" max-width="400px">
                    <v-card-title class="font-weight-bold border-b-sm">
                        Top Selling Items
                    </v-card-title>
                    <v-card-text>
                        <div v-for="item in topSellingItems" :key="item.id"
                            class="d-flex mt-3 align-center justify-space-between">
                            <div class="d-flex align-center">
                                <v-card class="custom-radius me-2" width="50px" height="50px">
                                    <v-img :src="item.image_url" height="100%" width="100%" cover />
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

const stats = ref({
    total_orders: 0,
    total_customers: 0,
    total_earnings: 0,
    daily_earnings: 0,
});

const fetchDashboardStats = async () => {
    try {
        const response = await axios.get('/api/dashboard/stats');
        stats.value = response.data;
    } catch (error) {
        // console.error('Error fetching dashboard stats:', error);
    }
};

const topSellingItems = ref([]);

const fetchTopSellingItems = async () => {
    try {
        const response = await axios.get('/api/dashboard/top-selling-items');
        topSellingItems.value = response.data;
    } catch (error) {
        // console.error('Error fetching top selling items:', error);
    }
};

const statsList = computed(() => [
    {
        title: 'Daily Earning',
        value: `₱ ${stats.value.daily_earnings}`,
        color: 'secondary',
        icon: 'mdi-hand-coin',
    },
    {
        title: 'Total Earning',
        value: `₱ ${stats.value.total_earnings}`,
        color: 'secondary-darken-1',
        icon: 'mdi-hand-coin',
    },
    {
        title: 'Total Customers',
        value: stats.value.total_customers,
        color: 'primary',
        icon: 'mdi-account-group',
    },
    {
        title: 'Total Orders',
        value: stats.value.total_orders,
        color: 'primary-darken-1',
        icon: 'mdi-shopping',
    },
]);

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const chartData = ref({
    labels: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
        {
            label: 'Earnings',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }
    ]
});

const chartOptions = ref({
    responsive: true,
    plugins: {
        tooltip: {
            enabled: true,
            callbacks: {
                label: (tooltipItem) => `₱ ${tooltipItem.raw.toLocaleString()}`,
            },
        },
        legend: {
            display: true,
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Months',
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Earnings (₱)',
            }
        }
    }
});

const fetchMonthlyEarnings = async () => {
    try {
        const response = await axios.get('/api/dashboard/monthly-earnings');
        chartData.value.datasets[0].data = response.data.monthly_earnings;
    } catch (error) {
        // console.error('Error fetching monthly earnings:', error);
    }
};

onMounted(() => {
    fetchDashboardStats();
    fetchTopSellingItems();
    fetchMonthlyEarnings();
});
</script>
