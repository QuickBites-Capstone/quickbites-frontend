<template>
    <Modal v-model="dialogVisible" max-width="500" icon="mdi-question-circle" title="Select Reason for Cancellation"
        @update:modelValue="dialogVisible = $event">

        <div v-for="reason in reasons" :key="reason.id">
            <v-checkbox v-model="selectedReasons" :label="reason.description" :value="reason" :key="reason.id" />
        </div>

        <v-card-actions slot="actions">
            <v-btn @click="dialogVisible = false">Cancel</v-btn>
            <v-btn color="primary" @click="confirmCancellation">Confirm</v-btn>
        </v-card-actions>
    </Modal>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['confirm-cancellation']);

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const dialogVisible = ref(props.modelValue);
const selectedReasons = ref([]);
const reasons = ref([]);

const fetchReasons = async () => {
    try {
        const response = await axios.get('/api/reasons');
        reasons.value = response.data;
    } catch (error) {
        // console.error('Error fetching reasons:', error);
    }
};

const confirmCancellation = () => {
    if (selectedReasons.value.length > 0) {
        emit('confirm-cancellation', selectedReasons.value);
        dialogVisible.value = false; // Close the modal
    }
};

watch(() => props.modelValue, (newValue) => {
    dialogVisible.value = newValue;
    if (newValue) fetchReasons();
});
</script>
