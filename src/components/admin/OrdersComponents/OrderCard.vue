<template>
    <v-card class="custom-radius w-100 me-5 mb-5" :max-width="400"
        :style="{ opacity: order.order_status.name === 'Complete' ? 0.5 : 1 }"
        :disabled="order.order_status.name === 'Cancelled'">
        <v-col>
            <div class="d-flex flex-wrap align-center justify-space-between">
                <h3>{{ order.customer?.first_name || 'Unknown' }} {{ order.customer?.last_name || 'Unknown' }}</h3>
                <div v-if="order.order_status.name === 'Pending'" class="rounded-lg px-3 py-1 bg-pending">
                    <p>
                        <v-icon>mdi-receipt-clock-outline</v-icon>
                        Pending
                    </p>
                </div>
                <div v-if="order.order_status.name === 'In progress'" class="rounded-lg px-3 py-1 bg-in-progress">
                    <p>
                        <v-icon>mdi-timer-outline</v-icon>
                        In progress
                    </p>
                </div>
                <div v-if="order.order_status.name === 'Ready for pick-up'" class="rounded-lg px-3 py-1 bg-ready">
                    <p>
                        <v-icon>mdi-check-all</v-icon>
                        Ready
                    </p>
                </div>
                <div v-if="order.order_status.name === 'Complete'" class="rounded-lg px-3 py-1 bg-complete">
                    <p>
                        <v-icon>mdi-receipt-text-check-outline</v-icon>
                        Complete
                    </p>
                </div>
                <div v-if="order.order_status.name === 'Cancelled'" class="rounded-lg px-3 py-1 bg-cancelled">
                    <p>
                        <v-icon>mdi-cancel</v-icon>
                        Cancelled
                    </p>
                </div>
            </div>

            <div class="d-flex flex-wrap align-center justify-space-between">
                <span>Order {{ order.order_number }} / {{ order.cart.payment_method ? order.cart.payment_method.name :
                    'Not Specified'
                    }}</span>
                <div>
                    <span v-if="order.order_status.name === 'Pending'" class="pending">
                        <v-icon>mdi-circle-medium</v-icon>
                        Incoming Order
                    </span>
                    <span v-if="order.order_status.name === 'In progress'" class="pending">
                        <v-icon class="in-progress">mdi-circle-medium</v-icon>
                        Preparing Order
                    </span>
                    <span v-if="order.order_status.name === 'Ready for pick-up'" class="pending">
                        <v-icon class="ready">mdi-circle-medium</v-icon>
                        Ready for pick-up
                    </span>
                    <span v-if="order.order_status.name === 'Complete'" class="pending">
                        <v-icon class="complete">mdi-circle-medium</v-icon>
                        Order picked-up
                    </span>
                    <span v-if="order.order_status.name === 'Cancelled'" class="pending">
                        <v-icon class="cancelled">mdi-circle-medium</v-icon>
                        Cancelled Order
                    </span>
                </div>
            </div>

            <div class="d-flex flex-wrap mt-3 align-center justify-space-between">
                <span>Placed at</span>
                <span>{{ new Date(order.created_at).toLocaleDateString() }} -
                    {{ new Date(order.created_at).toLocaleTimeString() }}</span>
            </div>

            <div class="d-flex flex-wrap mt-3 align-center justify-space-between">
                <span>Pick-up option</span>
                <span v-if="order.cart.schedule === 'Standard'">{{ order.cart.schedule }}</span>
                <span v-else><small>Schedule:</small> {{ order.cart.schedule }}</span>
            </div>

            <v-divider class="my-3" />

            <div v-if="order.reason" class="my-2">
                <p><strong>Cancellation Reason:</strong> {{ order.reason.description }}</p>
            </div>

            <v-table>
                <thead>
                    <tr>
                        <th class="text-left pending">Items</th>
                        <th class="text-center pending">Qty</th>
                        <th class="text-right pending">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in order.cart.cart_items" :key="item.id">
                        <td class="text-left">{{ item.product.name }}</td>
                        <td class="text-center">{{ item.quantity }}</td>
                        <td class="text-right">₱{{ item.price }}</td>
                    </tr>
                </tbody>
            </v-table>

            <v-divider class="my-3" />

            <div class="d-flex flex-wrap my-3 align-center justify-space-between">
                <b>Total</b>
                <b>₱{{ order.cart.total }}</b>
            </div>

            <v-col>
                <v-row v-if="order.order_status.name === 'Pending'" class="action-buttons mt-auto">
                    <v-btn @click="showCancelDialog" class="custom-radius" color="primary" variant="tonal" height="50px"
                        width="25%" flat>
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="acceptOrder" class="custom-radius" color="primary" height="50px" width="70%" flat>
                        Accept
                    </v-btn>
                </v-row>

                <v-row v-if="order.order_status.name === 'In progress'" class="action-buttons mt-auto">
                    <v-btn @click="showCancelDialog" class="custom-radius" color="primary" variant="tonal" height="50px"
                        width="25%" flat>
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="markAsReady" class="custom-radius" color="primary" height="50px" width="70%" flat>
                        Mark as Ready
                    </v-btn>
                </v-row>

                <v-row v-if="order.order_status.name === 'Ready for pick-up'" class="action-buttons mt-auto">
                    <v-btn @click="showCancelDialog" class="custom-radius" color="primary" variant="tonal" height="50px"
                        width="25%" flat>
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="markAsComplete" class="custom-radius" color="primary" height="50px" width="70%" flat>
                        Mark as Complete
                    </v-btn>
                </v-row>

                <v-row v-if="order.order_status.name === 'Complete'" class="action-buttons mt-auto">
                    <v-btn @click="showCancelDialog" class="custom-radius" color="primary" variant="tonal" height="50px"
                        width="100%" flat>
                        Cancel
                    </v-btn>
                </v-row>

                <v-row v-if="order.order_status.name === 'Cancelled'" class="action-buttons mt-auto">
                    <v-btn class="custom-radius" color="primary" variant="tonal" height="50px" width="100%" flat>
                        Order Cancelled
                    </v-btn>
                </v-row>
            </v-col>
        </v-col>

        <CancelOrder v-model="cancelDialogVisible" @confirm-cancellation="handleCancellation" />
    </v-card>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import axios from 'axios';

