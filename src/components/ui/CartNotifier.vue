<template>
  <v-menu offset-y width="400">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn icon v-bind="activatorProps" class="mr-5" to="/cart">
        <v-badge color="red" v-if="cart.getProductCount() > 0" :content="cart.getProductCount()">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
        <v-icon color="grey-darken-4" v-else>
          mdi-cart-outline
        </v-icon>
      </v-btn>
    </template>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue';
import { cart } from '@/stores/cart';

const cartCount = computed(() => cart.getProductCount());
</script>
