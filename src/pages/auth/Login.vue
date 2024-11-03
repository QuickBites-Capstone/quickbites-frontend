<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="12" sm="8" md="4" class="login-col">
        <div class="text-h6 mb-5">Login</div>

        <v-text-field v-model="form.email" type="email" label="Enter your email address" variant="outlined"
          class="custom-radius"></v-text-field>

        <v-text-field v-model="form.password" type="password" class="custom-radius" label="Enter your password"
          variant="outlined"></v-text-field>

        <v-btn type="submit" @click="login" :loading="loading" height="53" class="button-text w-100 mt-2">Sign
          In</v-btn>
        <div class="mt-4">
          <p>
            Don't have an account?
            <router-link to="/auth/register" class="register-link">Sign Up</router-link>
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
    if (error.response && error.response.status === 401 ) {
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
</style>
