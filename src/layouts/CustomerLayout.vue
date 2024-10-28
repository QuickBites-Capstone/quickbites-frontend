<template>
    <div v-touch="{ left: () => swipe('Left'), right: () => swipe('Right') }">
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

const swipe = (direction) => {
    if (direction === 'Right') {
        isDrawerOpen.value = true;
    } else if (direction === 'Left') {
        isDrawerOpen.value = false;
    }
};

</script>
