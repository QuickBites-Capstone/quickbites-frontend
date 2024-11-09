<template>
   <div>
      <v-tabs v-model="tab" color="primary" fixed-tabs>
         <v-tab text="My Information" value="information" />
         <v-tab text="Security" value="security" />
      </v-tabs>

      <div v-if="customer">
         <v-tabs-window v-model="tab">
            <v-tabs-window-item value="information">
               <v-col>
                  <h2>Account Info</h2>
               </v-col>

               <v-col class="d-flex justify-end">
                  <v-btn v-if="!editMode" @click="toggleEditMode" prepend-icon="mdi-square-edit-outline" color="grey"
                     variant="outlined">Edit</v-btn>

                  <div v-else>
                     <v-btn @click="cancelEdit" prepend-icon="mdi-close" color="red" variant="text">Cancel</v-btn>
                     <v-btn @click="saveEdit" prepend-icon="mdi-square-edit-outline" color="success">Save</v-btn>
                  </div>
               </v-col>

               <v-col>
                  <v-card class="custom-radius mx-auto profile-holder" height="150px" width="150px">
                     <v-img :src="customer.profile_picture_url" alt="Profile Picture" height="100%" width="100%"
                        cover />
                     <v-btn @click="triggerFileInput" class="overlay" icon="mdi-square-edit-outline" height="30px"
                        width="30px" :style="{ fontSize: '0.8rem' }" />
                     <input type="file" ref="fileInput" @change="uploadImage" style="display: none;" accept="image/*" />
                  </v-card>

                  <div v-if="!editMode">
                     <v-col class="text-center">
                        <h2>{{ customer.first_name }} {{ customer.last_name }}</h2>
                        <p>{{ customer.email }}</p>
                        <p v-if="customer.phone_number">{{ customer.phone_number }}</p>
                        <small v-else class="text-grey">Phone number unregistered</small>
                     </v-col>
                  </div>

                  <div v-else>
                     <v-col class="text-center">
                        <v-text-field v-model="customer.first_name" label="First Name" variant="outlined" />
                        <v-text-field v-model="customer.last_name" label="Last Name" variant="outlined" />
                        <v-text-field v-model="customer.email" label="Email Address" variant="outlined" />
                        <v-text-field v-model="customer.phone_number" label="Phone Number" variant="outlined" />
                     </v-col>
                  </div>

                  <v-card class="custom-radius" color="primary-darken-1">
                     <div class="d-flex flex-column align-end">
                        <v-btn @click="hideBalance" :icon="isBalanceHidden ? 'mdi-eye' : 'mdi-eye-off'" height="30px"
                           width="50px" variant="text" flat :style="{ fontSize: '0.8rem', opacity: '0.8' }" />
                     </div>
                     <div class="text-center">
                        <v-card-title class="font-weight-bold">
                           {{ isBalanceHidden ? '****' : `₱ ${customer?.balance?.toLocaleString()}` }}
                        </v-card-title>
                        <v-card-text><small>Balance</small></v-card-text>
                     </div>
                  </v-card>
               </v-col>
            </v-tabs-window-item>

            <v-tabs-window-item value="security">
               <SecurityTab :customer="customer" />
            </v-tabs-window-item>
         </v-tabs-window>
      </div>
      <div v-else>
         <p>Loading customer information...</p>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import axios from 'axios';

const tab = ref('information');
const customer = ref({});
const isBalanceHidden = ref(true);
const editMode = ref(false);
const fileInput = ref(null);

function resetForm() {
   Object.assign(customer.value, originalCustomer.value);
}

function toggleEditMode() {
   editMode.value = !editMode.value;
}

function cancelEdit() {
   editMode.value = false;
   resetForm();
}

function hideBalance() {
   isBalanceHidden.value = !isBalanceHidden.value;
}

async function saveEdit() {
   const { token } = getAuth();
   try {
      await axios.put('/api/update-customer', {
         first_name: customer.value.first_name,
         last_name: customer.value.last_name,
         email: customer.value.email,
         phone_number: customer.value.phone_number,
      }, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      editMode.value = false;
      Object.assign(originalCustomer.value, customer.value);
   } catch (error) {
      // console.error(`Error saving customer information:`, error);
   }
}

function triggerFileInput() {
   fileInput.value.click();
}

async function uploadImage(event) {
   const file = event.target.files[0];
   if (!file) return;

   const formData = new FormData();
   formData.append('profile_picture', file);

   const { token } = getAuth();
   try {
      const response = await axios.post('/api/update-profile-picture', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
         },
      });

      customer.value.profile_picture_url = response.data.profile_picture_url;

   } catch (error) {
      console.error('Error uploading image:', error);
   }
}

onMounted(async () => {
   const { token } = getAuth();
   try {
      const response = await axios.get('/api/get-customer-name', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      customer.value = response.data[0];
   } catch (error) {
      console.error(`Error fetching customer name:`, error);
   }
});
</script>

<style scoped>
.profile-holder {
   position: relative;
}

.overlay {
   position: absolute;
   z-index: 999;
   top: 0;
   right: 0;
}
</style>
