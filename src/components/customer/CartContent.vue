<template>
  <div>
    <v-row class="d-flex pb-0 mb-10 px-0 justify-space-between align-center">
      <v-btn
        to="/"
        size="small"
        class="button-text"
        variant="text"
        color="black"
      >
        <v-icon class="justify-start">mdi-arrow-left</v-icon>
      </v-btn>
      <h2>My Cart</h2>

      <v-menu activator="parent" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            class="button-text"
            variant="text"
            size="small"
            color="black"
            v-bind="props"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>

        <v-list class="dropdown-menu ml-auto" width="200">
          <v-list-item @click="orderMore">
            <v-list-item-title
              ><v-icon>mdi-cart-plus</v-icon> Order more</v-list-item-title
            >
          </v-list-item>

          <v-list-item @click="clearAllProducts" class="text-red">
            <v-list-item-title
              ><v-icon>mdi-delete-empty-outline</v-icon> Clear
              cart</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>

    <v-container fluid class="px-0 d-flex flex-column">
      <v-row
        class="flex-grow-1"
        v-if="cartProducts.length === 0"
        style="justify-content: center; align-items: center"
      >
        <LottieAnimation
          :animationData="animationData"
          width="200px"
          height="200px"
        />
        <span class="empty-title my-2">Your cart is empty.</span>
        <v-btn variant="text">
          <router-link color="primary" class="back-menu-link" to="/"
            >Go back to menu to order</router-link
          >
        </v-btn>
      </v-row>

      <v-row class="flex-grow-1" v-else>
        <v-col
          v-for="product in cartProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          class="border-b-sm"
        >
          <v-row class="custom-radius product-card pb-3">
            <v-card class="image-holder ml-3 custom-radius">
              <v-img
                :src="product.image"
                alt="Product Image"
                class="product-image"
                height="100%"
                width="100%"
                cover
              />
            </v-card>
            <v-col>
              <v-card-title class="text-subtitle-1 text-wrap">{{
                product.name
              }}</v-card-title>
              <v-row align="center">
                <v-btn
                  variant="text"
                  rounded="pill"
                  @click="decrementQuantity(product.id)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <p>{{ product.quantity }}</p>
                <v-btn
                  variant="text"
                  rounded="pill"
                  @click="incrementQuantity(product.id)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </v-col>

            <v-card-subtitle class="text-subtitle-2">{{
              "₱" + product.price.toFixed(2)
            }}</v-card-subtitle>
          </v-row>
        </v-col>
      </v-row>

      <div v-if="cartProducts.length > 0" class="gap"></div>

      <v-card
        v-if="cartProducts.length > 0"
        class="bottom-section action-cards w-100"
        elevation="10"
      >
        <v-col>
          <v-row align="center" justify="space-between">
            <v-col>
              <p class="font-weight-bold text-left">Total:</p>
            </v-col>
            <v-col>
              <p class="font-weight-bold text-right">₱ {{ totalAmount }}</p>
            </v-col>
          </v-row>
        </v-col>

        <v-col>
          <v-btn
  class="custom-radius w-100 mb-3"
  height="50"
  color="black"
  :to="{ path: '/checkout', query: { total: totalAmount } }"
>
  Proceed to checkout
</v-btn>

          <v-btn
            class="custom-radius w-100 font-weight-bold"
            height="50"
            variant="tonal"
            to="/"
          >
            Order more
          </v-btn>
        </v-col>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { calculateTotal } from "@/utils/helpers";
import Empty from "@/Lottie/empty.json";
import axios from "axios";
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import { cart } from "@/stores/cart";

const animationData = ref(Empty);
const router = useRouter();
const cartProducts = ref([]);

onMounted(async () => {
  cartProducts.value = cart.products.value;
});

// test new
const getCartId = async () => {
  const { customer } = getAuth();
  if (!customer) {
    console.error("Customer is not logged in.");
    return null;
  }

  try {
    const response = await axios.get(`/api/cart/${customer.id}`);
    const cartData = response.data;
    console.log(cartData);
    return cartData.id;
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    return null;
  }
};

const updateCart = async (productId, quantity) => {
  const cartId = await getCartId();

  if (!cartId) {
    console.error("No cart found for the customer.");
    return;
  }

  try {
    await axios.put(`/api/cart/${cartId}/items/${productId}`, {
      quantity: quantity,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
  }
};

const clearAllProducts = async () => {
  const cartId = await getCartId();

  if (!cartId) {
    console.error("No cart found for the customer.");
    return;
  }

  try {
    await axios.delete(`/api/cart/${cartId}`);
    cartProducts.value = [];
    cart.clearCart();
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
};


const incrementQuantity = async (productId) => {
  const product = cartProducts.value.find((p) => p.id === productId);
  product.quantity++;
  await updateCart(productId, product.quantity);

};

const decrementQuantity = async (productId) => {
  const product = cartProducts.value.find((p) => p.id === productId);

  if (product) {
    if (product.quantity > 1) {
      product.quantity--;
      await updateCart(productId, product.quantity);
   
    } else {
      await removeFromCart(productId);
    }
  }
};

const removeFromCart = async (productId) => {
  const cartId = await getCartId();

  if (!cartId) {
    console.error("No cart found for the customer.");
    return;
  }

  try {
    await axios.delete(`/api/cart/${cartId}/items/${productId}`);

    cartProducts.value = cartProducts.value.filter(
      (product) => product.id !== productId
    );
    cart.removeProduct(productId);
    
  } catch (error) {
    console.error("Failed to remove product from cart:", error);
  }
};

const totalAmount = computed(() => {
  return calculateTotal(cartProducts.value);
});
</script>

<style scoped>
.button-text {
  font-size: 22px;
}

.product-card {
  display: flex;
  align-items: center;
}

.image-holder {
  width: 50px;
  height: 50px;
}

.product-image {
  height: auto;
  object-fit: cover;
}

.dropdown-menu {
  min-width: 50px !important;
}

.bottom-section {
  bottom: 0;
  position: fixed;
  right: 0;
}

.flex-grow-1 {
  flex-grow: 1;
}

.empty-holder {
  flex-direction: column;
  margin-top: 130px !important;
}

.empty-title {
  font-size: 20px;
}

.back-menu-link {
  text-decoration: none;
  font-size: 20px;
  color: #fc8019;
}

.back-menu-link:hover {
  text-decoration: underline;
}

.gap {
  height: 200px;
}
</style>
