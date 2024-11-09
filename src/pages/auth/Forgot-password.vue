<template>
    <v-container class="mb-15" fluid>
        <v-row align="center">
            <v-col cols="12" sm="8" md="4" class="login-col">
                <div class="text-h6 mb-5">Forgot Password</div>

                <!-- Email Submission Form -->
                <v-form v-if="isEmailSubmissionStep" @submit.prevent="sendOtpToEmail">
                    <v-text-field v-model="sendOtpToEmailForm.email" type="email" label="Enter your email address"
                        variant="outlined" class="custom-radius" />
                    <v-btn type="submit" :loading="isLoading" height="53" class="button-text w-100 mt-2">
                        Send OTP
                    </v-btn>
                </v-form>

                <!-- OTP Verification Form -->
                <v-form v-if="isOtpSubmissionStep" @submit.prevent="verifyOtp">
                    <v-text-field v-model="verifyOtpForm.otp" type="text" label="Enter OTP" variant="outlined"
                        class="custom-radius" />
                    <v-btn type="submit" :loading="isLoading" height="53" class="button-text w-100 mt-2">
                        Submit
                    </v-btn>
                </v-form>

                <div v-if="otpSubmissionSuccess" class="w-100">
                    <LottieAnimation :animationData="successAnimation" class="mx-auto" width="100px" height="100px" />
                    <h4 class="text-center">OTP verified!</h4>
                </div>

                <!-- New Password Submission Form -->
                <v-form v-if="isNewPasswordSubmissionStep" @submit.prevent="submitNewPassword">
                    <div class="d-flex password-field">
                        <v-text-field v-model="newPasswordForm.password" :rules="[rules.required, rules.min]"
                            :type="passwordHidden ? 'password' : 'text'" class="custom-radius"
                            label="Enter your password" variant="outlined" required />
                        <v-btn @click="togglePasswordVisibility" icon class="show-password" variant="text">
                            <v-icon class="text-grey">
                                {{ passwordHidden ? 'mdi-eye-off' : 'mdi-eye' }}
                            </v-icon>
                        </v-btn>
                    </div>

                    <div class="d-flex password-field">
                        <v-text-field v-model="newPasswordForm.confirmPassword"
                            :rules="[rules.required, confirmPasswordRule]"
                            :type="confirmPasswordHidden ? 'password' : 'text'" class="custom-radius"
                            label="Confirm your password" variant="outlined" required />
                        <v-btn @click="toggleConfirmPasswordVisibility" icon class="show-password" variant="text">
                            <v-icon class="text-grey">
                                {{ confirmPasswordHidden ? 'mdi-eye-off' : 'mdi-eye' }}
                            </v-icon>
                        </v-btn>
                    </div>

                    <v-btn type="submit" :loading="isLoading" height="53" class="button-text w-100 mt-2">
                        Submit
                    </v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import successAnimation from "../../Lottie/check.json";

const currentStep = ref('emailSubmission');
const isLoading = ref(false);

const sendOtpToEmailForm = ref({ email: "" });
const verifyOtpForm = ref({ otp: "" });
const newPasswordForm = ref({ password: "", confirmPassword: "" });

const passwordHidden = ref(true);
const confirmPasswordHidden = ref(true);

const rules = {
    required: (value) => !!value || "Required.",
    min: (value) => (value.length >= 8) || "Password must be at least 8 characters.",
};

const togglePasswordVisibility = () => passwordHidden.value = !passwordHidden.value;
const toggleConfirmPasswordVisibility = () => confirmPasswordHidden.value = !confirmPasswordHidden.value;

const isEmailSubmissionStep = computed(() => currentStep.value === 'emailSubmission');
const isOtpSubmissionStep = computed(() => currentStep.value === 'otpSubmission');
const otpSubmissionSuccess = computed(() => currentStep.value === 'otpSubmissionSuccess');
const isNewPasswordSubmissionStep = computed(() => currentStep.value === 'newPasswordSubmission');

const confirmPasswordRule = (value) =>
    value === newPasswordForm.value.password || "Passwords must match.";

const setLoading = (status) => isLoading.value = status;

const sendOtpToEmail = async () => {
    setLoading(true);
    try {
        await axios.post("/api/password-reset/send-otp", { email: sendOtpToEmailForm.value.email });
        window.$snackbar("OTP has been sent to your email", "success");
        currentStep.value = 'otpSubmission';
    } catch (error) {
        showError(error, "The email you entered does not have an account.");
    } finally {
        setLoading(false);
    }
};

const verifyOtp = async () => {
    setLoading(true);
    try {
        await axios.post("/api/password-reset/verify-otp", {
            email: sendOtpToEmailForm.value.email,
            otp: verifyOtpForm.value.otp
        });
        currentStep.value = 'otpSubmissionSuccess';
        setTimeout(() => currentStep.value = 'newPasswordSubmission', 2000);
    } catch (error) {
        showError(error, "Incorrect or expired OTP!");
    } finally {
        setLoading(false);
    }
};

const submitNewPassword = async () => {
    setLoading(true);
    try {
        await axios.post("/api/password-reset/change-password", {
            email: sendOtpToEmailForm.value.email,
            otp: verifyOtpForm.value.otp,
            new_password: newPasswordForm.value.password,
            new_password_confirmation: newPasswordForm.value.confirmPassword
        });
        window.$snackbar("Password changed successfully", "success");
        setTimeout(() => window.location.href = "/auth/login", 2000);
    } catch (error) {
        showError(error, "Something went wrong, please try again.");
    } finally {
        setLoading(false);
    }
};

const showError = (error, defaultMessage) => {
    const message = error.response?.data.errors?.[Object.keys(error.response?.data.errors || {})[0]]?.[0] || defaultMessage;
    window.$snackbar(message, "error");
};
</script>

<style scoped>
.button-text {
    background-color: #171826;
    color: white;
}

.password-field {
    position: relative;
}

.show-password {
    position: absolute;
    right: 0;
    top: 5%;
}
</style>
