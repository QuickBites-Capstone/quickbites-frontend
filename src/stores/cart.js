import { ref } from 'vue';
import { getAuth } from '@/pages/auth/authServiceProvider/authService';

const loadCartFromLocalStorage = () => {
  const { customer } = getAuth();
  if (!customer) return { products: [], count: 0 }; // Return empty cart if no customer

  const storedCart = localStorage.getItem(`cart_${customer.id}`);
  return storedCart ? JSON.parse(storedCart) : { products: [], count: 0 };
};

const cartData = loadCartFromLocalStorage();
const products = ref(cartData.products);
const count = ref(cartData.count);

const saveCartToLocalStorage = () => {
  const { customer } = getAuth();
  if (!customer) return; 

  localStorage.setItem(`cart_${customer.id}`, JSON.stringify({ products: products.value, count: count.value }));
};

const addProduct = (product) => {
  const existingProduct = products.value.find((p) => p.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    product.quantity = 1;
    products.value.push(product);
  }
  
  count.value++;
  saveCartToLocalStorage();
};

const incrementQuantity = (productId) => {
  const product = products.value.find((p) => p.id === productId);
  if (product) {
    product.quantity++;
    count.value++;
    saveCartToLocalStorage();
  }
};

const decrementQuantity = (productId) => {
  const product = products.value.find((p) => p.id === productId);
  if (product) {
    if (product.quantity > 1) {
      product.quantity--;
      count.value--;
      saveCartToLocalStorage();
    } else {
      removeProduct(productId);
    }
  }
};

const removeProduct = (productId) => {
  const productIndex = products.value.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const removedProduct = products.value[productIndex];
    count.value -= removedProduct.quantity;
    products.value.splice(productIndex, 1);
    saveCartToLocalStorage();
  }
};

const clearCart = () => {
  products.value = [];
  count.value = 0;

  const { customer } = getAuth();
  if (customer) {
    localStorage.removeItem(`cart_${customer.id}`);
  }
};

const getProductCount = () => count.value;

export const cart = {
  products,
  count,
  addProduct,
  removeProduct,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  getProductCount,
};
