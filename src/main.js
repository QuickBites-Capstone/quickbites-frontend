import { registerPlugins } from '@/plugins';
import App from './App.vue';
import router from '@/router';
import { createApp } from 'vue';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.11:8000';

axios.defaults.baseURL = API_URL;

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_MIX_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_MIX_PUSHER_APP_CLUSTER,
    encrypted: true,
});

const app = createApp(App);

registerPlugins(app);
app.use(router);
app.mount('#app');
