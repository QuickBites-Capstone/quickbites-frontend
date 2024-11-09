<template>
    <div>
        <div v-if="customer">
            <v-col>
                <v-col class="text-center mb-10">
                    <h2>Upload Profile Picture</h2>
                </v-col>

                <v-card class="custom-radius mx-auto profile-holder mb-5" height="150px" width="150px">
                    <v-img :src="previewImage || customer.profile_picture_url || '../../../public/default-profile.webp'"
                        alt="Profile Picture" height="100%" width="100%" cover />
                    <v-btn @click="triggerFileInput" class="overlay" icon="mdi-square-edit-outline" height="30px"
                        width="30px" :style="{ fontSize: '0.8rem' }" />
                    <input type="file" ref="fileInput" style="display: none;" accept="image/*"
                        @change="handleFileChange" />
                </v-card>

                <v-col class="text-center">
                    <div>
                        <v-btn class="mb-3" color="primary" width="150px" prepend-icon="mdi-content-save"
                            @click="uploadImage">Save</v-btn>
                    </div>
                    <v-btn to="/" variant="text" width="150px">Skip</v-btn>
                </v-col>

            </v-col>
        </div>
        <div v-else>
            <p>Loading customer information...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from "@/pages/auth/authServiceProvider/authService";
import axios from 'axios';

const customer = ref({});
const fileInput = ref(null);
const router = useRouter();
const previewImage = ref(null);

function triggerFileInput() {
    fileInput.value.click();
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        previewImage.value = URL.createObjectURL(file);
    }
}

async function uploadImage() {
    const file = fileInput.value.files[0];
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
        window.$snackbar(`Profile Picture changed successfully!.`, "success");
        customer.value.profile_picture_url = response.data.profile_picture_url;
        previewImage.value = null;
        setTimeout(() => { router.push('/'); }, 1000);
    } catch (error) {

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
        // console.error(`Error fetching customer name:`, error);
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
