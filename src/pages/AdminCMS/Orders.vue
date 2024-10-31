<template>
    <div>
        <v-card>
            <v-layout>
                <v-main>
                    <v-app class="px-5 py-5">
                        <v-col>
                            <v-col>
                                <h1 class="page-title">Orders</h1>
                            </v-col>

                            <v-col>
                                <v-row>
                                    <v-card max-width="200" class="custom-radius d-flex align-center justify-center">
                                        <v-tabs v-model="tab" color="primary">
                                            <v-tab class="custom-radius my-auto" value="today">Today</v-tab>
                                            <v-tab class="custom-radius my-auto" value="history">History</v-tab>
                                        </v-tabs>
                                    </v-card>

                                    <v-spacer></v-spacer>

                                    <RefreshButton @refresh="refreshOrders" :loading="loading" class="me-3" />
                                    <!-- <ManualOrder /> -->
                                </v-row>
                            </v-col>

                            <v-card-text>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item value="today">
                                        <TodayOrders ref="todayOrders" v-if="tab === 'today'" :loading="loading" />
                                    </v-tab-item>

                                    <v-tab-item value="history">
                                        <HistoryOrders ref="historyOrders" v-if="tab === 'history'"
                                            :loading="loading" />
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-card-text>
                        </v-col>
                    </v-app>
                </v-main>
            </v-layout>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('today');
const loading = ref(false);
const todayOrdersRef = ref(null);
const historyOrdersRef = ref(null);

const refreshOrders = () => {
    loading.value = true;
    if (tab.value === 'today' && todayOrdersRef.value) {
        todayOrdersRef.value.fetchTodayOrders().finally(() => {
            loading.value = false;
        });
    } else if (tab.value === 'history' && historyOrdersRef.value) {
        historyOrdersRef.value.fetchHistoryOrders().finally(() => {
            loading.value = false;
        });
    }
};
</script>

<style></style>
