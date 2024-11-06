<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="12" sm="8" md="4" class="login-col">
        <div class="text-h6 mb-5">Login</div>

        <v-form @submit.prevent="login">
          <v-text-field v-model="form.email" type="email" label="Enter your email address" variant="outlined"
            class="custom-radius" />
          <div class="d-flex password-field">
            <v-text-field v-model="form.password" :type="passwordHidden ? 'password' : 'text'" class="custom-radius"
              label="Enter your password" variant="outlined" />
            <v-btn @click="togglePasswordVisibility" icon class="show-password" variant="text">
              <v-icon class="text-grey">{{ passwordHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
          </div>

          <v-btn type="submit" :loading="loading" height="53" class="button-text w-100 mt-2">Sign
            In</v-btn>
        </v-form>

        <div class="mt-5">
          <p class="mb-3">
            Don't have an account?
            <router-link to="/auth/register" class="register-link">Sign Up</router-link>
          </p>
          <p>
            <router-link to="/auth/forgot-password" class="register-link">Forgot password?</router-link>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { setAuth } from "./authServiceProvider/authService";

const loading = ref(false);
const form = ref({
  email: "",
  password: "",
});

const passwordHidden = ref(true);

const togglePasswordVisibility = () => {
  passwordHidden.value = !passwordHidden.value;
};

const login = async () => {
  loading.value = true;
  try {
    const response = await axios.post("/api/login", {
      email: form.value.email,
      password: form.value.password,
    });

    if (
      response &&
      response.data &&
      response.data.token &&
      response.data.customer
    ) {
      setAuth(response.data.token, response.data.customer);
      window.$snackbar("Successful! Logging in...", `success`);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } else {
      window.$snackbar(`Oops! Something went wrong.`, "error");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.$snackbar("Incorrect email or password!", "error");
    } else {
      window.$snackbar(`Oops! Something went wrong.`, "error");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.button-text {
  background-color: #171826;
  color: white;
}

.register-link {
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
