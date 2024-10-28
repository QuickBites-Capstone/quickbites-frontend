<template>
  <div>
    <v-btn
      color="primary"
      @click="showModal"
      class="custom-radius"
      prepend-icon="mdi-plus"
      height="50"
    >
      Add Admin
    </v-btn>

    <Modal
      v-model="isModalVisible"
      title="Add New Admin"
      icon="mdi-account-plus"
      max-width="800px"
    >
      <v-form
        ref="adminForm"
        v-model="formValid"
        @submit.prevent="registerAdmin"
      >
        <v-text-field
          label="Enter first name"
          v-model="form.first_name"
          :rules="[rules.required]"
          variant="outlined"
        />

        <v-text-field
          label="Enter last name"
          v-model="form.last_name"
          :rules="[rules.required]"
          variant="outlined"
        />

        <v-text-field
          label="Enter email address"
          v-model="form.email"
          :rules="[rules.required, rules.email]"
          variant="outlined"
        />

        <v-select
          label="Choose a role"
          :items="roleOptions"
          item-title="title"
          item-value="value"
          v-model="form.role_id"
          variant="outlined"
        />

        <v-card-actions slot="actions" class="d-flex justify-end">
          <v-btn @click="closeModal" height="50">Cancel</v-btn>
          <v-btn
            type="submit"
            class="bg-primary"
            :disabled="!formValid"
            :loading="loading"
            height="50"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { getAuth } from "@/pages/AdminCMS/adminAuthServiceProvider/adminAuthService";

const props = defineProps({
  modelValue: Boolean,
});

const loading = ref(false);
const emit = defineEmits(["update:modelValue", "admin-added"]);
const isModalVisible = ref(props.modelValue);
const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  role_id: null,
});

const roleOptions = [
  { title: "Admin", value: 1 },
  { title: "Staff", value: 2 },
];

const formValid = ref(false);

const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => /.+@.+/.test(value) || "E-mail must be valid.",
};

watch(
  () => props.modelValue,
  (newValue) => {
    isModalVisible.value = newValue;
  }
);

const showModal = () => {
  isModalVisible.value = true;
  emit("update:modelValue", true);
};

const closeModal = () => {
  isModalVisible.value = false;
  emit("update:modelValue", false);
  form.value = { first_name: "", last_name: "", email: "", role_id: "" };
};

const registerAdmin = async () => {
  loading.value = true;
  const { token } = getAuth();
  try {
    await axios.post("/api/admin/register", form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    closeModal();
    emit("admin-added");
    window.$snackbar("Admin successfully added!", "success");
    setTimeout(()=>{
        location.reload();
    }, 3000)
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      window.$snackbar(
        "Oops! You don't have access to perform this action!",
        "error"
      );
    } else {
      window.$snackbar(
        error.response?.data?.message ||
          "An error occurred while adding admin.",
        "error"
      );
     
    }
  } finally{
     loading.value = false;
     closeModal();
  }
};
</script>
