<template>
  <div>
    <v-col class="d-flex justify-end">
      <AddAdmin />
    </v-col>

    <v-card class="custom-radius">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Role</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in adminStore.admins" :key="admin.id">
            <td class="text-left">
              {{ admin.first_name }} {{ admin.last_name }}
            </td>
            <td class="text-left">
              {{ admin.email }}
            </td>
            <td class="text-left">
              {{ getRoleName(admin.role_id) }}
            </td>
            <td class="text-left">
              <v-btn
                @click="editAdmin(admin.id)"
                prepend-icon="mdi-square-edit-outline"
                color="blue"
                variant="text"
                class="custom-radius me-3"
              >
                Edit
              </v-btn>

              <v-btn
                @click="openDeleteModal(admin)"
                prepend-icon="mdi-trash-can-outline"
                color="error"
                variant="text"
                class="custom-radius"
              >
                Delete
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <Modal
      v-model="modalVisible"
      title="Remove Admin"
      icon="mdi-alert"
      max-width="800px"
    >
      <div>
        Are you sure you want to remove
        <b>{{ adminToDelete.first_name }} {{ adminToDelete.last_name }}</b> as
        admin?
      </div>
      <v-card-actions slot="actions">
        <v-btn @click="closeModal">Cancel</v-btn>
        <v-btn color="primary" @click="confirmDelete">Confirm</v-btn>
      </v-card-actions>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAdminStore } from "@/stores/Admin/AdminPinia";
import { getAuth } from "@/pages/AdminCMS/adminAuthServiceProvider/adminAuthService";

const adminStore = useAdminStore();

const modalVisible = ref(false);
const adminToDelete = ref(null);

const openDeleteModal = (admin) => {
  adminToDelete.value = admin;
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
  adminToDelete.value = null;
};

onMounted(() => {
  adminStore.fetchAdmins();
  adminStore.fetchRoles();
});

function getRoleName(roleId) {
  const role = adminStore.roles.find((role) => role.id === roleId);
  return role ? role.name : "Unknown";
}

function editAdmin(adminId) {
  // Logic to handle editing, e.g., redirecting to an edit page
}

async function confirmDelete() {
  const { token } = getAuth();
  if (!adminToDelete.value) return;

  try {
    await axios.delete(`/api/admins/${adminToDelete.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.$snackbar("Admin deleted successfully", "success");
    setTimeout(()=> {
        modalVisible.value = false;
    }, 3000);

    adminStore.admins = adminStore.admins.filter(
      (admin) => admin.id !== adminToDelete.value.id
    );

  } catch (error) {
    if (error.response && error.response.status === 403) {
      window.$snackbar(
        "Oops! You don't have access to perform this action!",
        "error"
      );
    } else {
      window.$snackbar(
        error.response?.data?.message ||
          "An error occurred while deleting admin.",
        "error"
      );
    }
  } finally{
    modalVisible.value = false;
  }
}
</script>
