<template>
    <v-card class="w-100 custom-radius">
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Image</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Quantity</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Availability</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td class="text-left">
                        <v-card class="custom-radius" height="80" width="80">
                            <v-img
                                v-if="product.image_url"
                                :src="product.image_url"
                                class="custom-radius"
                                alt="Product Image"
                                width="100%"
                                height="100%"
                                cover
                            />
                            <v-icon
                                v-else
                                class="bg-grey-darken-1"
                                style="font-size: 54px; height: 100%; width: 100%;"
                            >
                                mdi-food
                            </v-icon>
                        </v-card>
                    </td>

                    <td class="text-left">
                        <div v-if="!product.isEditing">{{ product.name }}</div>
                        <v-text-field
                            v-else
                            v-model="product.name"
                            label="Edit Name"
                        />
                    </td>

                    <td class="text-left">
                        <div v-if="!product.isEditing">{{ product.stock_quantity }}</div>
                        <v-text-field
                            v-else
                            v-model="product.stock_quantity"
                            label="Edit Quantity"
                            type="number"
                        />
                    </td>

                    <td class="text-left">
                        <div v-if="!product.isEditing">₱ {{ product.price }}</div>
                        <v-text-field
                            v-else
                            v-model="product.price"
                            label="Edit Price"
                            type="number"
                        />
                    </td>

                    <td class="text-left">
                        {{ product.stock_quantity > 0 ? 'Available' : 'Out of Stock' }}
                    </td>

                    <td class="text-left">
                        <v-btn
                            v-if="!product.isEditing"
                            @click="toggleEdit(product)"
                            prepend-icon="mdi-square-edit-outline"
                            color="blue"
                            variant="text"
                            class="custom-radius me-3"
                        >
                            Edit
                        </v-btn>
                        <v-btn
                            v-else
                            @click="updateProduct(product)"
                            prepend-icon="mdi-check"
                            color="green"
                            variant="text"
                            class="custom-radius me-3"
                        >
                            Update
                        </v-btn>

                        <v-btn
                            @click="deleteProduct(product.id)"
                            prepend-icon="mdi-trash-can-outline"
                            color="error"
                            variant="text"
                            class="custom-radius"
                        >
                            Delete
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    products: {
        type: Array,
        required: true,
    },
    updateProduct: {
        type: Function,
        required: true,
    },
    deleteProduct: {
        type: Function,
        required: true,
    },
});

const toggleEdit = (product) => {
    product.isEditing = !product.isEditing;
};
</script>

<style scoped>
.custom-radius {
    border-radius: 10px; /* Adjust radius as needed */
}
</style>
