<template>
    <div>
        <Modal v-model="isModalVisible" title="Your order is ready!" icon="mdi-alarm" max-width="800px">
            <v-card-text>
                <p>You can now pick up your order with ID: {{ order.id }}!</p>
            </v-card-text>
            <v-card-actions slot="actions" class="d-flex justify-end">
                <v-btn @click="closeModal" class="bg-primary" width="100%" height="50">Okay</v-btn>
            </v-card-actions>
        </Modal>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';

const props = defineProps(['order']);
const isModalVisible = ref(false);

watch(() => props.order, (newOrder) => {
    if (newOrder) {
        isModalVisible.value = true;
    }
});

const closeModal = () => {
    isModalVisible.value = false;
};
</script>