const { order } = defineProps({
    order: Object,
});

const cancelDialogVisible = ref(false);

const showCancelDialog = () => {
    cancelDialogVisible.value = true;
};

const handleCancellation = async (selectedReason) => {
    try {
        await axios.patch(`/api/orders/${order.id}/status`, {
            status: 'cancel',
            reason_id: selectedReason
        });
        cancelDialogVisible.value = false;
        order.order_status.name = 'Cancelled';
        order.reason = { description: selectedReason };
    } catch (error) {
        console.error('Error cancelling the order:', error);
    }
};

const acceptOrder = async () => {
    try {
        await axios.patch(`/api/orders/${order.id}/status`, { status: 'accept' });
        order.order_status.name = 'In progress';
    } catch (error) {
        console.error('Error accepting the order:', error);
    }
};

const markAsReady = async () => {
    try {
        await axios.patch(`/api/orders/${order.id}/status`, { status: 'ready' });
        order.order_status.name = 'Ready for pick-up';
    } catch (error) {
        console.error('Error marking the order as ready:', error);
    }
};

const markAsComplete = async () => {
    try {
        await axios.patch(`/api/orders/${order.id}/status`, { status: 'complete' });
        order.order_status.name = 'Complete';
    } catch (error) {
        console.error('Error marking the order as complete:', error);
    }
};
</script>



<style scoped>
.v-table td,
th {
    border-bottom: none !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 30px !important;
}
</style>
