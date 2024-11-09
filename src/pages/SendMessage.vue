<template>
    <v-container>
        <v-text-field v-model="message" label="Type a message" @keyup.enter="sendMessage"></v-text-field>
        <v-btn @click="sendMessage">Send</v-btn>
        <v-list>
            <v-list-item-group>
                <v-list-item v-for="(msg, index) in messages" :key="index">
                    <v-list-item-content>{{ msg }}</v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const message = ref('');
const messages = ref([]);

onMounted(() => {
    window.Echo.channel('chat').listen('MessageSent', (event) => {
        messages.value.push(event.message); // Add received message to the list
    });
});

const sendMessage = () => {
    if (message.value.trim() === '') return;

    axios.post('/api/send-message', {
        message: message.value
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        }
    }).then(() => {
        messages.value.push(message.value); // Add the sent message to the list
        message.value = ''; // Clear the input after sending
    }).catch(error => {
        // console.error("Error sending message:", error);
    });
};
</script>
