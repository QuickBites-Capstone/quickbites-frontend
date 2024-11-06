<template>
  <v-row class="align-center">
    <v-app-bar scroll-behavior="hide" class="navbar" scroll-threshold="100" dense>
      <v-col cols="auto" class="d-md-none"></v-col>
      <v-row class="align-center">
        <v-btn icon @click="toggleDrawer" class="toggle-button">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <img src="../../../public/quickbites-logo.png" height="40" />
        <v-spacer />

        <Notification v-if="isUserAuthenticated" />
        <CartNotifier v-if="isUserAuthenticated" />

        <v-btn v-else rounded class="button-text mr-6" to="/auth/register">Sign Up</v-btn>
      </v-row>
    </v-app-bar>
  </v-row>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const emit = defineEmits();
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});


const toggleDrawer = () => {
  emit("toggle-drawer");
};

const isUserAuthenticated = ref(!!localStorage.getItem("token"));
</script>
<style scoped>
.text-logo {
  font-size: 24px;
}

.cart-icon {
  font-size: 24px;
}

.button-text {
  background-color: #171826;
  color: white;
  font-size: 14px;
}
</style>