<template>
    <v-dialog v-model="isVisible" persistent>
        <v-card :style="{ height, width }" class="custom-radius">
            <v-card-title class="d-flex align-center justify-space-between">
                <div>
                    <v-icon class="me-3">{{ icon }}</v-icon>
                    <b class="headline">{{ title }}</b>
                </div>

                <v-btn icon="mdi-close" @click="close" flat></v-btn>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col>
                        <div class="custom-radius" outlined>
                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                1. Introduction
                            </v-card-subtitle>
                            <v-card-text>
                                Welcome to the Quick Bites School Canteen Pre-order System (the “System”). By
                                registering, accessing, or using the System, you (“User”) agree to comply with these
                                Terms and Conditions. If you do not agree with any part of these Terms, you may not
                                use the System. Please read these Terms carefully before placing any orders.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                2. User Registration and Account
                            </v-card-subtitle>
                            <v-card-text>
                                To use the System, Users must register by providing accurate and complete
                                information. Users are responsible for maintaining the confidentiality of their
                                account information, including login credentials, and for all activities that occur
                                under their account. The System is available for students, staff, and teachers
                                within the school. Unauthorized use by anyone outside this group is prohibited.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                3. Ordering Process
                            </v-card-subtitle>
                            <v-card-text>
                                By placing an order through the System, Users commit to picking up the ordered items
                                on the same day of the order. Orders must be picked up before the school canteen's
                                closing time. The canteen’s operating hours will be made available to Users. Failure
                                to pick up an order by the designated closing time forfeits the User’s right to
                                claim the item the following day. No refunds will be provided for uncollected items.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                4. Payment and Cancellation Policy
                            </v-card-subtitle>
                            <v-card-text>
                                Payment options may include cash, prepaid balances, or other methods made available
                                by the System. If the User selects the cash payment method, the order may be
                                canceled within 5 to 10 minutes of being placed without penalty. Failure to cancel
                                an order within the specified time frame may result in the imposition of a penalty
                                fee, as outlined by the canteen’s policies, which will be communicated to Users
                                before ordering. Prepaid orders are final, and no refunds will be issued once the
                                order has been confirmed unless otherwise specified by the canteen management.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                5. Canteen’s Responsibilities
                            </v-card-subtitle>
                            <v-card-text>
                                The canteen will make reasonable efforts to prepare and fulfill orders accurately
                                and on time. However, the availability of items is subject to change based on supply
                                and demand. The canteen reserves the right to substitute items in the event that
                                certain products are out of stock. Users will be notified of any changes before
                                order fulfillment.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                6. User Responsibilities
                            </v-card-subtitle>
                            <v-card-text>
                                Users agree to provide accurate order information, including selecting the correct
                                items and specifying any necessary details. Users are responsible for picking up
                                their order in a timely manner and adhering to canteen policies regarding order
                                collection and pickup times. Users must comply with any other guidelines or rules
                                established by the school in relation to the canteen.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                7. Data Privacy and Security
                            </v-card-subtitle>
                            <v-card-text>
                                The personal information collected through the System will only be used for the
                                purpose of facilitating the ordering process. This includes processing orders,
                                sending notifications, and communicating with Users. Personal information will not
                                be shared with any third party outside of the school without the User’s consent,
                                except where required by law or school policies. The school administration reserves
                                the right to access User information for purposes related to school operations and
                                canteen management.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                8. Limitation of Liability
                            </v-card-subtitle>
                            <v-card-text>
                                The System is provided on an “as-is” and “as-available” basis. The school does not
                                guarantee that the System will be uninterrupted or free from errors. The school will
                                not be liable for any losses or damages arising from the use of the System,
                                including but not limited to missed pickups, unavailable items, or order
                                inaccuracies, except in cases of gross negligence or intentional misconduct. Users
                                assume full responsibility for their use of the System and agree that the school and
                                canteen will not be liable for any indirect, incidental, or consequential damages.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                9. Changes to Terms and Conditions
                            </v-card-subtitle>
                            <v-card-text>
                                The school reserves the right to modify or update these Terms and Conditions at any
                                time. Users will be notified of any significant changes, and continued use of the
                                System after changes constitutes acceptance of the new Terms.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                10. Governing Law
                            </v-card-subtitle>
                            <v-card-text>
                                These Terms and Conditions shall be governed by and construed in accordance with the
                                laws of the Republic of the Philippines, without regard to its conflict of law
                                principles.
                            </v-card-text>

                            <v-card-subtitle class="mt-4 text-h6" style="color: #000;">
                                11. Contact Information
                            </v-card-subtitle>
                            <v-card-text>
                                If you have any questions or concerns regarding these Terms and Conditions, please
                                contact <strong>cctcquickbites@gmail.com</strong>.
                            </v-card-text>
                        </div>
                    </v-col>
                </v-row>

                <div class="mt-5 float-right">
                    <v-btn class="me-5" @click="close" flat>Decline</v-btn>
                    <v-btn color="primary" @click="close">Accept</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Terms and Conditions',
    },
    icon: {
        type: String,
        default: 'mdi-information',
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
    height: {
        type: String,
        default: 'auto',
    },
    width: {
        type: String,
        default: 'auto',
    },
});

const emit = defineEmits(['update:modelValue']);
const isVisible = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    isVisible.value = newVal;
});

const close = () => {
    isVisible.value = false;
    emit('update:modelValue', false);
};
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>
