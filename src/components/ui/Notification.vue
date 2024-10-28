<template>
    <v-menu offset-y width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn to="/notifications" icon v-bind="activatorProps" class="mr-3">
                <v-badge color="red" v-if="unreadCount > 0" :content="unreadCount">
                    <v-icon>mdi-bell-outline</v-icon>
                </v-badge>
                <v-icon color="grey-darken-4" v-else>
                    mdi-bell-outline
                </v-icon>
            </v-btn>
        </template>
    </v-menu>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { getAuth } from '@/pages/auth/authServiceProvider/authService';

const notification = useNotificationStore();

const unreadCount = computed(() => notification.getUnreadNotificationCount);

onMounted(async () => {
    const { customer } = getAuth();
    if (customer) {
        await notification.fetchNotifications(customer.id);
    }
});
</script>
