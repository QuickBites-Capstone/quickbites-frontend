<template>
    <div>
        <v-btn color="primary" @click="showModal" class="custom-radius" prepend-icon="mdi-cart-outline" height="50">
            Manual Order
        </v-btn>

        <Modal v-model="modalVisible" title="Manual Order" icon="mdi-cart-outline" max-width="800px">
            <v-form ref="form">
                <v-autocomplete v-model="selectedCustomer" :items="customers" item-text="full_name" item-value="id"
                    label="Select Customer or Type a New One" return-object :search-input.sync="searchQuery" clearable
                    dense hide-details allow-overflow @update:search-input="fetchCustomers"
                    @input="onCustomerInput"></v-autocomplete>

                <v-text-field v-model="orderDetails.product" label="Product" required></v-text-field>
                <v-text-field v-model="orderDetails.quantity" label="Quantity" type="number" required></v-text-field>

                <v-card-actions slot="actions" class="d-flex justify-end">
                    <v-btn @click="modalVisible = false" height="50">Cancel</v-btn>
                    <v-btn class="bg-primary" @click="submitOrder" height="50">Confirm</v-btn>
                </v-card-actions>
            </v-form>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const modalVisible = ref(false);
const selectedCustomer = ref(null);
const customers = ref([]);
const searchQuery = ref('');
const orderDetails = ref({
    product: '',
    quantity: 1,
});

// Show the modal when the user clicks the "Manual Order" button
const showModal = () => {
    modalVisible.value = true;
    fetchCustomers(); // Fetch customers when the modal opens
};

// Fetch customers based on search query
const fetchCustomers = async () => {
    try {
        if (searchQuery.value.length < 2) {
            customers.value = [];
            return;
        }

        const response = await axios.get('/api/customers', {
            params: { search: searchQuery.value },
        });
        customers.value = response.data;
    } catch (error) {
        // console.error('Error fetching customers:', error);
    }
};

// Handle custom input (manual customer entry)
const onCustomerInput = (value) => {
    // If the user enters a new customer name (not in the list)
    if (!customers.value.find((customer) => customer.full_name === value)) {
        selectedCustomer.value = {
            id: 'new', // Placeholder ID for new customer
            full_name: value,
        };
    }
};

// Submit the order
const submitOrder = async () => {
    if (!selectedCustomer.value) {
        // Show an error if no customer is selected
        return;
    }

    try {
        const customerData = selectedCustomer.value.id === 'new'
            ? { full_name: selectedCustomer.value.full_name } // New customer data
            : { id: selectedCustomer.value.id }; // Existing customer ID

        const response = await axios.post('/api/orders', {
            customer: customerData,
            product: orderDetails.value.product,
            quantity: orderDetails.value.quantity,
        });
        // Handle successful order submission (e.g., show a success message)
        console.log('Order submitted successfully:', response.data);
        modalVisible.value = false; // Close the modal after submission
    } catch (error) {
        // console.error('Error submitting order:', error);
    }
};
</script>
