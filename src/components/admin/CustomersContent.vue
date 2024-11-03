<template>
    <div>
        <div>
            <v-text-field v-model="searchQuery" label="Search customer" placeholder="name or email or phone"
                prepend-inner-icon="mdi-magnify" clearable @input="onInputChange" max-width="300px"
                variant="outlined" />
        </div>
        <v-card class="custom-radius">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Phone number</th>
                        <th class="text-left">Balance</th>
                        <th class="text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="customer in customerStore.customers" :key="customer.id">
                        <td class="text-left">{{ customer.id }}</td>
                        <td class="text-left">{{ customer.last_name }}, {{ customer.first_name }}</td>
                        <td class="text-left">{{ customer.email }}</td>
                        <td class="text-left">{{ customer.phone_number || 'N/A' }}</td>
                        <td class="text-left">₱ {{ customer.balance ? customer.balance.toLocaleString() : '0' }}</td>
                        <td class="text-left">
                            <v-btn @click="openDetailsModal(customer)" prepend-icon="mdi-account-details-outline"
                                color="primary" variant="tonal">View Details</v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <CustomerDetailModal :key="detailModalKey" :visible="detailModalVisible" :customer="selectedCustomer"
            @update:visible="handleModalClose" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCustomerStore } from '@/stores/Admin/CustomerPinia';
import axios from 'axios';

const customerStore = useCustomerStore();

const modalVisible = ref(false);
const detailModalVisible = ref(false);
const selectedCustomer = ref(null);
const customerToDelete = ref(null);
const detailModalKey = ref(0);
const searchQuery = ref('');
let debounceTimeout = null;

const onInputChange = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        searchCustomers();
    }, 300);
};

const searchCustomers = async () => {
    if (searchQuery.value) {
        try {
            const response = await axios.get(`/api/customers`, {
                params: { search: searchQuery.value }
            });
            customerStore.customers = response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    } else {
        customerStore.fetchCustomers();
    }
};

const openDetailsModal = (customer) => {
    selectedCustomer.value = customer;
    detailModalVisible.value = true;
    detailModalKey.value += 1;
};

const handleModalClose = (value) => {
    detailModalVisible.value = value;
    if (!value) {
        selectedCustomer.value = null;
    }
};

onMounted(() => {
    customerStore.fetchCustomers();
});
</script>
