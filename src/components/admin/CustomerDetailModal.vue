<template>
    <Modal v-model="localVisible" class="main-modal" title="Customer Detail" icon="mdi-account-details-outline"
        :height="'100vh'" :width="'500px'">
        <v-card-text>
            <div v-if="customer">
                <v-col>
                    <v-row>
                        <v-card class="custom-radius d-flex align-center justify-center bg-primary" height="100px"
                            width="100px">
                            <v-img v-if="customer.profile_picture_url" :src="customer.profile_picture_url"
                                class="w-100 h-100" cover />
                            <h1 v-else class="name-initial">{{ customer?.first_name[0] }}{{ customer?.last_name[0] }}
                            </h1>
                        </v-card>
                        <v-col class="mt-auto">
                            <h2 class="fullname">{{ customer?.first_name }} {{ customer?.last_name }}</h2>
                            <p><i>{{ customer?.email }}</i></p>
                            <p><i>{{ customer.phone_number || 'N/A' }}</i></p>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col>
                    <v-card elevation="2" class="custom-radius">
                        <div class="">
                            <v-card-text class="pb-0">Balance</v-card-text>
                            <v-card-title class="d-flex align-center">
                                <h2>₱ {{ customer.balance ? customer.balance.toLocaleString() : '0' }}</h2>
                            </v-card-title>

                            <v-card-actions class="d-flex justify-space-between">
                                <v-btn @click="openDeductCreditsModal" prepend-icon="mdi-cash-minus"
                                    class="custom-radius" color="red">
                                    Deduct Funds
                                </v-btn>
                                <v-btn @click="openAddCreditsModal" prepend-icon="mdi-cash-plus" class="custom-radius"
                                    color="secondary">
                                    Add Funds
                                </v-btn>
                            </v-card-actions>
                        </div>
                    </v-card>
                </v-col>

                <Modal v-model="addCreditsDialog" title="Add Credits" icon="mdi-cash-plus" class="add-credits"
                    max-width="500px">

                    <v-card-text>
                        <v-text-field v-model="creditAmount" label="Enter credit amount" type="number"
                            variant="outlined" />
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn text @click="addCreditsDialog = false" height="50">Cancel</v-btn>
                        <v-btn class="bg-primary" @click="addCredits" height="50">Add</v-btn>
                    </v-card-actions>
                </Modal>

                <Modal v-model="deductCreditsDialog" title="Deduct Credits" icon="mdi-cash-minus" class="add-credits"
                    max-width="500px">

                    <v-card-text>
                        <v-text-field v-model="creditAmount" label="Enter credit amount" type="number"
                            variant="outlined" />
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn text @click="deductCreditsDialog = false" height="50">Cancel</v-btn>
                        <v-btn class="bg-primary" @click="deductCredits" height="50">Deduct</v-btn>
                    </v-card-actions>
                </Modal>
            </div>
            <div v-else>Loading...</div>
        </v-card-text>
    </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    customer: {
        type: Object,
        required: false,
    },
});

const emit = defineEmits(['update:visible']);
const localVisible = ref(props.visible);
const addCreditsDialog = ref(false);
const deductCreditsDialog = ref(false);
const creditAmount = ref();

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
});

const openAddCreditsModal = () => {
    addCreditsDialog.value = true;
};

const openDeductCreditsModal = () => {
    deductCreditsDialog.value = true;
};

const addCredits = async () => {
    if (creditAmount.value > 0 && props.customer) {
        try {
            await axios.post(`/api/customers/${props.customer.id}/add-credits`, { amount: creditAmount.value });
            const newBalance = Number(props.customer.balance) + Number(creditAmount.value);
            props.customer.balance = parseFloat(newBalance.toFixed(2));
            addCreditsDialog.value = false;
            creditAmount.value = '';
        } catch (error) {
            console.error('Error adding credits:', error);
        }
    }
};

const deductCredits = async () => {
    if (creditAmount.value > 0 && props.customer) {
        try {
            await axios.post(`/api/customers/${props.customer.id}/deduct-credits`, { amount: creditAmount.value });
            const newBalance = Number(props.customer.balance) - Number(creditAmount.value);
            props.customer.balance = parseFloat(newBalance.toFixed(2));
            addCreditsDialog.value = false;
            creditAmount.value = '';
        } catch (error) {
            console.error('Error adding credits:', error);
        }
    }
};
</script>

<style scoped></style>