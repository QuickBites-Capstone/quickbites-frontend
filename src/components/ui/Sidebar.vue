<template>
  <v-col v-if="isUserAuthenticated">
    <v-navigation-drawer :model-value="isDrawerOpen" app temporary @update:model-value="updateDrawer">
      <v-row align="center" class="mx-auto px-3 py-2">
        <v-avatar size="40" class="bg-grey custom-radius">
          <v-img :src="customer.profile_picture_url" alt="User Avatar" v-if="customer.profile_picture_url" />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
        <v-col class="ml-3">
          <div class="text-h6">{{ customer.first_name}}</div>
          <div class="profile-text ml-0 mt-1 text-body-2" color="primary">
            <router-link to="/profile">
              Manage Profile
            </router-link>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-0"></v-divider>
      <v-list class="mt-0 pt-0 item-text" density="compact">
        <v-list-item :class="{ 'active-item': isActive('/') }" height="50px" title="Menu" to="/"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/orders') }" height="50px" title="Orders"
          to="/orders"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/wallet') }" height="50px" title="Wallet"
          to="/wallet"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/about') }" height="50px" title="About Us"
          to="/about"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/auth/login') }" height="50px" title="Sign Out"
          @click="handleLogout" to="/auth/login"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-col>

  <v-col v-else>
    <v-navigation-drawer :model-value="isDrawerOpen" app temporary @update:model-value="updateDrawer">
      <v-row align="center" class="drawer-header mt-1"></v-row>

      <v-list density="compact">
        <v-list-item :class="{ 'active-item': isActive('/') }" height="50px" title="Menu" to="/"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/about') }" height="50px" title="About Us"
          to="/about"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/auth/register') }" height="50px" title="Sign Up"
          to="/auth/register"></v-list-item>
        <v-divider />
        <v-list-item :class="{ 'active-item': isActive('/auth/login') }" height="50px" title="Sign In"
          to="/auth/login"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-col>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { logout, getAuth } from "@/pages/auth/authServiceProvider/authService";
import axios from 'axios';
import { cart } from '@/stores/cart';


const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits();

const updateDrawer = (value) => {
  emit("update:isDrawerOpen", value);
};

const route = useRoute();
const isActive = (path) => {
  return route.path === path;
};

const isUserAuthenticated = ref(!!localStorage.getItem("token"));
const customer = ref([]);

const handleLogout = async () => {
  logout();
  isUserAuthenticated.value = false;
};

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

<style scoped>
.profile-text {
  font-style: italic;
}

.profile-text:hover {
  cursor: pointer;
  text-decoration: underline;
}

.active-item {
  background-color: #171826;
  color: white;
}

.item-text {
  font-size: 50px;
}
</style>
