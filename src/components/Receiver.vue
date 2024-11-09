<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card class="custom-radius px-3 py-3">
            <v-card-title class="d-flex justify-space-between align-center">
                <div>
                    <v-icon class="mr-3">{{ receivedIcon }}</v-icon>
                    <span class="headline font-weight-bold">{{ receivedHeader }}</span>
                </div>
                <v-btn icon="mdi-close" variant="text" @click="close" />
            </v-card-title>
            <v-card-text>
                <p>{{ receivedMessage }}</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="bg-primary w-100" height="50px" @click="close">Okay</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import axios from 'axios';

const dialog = ref(false);
const receivedIcon = ref('');
const receivedHeader = ref('');
const receivedMessage = ref('');
const customerId = ref(null);

onMounted(async () => {
    const { token } = getAuth();
    try {
        const response = await axios.get('/api/get-customer-name', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.length > 0) {
            customerId.value = response.data[0].id;
            subscribeToMessages();
        }
    } catch (error) {
        // console.error(`Error fetching customer name:`, error);
    }
});

const requestNotificationPermission = () => {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
        });
    }
};

const handleMessageEvent = (event) => {
    open(event.icon, event.header, event.message);

    if (Notification.permission === 'granted') {
        new Notification('New Message', {
            body: event.message,
        });
    }
};

const open = (icon, header, message) => {
    receivedIcon.value = icon;
    receivedHeader.value = header;
    receivedMessage.value = message;
    dialog.value = true;
};

const close = () => {
    dialog.value = false;
};

const subscribeToMessages = () => {
    requestNotificationPermission();

    if (customerId.value) {
        window.Echo.channel(`chat.${customerId.value}`).listen('MessageSent', handleMessageEvent);
    }
};
</script>
