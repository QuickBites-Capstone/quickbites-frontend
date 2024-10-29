<template>
  <div>
    <v-row class="header-holder mt-1 mb-10 align-center">
      <v-btn to="/" variant="text" color="black" icon="mdi-arrow-left" />
      <h2 class="page-title mx-auto">Notifications</h2>
    </v-row>

    <v-card
      v-for="notification in sortedNotifications"
      :key="notification.id"
      :to="`orderdetails/${notification.order_id}`"
      @click="markAsRead(notification)"
      :class="notification.is_read ? 'bg-grey-lighten-2' : ''"
      class="custom-radius mb-3"
      flat
    >
      <v-card-text>
        <p>{{ notification.order_number }}</p>
        <div class="d-flex justify-space-between mb-3">
          <p><strong>{{ notification.message }}</strong></p>
          <p v-if="!notification.is_read">Unread</p>
        </div>
        <small>{{ formatDate(notification.created_at) }}</small>
      </v-card-text>
    </v-card>

    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-if="!loading && !hasMoreNotifications" class="text-center">
      <p>No more notifications to load.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { getAuth } from '@/pages/auth/authServiceProvider/authService';

const notificationStore = useNotificationStore();
const loading = ref(false);
const page = ref(1);
const hasMoreNotifications = ref(true);

const fetchNotifications = async () => {
  if (loading.value || !hasMoreNotifications.value) return;

  loading.value = true;
  const { customer } = getAuth();
  if (customer) {
    try {
      const response = await notificationStore.fetchNotifications(customer.id, page.value);
      if (response.length === 0) {
        hasMoreNotifications.value = false;
      } else {
        page.value += 1; 
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      loading.value = false; 
    }
  }
};

const markAsRead = async (notification) => {
  await notificationStore.markAsRead(notification.id);
};

const customerId = getAuth().customer?.id || '';
if (customerId) {
  window.Echo.channel('notifications.' + customerId).listen('NotificationCreated', (event) => {
    notificationStore.addNotification(event.notification);
  });
}

onMounted(() => {
  fetchNotifications();
  window.addEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  const bottom = document.documentElement.scrollHeight === window.innerHeight + window.scrollY;
  if (bottom) {
    fetchNotifications();
  }
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

const sortedNotifications = computed(() => {
  return [...notificationStore.getNotifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

</script>

<style scoped>
.page-title {
  translate: -15px;
}
</style>
