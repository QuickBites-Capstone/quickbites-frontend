<template>
    <div>
        <!-- Navigation Drawer for Admin Sidebar -->
        <v-navigation-drawer v-if="isUserAuthenticated" location="left" permanent border="none">
            <!-- Admin Info -->
            <template v-slot:prepend>
                <v-list-item prepend-avatar="https://cdn-icons-png.flaticon.com/512/599/599184.png" lines="three">
                    <v-list-item-title>{{ adminName }}</v-list-item-title>
                    <v-list-item-subtitle><small>{{ adminEmail }}</small></v-list-item-subtitle>
                </v-list-item>
            </template>

            <!-- Sidebar Menu Items -->
            <v-list density="compact" nav>
                <v-list-item v-for="(item, index) in items" :key="index" :to="item.route" class="custom-radius"
                    color="primary" :prepend-icon="item.icon">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>

                <!-- Divider and Logout Button -->
                <v-divider class="my-10"></v-divider>

                <v-btn @click="handleLogout" class="w-100 justify-start custom-radius" to="/admincms" flat
                    prepend-icon="mdi-logout">
                    Logout
                </v-btn>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { logout, getAuth } from "@/pages/AdminCMS/adminAuthServiceProvider/adminAuthService";

const items = ref([
    { title: 'Dashboard', route: '/admincms/dashboard', icon: 'mdi-view-dashboard-outline' },
    { title: 'Orders', route: '/admincms/orders', icon: 'mdi-package-variant-closed' },
    { title: 'Products', route: '/admincms/products', icon: 'mdi-food-outline' },
    { title: 'Customers', route: '/admincms/customers', icon: 'mdi-account-group-outline' },
    { title: 'Admins', route: '/admincms/admins', icon: 'mdi-shield-account-outline' },
]);

// Admin name and email
const adminName = ref('');
const adminEmail = ref('');

// Check authentication status
const isUserAuthenticated = ref(!!localStorage.getItem("admin-auth-token"));

// Logout function
const handleLogout = async () => {
    logout();
    localStorage.removeItem("token");
    isUserAuthenticated.value = false;
};

// Fetch admin name and email from the backend
onMounted(async () => {
    const { token } = getAuth(); // Get token from auth service
    if (token) {
        try {
            const response = await axios.get('/api/get-admin-name', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            adminName.value = `${response.data.first_name} ${response.data.last_name}`;
            adminEmail.value = response.data.email; // Assuming email is also provided
        } catch (error) {
            console.error('Error fetching admin data:', error.response ? error.response.data : error.message);
        }
    } else {
        console.error('No token found, user not authenticated');
    }
});
</script>

<style scoped></style>
