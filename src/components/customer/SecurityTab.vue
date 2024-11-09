<template>
    <div>
        <!-- Security Frame -->
        <div v-if="currentFrame === 'main'">
            <v-col>
                <h2>Security</h2>
            </v-col>
            <v-col class="mb-5">
                <h3>Logging in to Quick Bites</h3>
            </v-col>
            <v-col>
                <p class="mb-3"><b>Password</b></p>
                <v-btn @click="otpFrame" variant="text" append-icon="mdi-chevron-right">Change Password</v-btn>
            </v-col>
        </div>

        <!-- OTP Frame -->
        <div v-if="currentFrame === 'otp'">
            <v-col class="d-flex align-center justify-space-between">
                <h2>Change Password</h2>
                <div>
                    <v-btn @click="mainFrame" icon variant="text"><v-icon>mdi-close</v-icon></v-btn>
                </div>
            </v-col>
            <v-col>
                <p>Please enter the 6-digit code we sent to <u>{{ customer.email }}.</u></p>
            </v-col>
            <v-col>
                <div class="mb-5">
                    <v-text-field label="Enter OTP" variant="outlined" v-model="otp" />
                    <small>
                        Didn't receive a code?
                        <button @click="resendOtp"><u>Resend</u></button>
                        ({{ countdown }} seconds)
                    </small>
                </div>
                <v-btn @click="submitOtp" :loading="loading" class="w-100" color="primary" height="50">Continue</v-btn>
            </v-col>
        </div>

        <!-- Change Password Frame -->
        <div v-if="currentFrame === 'changePassword'">
            <v-col class="d-flex align-center justify-space-between">
                <h2>Change Password</h2>
                <div>
                    <v-btn @click="mainFrame" icon variant="text"><v-icon>mdi-close</v-icon></v-btn>
                </div>
            </v-col>
            <v-col>
                <v-text-field type="password" label="New Password" variant="outlined" v-model="newPassword" />
                <v-text-field type="password" label="Confirm New Password" variant="outlined"
                    v-model="confirmNewPassword" />
                <v-btn @click="submitNewPassword" :loading="loading" class="w-100" color="primary"
                    height="50">Submit</v-btn>
            </v-col>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { getAuth } from "@/pages/auth/authServiceProvider/authService";

const currentFrame = ref('main');
const otp = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const countdown = ref(60);
const customer = ref({});
const loading = ref(false);

const mainFrame = () => {
    currentFrame.value = 'main';
};

const otpFrame = () => {
    currentFrame.value = 'otp';
    sendOtp();
};

const changePasswordFrame = () => {
    currentFrame.value = 'changePassword';
};

const token = getAuth().token;

const handleUnauthenticated = () => {
    window.$snackbar(`It seems like you aren't logged in.`, "error");
    setTimeout(() => { logout(); }, 1500);
};

const sendOtp = async () => {
    if (!token) {
        handleUnauthenticated();
        return;
    }

    try {
        await axios.post('/api/send-otp', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        startCountdown();
        window.$snackbar(`OTP sent! Please check your email.`, "success");
    } catch (error) {
        if (error.response.status === 401) {
            handleUnauthenticated();
        } else {
            alert('Failed to send OTP.');
        }
    }
};

const startCountdown = () => {
    countdown.value = 60;
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval);
        }
    }, 1000);
};

const resendOtp = () => {
    sendOtp();
};

const submitOtp = async () => {
    const { token } = getAuth();
    if (!token) {
        handleUnauthenticated();
        return;
    }

    loading.value = true;

    try {
        await axios.post('/api/verify-otp', { otp: otp.value }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTimeout(() => { changePasswordFrame(); }, 1000);
        loading.value = false;
    } catch (error) {
        if (error.response.status === 401) {
            handleUnauthenticated();
            loading.value = false;
        } else {
            loading.value = false;
            window.$snackbar(`You entered an Invalid or Expired OTP.`, "error");
        }
    }
};

const submitNewPassword = async () => {
    if (newPassword.value.trim() !== confirmNewPassword.value.trim()) {
        window.$snackbar(`Passwords don't match!`, "error");
        return;
    }

    loading.value = true;

    const { token } = getAuth();
    if (!token) {
        handleUnauthenticated();
        return;
    }

    try {
        await axios.post('/api/change-password', {
            otp: otp.value,
            new_password: newPassword.value,
            new_password_confirmation: confirmNewPassword.value
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        loading.value = false;
        window.$snackbar(`Password changed successfully!.`, "success");
        setTimeout(() => { mainFrame(); }, 1500);
    } catch (error) {
        // console.error('Error changing password:', error.response ? error.response.data : error);
        if (error.response && error.response.status === 401) {
            handleUnauthenticated();
            loading.value = false;
        } else {
            loading.value = false;
            window.$snackbar(`Oops! Something went wrong.`, "error");
        }
    }
};


</script>
