<template>
    <div>
        <v-btn color="primary" @click="showModal" class="custom-radius" prepend-icon="mdi-cart-outline" height="50">
            Add New Product
        </v-btn>

        <Modal v-model="modalVisible" title="Add New Product" icon="mdi-plus" max-width="800px">
            <div v-if="productSubmissionSuccess" class="w-100">
                <LottieAnimation :animationData="successAnimation" class="mx-auto" width="300px" height="300px" />
                <h2 class="text-center">Product successfully added!</h2>
            </div>

            <v-form ref="form" v-else v-model="valid" lazy-validation>
                <v-select v-model="product.category_id" :items="categories" item-title="name" item-value="id"
                    label="Choose category for the new product" :rules="categoryRules" variant="outlined" />
                <v-text-field v-model="product.name" label="Enter Product Name" :rules="nameRules" variant="outlined" />
                <v-text-field v-model="product.price" label="Enter Price for the product" type="number"
                    :rules="priceRules" variant="outlined" />
                <v-text-field v-model="product.stock_quantity" label="Enter Stock Quantity" type="number"
                    :rules="stockQuantityRules" variant="outlined" />
                <v-file-input v-model="product.image" label="Upload Image" prepend-icon=""
                    prepend-inner-icon="mdi-image" accept="image/*" :rules="imageRules" variant="outlined" />

                <v-card-actions slot="actions">
                    <v-btn @click="closeModal">Cancel</v-btn>
                    <v-btn color="primary" @click="submitProduct">Confirm</v-btn>
                </v-card-actions>
            </v-form>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import successAnimation from "../../../Lottie/check.json";

const modalVisible = ref(false);
const valid = ref(false);
const product = ref(createInitialProduct());
const categories = ref([]);
const productSubmissionSuccess = ref(false);

const showModal = () => {
    modalVisible.value = true;
};

const closeModal = () => {
    modalVisible.value = false;
    resetProduct();
};

const fetchCategories = async () => {
    try {
        const { data } = await axios.get('/api/categories');
        categories.value = data;
    } catch (error) {
        handleError('Error fetching categories:', error);
    }
};

const submitProduct = async () => {
    if (!valid.value) return;
    console.log('Product before upload:', product.value);
    const formData = createFormData(product.value);
    try {
        await axios.post('/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        productSubmissionSuccess.value = true;
        setTimeout(() => {
            closeModal();
        }, 1500);
    } catch (error) {
        handleError('Error submitting product:', error);
    }
};

const nameRules = [v => !!v || 'Product name is required'];
const priceRules = [
    v => !!v || 'Price is required',
    v => v > 0 || 'Price must be greater than 0',
];
const stockQuantityRules = [
    v => !!v || 'Stock quantity is required',
    v => v >= 0 || 'Stock quantity cannot be negative',
];
const imageRules = [v => !!v || 'Image is required'];
const categoryRules = [v => !!v || 'Category is required'];

function createInitialProduct() {
    return {
        name: '',
        price: null,
        stock_quantity: null,
        image: null,
        category_id: null,
    };
}

function createFormData(product) {
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return formData;
}

function resetProduct() {
    product.value = createInitialProduct();
}

function handleError(message, error) {
    console.error(message, error);
}

onMounted(fetchCategories);
</script>

<style scoped>
/* Add any styles you need here */
</style>
