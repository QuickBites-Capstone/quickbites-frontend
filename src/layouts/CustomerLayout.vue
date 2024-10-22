<template>
    <div>
        <Sidebar :isDrawerOpen="isDrawerOpen" @update:isDrawerOpen="toggleDrawer" />
        <Header v-if="!isCartPage" :isDrawerOpen="isDrawerOpen" @toggle-drawer="toggleDrawer" />
        <v-container>
            <router-view @order-status-updated="showOrderReadyModal" />
        </v-container>

        <Ready v-if="showReadyModal" :order="currentOrder" @close="closeModal" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCartPage = computed(() => {
    return route.path.toLowerCase() === '/cart';
});

const isDrawerOpen = ref(false);
const showReadyModal = ref(false);
const currentOrder = ref(null);

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
};

const showOrderReadyModal = (order) => {
    currentOrder.value = order;
    showReadyModal.value = true;
};

const closeModal = () => {
    showReadyModal.value = false;
    currentOrder.value = null;
};
</script>
