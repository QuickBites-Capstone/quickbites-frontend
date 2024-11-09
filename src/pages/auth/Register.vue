<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="12" sm="8" md="4" class="login-col">
        <div class="text-h6 mb-5">Create an account</div>
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
          <v-text-field v-model="form.firstName" :rules="[rules.required]" label="Enter your first name"
            variant="outlined" class="custom-radius"></v-text-field>

          <v-text-field v-model="form.lastName" :rules="[rules.required]" label="Enter your last name"
            variant="outlined" class="custom-radius"></v-text-field>

          <v-text-field v-model="form.email" :rules="[rules.required, rules.email]" type="email"
            label="Enter your email address" variant="outlined" class="custom-radius"></v-text-field>
          <v-text-field v-model="form.phoneNumber" type="number" label="Enter your phone number (optional)"
            variant="outlined" class="custom-radius"></v-text-field>

          <div class="d-flex password-field">
            <v-text-field v-model="form.password" :rules="[rules.required, rules.min]"
              :type="passwordHidden ? 'password' : 'text'" class="custom-radius" label="Enter your password"
              variant="outlined" required />
            <v-btn @click="togglePasswordVisibility" icon class="show-password" variant="text">
              <v-icon class="text-grey">{{ passwordHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
          </div>

          <div class="d-flex password-field">
            <v-text-field v-model="form.confirmPassword" :rules="[rules.required, confirmPasswordRule]"
              :type="confirmPasswordHidden ? 'password' : 'text'" class="custom-radius"
              label="Enter your confirm password" variant="outlined" required />
            <v-btn @click="toggleCofirmPasswordVisibility" icon class="show-password" variant="text">
              <v-icon class="text-grey">{{ confirmPasswordHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
          </div>

          <div class="d-flex align-center mb-3">
            <v-checkbox class="d-flex align-center" v-model="termsAccepted" :rules="[rules.terms]" required />
            <v-btn @click="showModal = true" variant="text" flat>Terms and Condition</v-btn>
          </div>

          <v-btn type="submit" :disabled="!termsAccepted" :loading="loading" height="53"
            class="button-text w-100 mt-1">Sign Up</v-btn>

        </v-form>
        <div class="mt-4">
          <p>
            Already have an account?
            <router-link to="/auth/login" class="login-link">Log in</router-link>
          </p>
        </div>
      </v-col>
    </v-row>

    <TermsModal :modelValue="showModal" @update:modelValue="showModal = $event" />
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { setAuth } from "./authServiceProvider/authService";

const passwordHidden = ref(true);
const confirmPasswordHidden = ref(true);
const termsAccepted = ref(false);
const showModal = ref(false);

const togglePasswordVisibility = () => {
  passwordHidden.value = !passwordHidden.value;
};

const toggleCofirmPasswordVisibility = () => {
  confirmPasswordHidden.value = !confirmPasswordHidden.value;
};

const formRef = ref(null);
const isFormValid = ref(false);
const loading = ref(false);
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const resetForm = () => {
  form.value = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };
  termsAccepted.value = false;
};

const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
  min: (value) =>
    value.length >= 8 || "Password must be at least 8 characters.",
  terms: (value) => value || "You must accept the terms and conditions.",
};

const confirmPasswordRule = (value) =>
  value === form.value.password || "Passwords must match.";

const register = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      "/api/register",
      {
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone_number: form.value.phoneNumber,
        password: form.value.password,
        password_confirmation: form.value.confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.token && response?.data?.customer) {
      setAuth(response.data.token, response.data.customer);
      window.$snackbar(`Registration completed successfully!`, `success`);

      setTimeout(() => {
        window.location.href = `/UploadProfile`;
      }, 1500);
    } else {
      window.$snackbar(`Oops! Something went wrong.`, "error");
    }

  } catch (error) {
    // console.error(error)
    window.$snackbar(`Please fill in all required fields!`, `error`);
  } finally {
    loading.value = false;
  }
};

const submitForm = () => {
  if (formRef.value.validate()) {
    register();
  }
};
</script>

<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.terms-text {
  color: #171826;
  align-items: center;
}

.button-text {
  background-color: #171826;
  color: white;
}

.login-link {
  text-decoration: underline;
  color: #171826;
}

.password-field {
  position: relative;
}

.show-password {
  position: absolute;
  right: 0%;
  top: 5%;
}
</style>
