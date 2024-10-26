<template>
    <div>
        <Sidebar :isDrawerOpen="isDrawerOpen" @update:isDrawerOpen="toggleDrawer" />
        <Header v-if="!isCartPage" :isDrawerOpen="isDrawerOpen" @toggle-drawer="toggleDrawer" />
        <v-container>
            <router-view />
        </v-container>

        <Receiver />
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

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
};
</script>
